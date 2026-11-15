import React, { useMemo, useEffect, useState } from 'react';
import { X, Calculator } from 'lucide-react';
import type { Movie, WatchSchedule } from '../types';
import styles from '../App.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface BackendRecommendation {
  combo_id?: string;
  tier_count: number;
  providers: { id: string; name: string; monthly_price: number; color?: string }[];
  covered_movie_ids: string[];
  covered_count: number;
  total_movies: number;
  coverage_percent: number;
  total_monthly_price: number;
  price_per_movie: number;
}

interface BoxDetailModalProps {
  box: WatchSchedule | undefined;
  userId: string;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
  onUpdateTitle: (boxId: string, newTitle: string) => void;
  onRemoveMovie: (boxId: string, movieId: string) => void;
  onAddMoreMovies: (boxId: string) => void;
}

export const BoxDetailModal: React.FC<BoxDetailModalProps> = ({
  box,
  userId,
  onClose,
  onSelectMovie,
  onUpdateTitle,
  onRemoveMovie,
  onAddMoreMovies,
}) => {
  const [recommendations, setRecommendations] = useState<BackendRecommendation[]>([]);
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const uniqueMovies = useMemo(() => {
    if (!box) return [];
    return Array.from(new Map(box.movies.map((m: Movie) => [m.id, m])).values());
  }, [box]);

  // ดึงผลการคำนวณแพ็กเกจทั้งหมดของ Box นี้จาก Backend
  useEffect(() => {
    if (!box || !userId || uniqueMovies.length === 0) {
      setRecommendations([]);
      setSelectedComboId(null);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/calculate/${userId}?schedule_id=${box.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
          const firstKey = data.recommendations[0].combo_id || String(data.recommendations[0].tier_count);
          setSelectedComboId(firstKey);
        } else {
          setRecommendations([]);
          setSelectedComboId(null);
        }
      })
      .catch(err => console.error('คำนวณแพ็กเกจของ Box ผิดพลาด:', err))
      .finally(() => setLoading(false));
  }, [box?.id, userId, uniqueMovies.length]);

  const activeRecommendation = useMemo(
    () =>
      recommendations.find(r => (r.combo_id || String(r.tier_count)) === selectedComboId) ||
      recommendations[0],
    [recommendations, selectedComboId]
  );

  if (!box) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.5rem',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        className={styles.boxModalContent}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '1.75rem',
          maxWidth: '52rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            backgroundColor: '#f4f4f5',
            border: '1px solid #e4e4e7',
            color: '#09090b',
            borderRadius: '50%',
            width: '2.25rem',
            height: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X style={{ width: '1.15rem', height: '1.15rem' }} />
        </button>

        <div style={{ borderBottom: '1px solid #e4e4e7', paddingBottom: '1rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <input
              type="text"
              value={box.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateTitle(box.id, e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#09090b',
                fontSize: '1.35rem',
                fontWeight: 900,
                outline: 'none',
                borderBottom: '1px dashed #a1a1aa',
                paddingBottom: '0.2rem',
                width: '100%',
                maxWidth: '28rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '0.65rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#52525b' }}>
              ทั้งหมด {uniqueMovies.length} เรื่อง • สร้างเมื่อ {box.createdAt}
            </span>
          </div>
        </div>

        {/* ส่วนแสดงผลการคำนวณความคุ้มค่าของกล่องนี้ (เลื่อนดูได้ทุกความเป็นไปได้) */}
        {uniqueMovies.length > 0 && (
          <div
            style={{
              backgroundColor: '#fafafa',
              border: '1px solid #e4e4e7',
              borderRadius: '1.15rem',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 900, color: '#09090b' }}>
                <Calculator style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                <span>ผลการคำนวณความคุ้มค่าของกล่องนี้ ({recommendations.length} ตัวเลือก)</span>
              </div>
              {recommendations.length > 1 && (
                <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600 }}>
                  คลิกเลือกแพ็กเกจเพื่อดูเรื่องที่รองรับ
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ fontSize: '0.8rem', color: '#71717a' }}>กำลังคำนวณ...</div>
            ) : recommendations.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: '#71717a' }}>ยังไม่พบข้อมูลแพ็กเกจสตรีมมิ่งในไทยสำหรับหนังในกล่องนี้</div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(14.5rem, 1fr))',
                  gap: '0.65rem',
                  maxHeight: '13.5rem',
                  overflowY: 'auto',
                  paddingRight: '0.25rem',
                }}
              >
                {recommendations.map((rec, idx) => {
                  const recKey = rec.combo_id || String(rec.tier_count);
                  const isSelected = (activeRecommendation?.combo_id || String(activeRecommendation?.tier_count)) === recKey;
                  const comboName = rec.providers.map(p => p.name).join(' + ');

                  return (
                    <button
                      key={recKey}
                      type="button"
                      onClick={() => setSelectedComboId(recKey)}
                      style={{
                        backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                        border: isSelected ? '2px solid #10b981' : '1.5px solid #e4e4e7',
                        borderRadius: '0.85rem',
                        padding: '0.75rem 0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {idx === 0 && (
                            <span style={{ fontSize: '0.6rem', fontWeight: 800, backgroundColor: '#10b981', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '0.3rem' }}>
                              BEST
                            </span>
                          )}
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#09090b' }}>
                            {comboName}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#52525b', marginTop: '0.2rem' }}>
                          ดูได้ {rec.covered_count}/{rec.total_movies} เรื่อง ({rec.coverage_percent}%)
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: isSelected ? '#059669' : '#09090b' }}>
                          ~฿{Math.round(rec.price_per_movie)}/เรื่อง
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#71717a' }}>฿{Math.round(rec.total_monthly_price)}/ด.</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#09090b', margin: 0 }}>
              ภาพยนตร์ในกล่องนี้ ({uniqueMovies.length} เรื่อง)
            </h4>

            <button
              type="button"
              onClick={() => onAddMoreMovies(box.id)}
              style={{
                backgroundColor: '#fef2f2',
                border: '1px dashed #dc2626',
                color: '#dc2626',
                borderRadius: '0.4rem',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + เพิ่มหนังเข้ากล่องนี้
            </button>
          </div>

          {uniqueMovies.length === 0 ? (
            <div style={{ backgroundColor: '#f4f4f5', padding: '2rem', borderRadius: '0.85rem', textAlign: 'center', color: '#52525b', fontSize: '0.8rem' }}>
              ยังไม่มีภาพยนตร์ในกล่องนี้ กดปุ่ม "+ เพิ่มหนังเข้ากล่องนี้" เพื่อเลือกหนัง
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))', gap: '1rem', paddingBottom: '0.65rem' }}>
              {uniqueMovies.map((movie: Movie) => {
                const isCovered =
                  !activeRecommendation ||
                  activeRecommendation.covered_movie_ids.map(String).includes(String(movie.id));

                return (
                  <div
                    key={movie.id}
                    onClick={() => onSelectMovie(movie)}
                    title="คลิกเพื่อดูรายละเอียดหนัง"
                    style={{
                      position: 'relative',
                      backgroundColor: '#f4f4f5',
                      border: isCovered && activeRecommendation ? '2px solid #10b981' : '1px solid #e4e4e7',
                      borderRadius: '0.65rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: isCovered ? 1 : 0.45,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '11.5rem', objectFit: 'cover' }} />

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onRemoveMovie(box.id, movie.id);
                      }}
                      title="ลดเรื่องนี้ออกจากกล่อง"
                      style={{
                        position: 'absolute',
                        top: '0.35rem',
                        right: '0.35rem',
                        backgroundColor: '#ffffff',
                        color: '#dc2626',
                        border: '1px solid #e4e4e7',
                        borderRadius: '50%',
                        width: '1.5rem',
                        height: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    >
                      <X style={{ width: '0.9rem', height: '0.9rem' }} />
                    </button>

                    <div style={{ padding: '0.45rem', fontSize: '0.75rem', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {movie.title}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};