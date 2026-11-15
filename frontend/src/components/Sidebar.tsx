import React, { useState } from 'react';
import { LayoutGrid, Search, Calendar, Bookmark } from 'lucide-react';

export type NavTab = 'overview' | 'browse' | 'schedule' | 'saved' | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  scheduleCount: number;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  scheduleCount,
  savedCount,
}) => {
  const [popKey, setPopKey] = useState<number>(0);

  const navItems = [
    { id: 'overview' as NavTab, label: 'Home', icon: LayoutGrid },
    { id: 'browse' as NavTab, label: 'Serach', icon: Search },
    { id: 'schedule' as NavTab, label: `My Movie Box (${scheduleCount})`, icon: Calendar },
    { id: 'saved' as NavTab, label: `Bookmark (${savedCount})`, icon: Bookmark },
  ];

  const handleMascotClick = () => {
    setPopKey(prev => prev + 1);
  };

  return (
    <aside
      style={{
        width: '16.5rem',
        backgroundColor: '#ffffff',
        // พื้นหลังลายตารางเส้นเล็กสีแดง opacity 50%
        backgroundImage: `
          linear-gradient(to right, rgba(253, 171, 171, 0.5) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 138, 138, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '-1px -1px',
        border: '1px solid #e4e4e7',
        borderRadius: '1.75rem',
        padding: '1.5rem 1.15rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        height: 'calc(100vh - 2.5rem)',
        position: 'sticky',
        top: '1.25rem',
        boxSizing: 'border-box',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
      }}
    >
      {/* Keyframes สำหรับอนิเมชันกระโดดเด้งดึ๋ง */}
      <style>
        {`
          @keyframes mascotJumpBounce {
            0% {
              transform: translateY(0) scale(1, 1);
            }
            18% {
              transform: translateY(4px) scale(1.12, 0.85);
            }
            45% {
              transform: translateY(-28px) scale(0.94, 1.06);
            }
            70% {
              transform: translateY(0) scale(1.06, 0.92);
            }
            85% {
              transform: translateY(-8px) scale(0.98, 1.02);
            }
            100% {
              transform: translateY(0) scale(1, 1);
            }
          }
        `}
      </style>

      
      <div
        style={{
          padding: '0.5rem 0.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#09090b',
            letterSpacing: '0.16em',
            lineHeight: 1.1,
          }}
        >
          ABSOLUTE
        </div>
        <div
          style={{
            fontSize: '1.85rem',
            fontWeight: 900,
            color: '#09090b',
            letterSpacing: '0.04em',
            lineHeight: 1,
            marginTop: '0.15rem',
          }}
        >
          CINEMA
        </div>
      </div>

      
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          backgroundColor: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '1.25rem',
          padding: '0.5rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.9rem',
                borderRadius: '0.85rem',
                border: 'none',
                outline: 'none',
                backgroundColor: isActive ? '#111111' : 'transparent',
                color: isActive ? '#ffffff' : '#18181b',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#f4f4f5';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon
                style={{
                  width: '1.05rem',
                  height: '1.05rem',
                  color: isActive ? '#ffffff' : '#71717a',
                  flexShrink: 0,
                }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          paddingTop: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={handleMascotClick}
          title="Pop"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <img
            key={`mascot-img-${popKey}`}
            src="/char_2.png"
            alt="Popcorn Mascot"
            style={{
              width: '12.5rem',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
              transformOrigin: 'bottom center',
              animation: popKey > 0 ? 'mascotJumpBounce 0.55s ease-out' : 'none',
            }}
          />
        </button>
      </div>
    </aside>
  );
};