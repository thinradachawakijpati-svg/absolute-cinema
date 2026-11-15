import { useState, useMemo, useEffect } from 'react';
import type { Movie, ProviderStat, UserProfile, WatchSchedule } from './types';
import { Search, User, X, Bookmark, Heart } from 'lucide-react';


import { supabase } from './supabaseClient';
import { calculateAllProviders } from './utils/providerCalculator';
import { Sidebar, type NavTab } from './components/Sidebar';
import { CartFloating } from './components/CartFloating';
import { MovieDetailModal } from './components/MovieDetailModal';
import { LoginPage } from './components/LoginPage';
import { CalculateModal } from './components/CalculateModal';
import { BoxDetailModal } from './components/BoxDetailModal'; 
import { OverviewTab } from './components/OverviewTab';
import { ScheduleTab } from './components/ScheduleTab';
import { BrowseTab, SavedTab } from './components/BrowseAndSavedTabs';
import { ProfileTab } from './components/ProfileTab';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: '',
    name: 'Cinema Lover',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    joinedDate: 'พฤศจิกายน 2026',
    activeSubscriptions: [],
    preferredDailyHours: 2,
  });


  const [cart, setCart] = useState<Movie[]>([]);
  const [savedList, setSavedList] = useState<Movie[]>([]);
  const [unreadSavedCount, setUnreadSavedCount] = useState<number>(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [schedules, setSchedules] = useState<WatchSchedule[]>([]);

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
  const [apiSearchResults, setApiSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [isCalcModalOpen, setIsCalcModalOpen] = useState<boolean>(false);
  const [selectedBoxToSave, setSelectedBoxToSave] = useState<string>('');
  const [openedBoxId, setOpenedBoxId] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = (sessionUser: any) => {
      if (sessionUser) {
        setIsAuthenticated(true);
        const displayName =
          sessionUser.user_metadata?.full_name ||
          sessionUser.user_metadata?.name ||
          sessionUser.email?.split('@')[0] ||
          'Cinema Lover';
        setCurrentUser(prev => ({
          ...prev,
          id: sessionUser.id,
          name: displayName,
          email: sessionUser.email || '',
        }));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(prev => ({ ...prev, id: '', email: '' }));
        setCart([]);
        setSavedList([]);
        setSchedules([]);
      }
      setAuthLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !currentUser.id) return;

    fetch(`${API_URL}/api/user/${currentUser.id}/data`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.watchlist)) setCart(data.watchlist);
        if (Array.isArray(data.saved)) setSavedList(data.saved);
        if (Array.isArray(data.schedules)) {
          setSchedules(data.schedules);
          if (data.schedules.length > 0) {
            setSelectedBoxToSave(String(data.schedules[0].id));
          }
        }
      })
      .catch(err => console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ:', err));
  }, [isAuthenticated, currentUser.id]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadMovies = async () => {
      try {
        const [trendRes, actRes, horRes, romRes] = await Promise.all([
          fetch(`${API_URL}/api/movies/trending`).then(r => r.json()),
          fetch(`${API_URL}/api/movies/genre/28`).then(r => r.json()),
          fetch(`${API_URL}/api/movies/genre/27`).then(r => r.json()),
          fetch(`${API_URL}/api/movies/genre/10749`).then(r => r.json()),
        ]);
        if (Array.isArray(trendRes) && trendRes.length > 0) setTrendingMovies(trendRes);
        if (Array.isArray(actRes) && actRes.length > 0) setActionMovies(actRes);
        if (Array.isArray(horRes) && horRes.length > 0) setHorrorMovies(horRes);
        if (Array.isArray(romRes) && romRes.length > 0) setRomanceMovies(romRes);
      } catch (err) {
        console.warn('ใช้ข้อมูลหนังสำรองเนื่องจากเชื่อมต่อ TMDB API ไม่ได้:', err);
      }
    };

    loadMovies();
  }, [isAuthenticated]);

  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) {
      setApiSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true); 
    const timer = setTimeout(() => {
      fetch(`${API_URL}/api/movies/search?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => setApiSearchResults(Array.isArray(data) ? data : []))
        .catch(() => setApiSearchResults([]))
        .finally(() => setIsSearching(false)); 
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (activeTab === 'saved') {
      setUnreadSavedCount(0);
    }
  }, [activeTab]);

  const handleAddSchedule = async () => {
    const title = `BOX #${schedules.length + 1}`;
    try {
      const res = await fetch(`${API_URL}/api/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, title, movie_ids: [] }),
      });
      const created = await res.json();
      setSchedules(prev => [
        ...prev,
        {
          id: String(created.id),
          title: created.title || title,
          movies: [],
          createdAt: new Date().toLocaleDateString('th-TH', { dateStyle: 'short' }),
        },
      ]);
    } catch (err) {
      console.error('สร้าง Box ไม่สำเร็จ:', err);
    }
  };

  const handleSaveWatchlistAsSchedule = async () => {
    if (cart.length === 0) return;
    const uniqueCart = Array.from(new Map(cart.map((m: Movie) => [m.id, m])).values());
    const title = `ตารางดูหนังชุดที่ ${schedules.length + 1}`;

    try {
      const res = await fetch(`${API_URL}/api/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          title,
          movie_ids: uniqueCart.map(m => m.id),
        }),
      });
      const created = await res.json();

      await fetch(`${API_URL}/api/watchlist/${currentUser.id}/clear`, { method: 'DELETE' });
      setCart([]);

      setSchedules(prev => [
        ...prev,
        {
          id: String(created.id),
          title: created.title || title,
          movies: uniqueCart,
          createdAt: new Date().toLocaleDateString('th-TH', { dateStyle: 'short' }),
        },
      ]);
      setIsCalcModalOpen(false);
      setActiveTab('schedule');
    } catch (err) {
      console.error('บันทึก Watchlist เป็น Box ไม่สำเร็จ:', err);
    }
  };

  const handleSaveCartToExistingBox = async (schedId: string) => {
    if (cart.length === 0) return;
    try {
      await fetch(`${API_URL}/api/schedules/${schedId}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_ids: cart.map(m => m.id) }),
      });

      await fetch(`${API_URL}/api/watchlist/${currentUser.id}/clear`, { method: 'DELETE' });

      setSchedules(prev =>
        prev.map(s =>
          String(s.id) === String(schedId)
            ? { ...s, movies: Array.from(new Map([...s.movies, ...cart].map(m => [m.id, m])).values()) }
            : s
        )
      );
      setCart([]);
      setIsCalcModalOpen(false);
      setActiveTab('schedule');
    } catch (err) {
      console.error('เพิ่มหนังลง Box ไม่สำเร็จ:', err);
    }
  };

  const handleUpdateScheduleTitle = async (boxId: string, newTitle: string) => {
    setSchedules(prev => prev.map(s => (String(s.id) === String(boxId) ? { ...s, title: newTitle } : s)));
    try {
      await fetch(`${API_URL}/api/schedules/${boxId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (err) {
      console.error('เปลี่ยนชื่อ Box ไม่สำเร็จ:', err);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    setSchedules(prev => prev.filter(s => String(s.id) !== String(id)));
    if (String(openedBoxId) === String(id)) setOpenedBoxId(null);
    try {
      await fetch(`${API_URL}/api/schedules/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('ลบ Box ไม่สำเร็จ:', err);
    }
  };

  const handleRemoveMovieFromSchedule = async (schedId: string, movieId: string) => {
    setSchedules(prev =>
      prev.map(s => (String(s.id) === String(schedId) ? { ...s, movies: s.movies.filter(m => m.id !== movieId) } : s))
    );
    try {
      await fetch(`${API_URL}/api/schedules/${schedId}/movies/${movieId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('ลบหนังออกจาก Box ไม่สำเร็จ:', err);
    }
  };

  const toggleCart = async (movie: Movie) => {
    const exists = cart.some(m => m.id === movie.id);
    setCart(prev => (exists ? prev.filter(m => m.id !== movie.id) : [...prev, movie]));

    if (!currentUser.id) return;
    try {
      await fetch(`${API_URL}/api/watchlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, movie }),
      });
    } catch (err) {
      console.error('บันทึก Watchlist ผิดพลาด:', err);
    }
  };

  const toggleSaved = async (movie: Movie) => {
    const exists = savedList.some(m => m.id === movie.id);
    if (exists) {
      setSavedList(prev => prev.filter(m => m.id !== movie.id));
      setUnreadSavedCount(prev => Math.max(0, prev - 1));
    } else {
      setSavedList(prev => [...prev, movie]);
      if (activeTab !== 'saved') {
        setUnreadSavedCount(prev => prev + 1);
      }
    }

    if (!currentUser.id) return;
    try {
      await fetch(`${API_URL}/api/bookmark/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, movie }),
      });
    } catch (err) {
      console.error('บันทึก Bookmark ผิดพลาด:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const allLoadedMovies = useMemo(() => {
    const combined = [...trendingMovies, ...actionMovies, ...horrorMovies, ...romanceMovies, ...cart, ...savedList];
    return Array.from(new Map(combined.map(m => [m.id, m])).values());
  }, [trendingMovies, actionMovies, horrorMovies, romanceMovies, cart, savedList]);

  const providerStats = useMemo<ProviderStat[]>(() => calculateAllProviders(cart), [cart]);
  const bestProvider = providerStats[0];
  const currentOpenedBox = schedules.find(s => String(s.id) === String(openedBoxId));

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '1.25rem',
        gap: '1.25rem',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* พื้นหลังลายแพทเทิร์นดาวใส่เนกไท */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', filter: 'blur(2px)', opacity: 0.14, pointerEvents: 'none', zIndex: 0 }}>
        <defs>
          <pattern id="star-brick-pattern" width="220" height="220" patternUnits="userSpaceOnUse">
            <image href="/slidebarBG.png" x="15" y="15" width="65" height="65" />
            <image href="/slidebarBG.png" x="125" y="125" width="65" height="65" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#star-brick-pattern)" />
      </svg>

      {/* 1. Sidebar */}
      <div style={{ width: '16.5rem', flexShrink: 0 }}>
        <div
          style={{
            position: 'fixed',
            top: '1.25rem',
            left: '1.25rem',
            height: 'calc(100vh - 2.5rem)',
            zIndex: 30,
          }}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} scheduleCount={schedules.length} savedCount={savedList.length} />
        </div>
      </div>

      {/* 2. Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0, position: 'relative', zIndex: 1 }}>
        {/* Header แถวบน */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', minHeight: '3rem', marginBottom: '-0.5rem' }}>
          <div style={{ width: '8rem' }} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', pointerEvents: 'none', zIndex: 5 }}>
            <img src="/char_1.png" alt="Absolute Cinema Mascot" style={{ height: '6rem', width: 'auto', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6))' }} />
          </div>

          <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#121215', border: '1px dashed #3f3f46', borderRadius: '1.25rem', padding: '0.4rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.45)', marginBottom: '0.5rem' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(1px)', opacity: 0.16, pointerEvents: 'none', zIndex: 0 }}>
              <defs>
                <pattern id="header-icons-star-pattern" width="90" height="90" patternUnits="userSpaceOnUse">
                  <image href="/slidebarBG.png" x="8" y="8" width="32" height="32" />
                  <image href="/slidebarBG.png" x="50" y="50" width="32" height="32" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#header-icons-star-pattern)" />
            </svg>

            <button
              type="button"
              onClick={() => {
                setUnreadSavedCount(0);
                setActiveTab('saved');
              }}
              title={
                unreadSavedCount > 0
                  ? `เพิ่มใหม่ ${unreadSavedCount} รายการ (บันทึกทั้งหมด ${savedList.length})`
                  : `รายการที่สนใจ (${savedList.length})`
              }
              style={{
                position: 'relative',
                zIndex: 1,
                backgroundColor: activeTab === 'saved' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: '0.85rem',
                padding: '0.55rem',
                color: activeTab === 'saved' || unreadSavedCount > 0 ? '#f59e0b' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bookmark style={{ width: '1.25rem', height: '1.25rem', fill: savedList.length > 0 ? 'currentColor' : 'none' }} />
              {unreadSavedCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0.2rem',
                    right: '0.2rem',
                    backgroundColor: '#f59e0b',
                    color: '#fff',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    borderRadius: '50%',
                    width: '0.9rem',
                    height: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadSavedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (cart.length > 0) {
                  if (schedules.length > 0) setSelectedBoxToSave(String(schedules[0].id));
                  setIsCalcModalOpen(true);
                } else {
                  setActiveTab('browse');
                }
              }}
              title={`คำนวณ Watchlist (${cart.length})`}
              style={{ position: 'relative', zIndex: 1, backgroundColor: cart.length > 0 ? 'rgba(220, 38, 38, 0.18)' : 'transparent', border: 'none', borderRadius: '0.85rem', padding: '0.55rem', color: cart.length > 0 ? '#ef4444' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Heart style={{ width: '1.25rem', height: '1.25rem', fill: cart.length > 0 ? '#ef4444' : 'none' }} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '0.2rem', right: '0.2rem', backgroundColor: '#dc2626', color: '#fff', fontSize: '0.6rem', fontWeight: 800, borderRadius: '50%', width: '0.9rem', height: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</span>}
            </button>

            <button type="button" onClick={() => setActiveTab('profile')} title="โปรไฟล์ผู้ใช้" style={{ position: 'relative', zIndex: 1, backgroundColor: activeTab === 'profile' ? 'rgba(255, 255, 255, 0.12)' : 'transparent', border: 'none', borderRadius: '0.85rem', padding: '0.55rem', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>

        {/* แถบค้นหาแนวยาว */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '1.15rem', height: '1.15rem', color: '#52525b' }} />
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              if (activeTab !== 'browse' && e.target.value.trim().length > 0) setActiveTab('browse');
            }}
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '1.25rem', padding: '0.95rem 3rem 0.95rem 3.25rem', color: '#09090b', fontSize: '0.9rem', fontWeight: 500, outline: 'none', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)' }}
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#52525b', cursor: 'pointer', padding: '0.25rem' }}>
              <X style={{ width: '1.1rem', height: '1.1rem' }} />
            </button>
          )}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'overview' && (
          <OverviewTab
            savedList={savedList}
            unreadSavedCount={unreadSavedCount}
            schedules={schedules}
            cart={cart}
            trendingMovies={trendingMovies}
            actionMovies={actionMovies}
            horrorMovies={horrorMovies}
            romanceMovies={romanceMovies}
            onOpenSavedTab={() => {
              setUnreadSavedCount(0);
              setActiveTab('saved');
            }}
            onOpenScheduleTab={() => setActiveTab('schedule')}
            onOpenBox={setOpenedBoxId}
            onSelectMovie={setSelectedMovie}
            onToggleCart={toggleCart}
            onToggleSaved={toggleSaved}
          />
        )}

        {/* TAB 2: หน้าค้นหาหนัง */}
        {activeTab === 'browse' && (
          <BrowseTab
            searchTerm={searchTerm}
            isSearching={isSearching}
            movies={searchTerm.trim() ? apiSearchResults : allLoadedMovies}
            cart={cart}
            savedList={savedList}
            onSelectMovie={setSelectedMovie}
            onToggleCart={toggleCart}
            onToggleSaved={toggleSaved}
          />
        )}

        {/* TAB 3: กล่องตารางดูหนัง 3D */}
        {activeTab === 'schedule' && (
          <ScheduleTab
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onOpenBox={setOpenedBoxId}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}

        {/* TAB 4: รายการที่สนใจเก็บไว้ */}
        {activeTab === 'saved' && (
          <SavedTab
            savedList={savedList}
            cart={cart}
            onSelectMovie={setSelectedMovie}
            onToggleCart={toggleCart}
            onToggleSaved={toggleSaved}
          />
        )}

        {/* TAB 5: หน้าโปรไฟล์ */}
        {activeTab === 'profile' && (
          <ProfileTab user={currentUser} onLogout={handleLogout} />
        )}
      </main>

      {/* 3. ตะกร้าลอยน้ำ */}
      <div style={{ position: 'relative', zIndex: 90 }}>
        <CartFloating
          cart={cart}
          bestProvider={bestProvider}
          schedules={schedules}
          onOpenBrowse={() => setActiveTab('browse')}
          onOpenCalculate={() => {
            if (schedules.length > 0 && !schedules.some(s => String(s.id) === String(selectedBoxToSave))) {
              setSelectedBoxToSave(String(schedules[0].id));
            }
            setIsCalcModalOpen(true);
          }}
        />
      </div>

      {/* 4. Modals */}
      <CalculateModal
        isOpen={isCalcModalOpen}
        userId={currentUser.id}
        cart={cart}
        providerStats={providerStats}
        schedules={schedules}
        selectedBoxToSave={selectedBoxToSave}
        setSelectedBoxToSave={setSelectedBoxToSave}
        onClose={() => setIsCalcModalOpen(false)}
        onRemoveMovie={toggleCart}
        onClearCart={async () => {
          setCart([]);
          setIsCalcModalOpen(false);
          if (currentUser.id) {
            await fetch(`${API_URL}/api/watchlist/${currentUser.id}/clear`, { method: 'DELETE' });
          }
        }}
        onSaveToExistingBox={handleSaveCartToExistingBox}
        onSaveToNewBox={handleSaveWatchlistAsSchedule}
      />

      <MovieDetailModal
        movie={selectedMovie}
        isInCart={cart.some(m => m.id === selectedMovie?.id)}
        isSaved={savedList.some(m => m.id === selectedMovie?.id)}
        onClose={() => setSelectedMovie(null)}
        onToggleCart={toggleCart}
        onToggleSaved={toggleSaved}
      />

      <BoxDetailModal
        box={currentOpenedBox}
        userId={currentUser.id}
        onClose={() => setOpenedBoxId(null)}
        onSelectMovie={setSelectedMovie}
        onUpdateTitle={handleUpdateScheduleTitle}
        onRemoveMovie={handleRemoveMovieFromSchedule}
        onAddMoreMovies={() => {
          setOpenedBoxId(null);
          setActiveTab('browse');
        }}
      />
    </div>
  );
}