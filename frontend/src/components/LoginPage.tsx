import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (targetMode: 'register' | 'login') => {
    setMode(targetMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const translateAuthError = (message: string) => {
    if (message.includes('Invalid login credentials')) {
      return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    }
    if (message.includes('User already registered')) {
      return 'อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ';
    }
    if (message.includes('Email not confirmed')) {
      return 'กรุณายืนยันอีเมลในกล่องข้อความของคุณก่อนเข้าสู่ระบบ';
    }
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'register') {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('กรุณากรอกข้อมูลให้ครบทุกช่อง');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: username.trim(), // เก็บ username ไว้ใน user_metadata
            },
          },
        });

        if (error) {
          setErrorMsg(translateAuthError(error.message));
          return;
        }

        // กรณีปิด Confirm Email ใน Supabase จะได้ session ทันที
        if (data.session) {
          onLoginSuccess();
        } else {
          // กรณีเปิด Confirm Email ไว้
          setSuccessMsg('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตนก่อนเข้าสู่ระบบ');
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } catch (err) {
        setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('กรุณากรอกอีเมลและรหัสผ่าน');
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(translateAuthError(error.message));
          return;
        }

        if (data.session) {
          onLoginSuccess();
        }
      } catch (err) {
        setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09090b',
        color: '#09090b',
        fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* พื้นหลัง */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(2px)',
          opacity: 0.14,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <defs>
          <pattern id="auth-star-pattern" width="220" height="220" patternUnits="userSpaceOnUse">
            <image href="/slidebarBG.png" x="15" y="15" width="65" height="65" />
            <image href="/slidebarBG.png" x="125" y="125" width="65" height="65" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-star-pattern)" />
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#ffffff',
          backgroundImage: `
            linear-gradient(to right, rgba(244, 63, 94, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 63, 94, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          border: '1px solid #e4e4e7',
          borderRadius: '2.25rem',
          padding: '2.25rem 2rem 1.5rem 2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#09090b',
              textTransform: 'uppercase',
            }}
          >
            ABSOLUTE
          </span>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              margin: '0.05rem 0 0 0',
              letterSpacing: '0.02em',
              color: '#09090b',
              lineHeight: 1.05,
            }}
          >
            CINEMA
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#52525b', fontWeight: 500, margin: '0.55rem 0 0 0' }} />
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #f4f4f5',
            borderRadius: '1.5rem',
            padding: '1.35rem',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* ข้อความแจ้งเตือน Error */}
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '0.6rem 0.85rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* ข้อความแจ้งเตือน Success (กรณีต้องยืนยันอีเมล) */}
          {successMsg && (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#16a34a',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '0.6rem 0.85rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
              }}
            >
              {successMsg}
            </div>
          )}

          {/* ฟอร์มกรอกข้อมูล */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#18181b' }}>ชื่อผู้ใช้ (Username)</label>
                <div style={{ position: 'relative' }}>
                  <User
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1rem',
                      height: '1rem',
                      color: '#71717a',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="เช่น Somchai Cinema"
                    value={username}
                    disabled={loading}
                    onChange={e => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#fafafa',
                      border: '1px solid #e4e4e7',
                      borderRadius: '0.85rem',
                      padding: '0.75rem 1rem 0.75rem 2.6rem',
                      color: '#09090b',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      outline: 'none',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#09090b';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#e4e4e7';
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#18181b' }}>อีเมล</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#71717a',
                  }}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  disabled={loading}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#fafafa',
                    border: '1px solid #e4e4e7',
                    borderRadius: '0.85rem',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    color: '#09090b',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#09090b';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e4e4e7';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#18181b' }}>รหัสผ่าน</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#71717a',
                  }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  disabled={loading}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#fafafa',
                    border: '1px solid #e4e4e7',
                    borderRadius: '0.85rem',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    color: '#09090b',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#09090b';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e4e4e7';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#18181b' }}>ยืนยันรหัสผ่าน</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1rem',
                      height: '1rem',
                      color: '#71717a',
                    }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    disabled={loading}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#fafafa',
                      border: '1px solid #e4e4e7',
                      borderRadius: '0.85rem',
                      padding: '0.75rem 1rem 0.75rem 2.6rem',
                      color: '#09090b',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      outline: 'none',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#09090b';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#e4e4e7';
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.35rem',
                width: '100%',
                backgroundColor: loading ? '#52525b' : '#09090b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.95rem',
                padding: '0.85rem 1rem',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 6px 18px rgba(9, 9, 11, 0.25)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.backgroundColor = '#27272a';
              }}
              onMouseLeave={e => {
                if (!loading) e.currentTarget.style.backgroundColor = '#09090b';
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                  <span>กำลังดำเนินการ...</span>
                </>
              ) : mode === 'register' ? (
                <>
                  <UserPlus style={{ width: '1rem', height: '1rem' }} />
                  <span>สมัครสมาชิก</span>
                </>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </>
              )}
            </button>
          </form>

          {/* ลิงก์สลับระหว่าง Register <-> Login */}
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#52525b', fontWeight: 500 }}>
            {mode === 'register' ? (
              <>
                มีบัญชีอยู่แล้วใช่ไหม?{' '}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => switchMode('login')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0c3fe8',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  เข้าสู่ระบบ (Login)
                </button>
              </>
            ) : (
              <>
                ยังไม่มีบัญชีผู้ใช้?{' '}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => switchMode('register')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0c3fe8',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  สมัครสมาชิก (Register)
                </button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e4e4e7' }} />
            <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 600 }}>หรือ</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e4e4e7' }} />
          </div>

          {/* ปุ่มบัญชีทดลอง (Demo) */}
          <button
            type="button"
            disabled={loading}
            onClick={onLoginSuccess}
            style={{
              width: '100%',
              backgroundColor: '#fafafa',
              border: '1px solid #e4e4e7',
              borderRadius: '0.9rem',
              padding: '0.75rem 1rem',
              color: '#09090b',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'border-color 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#09090b';
              e.currentTarget.style.backgroundColor = '#f4f4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e4e4e7';
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
          >
            <Sparkles style={{ width: '0.95rem', height: '0.95rem', color: '#f59e0b' }} />
            <span>เข้าสู่ระบบด้วยบัญชีทดลอง (Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};