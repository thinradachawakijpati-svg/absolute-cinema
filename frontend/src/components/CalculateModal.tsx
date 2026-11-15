import React, { useEffect, useState } from 'react';
import { X, Calculator, FolderPlus, CheckCircle2, Trash2 } from 'lucide-react';
import type { Movie, ProviderStat, WatchSchedule } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface BackendRecommendation {
  tier_count: number;
  providers: { id: string; name: string; monthly_price: number; color?: string }[];
  covered_movie_ids: string[];
  covered_count: number;
  total_movies: number;
  coverage_percent: number;
  total_monthly_price: number;
  price_per_movie: number;
}

interface CalculateModalProps {
  isOpen: boolean;
  userId: string;
  cart: Movie[];
  providerStats: ProviderStat[];
  schedules: WatchSchedule[];
  selectedBoxToSave: string;
  setSelectedBoxToSave: (id: string) => void;
  onClose: () => void;
  onRemoveMovie: (movie: Movie) => void;
  onClearCart: () => void;
  onSaveToExistingBox: (schedId: string) => void;
  onSaveToNewBox: () => void;
}

export const CalculateModal: React.FC<CalculateModalProps> = ({
  isOpen,
  userId,
  cart,
  providerStats,
  schedules,
  selectedBoxToSave,
  setSelectedBoxToSave,
  onClose,
  onRemoveMovie,
  onClearCart,
  onSaveToExistingBox,
  onSaveToNewBox,
}) => {
  const [recommendations, setRecommendations] = useState<BackendRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ดึงผลการคำนวณจริงจาก Backend ทุกครั้งที่เปิด Modal หรือจำนวนหนังใน cart เปลี่ยน
  useEffect(() => {
    if (!isOpen || !userId || cart.length === 0) {
      setRecommendations([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`${API_URL}/api/calculate/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.recommendations)) {
            setRecommendations(data.recommendations);
          }
        })
        .catch(err => console.error('คำนวณแพ็กเกจผิดพลาด:', err))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [isOpen, userId, cart]);

  if (!isOpen) return null;

  // คำนวณเวลาดูรวมของหนังที่ครอบคลุมในแต่ละตัวเลือก
  const getTotalMinutes = (coveredIds: string[]) => {
    return cart
      .filter(m => coveredIds.includes(String(m.id)))
      .reduce((sum, m) => sum + (m.runtime || 120), 0);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1.5rem',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '1.75rem',
          maxWidth: '42rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.35rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
          position: 'relative',
          color: '#09090b',
        }}
      >
        <button
          type="button"
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '0.75rem', color: '#dc2626', display: 'flex' }}>
              <Calculator style={{ width: '1.35rem', height: '1.35rem' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#09090b' }}>
                Best Deal
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#52525b', margin: '0.15rem 0 0 0' }}>
                วิเคราะห์แพ็กเกจสตรีมมิ่งที่คุ้มค่าที่สุดสำหรับคุณ
              </p>
            </div>
          </div>
        </div>

        {/* ส่วนแสดงผลการคำนวณแพ็กเกจจาก Backend */}
        {loading ? (
          <div style={{ backgroundColor: '#f4f4f5', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#52525b' }}>
            กำลังคำนวณความคุ้มค่าจากฐานข้อมูล...
          </div>
        ) : recommendations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommendations.map((rec, index) => {
              const isTop = index === 0;
              const comboName = rec.providers.map(p => p.name).join(' + ');
              const totalMins = getTotalMinutes(rec.covered_movie_ids);

              return (
                <div
                  key={rec.tier_count}
                  style={{
                    backgroundColor: isTop ? '#fef2f2' : '#f4f4f5',
                    border: isTop ? '2px solid #dc2626' : '1px solid #e4e4e7',
                    borderRadius: '1.1rem',
                    padding: '1rem 1.15rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {isTop && (
                        <span style={{ backgroundColor: '#dc2626', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '0.4rem' }}>
                          RECOMMEND
                        </span>
                      )}
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#09090b' }}>{comboName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: 600 }}>
                        (฿{Math.round(rec.total_monthly_price)}/เดือน)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#3f3f46', marginTop: '0.3rem', fontWeight: 600 }}>
                      ดูได้ <strong style={{ color: '#09090b' }}>{rec.covered_count}</strong> จาก {rec.total_movies} เรื่อง ({rec.coverage_percent}%) • รวม {totalMins} นาที
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: 600 }}>เฉลี่ยตกเรื่องละ</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: isTop ? '#dc2626' : '#059669' }}>
                      ~฿{Math.round(rec.price_per_movie)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : providerStats.length === 0 ? (
          <div style={{ backgroundColor: '#f4f4f5', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#52525b' }}>
            ไม่พบข้อมูลสตรีมมิงที่รองรับสำหรับรายการที่เลือก
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {providerStats.map((stat, index) => {
              const isTop = index === 0;
              return (
                <div
                  key={stat.providerId}
                  style={{
                    backgroundColor: isTop ? '#fef2f2' : '#f4f4f5',
                    border: isTop ? '2px solid #dc2626' : '1px solid #e4e4e7',
                    borderRadius: '1.1rem',
                    padding: '1rem 1.15rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isTop && (
                        <span style={{ backgroundColor: '#dc2626', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '0.4rem' }}>
                          RECOMMEND
                        </span>
                      )}
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#09090b' }}>{stat.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: 600 }}>(฿{stat.price}/เดือน)</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#3f3f46', marginTop: '0.3rem', fontWeight: 600 }}>
                      ดูได้ <strong style={{ color: '#09090b' }}>{stat.matchedCount}</strong> จาก {cart.length} เรื่อง ({stat.coveragePercent}%) • รวม {stat.totalMinutes} นาที
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: 600 }}>เฉลี่ยตกเรื่องละ</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: isTop ? '#dc2626' : '#059669' }}>
                      ~฿{stat.costPerMovie}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* รายการภาพยนตร์ + ปุ่มกดลบทีละเรื่อง และปุ่มล้างทั้งหมด */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#52525b' }}>
              รายการภาพยนตร์ในรอบนี้ ({cart.length} เรื่อง):
            </span>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                style={{
                  background: 'transparent',
                  border: '1px solid #fecaca',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '0.45rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Trash2 style={{ width: '0.75rem', height: '0.75rem' }} />
                ล้างหัวใจทั้งหมด
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingTop: '0.35rem', paddingBottom: '0.25rem' }}>
            {cart.map(movie => (
              <div key={movie.id} style={{ position: 'relative', flex: '0 0 4.6rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => onRemoveMovie(movie)}
                  title={`เอา "${movie.title}" ออกจากรายการ`}
                  style={{
                    position: 'absolute',
                    top: '-0.3rem',
                    right: '-0.3rem',
                    width: '1.3rem',
                    height: '1.3rem',
                    borderRadius: '50%',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                    zIndex: 2,
                  }}
                >
                  <X style={{ width: '0.7rem', height: '0.7rem', strokeWidth: 3 }} />
                </button>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: '4.5rem', height: '6.3rem', objectFit: 'cover', borderRadius: '0.45rem', border: '1px solid #e4e4e7' }}
                />
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.25rem' }}>
                  {movie.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* เลือกเซฟลงกล่องไหน */}
        <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#09090b' }}>
              My Boxes:
            </span>
            <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600 }}>
              มีอยู่ {schedules.length} กล่อง
            </span>
          </div>

          {schedules.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
                gap: '0.6rem',
                maxHeight: '11rem',
                overflowY: 'auto',
                padding: '0.15rem',
              }}
            >
              {schedules.map((s, i) => {
                const isSelected = selectedBoxToSave === s.id;
                const uniqueInBox = Array.from(new Map(s.movies.map(m => [m.id, m])).values()).length;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedBoxToSave(s.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.6rem',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '0.95rem',
                      border: isSelected ? '2px solid #dc2626' : '1.5px solid #e4e4e7',
                      backgroundColor: isSelected ? '#fef2f2' : '#fafafa',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 900,
                            backgroundColor: isSelected ? '#dc2626' : '#09090b',
                            color: '#ffffff',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '0.35rem',
                            letterSpacing: '0.03em',
                          }}
                        >
                          BOX #{i + 1}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a' }}>
                          ({uniqueInBox} เรื่อง)
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#09090b',
                          marginTop: '0.3rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {s.title}
                      </div>
                    </div>

                    <div
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '50%',
                        border: isSelected ? 'none' : '1.5px solid #d4d4d8',
                        backgroundColor: isSelected ? '#dc2626' : '#ffffff',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && <CheckCircle2 style={{ width: '0.9rem', height: '0.9rem' }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.2rem' }}>
            {schedules.length > 0 && (
              <button
                type="button"
                onClick={() => onSaveToExistingBox(selectedBoxToSave)}
                style={{
                  flex: 1,
                  backgroundColor: '#09090b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.85rem',
                  padding: '0.8rem 1rem',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 12px rgba(9, 9, 11, 0.2)',
                }}
              >
                <CheckCircle2 style={{ width: '1.05rem', height: '1.05rem' }} />
                Save To Selected Box
              </button>
            )}

            <button
              type="button"
              onClick={onSaveToNewBox}
              style={{
                flex: 1,
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.85rem',
                padding: '0.8rem 1rem',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              }}
            >
              <FolderPlus style={{ width: '1.05rem', height: '1.05rem' }} />
              + Add To New Box
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};