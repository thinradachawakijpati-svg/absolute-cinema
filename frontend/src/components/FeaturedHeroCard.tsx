import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '../types';

interface FeaturedHeroCardProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const FeaturedHeroCard: React.FC<FeaturedHeroCardProps> = ({ movies, onSelectMovie }) => {
  const featuredMovies = movies.slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredMovies.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % featuredMovies.length);
  };

  return (
    <div
      onClick={() => onSelectMovie(currentMovie)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        minHeight: '11rem',
        cursor: 'pointer',
        border: isHovered ? '1.5px solid #ffffff' : '1.5px solid transparent',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
        transition: 'border-color 0.15s ease',
        backgroundColor: '#121215',
      }}
    >
      {/* รูปภาพพื้นหลัง */}
      <img
        src={currentMovie.backdrop || currentMovie.poster}
        alt={currentMovie.title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(9,9,11,0.35) 0%, rgba(9,9,11,0.75) 100%)',
        }}
      />

      
      <div
        style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 800,
          padding: '0.32rem 0.7rem',
          borderRadius: '0.55rem',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.45)',
          zIndex: 2,
        }}
      >
        !!!TRENDING!!!
      </div>

      {/* ปุ่มเลื่อนซ้าย */}
      <button
        type="button"
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '0.6rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
          zIndex: 2,
        }}
      >
        <ChevronLeft style={{ width: '1.35rem', height: '1.35rem', strokeWidth: 2.8 }} />
      </button>

      {/* ปุ่มเลื่อนขวา */}
      <button
        type="button"
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '0.6rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
          zIndex: 2,
        }}
      >
        <ChevronRight style={{ width: '1.35rem', height: '1.35rem', strokeWidth: 2.8 }} />
      </button>

      
      <div
        style={{
          position: 'absolute',
          bottom: '0.7rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          zIndex: 2,
        }}
      >
        {featuredMovies.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={e => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            style={{
              width: currentIndex === idx ? '1.25rem' : '0.4rem',
              height: '0.4rem',
              borderRadius: '999px',
              backgroundColor: currentIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};