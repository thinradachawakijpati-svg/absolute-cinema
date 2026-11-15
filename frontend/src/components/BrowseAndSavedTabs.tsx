import React, { useMemo } from 'react';
import { Heart, Bookmark, Loader2 } from 'lucide-react';
import type { Movie } from '../types';

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[\s\-_:.,'"!?()]+/g, '')
    .trim();

interface BrowseTabProps {
  searchTerm: string;
  isSearching?: boolean;
  movies: Movie[];
  cart: Movie[];
  savedList: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleCart: (movie: Movie) => void;
  onToggleSaved: (movie: Movie) => void;
}

export const BrowseTab: React.FC<BrowseTabProps> = ({
  searchTerm,
  isSearching = false,
  movies,
  cart,
  savedList,
  onSelectMovie,
  onToggleCart,
  onToggleSaved,
}) => {
  const displayMovies = useMemo(() => {
    const keyword = normalizeText(searchTerm);
    if (!keyword) return movies;

    const matched = movies.filter((movie: Movie & { originalTitle?: string }) => {
      const titleTh = normalizeText(movie.title || '');
      const titleEn = normalizeText(movie.originalTitle || '');
      return titleTh.includes(keyword) || titleEn.includes(keyword);
    });

    return matched.length > 0 ? matched : movies;
  }, [movies, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {searchTerm.trim() ? (
            isSearching ? (
              <>
                <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite', color: '#f59e0b' }} />
                <span>Searching "{searchTerm}"...</span>
              </>
            ) : (
              `Searched "${searchTerm}" (${displayMovies.length})`
            )
          ) : (
            `Movies (${displayMovies.length})`
          )}
        </h2>
      </div>

      {isSearching && searchTerm.trim() ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 2rem',
            gap: '1rem',
            color: '#a1a1aa',
          }}
        >
          <Loader2 style={{ width: '2.5rem', height: '2.5rem', animation: 'spin 1s linear infinite', color: '#ffffff' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>กำลังค้นหาภาพยนตร์ "{searchTerm}"...</div>
        </div>
      ) : displayMovies.length === 0 && searchTerm.trim() ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4.5rem 2rem',
            color: '#a1a1aa',
            backgroundColor: 'rgba(18, 18, 21, 0.7)',
            border: '1px dashed #3f3f46',
            borderRadius: '1.5rem',
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>ไม่พบภาพยนตร์ที่ค้นหา</div>
          <p style={{ fontSize: '0.82rem', marginTop: '0.4rem' }}>ลองพิมพ์ชื่อเรื่องภาษาอังกฤษ หรือเว้นวรรคคำค้นหาดูอีกครั้ง</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))', gap: '1.25rem' }}>
          {displayMovies.map((movie: Movie) => {
            const inCart = cart.some((m: Movie) => m.id === movie.id);
            const isSaved = savedList.some((m: Movie) => m.id === movie.id);

            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                onMouseEnter={e => {
                  const frame = e.currentTarget.querySelector('.poster-frame') as HTMLElement;
                  if (frame) frame.style.borderColor = '#ffffff';
                }}
                onMouseLeave={e => {
                  const frame = e.currentTarget.querySelector('.poster-frame') as HTMLElement;
                  if (frame) frame.style.borderColor = 'transparent';
                }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div
                  className="poster-frame"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#09090b',
                    padding: '3px',
                    border: '2px solid transparent',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '18.5rem',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '0.65rem',
                      right: '0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.55rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleCart(movie);
                      }}
                      title={inCart ? 'นำออกจาก Watchlist' : 'เพิ่มเข้า Watchlist'}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 0,
                        color: inCart ? '#ef4444' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Heart style={{ width: '1.25rem', height: '1.25rem', fill: inCart ? '#ef4444' : 'none' }} />
                    </button>

                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleSaved(movie);
                      }}
                      title={isSaved ? 'เลิกบันทึก' : 'บันทึกไว้ดูภายหลัง'}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 0,
                        color: isSaved ? '#f59e0b' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Bookmark style={{ width: '1.25rem', height: '1.25rem', fill: isSaved ? '#f59e0b' : 'none' }} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {movie.title}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SavedTabProps {
  savedList: Movie[];
  cart: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleCart: (movie: Movie) => void;
  onToggleSaved: (movie: Movie) => void;
}

export const SavedTab: React.FC<SavedTabProps> = ({
  savedList,
  cart,
  onSelectMovie,
  onToggleCart,
  onToggleSaved,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '95vh', paddingBottom: '6rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bookmark style={{ width: '1.3rem', height: '1.3rem', color: '#f59e0b', fill: '#f59e0b' }} /> My Bookmarks ({savedList.length})
      </h2>

      {savedList.length === 0 ? (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#121215',
            border: '1px dashed #3f3f46',
            borderRadius: '1.75rem',
            padding: '4.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
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
              <pattern id="empty-saved-star-pattern" width="180" height="180" patternUnits="userSpaceOnUse">
                <image href="/slidebarBG.png" x="15" y="15" width="55" height="55" />
                <image href="/slidebarBG.png" x="105" y="105" width="55" height="55" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#empty-saved-star-pattern)" />
          </svg>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Bookmark style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto 0.75rem auto', color: '#71717a' }} />
            <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 800 }}>No Bookmark</div>
            <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0.4rem 0 0 0' }}>
              Add yuor Bookmark!!!
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))', gap: '1.25rem' }}>
          {savedList.map((movie: Movie) => {
            const inCart = cart.some((m: Movie) => m.id === movie.id);
            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                onMouseEnter={e => {
                  const frame = e.currentTarget.querySelector('.poster-frame') as HTMLElement;
                  if (frame) frame.style.borderColor = '#ffffff';
                }}
                onMouseLeave={e => {
                  const frame = e.currentTarget.querySelector('.poster-frame') as HTMLElement;
                  if (frame) frame.style.borderColor = 'transparent';
                }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div
                  className="poster-frame"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#09090b',
                    padding: '3px',
                    border: '2px solid transparent',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '18.5rem',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '0.65rem',
                      right: '0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.55rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleCart(movie);
                      }}
                      title={inCart ? 'นำออกจาก Watchlist' : 'เพิ่มเข้า Watchlist'}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 0,
                        color: inCart ? '#ef4444' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Heart style={{ width: '1.25rem', height: '1.25rem', fill: inCart ? '#ef4444' : 'none' }} />
                    </button>

                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleSaved(movie);
                      }}
                      title="Bookmarked"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 0,
                        color: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Bookmark style={{ width: '1.25rem', height: '1.25rem', fill: '#f59e0b' }} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {movie.title}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};