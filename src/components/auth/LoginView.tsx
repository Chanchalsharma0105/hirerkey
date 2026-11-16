import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Input,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
} from '@mui/joy';
import { motion } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiArrowRight, HiEye, HiEyeSlash } from 'react-icons/hi2';

export type AuthMode = 'otp' | 'password';

export interface LoginViewProps {
  onSuccessLogin?: (email: string, method: AuthMode) => void;
  className?: string;
  defaultView?: number;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccessLogin,
  className,
  defaultView,
}) => {
  // Active page state (1: The Connected HR Ecosystem, 2: The Living Dashboard)
  const [activePage, setActivePage] = useState<1 | 4>((defaultView === 4 ? 4 : 1) as 1 | 4);

  // View 4 form states (ApprovalMax Inspired Workflow Animation & Modern Split)
  const [v4AuthMode, setV4AuthMode] = useState<'otp' | 'password'>('otp');
  const [v4OtpStep, setV4OtpStep] = useState<'input' | 'verify'>('input');
  const [v4OtpDigits, setV4OtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [v4OtpSecondsLeft, setV4OtpSecondsLeft] = useState(29);
  const [v4Email, setV4Email] = useState('alex.chen@earthhotels.com');
  const [v4Password, setV4Password] = useState('EarthHotels2026!#');
  const [v4ShowPassword, setV4ShowPassword] = useState(false);
  const [v4RememberMe, setV4RememberMe] = useState(true);
  const [v4Tilt, setV4Tilt] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const handleV4MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setV4Tilt({ x: -y * 12, y: x * 12 });
  };

  const handleV4MouseLeave = () => {
    setV4Tilt({ x: 0, y: 0 });
  };

  // View 4 OTP countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (v4OtpStep === 'verify' && v4OtpSecondsLeft > 0) {
      timer = setInterval(() => {
        setV4OtpSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [v4OtpStep, v4OtpSecondsLeft]);

  // Keyboard Shortcuts: [1], [2], [3], [ArrowLeft], [ArrowRight]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) {
        return;
      }
      const pages: (1 | 4)[] = [1, 4];
      if (e.key === '1') {
        setActivePage(1);
      } else if (e.key === '4') {
        setActivePage(4);
      } else if (e.key === 'ArrowLeft') {
        setActivePage((prev) => {
          const idx = pages.indexOf(prev as any);
          return pages[(idx - 1 + pages.length) % pages.length];
        });
      } else if (e.key === 'ArrowRight') {
        setActivePage((prev) => {
          const idx = pages.indexOf(prev as any);
          return pages[(idx + 1) % pages.length];
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // View 4 Form Handlers
  const handleV4SendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v4Email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setV4OtpStep('verify');
      setV4OtpSecondsLeft(29);
      setV4OtpDigits(['', '', '', '', '', '']);
    }, 450);
  };

  const handleV4VerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const code = v4OtpDigits.join('');
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v4Email, 'otp');
    }, 600);
  };

  const handleV4PasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v4Email || !v4Password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v4Email, 'password');
    }, 600);
  };

  const handleV4OtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const nextDigits = [...v4OtpDigits];
    nextDigits[index] = clean ? clean[clean.length - 1] : '';
    setV4OtpDigits(nextDigits);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`v4-otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleV4OtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !v4OtpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`v4-otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendV4Code = () => {
    setV4OtpSecondsLeft(29);
    setV4OtpDigits(['', '', '', '', '', '']);
  };

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 }, pb: { xs: 8, sm: 10 },
        backgroundColor: '#F6F1FF',
        backgroundImage:
          "url('v4_bg_gradient.png'), radial-gradient(ellipse 65% 55% at 90% 10%, rgba(168, 85, 247, 0.55) 0%, rgba(192, 132, 252, 0.25) 45%, transparent 75%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(147, 51, 234, 0.5) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 75%), linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 35%, #F3E8FF 70%, #EDE9FE 100%)",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: '#0F172A',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      <motion.div
            key="view-4"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: '1220px', display: 'flex', justifyContent: 'center' }}
          >
            <style>{`
              @keyframes v4DotPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.4); opacity: 0.5; }
              }

              /* 1. CENTRAL MINI DASHBOARD */
              @keyframes v4DashMaster {
                0% {
                  opacity: 0.92;
                  transform: scale(0.97) translateY(2px);
                  box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24);
                }
                10% {
                  opacity: 1;
                  transform: scale(1.008) translateY(-3px);
                  box-shadow: 0 24px 50px -10px rgba(124, 58, 237, 0.36);
                }
                15% {
                  opacity: 1;
                  transform: scale(1.0) translateY(0px);
                  box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.30);
                }
                35% {
                  transform: scale(1.0) translateY(-2px);
                }
                50% {
                  transform: scale(1.0) translateY(1px);
                }
                60% {
                  transform: scale(1.0) translateY(0px);
                  box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.32);
                }
                70% {
                  transform: scale(1.025) translateY(-3px);
                  box-shadow: 
                    0 30px 70px -10px rgba(124, 58, 237, 0.46),
                    0 0 35px 4px rgba(124, 58, 237, 0.26),
                    0 0 0 1px rgba(255, 255, 255, 0.9);
                }
                80% {
                  transform: scale(1.0) translateY(0px);
                  box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.32);
                }
                94% {
                  opacity: 1;
                  transform: scale(0.985) translateY(1px);
                  box-shadow: 0 18px 40px -8px rgba(124, 58, 237, 0.26);
                }
                100% {
                  opacity: 0.92;
                  transform: scale(0.97) translateY(2px);
                  box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24);
                }
              }

              /* 2. CARD 1: ORIENTATION (Top-Left) */
              @keyframes v4Card1Motion {
                0%, 14% {
                  opacity: 0;
                  transform: translate(-14px, -8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                20% {
                  opacity: 1;
                  transform: translate(1px, 1px) scale(1.02);
                  border-color: #7C3AED;
                  box-shadow: 0 14px 32px -6px rgba(124, 58, 237, 0.32);
                }
                24% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(124, 58, 237, 0.6);
                }
                50% {
                  transform: translate(0, -2px) scale(1.0);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(-1px, -3px) scale(1.03);
                  border-color: #7C3AED;
                  box-shadow: 0 16px 36px -6px rgba(124, 58, 237, 0.38);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(124, 58, 237, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(-14px, -8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(-14px, -8px) scale(0.96);
                }
              }

              /* 3. CARD 2: DEPARTMENT TOUR (Bottom-Left) */
              @keyframes v4Card2Motion {
                0%, 24% {
                  opacity: 0;
                  transform: translate(-14px, 8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                30% {
                  opacity: 1;
                  transform: translate(1px, -1px) scale(1.02);
                  border-color: #3B82F6;
                  box-shadow: 0 14px 32px -6px rgba(59, 130, 246, 0.32);
                }
                34% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(59, 130, 246, 0.6);
                }
                55% {
                  transform: translate(0, 2px) scale(1.0);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(-1px, 3px) scale(1.03);
                  border-color: #3B82F6;
                  box-shadow: 0 16px 36px -6px rgba(59, 130, 246, 0.38);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(59, 130, 246, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(-14px, 8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(-14px, 8px) scale(0.96);
                }
              }

              /* 4. CARD 3: ASK HyIQ™ AI (Top-Right) */
              @keyframes v4Card3Motion {
                0%, 34% {
                  opacity: 0;
                  transform: translate(14px, -8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                40% {
                  opacity: 1;
                  transform: translate(-1px, 1px) scale(1.02);
                  border-color: #EC4899;
                  box-shadow: 0 14px 32px -6px rgba(236, 72, 153, 0.35);
                }
                44% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(236, 72, 153, 0.6);
                }
                55% {
                  transform: translate(0, -2px) scale(1.0);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(1px, -3px) scale(1.03);
                  border-color: #EC4899;
                  box-shadow: 0 16px 36px -6px rgba(236, 72, 153, 0.40);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(236, 72, 153, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(14px, -8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(14px, -8px) scale(0.96);
                }
              }

              /* 5. CARD 4: 1-ON-1 CHECK-INS (Bottom-Right) */
              @keyframes v4Card4Motion {
                0%, 47% {
                  opacity: 0;
                  transform: translate(14px, 8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                53% {
                  opacity: 1;
                  transform: translate(-1px, -1px) scale(1.02);
                  border-color: #10B981;
                  box-shadow: 0 14px 32px -6px rgba(16, 185, 129, 0.35);
                }
                57% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(16, 185, 129, 0.6);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(1px, 3px) scale(1.03);
                  border-color: #10B981;
                  box-shadow: 0 16px 36px -6px rgba(16, 185, 129, 0.40);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(16, 185, 129, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(14px, 8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(14px, 8px) scale(0.96);
                }
              }

              /* 6. CONNECTOR PATHS */
              @keyframes v4Path1Draw {
                0%, 14% { stroke-dashoffset: 144; opacity: 0; }
                16% { opacity: 0.9; }
                24% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path2Draw {
                0%, 24% { stroke-dashoffset: 144; opacity: 0; }
                26% { opacity: 0.9; }
                34% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path3Draw {
                0%, 34% { stroke-dashoffset: 144; opacity: 0; }
                36% { opacity: 0.9; }
                45% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path4Draw {
                0%, 47% { stroke-dashoffset: 144; opacity: 0; }
                49% { opacity: 0.9; }
                57% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              /* 7. LUMINESCENT PARTICLES */
              @keyframes v4Particle1Motion {
                0%, 18% { offset-distance: 0%; opacity: 0; }
                19% { opacity: 1; }
                25% { offset-distance: 100%; opacity: 0; }
                61% { offset-distance: 0%; opacity: 0; }
                62% { opacity: 1; }
                68% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle2Motion {
                0%, 28% { offset-distance: 0%; opacity: 0; }
                29% { opacity: 1; }
                35% { offset-distance: 100%; opacity: 0; }
                64% { offset-distance: 0%; opacity: 0; }
                65% { opacity: 1; }
                71% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle3Motion {
                0%, 38% { offset-distance: 0%; opacity: 0; }
                39% { opacity: 1; }
                46% { offset-distance: 100%; opacity: 0; }
                67% { offset-distance: 0%; opacity: 0; }
                68% { opacity: 1; }
                74% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle4Motion {
                0%, 51% { offset-distance: 0%; opacity: 0; }
                52% { opacity: 1; }
                59% { offset-distance: 100%; opacity: 0; }
                70% { offset-distance: 0%; opacity: 0; }
                71% { opacity: 1; }
                77% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              /* 8. MINI DASHBOARD AI INSIGHT TOAST */
              @keyframes v4AiToastFlow {
                0%, 37% { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.92); pointer-events: none; }
                42% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1.0); }
                78% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1.0); }
                85% { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.95); }
                100% { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.92); }
              }

              /* 9. GOAL PROGRESS BAR */
              @keyframes v4GoalProgressFlow {
                0%, 48% { width: 0%; opacity: 0; }
                50% { opacity: 1; }
                58% { width: 85%; }
                80% { width: 85%; opacity: 1; }
                88% { opacity: 0.4; }
                94%, 100% { width: 0%; opacity: 0; }
              }

              /* 10. SPARKLE ICON ROTATION */
              @keyframes v4SparkleShimmer {
                0%, 36% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                41% { transform: scale(1.22) rotate(14deg); filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.7)); }
                46% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                70% { transform: scale(1.15) rotate(8deg); filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.5)); }
                76% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                100% { transform: scale(1) rotate(0deg); }
              }

              /* Component CSS Styles */
              .v4-track-base {
                fill: none;
                stroke: rgba(148, 163, 184, 0.22);
                stroke-width: 1.5;
                stroke-dasharray: 4 4;
              }

              .v4-path-active {
                fill: none;
                stroke-width: 2.2;
                stroke-linecap: round;
                stroke-dasharray: 144;
                stroke-dashoffset: 144;
                will-change: stroke-dashoffset, opacity;
              }

              .v4-path-1 { animation: v4Path1Draw 10s linear infinite; }
              .v4-path-2 { animation: v4Path2Draw 10s linear infinite; }
              .v4-path-3 { animation: v4Path3Draw 10s linear infinite; }
              .v4-path-4 { animation: v4Path4Draw 10s linear infinite; }

              .v4-particle {
                position: absolute;
                top: 0;
                left: 0;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
                opacity: 0;
                will-change: transform, opacity, offset-distance;
              }

              .v4-particle-1 {
                background: #A855F7;
                box-shadow: 0 0 10px 2px #A855F7, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
                offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
                animation: v4Particle1Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-2 {
                background: #3B82F6;
                box-shadow: 0 0 10px 2px #3B82F6, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
                offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
                animation: v4Particle2Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-3 {
                background: #EC4899;
                box-shadow: 0 0 10px 2px #EC4899, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
                offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
                animation: v4Particle3Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-4 {
                background: #10B981;
                box-shadow: 0 0 10px 2px #10B981, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
                offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
                animation: v4Particle4Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-sparkle-box {
                animation: v4SparkleShimmer 10s ease-in-out infinite;
              }

              .v4-pulse-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #10B981;
                box-shadow: 0 0 6px #10B981;
                animation: v4DotPulse 1.8s infinite;
                display: inline-block;
              }

              .v4-ai-pulse {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #EC4899;
                box-shadow: 0 0 6px #EC4899;
                animation: v4DotPulse 1.8s infinite;
                display: inline-block;
              }

              .v4-mini-dash-toast {
                position: absolute;
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%) translateY(12px) scale(0.92);
                background: rgba(15, 23, 42, 0.92);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border: 1px solid rgba(168, 85, 247, 0.45);
                border-radius: 9999px;
                padding: 3px 9px;
                display: flex;
                align-items: center;
                gap: 5px;
                color: #FFFFFF;
                font-size: 8px;
                font-weight: 600;
                white-space: nowrap;
                z-index: 8;
                opacity: 0;
                animation: v4AiToastFlow 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
              }

              .v4-toast-icon {
                font-size: 8px;
                color: #F472B6;
              }

              .v4-toast-text {
                font-size: 8px;
                color: #FFFFFF;
              }

              .v4-progress-status {
                display: flex;
                align-items: center;
                gap: 5px;
              }

              .v4-progress-label {
                font-size: 10px;
                color: #64748B;
              }

              .v4-progress-track {
                width: 44px;
                height: 4px;
                border-radius: 9999px;
                background: #E2E8F0;
                overflow: hidden;
                position: relative;
              }

              .v4-progress-fill {
                height: 100%;
                width: 0%;
                border-radius: 9999px;
                background: linear-gradient(90deg, #10B981, #059669);
                animation: v4GoalProgressFlow 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }

              .v4-progress-val {
                font-size: 9.5px;
                font-weight: 700;
                color: #059669;
              }

              @media (prefers-reduced-motion: reduce) {
                .v4-mini-dashboard,
                .v4-flow-card,
                .v4-path-active,
                .v4-sparkle-box,
                .v4-mini-dash-toast,
                .v4-progress-fill,
                .v4-pulse-dot,
                .v4-ai-pulse {
                  animation: none !important;
                  transition: none !important;
                }

                .v4-path-active {
                  stroke-dashoffset: 0 !important;
                  opacity: 0.8 !important;
                }

                .v4-particle {
                  display: none !important;
                }

                .v4-mini-dash-toast {
                  opacity: 1 !important;
                  transform: translateX(-50%) translateY(0) !important;
                }

                .v4-progress-fill {
                  width: 85% !important;
                  opacity: 1 !important;
                }
              }

              /* ==========================================================================
       PAGE 4: THE HIRERKEY ECOSYSTEM (CONNECTED HUB) — 10.0s MASTER ANIMATION SYSTEM
       ========================================================================== */

    /* Stage */
    #v4WorkflowStageEco {
      position: relative;
    }

    /* Central Live Miniature Dashboard */
    .v4-mini-dashboard-eco {
      position: absolute;
      z-index: 5;
      width: 236px;
      min-height: 178px;
      background: #FFFFFF;
      border-radius: 14px;
      border: 1px solid rgba(124, 58, 237, 0.28);
      box-shadow: 
        0 20px 45px -10px rgba(124, 58, 237, 0.32),
        0 8px 20px -4px rgba(15, 23, 42, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.9);
      overflow: hidden;
      animation: v4DashMasterP4 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
      will-change: transform, box-shadow;
      user-select: none;
    }

    .v4-eco-chrome {
      padding: 5px 9px;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 23px;
    }

    .v4-eco-live-pill {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1.5px 5.5px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #059669;
      font-size: 7.5px;
      font-weight: 700;
    }

    .v4-eco-body {
      position: relative;
      background: #FFFFFF;
      padding: 6px;
      min-height: 152px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Live Sheen Sweep */
    .v4-eco-sheen {
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.7) 48%, rgba(124, 58, 237, 0.15) 52%, transparent 80%);
      transform: translateX(-120%);
      pointer-events: none;
      z-index: 15;
      animation: v4EcoSheenSweep 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    /* 2x2 Functional Modules Grid */
    .v4-eco-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      flex: 1;
    }

    .v4-eco-widget {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 7px;
      padding: 5px 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      min-height: 64px;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .v4-eco-w-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .v4-eco-w-title {
      font-size: 8.5px;
      font-weight: 700;
      color: #0F172A;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
    }

    .v4-eco-w-sub {
      font-size: 7px;
      color: #64748B;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }

    .v4-eco-pill-purple {
      font-size: 7px;
      font-weight: 700;
      padding: 1px 4.5px;
      border-radius: 9999px;
      background: #EDE9FE;
      color: #7C3AED;
    }

    .v4-eco-pill-blue {
      font-size: 7px;
      font-weight: 700;
      padding: 1px 4.5px;
      border-radius: 9999px;
      background: #EFF6FF;
      color: #3B82F6;
    }

    .v4-eco-pill-pink {
      font-size: 7px;
      font-weight: 700;
      padding: 1px 4.5px;
      border-radius: 9999px;
      background: #FDF2F8;
      color: #EC4899;
    }

    .v4-eco-pill-green {
      font-size: 7px;
      font-weight: 700;
      padding: 1px 4.5px;
      border-radius: 9999px;
      background: #ECFDF5;
      color: #059669;
    }

    .v4-eco-bar-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .v4-eco-bar-bg {
      flex: 1;
      height: 4px;
      border-radius: 9999px;
      background: #E2E8F0;
      overflow: hidden;
    }

    .v4-eco-bar-fill {
      height: 100%;
      width: 100%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #7C3AED, #9333EA);
    }

    .v4-eco-perf-bar-fill {
      height: 100%;
      width: 85%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #10B981, #059669);
      animation: v4GoalProgressFlowP4 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    .v4-eco-bar-pct, .v4-eco-perf-pct {
      font-size: 7px;
      font-weight: 700;
      color: #64748B;
      min-width: 16px;
      text-align: right;
    }

    .v4-eco-perf-pct {
      color: #059669;
    }

    .v4-eco-badge-row {
      display: flex;
      align-items: center;
    }

    .v4-eco-tag-sub {
      font-size: 7px;
      color: #3B82F6;
      font-weight: 600;
    }

    .v4-eco-ai-status {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .v4-eco-ai-sparkle {
      font-size: 7px;
      animation: v4SparkleShimmerP4 10s ease-in-out infinite;
    }

    .v4-eco-ai-hint {
      font-size: 7px;
      color: #EC4899;
      font-weight: 600;
    }

    .v4-eco-dash-toast {
      animation: v4AiToastFlowP4 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    /* Floating Insight Bubble on Card 3 */
    .v4-floating-insight-bubble {
      position: absolute;
      top: -14px;
      right: 8px;
      background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
      color: #FFFFFF;
      font-size: 8px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 6px 18px -2px rgba(124, 58, 237, 0.45);
      white-space: nowrap;
      pointer-events: none;
      z-index: 10;
      animation: v4InsightBubbleMotion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    .v4-insight-sparkle {
      font-size: 8px;
    }

    /* Page 4 Spoke Cards Positioning */
    .v4-mod-1-p4 {
      top: 14px;
      left: 14px;
      animation: v4Card1MotionP4 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .v4-mod-1-p4 .v4-card-icon-box { background: #EDE9FE; color: #7C3AED; }
    .v4-mod-1-p4 .v4-card-tag { color: #7C3AED; }

    .v4-mod-2-p4 {
      bottom: 18px;
      left: 14px;
      animation: v4Card2MotionP4 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .v4-mod-2-p4 .v4-card-icon-box { background: #EFF6FF; color: #3B82F6; }
    .v4-mod-2-p4 .v4-card-tag { color: #3B82F6; }

    .v4-mod-3-p4 {
      top: 14px;
      right: 14px;
      animation: v4Card3MotionP4 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .v4-mod-3-p4 .v4-card-icon-box { background: #FDF2F8; color: #EC4899; }
    .v4-mod-3-p4 .v4-card-tag { color: #EC4899; }

    .v4-mod-4-p4 {
      bottom: 18px;
      right: 14px;
      animation: v4Card4MotionP4 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .v4-mod-4-p4 .v4-card-icon-box { background: #ECFDF5; color: #10B981; }
    .v4-mod-4-p4 .v4-card-tag { color: #059669; }

    .v4-sparkle-box-p4 {
      animation: v4SparkleShimmerP4 10s ease-in-out infinite;
    }

    .v4-progress-fill-p4 {
      height: 100%;
      width: 0%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #10B981, #059669);
      animation: v4GoalProgressFlowP4 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    /* Page 4 Connector Paths (stroke-dasharray: 144) */
    .v4-path-p4-1 { animation: v4Path1DrawP4 10s linear infinite; }
    .v4-path-p4-2 { animation: v4Path2DrawP4 10s linear infinite; }
    .v4-path-p4-3 { animation: v4Path3DrawP4 10s linear infinite; }
    .v4-path-p4-4 { animation: v4Path4DrawP4 10s linear infinite; }

    /* Page 4 Travelling Particles */
    .v4-particle-p4 {
      position: absolute;
      top: 0;
      left: 0;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 4;
      opacity: 0;
      will-change: transform, opacity, offset-distance;
    }

    .v4-particle-p4-1 {
      background: #A855F7;
      box-shadow: 0 0 10px 2px #A855F7, 0 0 4px #FFFFFF;
      -webkit-offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
      offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
      animation: v4Particle1MotionP4 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    }

    .v4-particle-p4-2 {
      background: #3B82F6;
      box-shadow: 0 0 10px 2px #3B82F6, 0 0 4px #FFFFFF;
      -webkit-offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
      offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
      animation: v4Particle2MotionP4 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    }

    .v4-particle-p4-3 {
      background: #EC4899;
      box-shadow: 0 0 10px 2px #EC4899, 0 0 4px #FFFFFF;
      -webkit-offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
      offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
      animation: v4Particle3MotionP4 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    }

    .v4-particle-p4-4 {
      background: #10B981;
      box-shadow: 0 0 10px 2px #10B981, 0 0 4px #FFFFFF;
      -webkit-offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
      offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
      animation: v4Particle4MotionP4 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    }

    /* Page 4 Keyframes (10.0s Master Loop) */
    @keyframes v4DashMasterP4 {
      0% {
        opacity: 0.92;
        transform: scale(0.97) translateY(2px);
        box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24);
      }
      10% {
        opacity: 1;
        transform: scale(1.008) translateY(-3px);
        box-shadow: 0 24px 50px -10px rgba(124, 58, 237, 0.36);
      }
      15% {
        opacity: 1;
        transform: scale(1.0) translateY(0px);
        box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.30);
      }
      35% {
        transform: scale(1.0) translateY(-2px);
      }
      50% {
        transform: scale(1.0) translateY(1px);
      }
      60% {
        transform: scale(1.0) translateY(0px);
        box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.32);
      }
      70% {
        transform: scale(1.025) translateY(-3px);
        box-shadow: 
          0 30px 70px -10px rgba(124, 58, 237, 0.46),
          0 0 35px 4px rgba(124, 58, 237, 0.26),
          0 0 0 1px rgba(255, 255, 255, 0.9);
      }
      80% {
        transform: scale(1.0) translateY(0px);
        box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.32);
      }
      94% {
        opacity: 1;
        transform: scale(0.985) translateY(1px);
        box-shadow: 0 18px 40px -8px rgba(124, 58, 237, 0.26);
      }
      100% {
        opacity: 0.92;
        transform: scale(0.97) translateY(2px);
        box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24);
      }
    }

    @keyframes v4EcoSheenSweep {
      0%, 65% {
        transform: translateX(-120%);
        opacity: 0;
      }
      68% {
        opacity: 0.9;
      }
      75% {
        transform: translateX(120%);
        opacity: 0;
      }
      100% {
        transform: translateX(120%);
        opacity: 0;
      }
    }

    @keyframes v4Card1MotionP4 {
      0%, 14% {
        opacity: 0;
        transform: translate(-14px, -8px) scale(0.96);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      20% {
        opacity: 1;
        transform: translate(1px, 1px) scale(1.02);
        border-color: #7C3AED;
        box-shadow: 0 14px 32px -6px rgba(124, 58, 237, 0.32);
      }
      24% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(124, 58, 237, 0.6);
      }
      50% {
        transform: translate(0, -2px) scale(1.0);
      }
      60% {
        transform: translate(0, 0) scale(1.0);
      }
      70% {
        transform: translate(-1px, -3px) scale(1.03);
        border-color: #7C3AED;
        box-shadow: 0 16px 36px -6px rgba(124, 58, 237, 0.38);
      }
      80% {
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(124, 58, 237, 0.5);
      }
      88% {
        opacity: 0.8;
        border-color: #E2E8F0;
      }
      94%, 100% {
        opacity: 0;
        transform: translate(-14px, -8px) scale(0.96);
      }
    }

    @keyframes v4Card2MotionP4 {
      0%, 24% {
        opacity: 0;
        transform: translate(-14px, 8px) scale(0.96);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      30% {
        opacity: 1;
        transform: translate(1px, -1px) scale(1.02);
        border-color: #3B82F6;
        box-shadow: 0 14px 32px -6px rgba(59, 130, 246, 0.32);
      }
      34% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(59, 130, 246, 0.6);
      }
      55% {
        transform: translate(0, 2px) scale(1.0);
      }
      60% {
        transform: translate(0, 0) scale(1.0);
      }
      70% {
        transform: translate(-1px, 3px) scale(1.03);
        border-color: #3B82F6;
        box-shadow: 0 16px 36px -6px rgba(59, 130, 246, 0.38);
      }
      80% {
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(59, 130, 246, 0.5);
      }
      88% {
        opacity: 0.8;
        border-color: #E2E8F0;
      }
      94%, 100% {
        opacity: 0;
        transform: translate(-14px, 8px) scale(0.96);
      }
    }

    @keyframes v4Card3MotionP4 {
      0%, 34% {
        opacity: 0;
        transform: translate(14px, -8px) scale(0.96);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      40% {
        opacity: 1;
        transform: translate(-1px, 1px) scale(1.02);
        border-color: #EC4899;
        box-shadow: 0 14px 32px -6px rgba(236, 72, 153, 0.35);
      }
      44% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(236, 72, 153, 0.6);
      }
      55% {
        transform: translate(0, -2px) scale(1.0);
      }
      60% {
        transform: translate(0, 0) scale(1.0);
      }
      70% {
        transform: translate(1px, -3px) scale(1.03);
        border-color: #EC4899;
        box-shadow: 0 16px 36px -6px rgba(236, 72, 153, 0.40);
      }
      80% {
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(236, 72, 153, 0.5);
      }
      88% {
        opacity: 0.8;
        border-color: #E2E8F0;
      }
      94%, 100% {
        opacity: 0;
        transform: translate(14px, -8px) scale(0.96);
      }
    }

    @keyframes v4InsightBubbleMotion {
      0%, 37% {
        opacity: 0;
        transform: translateY(8px) scale(0.88);
      }
      43% {
        opacity: 1;
        transform: translateY(0px) scale(1.0);
      }
      76% {
        opacity: 1;
        transform: translateY(0px) scale(1.0);
      }
      84% {
        opacity: 0;
        transform: translateY(-6px) scale(0.92);
      }
      100% {
        opacity: 0;
        transform: translateY(8px) scale(0.88);
      }
    }

    @keyframes v4Card4MotionP4 {
      0%, 47% {
        opacity: 0;
        transform: translate(14px, 8px) scale(0.96);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      53% {
        opacity: 1;
        transform: translate(-1px, -1px) scale(1.02);
        border-color: #10B981;
        box-shadow: 0 14px 32px -6px rgba(16, 185, 129, 0.35);
      }
      57% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(16, 185, 129, 0.6);
      }
      60% {
        transform: translate(0, 0) scale(1.0);
      }
      70% {
        transform: translate(1px, 3px) scale(1.03);
        border-color: #10B981;
        box-shadow: 0 16px 36px -6px rgba(16, 185, 129, 0.40);
      }
      80% {
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(16, 185, 129, 0.5);
      }
      88% {
        opacity: 0.8;
        border-color: #E2E8F0;
      }
      94%, 100% {
        opacity: 0;
        transform: translate(14px, 8px) scale(0.96);
      }
    }

    @keyframes v4GoalProgressFlowP4 {
      0%, 48% {
        width: 0%;
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      58% {
        width: 85%;
      }
      80% {
        width: 85%;
        opacity: 1;
      }
      88% {
        opacity: 0.4;
      }
      94%, 100% {
        width: 0%;
        opacity: 0;
      }
    }

    @keyframes v4SparkleShimmerP4 {
      0%, 36% {
        transform: scale(1) rotate(0deg);
        filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0));
      }
      41% {
        transform: scale(1.22) rotate(14deg);
        filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.7));
      }
      46% {
        transform: scale(1) rotate(0deg);
        filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0));
      }
      70% {
        transform: scale(1.15) rotate(8deg);
        filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.5));
      }
      76%, 100% {
        transform: scale(1) rotate(0deg);
      }
    }

    @keyframes v4Path1DrawP4 {
      0%, 14% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      16% {
        opacity: 0.9;
      }
      24% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      60% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      70% {
        opacity: 1.0;
        stroke-width: 2.8px;
      }
      80% {
        opacity: 0.85;
        stroke-width: 2.2px;
        stroke-dashoffset: 0;
      }
      90% {
        opacity: 0.15;
        stroke-dashoffset: 0;
      }
      95%, 100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    @keyframes v4Path2DrawP4 {
      0%, 24% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      26% {
        opacity: 0.9;
      }
      34% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      60% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      70% {
        opacity: 1.0;
        stroke-width: 2.8px;
      }
      80% {
        opacity: 0.85;
        stroke-width: 2.2px;
        stroke-dashoffset: 0;
      }
      90% {
        opacity: 0.15;
        stroke-dashoffset: 0;
      }
      95%, 100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    @keyframes v4Path3DrawP4 {
      0%, 34% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      36% {
        opacity: 0.9;
      }
      45% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      60% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      70% {
        opacity: 1.0;
        stroke-width: 2.8px;
      }
      80% {
        opacity: 0.85;
        stroke-width: 2.2px;
        stroke-dashoffset: 0;
      }
      90% {
        opacity: 0.15;
        stroke-dashoffset: 0;
      }
      95%, 100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    @keyframes v4Path4DrawP4 {
      0%, 47% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      49% {
        opacity: 0.9;
      }
      57% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      60% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      70% {
        opacity: 1.0;
        stroke-width: 2.8px;
      }
      80% {
        opacity: 0.85;
        stroke-width: 2.2px;
        stroke-dashoffset: 0;
      }
      90% {
        opacity: 0.15;
        stroke-dashoffset: 0;
      }
      95%, 100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    @keyframes v4Particle1MotionP4 {
      0%, 18% {
        offset-distance: 0%;
        opacity: 0;
      }
      19% {
        opacity: 1;
      }
      25% {
        offset-distance: 100%;
        opacity: 0;
      }
      61% {
        offset-distance: 0%;
        opacity: 0;
      }
      62% {
        opacity: 1;
      }
      68% {
        offset-distance: 100%;
        opacity: 0;
      }
      100% {
        offset-distance: 100%;
        opacity: 0;
      }
    }

    @keyframes v4Particle2MotionP4 {
      0%, 28% {
        offset-distance: 0%;
        opacity: 0;
      }
      29% {
        opacity: 1;
      }
      35% {
        offset-distance: 100%;
        opacity: 0;
      }
      64% {
        offset-distance: 0%;
        opacity: 0;
      }
      65% {
        opacity: 1;
      }
      71% {
        offset-distance: 100%;
        opacity: 0;
      }
      100% {
        offset-distance: 100%;
        opacity: 0;
      }
    }

    @keyframes v4Particle3MotionP4 {
      0%, 38% {
        offset-distance: 0%;
        opacity: 0;
      }
      39% {
        opacity: 1;
      }
      46% {
        offset-distance: 100%;
        opacity: 0;
      }
      67% {
        offset-distance: 0%;
        opacity: 0;
      }
      68% {
        opacity: 1;
      }
      74% {
        offset-distance: 100%;
        opacity: 0;
      }
      100% {
        offset-distance: 100%;
        opacity: 0;
      }
    }

    @keyframes v4Particle4MotionP4 {
      0%, 51% {
        offset-distance: 0%;
        opacity: 0;
      }
      52% {
        opacity: 1;
      }
      59% {
        offset-distance: 100%;
        opacity: 0;
      }
      70% {
        offset-distance: 0%;
        opacity: 0;
      }
      71% {
        opacity: 1;
      }
      77% {
        offset-distance: 100%;
        opacity: 0;
      }
      100% {
        offset-distance: 100%;
        opacity: 0;
      }
    }

    @keyframes v4AiToastFlowP4 {
      0%, 37% {
        opacity: 0;
        transform: translateX(-50%) translateY(12px) scale(0.92);
        pointer-events: none;
      }
      42% {
        opacity: 1;
        transform: translateX(-50%) translateY(0px) scale(1.0);
      }
      78% {
        opacity: 1;
        transform: translateX(-50%) translateY(0px) scale(1.0);
      }
      85% {
        opacity: 0;
        transform: translateX(-50%) translateY(8px) scale(0.95);
      }
      100% {
        opacity: 0;
        transform: translateX(-50%) translateY(12px) scale(0.92);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .v4-mini-dashboard-eco,
      .v4-mod-1-p4,
      .v4-mod-2-p4,
      .v4-mod-3-p4,
      .v4-mod-4-p4,
      .v4-path-p4-1,
      .v4-path-p4-2,
      .v4-path-p4-3,
      .v4-path-p4-4,
      .v4-particle-p4-1,
      .v4-particle-p4-2,
      .v4-particle-p4-3,
      .v4-particle-p4-4,
      .v4-floating-insight-bubble,
      .v4-eco-sheen,
      .v4-sparkle-box-p4,
      .v4-progress-fill-p4,
      .v4-eco-perf-bar-fill,
      .v4-eco-dash-toast {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .v4-path-p4-1,
      .v4-path-p4-2,
      .v4-path-p4-3,
      .v4-path-p4-4 {
        stroke-dashoffset: 0 !important;
      }
      .v4-progress-fill-p4,
      .v4-eco-perf-bar-fill {
        width: 85% !important;
      }
      .v4-floating-insight-bubble {
        opacity: 1 !important;
        transform: none !important;
      }
    }

    /* Mobile responsive overrides for Page 4 */
    @media (max-width: 640px) {
      .v4-mini-dashboard-eco {
        width: 180px;
        min-height: 146px;
      }
      .v4-eco-grid {
        gap: 3px;
      }
      .v4-eco-widget {
        min-height: 48px;
        padding: 3px 4px;
      }
      .v4-eco-w-title {
        font-size: 7.5px;
      }
      .v4-eco-w-sub {
        font-size: 6px;
      }
      .v4-eco-pill-purple,
      .v4-eco-pill-blue,
      .v4-eco-pill-pink,
      .v4-eco-pill-green {
        font-size: 6px;
        padding: 1px 3px;
      }
      .v4-eco-chrome {
        height: 20px;
        padding: 3px 6px;
      }
      .v4-floating-insight-bubble {
        font-size: 7px;
        padding: 2px 5px;
        top: -10px;
        right: 4px;
      }
    }

            `}</style>
            <Box
              sx={{
                width: '100%',
                maxWidth: '1220px',
                minHeight: '640px',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.95fr' },
                gap: { xs: 4, lg: '36px' },
                alignItems: 'center',
                position: 'relative',
                zIndex: 10,
              }}
            >
              {/* LEFT COLUMN: HERO SHOWCASE WITH APPROVALMAX-STYLE WORKFLOW ANIMATION */}
              <Box
                sx={{
                  p: { xs: 1, sm: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Brand Logo Header & People Performance Progress Subtag */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2.75, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.45)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: 20,
                      }}
                    >
                      H
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: 24,
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.035em',
                      }}
                    >
                      Hirerkey<span style={{ color: '#7C3AED' }}>.</span>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '9999px',
                      background: 'rgba(124, 58, 237, 0.08)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      color: '#7C3AED',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span>PEOPLE • PERFORMANCE • PROGRESS</span>
                  </Box>
                </Box>

                {/* Headline */}
                <Typography
                  level="h1"
                  sx={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: { xs: 34, sm: 44 },
                    fontWeight: 800,
                    lineHeight: 1.14,
                    letterSpacing: '-0.035em',
                    color: '#0F172A',
                    mb: 1.75,
                  }}
                >
                  Make worklife{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    easy
                  </span>
                </Typography>

                {/* Subtitle */}
                <Typography
                  sx={{
                    fontSize: 16,
                    color: '#475569',
                    lineHeight: 1.55,
                    maxWidth: 480,
                    mb: 3,
                  }}
                >
                  Everything you need to build, manage and grow a high-performing team.
                </Typography>

                {/* ANIMATED WORKFLOW STAGE (PAGE 1 vs PAGE 2) */}
                {activePage === 1 && (
                <Box
                  id="v4WorkflowStage"
                  onMouseMove={handleV4MouseMove}
                  onMouseLeave={handleV4MouseLeave}
                  sx={{
                    width: '100%',
                    maxWidth: 540,
                    height: 350,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: 1000,
                    mt: 0.75,
                  }}
                >
                  {/* Dynamic SVG Flow Connectors & Luminescent Particles */}
                  <svg
                    viewBox="0 0 540 350"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  >
                    <defs>
                      {/* Multi-Stop Cosmic Gradient for Live Stream */}
                      <linearGradient id="v4Grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad4" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                      </linearGradient>

                      {/* Soft Bloom Filter for Flow Lines */}
                      <filter id="v4FlowGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>

                      {/* Intense Radial Bloom for Particles */}
                      <filter id="v4ParticleGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Base Ambient Dashed Tracks */}
                    <path className="v4-track-base" d="M 160 75 C 210 75, 230 145, 270 160" />
                    <path className="v4-track-base" d="M 160 275 C 210 275, 230 205, 270 190" />
                    <path className="v4-track-base" d="M 380 75 C 330 75, 310 145, 270 160" />
                    <path className="v4-track-base" d="M 380 275 C 330 275, 310 205, 270 190" />

                    {/* Animated Dynamic Connector Flow Lines */}
                    <path className="v4-path-active v4-path-1" stroke="url(#v4Grad1)" d="M 160 75 C 210 75, 230 145, 270 160" filter="url(#v4FlowGlow)" />
                    <path className="v4-path-active v4-path-2" stroke="url(#v4Grad2)" d="M 160 275 C 210 275, 230 205, 270 190" filter="url(#v4FlowGlow)" />
                    <path className="v4-path-active v4-path-3" stroke="url(#v4Grad3)" d="M 380 75 C 330 75, 310 145, 270 160" filter="url(#v4FlowGlow)" />
                    <path className="v4-path-active v4-path-4" stroke="url(#v4Grad4)" d="M 380 275 C 330 275, 310 205, 270 190" filter="url(#v4FlowGlow)" />
                  </svg>

                  {/* Travelling Particle Dots (Driven by CSS offset-path) */}
                  <div className="v4-particle v4-particle-1" />
                  <div className="v4-particle v4-particle-2" />
                  <div className="v4-particle v4-particle-3" />
                  <div className="v4-particle v4-particle-4" />

                  {/* MODULE 1: ORIENTATION (Top-Left) */}
                  <Box
                    className="v4-flow-card v4-mod-1"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 6,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card1Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(124, 58, 237, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#EDE9FE',
                        color: '#7C3AED',
                      }}
                    >
                      🧭
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7C3AED', mb: 0.25 }}>
                        01 • ONBOARDING
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Orientation
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        <span className="v4-pulse-dot" />
                        <span>Active • Automated</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* MODULE 2: DEPARTMENT TOUR (Bottom-Left) */}
                  <Box
                    className="v4-flow-card v4-mod-2"
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      left: 12,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card2Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(59, 130, 246, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#EFF6FF',
                        color: '#3B82F6',
                      }}
                    >
                      🏢
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#3B82F6', mb: 0.25 }}>
                        02 • ALIGNMENT
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Department Tour
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        <span className="v4-status-label">Sales &amp; Marketing</span>
                      </Typography>
                    </Box>
                  </Box>

                  {/* CENTRAL MINI DASHBOARD (Core Hub) */}
                  <Box
                    id="v4MiniDashboard"
                    className="v4-mini-dashboard"
                    sx={{
                      position: 'absolute',
                      zIndex: 5,
                      width: 220,
                      bgcolor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid rgba(124, 58, 237, 0.25)',
                      boxShadow: '0 20px 45px -10px rgba(124, 58, 237, 0.32), 0 8px 20px -4px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.9)',
                      overflow: 'hidden',
                      transform: `rotateX(${v4Tilt.x}deg) rotateY(${v4Tilt.y}deg)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4DashMaster 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
                      willChange: 'transform, box-shadow',
                    }}
                  >
                    <Box sx={{ p: '6px 10px', bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                      </Box>
                      <Typography sx={{ fontSize: 8.5, color: '#64748B', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                        app.hirerkey.com
                      </Typography>
                    </Box>
                    <Box sx={{ position: 'relative', bgcolor: '#0B0818', overflow: 'hidden' }}>
                      <img
                        src="hirerkey_dashboard_v4.png"
                        onError={(e: any) => {
                          if (!e.target.dataset.retry) {
                            e.target.dataset.retry = '1';
                            e.target.src = '../hirerkey_dashboard_v4.png';
                          }
                        }}
                        alt="Hirerkey Core Workspace"
                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                      />
                      {/* Live Sync Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          px: '6px',
                          py: '2px',
                          borderRadius: '9999px',
                          bgcolor: 'rgba(15, 23, 42, 0.88)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#FFFFFF',
                          fontSize: 8,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          zIndex: 7,
                        }}
                      >
                        <span className="v4-pulse-dot" />
                        <span>Live Sync</span>
                      </Box>

                      {/* Mini AI Insight Toast (Scene 4 & Climax) */}
                      <div className="v4-mini-dash-toast" id="v4MiniDashToast">
                        <span className="v4-toast-icon">✨</span>
                        <span className="v4-toast-text">HyIQ: 4 matches ready</span>
                      </div>
                    </Box>
                  </Box>

                  {/* MODULE 3: ASK HyIQ AI (Top-Right) */}
                  <Box
                    className="v4-flow-card v4-mod-3"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 6,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card3Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(236, 72, 153, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box v4-sparkle-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#FDF2F8',
                        color: '#EC4899',
                      }}
                    >
                      ✨
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#EC4899', mb: 0.25 }}>
                        03 • INTELLIGENCE
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Ask HyIQ™ AI
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        <span className="v4-ai-pulse" />
                        <span>Real-time • 12ms</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* MODULE 4: 1-ON-1 CHECK-INS (Bottom-Right) */}
                  <Box
                    className="v4-flow-card v4-mod-4"
                    sx={{
                      position: 'absolute',
                      bottom: 18,
                      right: 14,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card4Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(16, 185, 129, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#ECFDF5',
                        color: '#10B981',
                      }}
                    >
                      📊
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#059669', mb: 0.25 }}>
                        04 • PERFORMANCE
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        1-on-1 Check-ins
                      </Typography>
                      <div className="v4-card-status v4-progress-status">
                        <span className="v4-progress-label">Goal</span>
                        <div className="v4-progress-track">
                          <div className="v4-progress-fill" />
                        </div>
                        <span className="v4-progress-val">85%</span>
                      </div>
                    </Box>
                  </Box>
                </Box>
                )}
                {activePage === 4 && (
                <Box
                  id="v4WorkflowStageEco"
                  onMouseMove={handleV4MouseMove}
                  onMouseLeave={handleV4MouseLeave}
                  sx={{
                    width: '100%',
                    maxWidth: 540,
                    height: 350,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: 1000,
                    mt: 0.75,
                    contain: 'layout paint style',
                  }}
                >
                  {/* Dynamic SVG Flow Connectors & Luminescent Particles */}
                  <svg
                    viewBox="0 0 540 350"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  >
                    <defs>
                      <linearGradient id="v4Grad1_p4_tsx" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad2_p4_tsx" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad3_p4_tsx" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad4_p4_tsx" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                      </linearGradient>

                      <filter id="v4FlowGlow_p4_tsx" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Base Ambient Dashed Tracks */}
                    <path className="v4-track-base" d="M 160 75 C 210 75, 230 145, 270 160" />
                    <path className="v4-track-base" d="M 160 275 C 210 275, 230 205, 270 190" />
                    <path className="v4-track-base" d="M 380 75 C 330 75, 310 145, 270 160" />
                    <path className="v4-track-base" d="M 380 275 C 330 275, 310 205, 270 190" />

                    {/* Animated Dynamic Connector Flow Lines */}
                    <path className="v4-path-active v4-path-p4-1" stroke="url(#v4Grad1_p4_tsx)" d="M 160 75 C 210 75, 230 145, 270 160" filter="url(#v4FlowGlow_p4_tsx)" />
                    <path className="v4-path-active v4-path-p4-2" stroke="url(#v4Grad2_p4_tsx)" d="M 160 275 C 210 275, 230 205, 270 190" filter="url(#v4FlowGlow_p4_tsx)" />
                    <path className="v4-path-active v4-path-p4-3" stroke="url(#v4Grad3_p4_tsx)" d="M 380 75 C 330 75, 310 145, 270 160" filter="url(#v4FlowGlow_p4_tsx)" />
                    <path className="v4-path-active v4-path-p4-4" stroke="url(#v4Grad4_p4_tsx)" d="M 380 275 C 330 275, 310 205, 270 190" filter="url(#v4FlowGlow_p4_tsx)" />
                  </svg>

                  {/* Travelling Particle Dots */}
                  <div className="v4-particle-p4 v4-particle-p4-1" />
                  <div className="v4-particle-p4 v4-particle-p4-2" />
                  <div className="v4-particle-p4 v4-particle-p4-3" />
                  <div className="v4-particle-p4 v4-particle-p4-4" />

                  {/* CARD 1: ORIENTATION (Upper-Left: top: 14px, left: 14px) */}
                  <Box
                    className="v4-flow-card v4-mod-1-p4"
                    sx={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(124, 58, 237, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      🧭
                    </Box>
                    <Box className="v4-card-meta" sx={{ flex: 1, minWidth: 0 }}>
                      <div className="v4-card-tag">01 • ONBOARDING</div>
                      <div className="v4-card-title">Orientation</div>
                      <div className="v4-card-status">
                        <span className="v4-pulse-dot" />
                        <span>Active • Automated</span>
                      </div>
                    </Box>
                  </Box>

                  {/* CARD 2: DEPARTMENT TOUR (Lower-Left: bottom: 18px, left: 14px) */}
                  <Box
                    className="v4-flow-card v4-mod-2-p4"
                    sx={{
                      position: 'absolute',
                      bottom: 18,
                      left: 14,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(59, 130, 246, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      🏢
                    </Box>
                    <Box className="v4-card-meta" sx={{ flex: 1, minWidth: 0 }}>
                      <div className="v4-card-tag">02 • ALIGNMENT</div>
                      <div className="v4-card-title">Department Tour</div>
                      <div className="v4-card-status">
                        <span className="v4-status-label">Sales &amp; Marketing</span>
                      </div>
                    </Box>
                  </Box>

                  {/* CENTRAL LIVE MINIATURE DASHBOARD (Hub) */}
                  <Box
                    id="v4MiniDashboardEco"
                    className="v4-mini-dashboard v4-mini-dashboard-eco"
                    style={{
                      transform: `perspective(800px) rotateX(${v4Tilt.x}deg) rotateY(${v4Tilt.y}deg) translateZ(8px)`,
                    }}
                  >
                    {/* Browser Chrome */}
                    <div className="v4-eco-chrome">
                      <div className="v4-mini-traffic-dots">
                        <div className="v4-mini-dot red" />
                        <div className="v4-mini-dot amber" />
                        <div className="v4-mini-dot green" />
                      </div>
                      <div className="v4-mini-dash-url">app.hirerkey.com</div>
                      <div className="v4-eco-live-pill">
                        <span className="v4-pulse-dot" style={{ width: 4, height: 4 }} />
                        <span>Live Ecosystem</span>
                      </div>
                    </div>

                    {/* Dashboard Body with Live Sheen & 4 Functional Modules */}
                    <div className="v4-eco-body">
                      <div className="v4-eco-sheen" />

                      {/* 2x2 Grid: 4 Functional Modules */}
                      <div className="v4-eco-grid">
                        {/* Module 1: Onboarding */}
                        <div className="v4-eco-widget v4-eco-w-onboard">
                          <div className="v4-eco-w-head">
                            <span className="v4-eco-w-title">🧭 Onboarding</span>
                            <span className="v4-eco-pill-purple">Active</span>
                          </div>
                          <div className="v4-eco-w-sub">Alex C. • Design Ops</div>
                          <div className="v4-eco-bar-wrap">
                            <div className="v4-eco-bar-bg"><div className="v4-eco-bar-fill" /></div>
                            <span className="v4-eco-bar-pct">100%</span>
                          </div>
                        </div>

                        {/* Module 2: Alignment */}
                        <div className="v4-eco-widget v4-eco-w-align">
                          <div className="v4-eco-w-head">
                            <span className="v4-eco-w-title">🏢 Alignment</span>
                            <span className="v4-eco-pill-blue">Sync</span>
                          </div>
                          <div className="v4-eco-w-sub">Sales &amp; Marketing</div>
                          <div className="v4-eco-badge-row">
                            <span className="v4-eco-tag-sub">Tour Complete ✓</span>
                          </div>
                        </div>

                        {/* Module 3: AI Intelligence */}
                        <div className="v4-eco-widget v4-eco-w-ai">
                          <div className="v4-eco-w-head">
                            <span className="v4-eco-w-title">✨ Ask HyIQ</span>
                            <span className="v4-eco-pill-pink">12ms</span>
                          </div>
                          <div className="v4-eco-w-sub">Workforce AI</div>
                          <div className="v4-eco-ai-status">
                            <span className="v4-eco-ai-sparkle">✨</span>
                            <span className="v4-eco-ai-hint">Insights ready</span>
                          </div>
                        </div>

                        {/* Module 4: Performance */}
                        <div className="v4-eco-widget v4-eco-w-perf">
                          <div className="v4-eco-w-head">
                            <span className="v4-eco-w-title">📊 Performance</span>
                            <span className="v4-eco-pill-green">On Track</span>
                          </div>
                          <div className="v4-eco-w-sub">Goal Tracking</div>
                          <div className="v4-eco-bar-wrap">
                            <div className="v4-eco-bar-bg"><div className="v4-eco-perf-bar-fill" /></div>
                            <span className="v4-eco-perf-pct">85%</span>
                          </div>
                        </div>
                      </div>

                      {/* Mini Dashboard AI Insight Toast */}
                      <div className="v4-mini-dash-toast v4-eco-dash-toast" id="v4MiniDashToastEco">
                        <span className="v4-toast-icon">✨</span>
                        <span className="v4-toast-text">Workforce insights are ready</span>
                      </div>
                    </div>
                  </Box>

                  {/* CARD 3: ASK HyIQ (Upper-Right: top: 14px, right: 14px) */}
                  <Box
                    className="v4-flow-card v4-mod-3-p4"
                    sx={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(236, 72, 153, 0.25)',
                      },
                    }}
                  >
                    <div className="v4-floating-insight-bubble">
                      <span className="v4-insight-sparkle">✨</span>
                      <span>Workforce insights are ready</span>
                    </div>
                    <Box
                      className="v4-card-icon-box v4-sparkle-box-p4"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      ✨
                    </Box>
                    <Box className="v4-card-meta" sx={{ flex: 1, minWidth: 0 }}>
                      <div className="v4-card-tag">03 • INTELLIGENCE</div>
                      <div className="v4-card-title">Ask HyIQ™ AI</div>
                      <div className="v4-card-status">
                        <span className="v4-ai-pulse" />
                        <span>Real-time • 12ms</span>
                      </div>
                    </Box>
                  </Box>

                  {/* CARD 4: 1-ON-1 CHECK-INS (Lower-Right: bottom: 18px, right: 14px) */}
                  <Box
                    className="v4-flow-card v4-mod-4-p4"
                    sx={{
                      position: 'absolute',
                      bottom: 18,
                      right: 14,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(16, 185, 129, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      📊
                    </Box>
                    <Box className="v4-card-meta" sx={{ flex: 1, minWidth: 0 }}>
                      <div className="v4-card-tag">04 • PERFORMANCE</div>
                      <div className="v4-card-title">1-on-1 Check-ins</div>
                      <div className="v4-card-status v4-progress-status">
                        <span className="v4-progress-label">On Track</span>
                        <div className="v4-progress-track">
                          <div className="v4-progress-fill-p4" />
                        </div>
                        <span className="v4-progress-val">85%</span>
                      </div>
                    </Box>
                  </Box>
                </Box>
                )}
              </Box>

              {/* RIGHT COLUMN: CLEAN WHITE AUTHENTICATION CARD */}
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: '28px',
                  border: '1px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 30px 70px -15px rgba(124, 58, 237, 0.12), 0 12px 30px -5px rgba(15, 23, 42, 0.04), inset 0 1px 1px #FFFFFF',
                  p: { xs: 3, sm: '38px 38px 32px 38px' },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Form Titles */}
                <Typography
                  level="h2"
                  sx={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 30,
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.03em',
                    mb: 0.75,
                  }}
                >
                  Welcome back
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#64748B', mb: 3 }}>
                  Sign in to continue to Hirerkey
                </Typography>

                {/* Dual Tab Segmented Track (OTP vs Password) */}
                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    p: '4px',
                    gap: '4px',
                    mb: 3,
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setV4AuthMode('otp')}
                    sx={{
                      flex: 1,
                      py: 1.25,
                      px: 1.75,
                      borderRadius: '9px',
                      border: '1px solid',
                      borderColor: v4AuthMode === 'otp' ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
                      bgcolor: v4AuthMode === 'otp' ? '#FFFFFF' : 'transparent',
                      color: v4AuthMode === 'otp' ? '#7C3AED' : '#64748B',
                      fontWeight: v4AuthMode === 'otp' ? 700 : 600,
                      boxShadow: v4AuthMode === 'otp' ? '0 2px 8px rgba(124, 58, 237, 0.12)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: 13.5,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <HiEnvelope size={16} />
                    <span>Login with OTP</span>
                  </Box>

                  <Box
                    component="button"
                    type="button"
                    onClick={() => setV4AuthMode('password')}
                    sx={{
                      flex: 1,
                      py: 1.25,
                      px: 1.75,
                      borderRadius: '9px',
                      border: '1px solid',
                      borderColor: v4AuthMode === 'password' ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
                      bgcolor: v4AuthMode === 'password' ? '#FFFFFF' : 'transparent',
                      color: v4AuthMode === 'password' ? '#7C3AED' : '#64748B',
                      fontWeight: v4AuthMode === 'password' ? 700 : 600,
                      boxShadow: v4AuthMode === 'password' ? '0 2px 8px rgba(124, 58, 237, 0.12)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: 13.5,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <HiLockClosed size={16} />
                    <span>Login with password</span>
                  </Box>
                </Box>

                {/* MODE A: OTP FLOW */}
                {v4AuthMode === 'otp' && v4OtpStep === 'input' && (
                  <Box component="form" onSubmit={handleV4SendOTP}>
                    <Box sx={{ mb: 2.25 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 1 }}>
                        Work email
                      </Typography>
                      <Input
                        type="email"
                        required
                        value={v4Email}
                        onChange={(e) => setV4Email(e.target.value)}
                        placeholder="you@company.com"
                        startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                        sx={{
                          height: 48,
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          bgcolor: '#FFFFFF',
                          fontSize: 14,
                          '&:focus-within': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                          },
                        }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          bgcolor: '#6D28D9',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 14px 28px -5px rgba(124, 58, 237, 0.55)',
                        },
                      }}
                      endDecorator={<HiArrowRight size={16} />}
                    >
                      Send OTP
                    </Button>
                  </Box>
                )}

                {/* MODE A2: OTP VERIFICATION */}
                {v4AuthMode === 'otp' && v4OtpStep === 'verify' && (
                  <Box component="form" onSubmit={handleV4VerifyOTP}>
                    <Typography level="h3" sx={{ fontSize: 19, fontWeight: 700, color: '#0F172A', mb: 0.75 }}>
                      Enter verification code
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B', mb: 2.5 }}>
                      We sent a 6-digit code to <strong style={{ color: '#7C3AED' }}>{v4Email}</strong>
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1.25, mb: 2.5 }}>
                      {v4OtpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`v4-otp-digit-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleV4OtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleV4OtpKeyDown(idx, e)}
                          style={{
                            height: 52,
                            width: '100%',
                            textAlign: 'center',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: 22,
                            fontWeight: 800,
                            color: '#0F172A',
                            borderRadius: '12px',
                            border: '1.5px solid #CBD5E1',
                            background: '#FFFFFF',
                            outline: 'none',
                            transition: 'all 0.15s ease',
                          }}
                        />
                      ))}
                    </Box>

                    {/* Resend Timer Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, fontSize: 13, color: '#64748B', mb: 2.5 }}>
                      <span>Didn't receive code?</span>
                      {v4OtpSecondsLeft > 0 ? (
                        <span>
                          Resend in <strong style={{ color: '#7C3AED' }}>0:{v4OtpSecondsLeft.toString().padStart(2, '0')}</strong>
                        </span>
                      ) : (
                        <Box
                          component="button"
                          type="button"
                          onClick={resendV4Code}
                          sx={{
                            background: 'none',
                            border: 'none',
                            p: 0,
                            color: '#7C3AED',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: 13,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          Resend OTP
                        </Box>
                      )}
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          bgcolor: '#6D28D9',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 14px 28px -5px rgba(124, 58, 237, 0.55)',
                        },
                      }}
                      endDecorator={<HiArrowRight size={16} />}
                    >
                      Verify &amp; Sign in
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 1.75 }}>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => setV4OtpStep('input')}
                        sx={{
                          background: 'none',
                          border: 'none',
                          p: 0,
                          color: '#7C3AED',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        ← Back to Email entry
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* MODE B: PASSWORD LOGIN */}
                {v4AuthMode === 'password' && (
                  <Box component="form" onSubmit={handleV4PasswordLogin}>
                    <Box sx={{ mb: 2.25 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 1 }}>
                        Work email
                      </Typography>
                      <Input
                        type="email"
                        required
                        value={v4Email}
                        onChange={(e) => setV4Email(e.target.value)}
                        placeholder="you@company.com"
                        startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                        sx={{
                          height: 48,
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          bgcolor: '#FFFFFF',
                          fontSize: 14,
                          '&:focus-within': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2.25 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 1 }}>
                        Password
                      </Typography>
                      <Input
                        type={v4ShowPassword ? 'text' : 'password'}
                        required
                        value={v4Password}
                        onChange={(e) => setV4Password(e.target.value)}
                        placeholder="••••••••"
                        startDecorator={<HiLockClosed color="#94A3B8" size={18} />}
                        endDecorator={
                          <Box
                            component="button"
                            type="button"
                            onClick={() => setV4ShowPassword(!v4ShowPassword)}
                            sx={{ background: 'none', border: 'none', p: 0.5, color: '#94A3B8', cursor: 'pointer', display: 'flex' }}
                          >
                            {v4ShowPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                          </Box>
                        }
                        sx={{
                          height: 48,
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          bgcolor: '#FFFFFF',
                          fontSize: 14,
                          '&:focus-within': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, fontSize: 13 }}>
                      <Box
                        component="label"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.85, color: '#475569', cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={v4RememberMe}
                          onChange={(e) => setV4RememberMe(e.target.checked)}
                          style={{ accentColor: '#7C3AED', width: 16, height: 16 }}
                        />
                        <span>Remember me</span>
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => setHelpModalOpen(true)}
                        sx={{
                          background: 'none',
                          border: 'none',
                          p: 0,
                          color: '#7C3AED',
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Forgot password?
                      </Box>
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          bgcolor: '#6D28D9',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 14px 28px -5px rgba(124, 58, 237, 0.55)',
                        },
                      }}
                      endDecorator={<HiArrowRight size={16} />}
                    >
                      Sign in
                    </Button>
                  </Box>
                )}

                {/* Can't access your login email recovery link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setHelpModalOpen(true)}
                    sx={{
                      background: 'none',
                      border: 'none',
                      p: 0,
                      color: '#7C3AED',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { color: '#6D28D9', textDecoration: 'underline' },
                    }}
                  >
                    Can't access your login email?
                  </Box>
                </Box>

                {/* Legal Footer */}
                <Typography sx={{ mt: 3.5, fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>
                  By continuing, you agree to our{' '}
                  <span style={{ color: '#7C3AED', fontWeight: 600, cursor: 'pointer' }}>Terms of Use</span> and{' '}
                  <span style={{ color: '#7C3AED', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>.
                </Typography>
              </Box>
            </Box>
          </motion.div>

      {/* Sleek Bottom Pagination Dock */}
      <Box
        component="nav"
        aria-label="Page navigation"
        sx={{
          position: 'fixed',
          bottom: { xs: '14px', sm: '22px' },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'inline-flex',
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          borderRadius: '9999px',
          p: '5px 6px',
          gap: '6px',
          boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.12), 0 6px 14px -3px rgba(124, 58, 237, 0.08), inset 0 1px 1px #FFFFFF',
          userSelect: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: '0 20px 42px -6px rgba(15, 23, 42, 0.16), 0 8px 20px -3px rgba(124, 58, 237, 0.14), inset 0 1px 1px #FFFFFF',
          },
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(1)}
          aria-label="Page 1: The Connected HR Ecosystem"
          title="The Connected HR Ecosystem (Key 1)"
          sx={{
            appearance: 'none',
            border: activePage === 1 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 1 ? '#FFFFFF' : 'transparent',
            color: activePage === 1 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 1 ? 700 : 600,
            boxShadow: activePage === 1 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 1 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>①</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Ecosystem</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 1 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 1 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 1 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            1
          </Box>
        </Box>

        

        

        <Box sx={{ width: '1px', height: '18px', bgcolor: '#E2E8F0' }} />

        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(4)}
          aria-label="Page 4: The Hirerkey Ecosystem (Connected Hub)"
          title="The Hirerkey Ecosystem (Key 4)"
          sx={{
            appearance: 'none',
            border: activePage === 4 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 4 ? '#FFFFFF' : 'transparent',
            color: activePage === 4 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 4 ? 700 : 600,
            boxShadow: activePage === 4 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 4 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>④</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Connected Hub</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              fontSize: '9px',
              fontWeight: 800,
              px: '6px',
              py: '1.5px',
              borderRadius: '9999px',
              bgcolor: 'rgba(16, 185, 129, 0.15)',
              color: '#059669',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Live
          </Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 4 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 4 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 4 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            4
          </Box>
        </Box>
      </Box>

      {/* IT / HR Help Modal */}
      <Modal open={helpModalOpen} onClose={() => setHelpModalOpen(false)}>
        <ModalDialog
          sx={{
            bgcolor: '#120D24',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            color: '#FFFFFF',
            textAlign: 'left',
            p: 4,
            maxWidth: 420,
          }}
        >
          <ModalClose />
          <Typography level="title-lg" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
            Can't access your corporate account?
          </Typography>
          <Typography level="body-sm" sx={{ color: '#CBD5E1', mb: 2 }}>
            Hirerkey enterprise accounts are managed by your organization's IT and HR administrators.
          </Typography>
          <Button
            onClick={() => setHelpModalOpen(false)}
            sx={{
              height: 48,
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
              fontWeight: 700,
              mt: 2,
            }}
          >
            Understood
          </Button>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default LoginView;
