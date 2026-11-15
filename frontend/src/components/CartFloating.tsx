import React, { useState } from 'react';
import { ShoppingBag, X, Calculator, ChevronRight } from 'lucide-react';
import type { Movie, ProviderStat, WatchSchedule } from '../types';

interface CartFloatingProps {
  cart: Movie[];
  bestProvider?: ProviderStat;
  schedules: WatchSchedule[];
  onOpenBrowse: () => void;
  onOpenCalculate: () => void;
}

export const CartFloating: React.FC<CartFloatingProps> = ({
  cart,
  bestProvider,
  onOpenBrowse,
  onOpenCalculate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.85rem' }}>
    
      {isOpen && (
        <div
          style={{
            width: '22rem',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '1.35rem',
            padding: '1.25rem',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75)',
            color: '#f4f4f5',
          }}
        >
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid #27272a' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              My Movie Cart
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600 }}>
                เลือกไว้ {cart.length} เรื่อง
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a1a1aa',
                  cursor: 'pointer',
                  padding: '0.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>

          
          {cart.length === 0 ? (
            <div style={{ padding: '1.75rem 0.5rem 0.75rem 0.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                No Watchlist
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenBrowse();
                }}
                style={{
                  backgroundColor: '#27272a',
                  border: '1px solid #3f3f46',
                  color: '#ffffff',
                  borderRadius: '0.75rem',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Go Add to Watchlist
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem' }}>
              <div style={{ maxHeight: '13rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingRight: '0.2rem' }}>
                {cart.map(movie => (
                  <div
                    key={movie.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      backgroundColor: '#27272a',
                      padding: '0.45rem',
                      borderRadius: '0.7rem',
                    }}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      style={{ width: '2.25rem', height: '3rem', objectFit: 'cover', borderRadius: '0.4rem', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.title}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
                        {movie.genres.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {bestProvider && (
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '0.75rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.72rem',
                    color: '#34d399',
                    fontWeight: 700,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Best Deal: {bestProvider.name}</span>
                  <span>~฿{bestProvider.costPerMovie}/เรื่อง</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenCalculate();
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.8rem',
                  padding: '0.65rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 6px 18px rgba(220, 38, 38, 0.4)',
                }}
              >
                <Calculator style={{ width: '0.95rem', height: '0.95rem' }} />
                Calculate And Save
                <ChevronRight style={{ width: '0.9rem', height: '0.9rem' }} />
              </button>
            </div>
          )}
        </div>
      )}

      
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        title="Cart"
        style={{
          position: 'relative',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: '#dc2626',
          border: '2px solid #ffffff',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(220, 38, 38, 0.55)',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <ShoppingBag style={{ width: '1.45rem', height: '1.45rem' }} />
        {cart.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-0.25rem',
              right: '-0.25rem',
              backgroundColor: '#ffffff',
              color: '#dc2626',
              fontSize: '0.72rem',
              fontWeight: 900,
              borderRadius: '50%',
              width: '1.35rem',
              height: '1.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            }}
          >
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
};