import React from 'react';
import type { UserProfile } from '../types';

interface ProfileTabProps {
  user: UserProfile;
  onLogout: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onLogout }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '42rem',
        width: '100%',
        margin: '1.5rem auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#121215',
          border: '1px dashed #3f3f46',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
            <pattern id="profile-card1-star-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
              <image href="/slidebarBG.png" x="15" y="15" width="50" height="50" />
              <image href="/slidebarBG.png" x="95" y="95" width="50" height="50" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profile-card1-star-pattern)" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={user.avatar}
            alt=""
            style={{ width: '4.25rem', height: '4.25rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #dc2626' }}
          />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>{user.name}</h2>
            <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '0.25rem 0 0.45rem 0' }}>{user.email}</p>
            <span style={{ fontSize: '0.65rem', backgroundColor: '#dc2626', color: '#fff', padding: '0.18rem 0.55rem', borderRadius: '0.35rem', fontWeight: 700 }}>
              PRO MEMBER
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#ef4444',
            borderRadius: '0.75rem',
            padding: '0.65rem 1.1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ออกจากระบบ
        </button>
      </div>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#121215',
          border: '1px dashed #3f3f46',
          borderRadius: '1.5rem',
          padding: '1.75rem',
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
            <pattern id="profile-card2-star-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
              <image href="/slidebarBG.png" x="15" y="15" width="50" height="50" />
              <image href="/slidebarBG.png" x="95" y="95" width="50" height="50" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profile-card2-star-pattern)" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>การตั้งค่าบัญชี</h3>
          <p style={{ fontSize: '0.82rem', color: '#a1a1aa', margin: 0 }}>เข้าร่วมเมื่อ: {user.joinedDate}</p>
        </div>
      </div>
    </div>
  );
};