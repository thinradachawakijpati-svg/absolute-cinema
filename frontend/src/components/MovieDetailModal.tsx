import React from 'react';
import type { Movie } from '../types';
import { PROVIDERS } from '../mockMovies';
import styles from '../App.module.css';
import { X } from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  isInCart: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleCart: (movie: Movie) => void;
  onToggleSaved: (movie: Movie) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  isInCart,
  isSaved,
  onClose,
  onToggleCart,
  onToggleSaved,
}) => {
  if (!movie) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '44rem',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          backgroundColor: '#121215',
          border: '1px solid #27272a',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '14rem', overflow: 'hidden' }}>
          <img
            src={movie.backdrop || movie.poster}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #121215 10%, transparent 90%)' }} />
          <button onClick={onClose} className={styles.modalCloseBtn}>
            <X style={{ width: '1.1rem', height: '1.1rem' }} />
          </button>
        </div>

        <div style={{ padding: '0 1.75rem 1.75rem 1.75rem', marginTop: '-4.5rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end' }}>
            <img
              src={movie.poster}
              alt={movie.title}
              style={{
                width: '7rem',
                height: '10.5rem',
                objectFit: 'cover',
                borderRadius: '0px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                border: '2px solid #27272a',
                flexShrink: 0,
              }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                {movie.title} <span style={{ fontWeight: 400, color: '#a1a1aa', fontSize: '1.1rem' }}>({movie.year})</span>
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
                <span style={{ border: '1px solid #71717a', padding: '0.1rem 0.4rem', borderRadius: '0px', color: '#e4e4e7', fontWeight: 700 }}>
                  {movie.ageRating || '15+'}
                </span>
                <span>{movie.releaseDate || `${movie.year}`}</span>
                <span>•</span>
                <span>{movie.genres.join(', ')}</span>
                <span>•</span>
                <span>{Math.floor(movie.runtime / 60)} ชม. {movie.runtime % 60} น.</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.65rem' }}>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: '#09090b',
                    border: '3px solid #22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    color: '#fff',
                    boxShadow: '0 0 12px rgba(34,197,94,0.35)',
                  }}
                >
                  {Math.round((movie.voteAverage || 7.5) * 10)}%
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e4e4e7' }}>คะแนนของผู้ใช้</span>
              </div>
            </div>
          </div>

          {movie.tagline && (
            <div style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '0.85rem', marginTop: '1.25rem', borderLeft: '3px solid #ef4444', paddingLeft: '0.65rem' }}>
              "{movie.tagline}"
            </div>
          )}

          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>เรื่องย่อ</div>
            <p style={{ fontSize: '0.8rem', color: '#d4d4d8', lineHeight: 1.6, margin: 0 }}>
              {movie.overview}
            </p>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '0.85rem', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600 }}>รับชมแบบสตรีมมิ่งได้ที่:</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              {movie.providers.map(pId => (
                <span
                  key={pId}
                  style={{
                    backgroundColor: '#27272a',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {PROVIDERS[pId]?.name} <span style={{ color: '#71717a', fontSize: '0.65rem' }}>(฿{PROVIDERS[pId]?.price}/ด.)</span>
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => onToggleSaved(movie)}
              style={{
                backgroundColor: isSaved ? '#f59e0b' : '#27272a',
                color: isSaved ? '#000' : '#fff',
                border: 'none',
                borderRadius: '0.65rem',
                padding: '0.6rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isSaved ? 'Bookmarked' : 'Bookmark'}
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleCart(movie);
                onClose();
              }}
              style={{
                backgroundColor: isInCart ? '#27272a' : '#dc2626',
                color: isInCart ? '#34d399' : '#fff',
                border: isInCart ? '1px solid #3f3f46' : 'none',
                borderRadius: '0.65rem',
                padding: '0.6rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isInCart ? 'Added to Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};