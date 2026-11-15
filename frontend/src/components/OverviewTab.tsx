import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Movie, WatchSchedule } from '../types';
import { calculateBestProvider } from '../utils/providerCalculator';
import { MovieSlider } from './MovieSlider';
import { FeaturedHeroCard } from './FeaturedHeroCard';

interface OverviewTabProps {
  savedList: Movie[];
  unreadSavedCount: number;
  schedules: WatchSchedule[];
  cart: Movie[];
  trendingMovies: Movie[];
  actionMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  onOpenSavedTab: () => void;
  onOpenScheduleTab: () => void;
  onOpenBox: (id: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onToggleCart: (movie: Movie) => void;
  onToggleSaved: (movie: Movie) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  savedList,
  unreadSavedCount,
  schedules,
  cart,
  trendingMovies,
  actionMovies,
  horrorMovies,
  romanceMovies,
  onOpenSavedTab,
  onOpenScheduleTab,
  onOpenBox,
  onSelectMovie,
  onToggleCart,
  onToggleSaved,
}) => {
  const recentSavedMovies = useMemo(() => {
    return [...savedList].reverse().slice(0, 3);
  }, [savedList]);

  const latestSchedule = schedules.length > 0 ? schedules[schedules.length - 1] : undefined;
  const latestUniqueMovies = useMemo(() => {
    if (!latestSchedule) return [];
    return Array.from(new Map(latestSchedule.movies.map(m => [m.id, m])).values());
  }, [latestSchedule]);
  const latestBestProvider = useMemo(() => calculateBestProvider(latestUniqueMovies), [latestUniqueMovies]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        
        <div
          onClick={onOpenSavedTab}
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#121215',
            border: '1px dashed #3f3f46',
            borderRadius: '1.5rem',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '11rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderStyle = 'solid';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderStyle = 'dashed';
            e.currentTarget.style.borderColor = '#3f3f46';
          }}
        >
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              filter: 'blur(1.5px)',
              opacity: 0.14,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <defs>
              <pattern id="recent-saved-star-pattern" width="140" height="140" patternUnits="userSpaceOnUse">
                <image href="/slidebarBG.png" x="12" y="12" width="44" height="44" />
                <image href="/slidebarBG.png" x="82" y="82" width="44" height="44" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#recent-saved-star-pattern)" />
          </svg>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span>Lastest Bookmark:</span>
              </h3>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#27272a', color: '#a1a1aa', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', flexShrink: 0 }}>
                {savedList.length} เรื่อง
              </span>
            </div>

            {recentSavedMovies.length === 0 ? (
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0.5rem 0' }}>
                กดปักธงมุมขวาบนของการ์ดหนังเพื่อเก็บไว้ดูภายหลัง
              </p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginTop: '0.45rem' }}>
                <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                  {recentSavedMovies.map(m => (
                    <img
                      key={m.id}
                      src={m.poster}
                      alt={m.title}
                      onClick={e => {
                        e.stopPropagation();
                        onSelectMovie(m);
                      }}
                      title={`ดูรายละเอียด: ${m.title}`}
                      style={{ width: '2.1rem', height: '3rem', objectFit: 'cover', borderRadius: '0.3rem', border: '1px solid #3f3f46' }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#d4d4d8',
                    margin: 0,
                    fontWeight: 600,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.35,
                  }}
                >
                  {recentSavedMovies.map(m => m.title).join(', ')}
                </p>
              </div>
            )}
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px solid #27272a' }}>
            {unreadSavedCount > 0 ? (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', backgroundColor: 'rgba(245, 158, 11, 0.14)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.55rem', borderRadius: '0.4rem' }}>
                เพิ่มใหม่ล่าสุด +{unreadSavedCount} เรื่อง
              </span>
            ) : savedList.length > 0 ? (
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#a1a1aa' }}>
                บันทึกไว้ทั้งหมด {savedList.length} เรื่อง
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a' }}>
                ยังไม่มีรายการที่ปักธงไว้
              </span>
            )}

            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgb(243, 243, 243)', display: 'flex', alignItems: 'center', gap: '0.15rem', flexShrink: 0 }}>
              ดูทั้งหมด <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} />
            </span>
          </div>
        </div>

        
        <div
          onClick={() => {
            if (latestSchedule) {
              onOpenBox(latestSchedule.id);
            } else {
              onOpenScheduleTab();
            }
          }}
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#121215',
            border: '1px dashed #3f3f46',
            borderRadius: '1.5rem',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '11rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderStyle = 'solid';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderStyle = 'dashed';
            e.currentTarget.style.borderColor = '#3f3f46';
          }}
        >
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              filter: 'blur(1.5px)',
              opacity: 0.14,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <defs>
              <pattern id="latest-box-star-pattern" width="140" height="140" patternUnits="userSpaceOnUse">
                <image href="/slidebarBG.png" x="12" y="12" width="44" height="44" />
                <image href="/slidebarBG.png" x="82" y="82" width="44" height="44" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#latest-box-star-pattern)" />
          </svg>

          {latestSchedule ? (
            <>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>Latest Box : {latestSchedule.title}</span>
                  </h3>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#27272a', color: '#a1a1aa', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', flexShrink: 0 }}>
                    {latestUniqueMovies.length} เรื่อง
                  </span>
                </div>

                {latestUniqueMovies.length === 0 ? (
                  <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0.5rem 0' }}>
                    กล่องนี้ยังไม่มีภาพยนตร์ กดเพื่อเพิ่มหนังเข้ากล่อง
                  </p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginTop: '0.45rem' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                      {latestUniqueMovies.slice(0, 3).map(m => (
                        <img
                          key={m.id}
                          src={m.poster}
                          alt={m.title}
                          style={{ width: '2.1rem', height: '3rem', objectFit: 'cover', borderRadius: '0.3rem', border: '1px solid #3f3f46' }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#d4d4d8',
                        margin: 0,
                        fontWeight: 600,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.35,
                      }}
                    >
                      {latestUniqueMovies.map(m => m.title).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px solid #27272a' }}>
                {latestBestProvider ? (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.55rem', borderRadius: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Best Deal: {latestBestProvider.name} (~฿{latestBestProvider.costPerMovie}/เรื่อง)
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a' }}>
                    ยังไม่มีข้อมูลแนะนำแอป
                  </span>
                )}

                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#e4e4e4', display: 'flex', alignItems: 'center', gap: '0.15rem', flexShrink: 0 }}>
                  เปิดกล่อง <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} />
                </span>
              </div>
            </>
          ) : (
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>ยังไม่มีกล่องตารางล่าสุด</div>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>กดเพื่อสร้างกล่องแรก →</div>
            </div>
          )}
        </div>

        {/* ช่องที่ 3: FeaturedHeroCard */}
        <FeaturedHeroCard movies={trendingMovies} onSelectMovie={onSelectMovie} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        <MovieSlider title="TRENDING" movies={trendingMovies} cart={cart} savedList={savedList} onToggleCart={onToggleCart} onToggleSaved={onToggleSaved} onSelectMovie={onSelectMovie} />
        <MovieSlider title="Action Movies" movies={actionMovies} cart={cart} savedList={savedList} onToggleCart={onToggleCart} onToggleSaved={onToggleSaved} onSelectMovie={onSelectMovie} />
        <MovieSlider title="Horror & Mystery" movies={horrorMovies} cart={cart} savedList={savedList} onToggleCart={onToggleCart} onToggleSaved={onToggleSaved} onSelectMovie={onSelectMovie} />
        <MovieSlider title="Romance & Drama" movies={romanceMovies} cart={cart} savedList={savedList} onToggleCart={onToggleCart} onToggleSaved={onToggleSaved} onSelectMovie={onSelectMovie} />
      </div>
    </div>
  );
};