import React from 'react';
import { Calendar, Plus, Film, Trash2, ChevronRight } from 'lucide-react';
import type { Movie, WatchSchedule } from '../types';
import styles from '../App.module.css';

interface ScheduleTabProps {
  schedules: WatchSchedule[];
  onAddSchedule: () => void;
  onOpenBox: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  schedules,
  onAddSchedule,
  onOpenBox,
  onDeleteSchedule,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minHeight: '95vh', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar style={{ width: '1.4rem', height: '1.4rem', color: '#ef4444' }} />
            My Movie Boxes ({schedules.length})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={onAddSchedule}
            style={{
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.6rem 1.15rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
            }}
          >
            <Plus style={{ width: '1.05rem', height: '1.05rem' }} />
            Add Box
          </button>
        </div>
      </div>

      {schedules.length === 0 ? (
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
              <pattern id="empty-box-star-pattern" width="180" height="180" patternUnits="userSpaceOnUse">
                <image href="/slidebarBG.png" x="15" y="15" width="55" height="55" />
                <image href="/slidebarBG.png" x="105" y="105" width="55" height="55" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#empty-box-star-pattern)" />
          </svg>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Film style={{ width: '2.5rem', height: '2.5rem', color: '#71717a', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>No Box</h3>
            <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0.4rem 0 1.25rem 0' }}>Click HERE!!!</p>
            <button
              type="button"
              onClick={onAddSchedule}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '0.65rem',
                padding: '0.6rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              }}
            >
              + Creat My First Box
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '2rem 1.25rem', paddingTop: '1rem' }}>
          {schedules.map((box: WatchSchedule) => {
            const uniqueBoxMovies = Array.from(new Map(box.movies.map((m: Movie) => [m.id, m])).values());
            const uniqueCount = uniqueBoxMovies.length;

            return (
              <div
                key={box.id}
                onClick={() => onOpenBox(box.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  const lid = e.currentTarget.querySelector('.box-lid') as HTMLElement;
                  if (lid) lid.style.transform = 'translateY(-8px) scaleY(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const lid = e.currentTarget.querySelector('.box-lid') as HTMLElement;
                  if (lid) lid.style.transform = 'translateY(0) scaleY(1)';
                }}
              >
                {/*ชื่อกล่อง */}
                <div
                  className={`box-lid ${styles.boxLidAnimated}`}
                  style={{
                    width: '100%',
                    height: '2.5rem',
                    backgroundColor: '#ffffff',
                    border: '2px solid #09090b',
                    borderRadius: '0.65rem',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    padding: '0 0.85rem',
                    boxSizing: 'border-box',
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 900,
                      color: '#09090b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {box.title}
                  </span>

                  <button
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDeleteSchedule(box.id);
                    }}
                    title="ลบกล่องนี้"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#71717a',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
                  >
                    <Trash2 style={{ width: '0.95rem', height: '0.95rem' }} />
                  </button>
                </div>

                
                <div
                  style={{
                    width: '92%',
                    marginTop: '-0.35rem',
                    backgroundColor: '#ffffff',
                    border: '2px solid #09090b',
                    borderTop: 'none',
                    borderRadius: '0 0 1.25rem 1.25rem',
                    padding: '1.25rem 1rem 1.5rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.85rem',
                    boxSizing: 'border-box',
                    boxShadow: '0 14px 32px rgba(0,0,0,0.5)',
                    minHeight: '9.5rem',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      width: '4.75rem',
                      height: '1.35rem',
                      backgroundColor: '#09090b',
                      border: '1px solid #a1a1aa',
                      borderRadius: '0.45rem',
                      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.85)',
                    }}
                  />

                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#09090b' }}>
                      {uniqueCount} เรื่อง
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#09090b',
                      backgroundColor: '#f4f4f5',
                      border: '1px solid #d4d4d8',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ดูผลคำนวณ & รายชื่อหนัง <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};