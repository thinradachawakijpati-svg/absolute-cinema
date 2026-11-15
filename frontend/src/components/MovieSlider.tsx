import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Bookmark } from 'lucide-react';
import type { Movie } from '../types';

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  cart: Movie[];
  savedList: Movie[];
  onToggleCart: (movie: Movie) => void;
  onToggleSaved: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieSlider: React.FC<MovieSliderProps> = ({
  title,
  movies,
  cart,
  savedList,
  onToggleCart,
  onToggleSaved,
  onSelectMovie,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}>
      {/* หัวข้อหมวดหมู่ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          {title}
        </h2>
      </div>

      {/* แถวรายการหนัง */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* ปุ่มเลื่อนซ้าย */}
        <button
          type="button"
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: '-0.5rem',
            zIndex: 10,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9))',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.18)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <ChevronLeft style={{ width: '1.75rem', height: '1.75rem', strokeWidth: 2.8 }} />
        </button>

        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            gap: '1.1rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '0.25rem 0',
            width: '100%',
          }}
        >
          {movies.map(movie => {
            const inCart = cart.some(m => m.id === movie.id);
            const isSaved = savedList.some(m => m.id === movie.id);
            const isHovered = hoveredId === movie.id;

            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  flex: '0 0 12.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                {/*ไฮไลท์กรอบขาว*/}
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#09090b',
                    padding: '3px',
                    border: isHovered ? '2px solid #ffffff' : '2px solid transparent',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '17.5rem',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.6rem',
                      right: '0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    
                    <button
                      type="button"
                      onClick={e => {
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
                      <Heart style={{ width: '1.2rem', height: '1.2rem', fill: inCart ? '#ef4444' : 'none' }} />
                    </button>

                    
                    <button
                      type="button"
                      onClick={e => {
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
                      <Bookmark style={{ width: '1.2rem', height: '1.2rem', fill: isSaved ? '#f59e0b' : 'none' }} />
                    </button>
                  </div>
                </div>

                
                <div
                  style={{
                    fontSize: '0.88rem',
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

        {/* ปุ่มเลื่อนขวา */}
        <button
          type="button"
          onClick={() => scroll('right')}
          style={{
            position: 'absolute',
            right: '-0.5rem',
            zIndex: 10,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9))',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.18)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <ChevronRight style={{ width: '1.75rem', height: '1.75rem', strokeWidth: 2.8 }} />
        </button>
      </div>
    </section>
  );
};