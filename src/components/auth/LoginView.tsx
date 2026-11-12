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
  const [activePage, setActivePage] = useState<1 | 2 | 3 | 4>((defaultView === 4 ? 4 : defaultView === 3 ? 3 : defaultView === 2 ? 2 : 1) as 1 | 2 | 3 | 4);

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
      if (e.key === '1') {
        setActivePage(1);
      } else if (e.key === '2') {
        setActivePage(2);
      } else if (e.key === '3') {
        setActivePage(3);
      } else if (e.key === '4') {
        setActivePage(4);
      } else if (e.key === 'ArrowLeft') {
        setActivePage((prev) => (prev === 1 ? 4 : ((prev - 1) as 1 | 2 | 3 | 4)));
      } else if (e.key === 'ArrowRight') {
        setActivePage((prev) => (prev === 4 ? 1 : ((prev + 1) as 1 | 2 | 3 | 4)));
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
       PAGE 2: THE LIVE INTERACTIVE GLASS BENTO COMMAND DECK
       ========================================================================== */

    /* Bento Container & Glassmorphism Deck */
    .p2-bento-deck {
      position: relative;
      width: 100%;
      max-width: 524px;
      height: 342px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding: 8px 10px 9px 10px;
      border-radius: 16px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 20px 45px -12px rgba(124, 58, 237, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
      box-sizing: border-box;
      perspective: 1000px;
      transform-style: preserve-3d;
      user-select: none;
      contain: layout style;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Ambient Specular Glow */
    .p2-bento-ambient-glow {
      position: absolute;
      inset: -15px;
      border-radius: 24px;
      background: radial-gradient(circle at 50% 30%, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.08) 40%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      animation: p2BentoGlowBreath 6s ease-in-out infinite alternate;
    }

    @keyframes p2BentoGlowBreath {
      0% { opacity: 0.6; transform: scale(0.98); }
      100% { opacity: 1; transform: scale(1.02); }
    }

    /* Chrome Header */
    .p2-bento-chrome {
      position: relative;
      z-index: 1;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px;
      border-bottom: 1px solid rgba(226, 232, 240, 0.7);
      padding-bottom: 5px;
    }

    .p2-bento-chrome-dots {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .p2-bento-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .p2-bento-dot.red { background: #EF4444; }
    .p2-bento-dot.amber { background: #F59E0B; }
    .p2-bento-dot.green { background: #10B981; }

    .p2-bento-chrome-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .p2-bento-chrome-badge {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #7C3AED;
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid rgba(124, 58, 237, 0.25);
      border-radius: 4px;
      padding: 1px 4px;
    }

    .p2-bento-chrome-status {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 8.5px;
      font-weight: 700;
      color: #059669;
      letter-spacing: 0.05em;
    }

    .p2-bento-live-beacon {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
      animation: p2BentoBeaconPulse 1.4s ease infinite;
    }

    @keyframes p2BentoBeaconPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.45; }
    }

    /* Bento 2x2 Core Grid */
    .p2-bento-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1.14fr 1fr;
      grid-template-rows: 124px 124px;
      gap: 7px;
    }

    /* Common Bento Tile Styling */
    .p2-bento-tile {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(226, 232, 240, 0.85);
      border-radius: 12px;
      padding: 8px 10px;
      box-shadow: 0 4px 14px -3px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.7) inset;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .p2-bento-tile:hover {
      border-color: rgba(124, 58, 237, 0.35);
      box-shadow: 0 8px 20px -4px rgba(124, 58, 237, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
    }

    .p2-bento-tile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    /* Badges */
    .p2-bento-badge {
      display: inline-flex;
      align-items: center;
      gap: 3.5px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 1.5px 5px;
      border-radius: 4px;
    }

    .p2-bento-badge.cyan {
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: #0891B2;
    }

    .p2-bento-badge.emerald {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #059669;
    }

    .p2-bento-badge.rose {
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #E11D48;
    }

    .p2-bento-badge.purple {
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid rgba(124, 58, 237, 0.3);
      color: #7C3AED;
    }

    .p2-bento-badge-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
    }

    /* ==========================================================================
       TILE 1: WORKFORCE VELOCITY & SINE SPARKLINE
       ========================================================================== */
    .p2-bento-retention-pill {
      font-size: 8.5px;
      font-weight: 700;
      color: #059669;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 999px;
      padding: 1px 6px;
    }

    .p2-bento-kpi-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-top: 3px;
    }

    .p2-bento-kpi-val {
      font-size: 19px;
      font-weight: 800;
      color: #0F172A;
      font-family: "Plus Jakarta Sans", sans-serif;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .p2-bento-trend-badge {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 9.5px;
      font-weight: 700;
      color: #059669;
      background: rgba(16, 185, 129, 0.12);
      padding: 1px 5px;
      border-radius: 4px;
    }

    .p2-bento-kpi-sub {
      font-size: 9px;
      color: #64748B;
      font-weight: 500;
      margin-top: 1px;
    }

    .p2-bento-sparkline-canvas {
      position: relative;
      width: 100%;
      height: 38px;
      margin-top: 4px;
      overflow: hidden;
      border-radius: 6px;
    }

    .p2-bento-sparkline-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .p2-bento-sparkline-path {
      fill: none;
      stroke: url(#p2SparklineGrad);
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-dasharray: 280;
      stroke-dashoffset: 280;
      filter: url(#p2NeonGlow);
      animation: p2BentoSparklineDraw 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    @keyframes p2BentoSparklineDraw {
      0%, 12% {
        stroke-dashoffset: 280;
        opacity: 0.3;
      }
      28%, 88% {
        stroke-dashoffset: 0;
        opacity: 1;
      }
      96%, 100% {
        stroke-dashoffset: 0;
        opacity: 0.35;
      }
    }

    .p2-bento-sparkline-fill {
      fill: url(#p2SparklineFillGrad);
      opacity: 0;
      animation: p2BentoSparklineFill 10s ease-out infinite;
    }

    @keyframes p2BentoSparklineFill {
      0%, 16% { opacity: 0; transform: translateY(3px); }
      30%, 88% { opacity: 1; transform: translateY(0); }
      96%, 100% { opacity: 0.25; }
    }

    .p2-bento-sparkline-cursor {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px 2px #10B981, 0 0 3px #FFFFFF;
      pointer-events: none;
      offset-path: path("M 0 32 Q 35 30 65 20 T 130 16 T 195 8 T 240 4");
      offset-distance: 0%;
      opacity: 0;
      animation: p2BentoCursorScan 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    @keyframes p2BentoCursorScan {
      0%, 12% { offset-distance: 0%; opacity: 0; transform: scale(0.5); }
      15% { opacity: 1; transform: scale(1.2); }
      30%, 88% { offset-distance: 100%; opacity: 1; transform: scale(1.0); }
      94%, 100% { opacity: 0; transform: scale(0.6); }
    }

    .p2-bento-sparkline-scan-beam {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.8), transparent);
      box-shadow: 0 0 8px rgba(6, 182, 212, 0.6);
      opacity: 0;
      animation: p2BentoScanBeam 10s ease-in-out infinite;
    }

    @keyframes p2BentoScanBeam {
      0%, 12% { left: 0%; opacity: 0; }
      15% { opacity: 0.75; }
      30% { left: 96%; opacity: 0.75; }
      34%, 100% { opacity: 0; left: 96%; }
    }

    /* ==========================================================================
       TILE 2: HyIQ™ AUTONOMOUS COPILOT
       ========================================================================== */
    .p2-bento-ai-brand {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .p2-bento-ai-orb {
      position: relative;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7C3AED, #06B6D4);
      display: grid;
      place-items: center;
      flex-shrink: 0;
      box-shadow: 0 0 8px rgba(124, 58, 237, 0.4);
    }

    .p2-bento-ai-halo-1,
    .p2-bento-ai-halo-2 {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 1px solid rgba(139, 92, 246, 0.45);
      pointer-events: none;
      animation: p2BentoAiHalo 2.6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
    }
    .p2-bento-ai-halo-2 {
      animation-delay: 1.3s;
    }

    @keyframes p2BentoAiHalo {
      0% { transform: scale(0.85); opacity: 0.9; border-color: rgba(6, 182, 212, 0.6); }
      100% { transform: scale(1.65); opacity: 0; border-color: rgba(139, 92, 246, 0); }
    }

    .p2-bento-ai-icon {
      font-size: 10px;
      line-height: 1;
    }

    .p2-bento-ai-meta {
      display: flex;
      flex-direction: column;
    }

    .p2-bento-ai-title {
      font-size: 11px;
      font-weight: 700;
      color: #0F172A;
      line-height: 1.2;
    }

    .p2-bento-ai-sub {
      font-size: 8px;
      font-weight: 600;
      color: #7C3AED;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* 5 Dancing EQ Bars */
    .p2-bento-eq-cluster {
      display: flex;
      align-items: flex-end;
      gap: 2.5px;
      height: 14px;
    }

    .p2-bento-eq-bar {
      width: 2px;
      border-radius: 1px;
      background: linear-gradient(180deg, #06B6D4 0%, #7C3AED 100%);
      animation: p2BentoEqDance 0.75s ease-in-out infinite alternate;
    }

    .p2-bento-eq-bar.bar-1 { height: 35%; animation-delay: 0.0s; }
    .p2-bento-eq-bar.bar-2 { height: 90%; animation-delay: 0.15s; }
    .p2-bento-eq-bar.bar-3 { height: 55%; animation-delay: 0.3s; }
    .p2-bento-eq-bar.bar-4 { height: 85%; animation-delay: 0.1s; }
    .p2-bento-eq-bar.bar-5 { height: 45%; animation-delay: 0.25s; }

    @keyframes p2BentoEqDance {
      0% { transform: scaleY(0.4); opacity: 0.55; }
      100% { transform: scaleY(1.0); opacity: 1; filter: drop-shadow(0 0 3px #06B6D4); }
    }

    /* Cycling AI Insight Stream */
    .p2-bento-insight-viewport {
      position: relative;
      height: 48px;
      width: 100%;
      margin-top: 6px;
    }

    .p2-bento-insight-item {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(124, 58, 237, 0.06);
      border: 1px solid rgba(124, 58, 237, 0.16);
      border-radius: 8px;
      padding: 5px 8px;
      opacity: 0;
      transform: translateY(8px);
      box-sizing: border-box;
    }

    .p2-bento-insight-item.insight-1 { animation: p2BentoInsight1 10s ease infinite; }
    .p2-bento-insight-item.insight-2 { animation: p2BentoInsight2 10s ease infinite; }
    .p2-bento-insight-item.insight-3 { animation: p2BentoInsight3 10s ease infinite; }

    @keyframes p2BentoInsight1 {
      0%, 2% { opacity: 0; transform: translateY(8px); }
      6%, 30% { opacity: 1; transform: translateY(0); }
      34%, 100% { opacity: 0; transform: translateY(-8px); }
    }
    @keyframes p2BentoInsight2 {
      0%, 33% { opacity: 0; transform: translateY(8px); }
      37%, 63% { opacity: 1; transform: translateY(0); }
      67%, 100% { opacity: 0; transform: translateY(-8px); }
    }
    @keyframes p2BentoInsight3 {
      0%, 66% { opacity: 0; transform: translateY(8px); }
      70%, 94% { opacity: 1; transform: translateY(0); }
      98%, 100% { opacity: 0; transform: translateY(-8px); }
    }

    .p2-bento-insight-bullet {
      color: #7C3AED;
      font-size: 10px;
      line-height: 1;
      filter: drop-shadow(0 0 2px rgba(124, 58, 237, 0.5));
    }

    .p2-bento-insight-text {
      font-size: 10px;
      font-weight: 600;
      color: #4338CA;
      line-height: 1.25;
    }

    .p2-bento-insight-pips {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }

    .p2-bento-insight-pip {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #CBD5E1;
      transition: background 0.3s, transform 0.3s;
    }

    /* ==========================================================================
       TILE 3: LIVE COMPLIANCE & APPROVAL RADAR
       ========================================================================== */
    .p2-bento-radar-layout {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      height: 100%;
    }

    .p2-bento-radar-screen {
      position: relative;
      width: 82px;
      height: 82px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.88) 78%);
      border: 1px solid rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.15) inset;
      overflow: hidden;
      flex-shrink: 0;
    }

    .p2-bento-radar-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px dashed rgba(16, 185, 129, 0.22);
    }
    .p2-bento-radar-ring.ring-1 { inset: 10px; }
    .p2-bento-radar-ring.ring-2 { inset: 22px; }
    .p2-bento-radar-ring.ring-3 { inset: 33px; }

    .p2-bento-radar-crosshair-h {
      position: absolute; top: 50%; left: 0; right: 0; height: 1px;
      background: rgba(16, 185, 129, 0.18);
    }
    .p2-bento-radar-crosshair-v {
      position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
      background: rgba(16, 185, 129, 0.18);
    }

    .p2-bento-radar-beam {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 44px;
      height: 44px;
      transform-origin: 0% 0%;
      background: conic-gradient(from 0deg, rgba(16, 185, 129, 0.55) 0deg, rgba(16, 185, 129, 0.0) 65deg, transparent 65deg);
      border-radius: 0 100% 0 0;
      animation: p2BentoRadarSweep 3s linear infinite;
    }

    @keyframes p2BentoRadarSweep {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .p2-bento-radar-blip {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .p2-bento-radar-blip.blip-pto { top: 16px; left: 18px; }
    .p2-bento-radar-blip.blip-gear { bottom: 14px; right: 10px; }

    .p2-bento-blip-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
      flex-shrink: 0;
    }

    .p2-bento-blip-ripple {
      position: absolute;
      top: 0;
      left: 0;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      border: 1px solid #10B981;
      animation: p2BentoBlipRipple 3s ease-out infinite;
    }

    @keyframes p2BentoBlipRipple {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(3.5); opacity: 0; }
    }

    .p2-bento-blip-tag {
      font-size: 7.5px;
      font-weight: 700;
      letter-spacing: 0.03em;
      color: #10B981;
      background: rgba(16, 185, 129, 0.22);
      border: 1px solid rgba(16, 185, 129, 0.45);
      border-radius: 3px;
      padding: 0.5px 3px;
      white-space: nowrap;
      opacity: 0;
      transform: scale(0.85);
      animation: p2BentoBlipLock 3s ease-in-out infinite;
    }

    .p2-bento-radar-blip.blip-gear .p2-bento-blip-tag {
      animation-delay: 1.5s;
    }
    .p2-bento-radar-blip.blip-gear .p2-bento-blip-ripple {
      animation-delay: 1.5s;
    }

    @keyframes p2BentoBlipLock {
      0%, 18% { opacity: 0; transform: scale(0.7); }
      26%, 72% { opacity: 1; transform: scale(1.0); }
      85%, 100% { opacity: 0; transform: scale(0.8); }
    }

    .p2-bento-radar-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .p2-bento-radar-kpi {
      font-size: 19px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.1;
      margin-top: 2px;
      font-family: "Plus Jakarta Sans", sans-serif;
    }

    .p2-bento-radar-unit {
      font-size: 11px;
      font-weight: 600;
      color: #64748B;
    }

    .p2-bento-radar-sub {
      font-size: 8.5px;
      color: #64748B;
      font-weight: 500;
    }

    .p2-bento-radar-stat-pill {
      font-size: 8.5px;
      font-weight: 700;
      color: #059669;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 4px;
      padding: 1.5px 5px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      margin-top: 4px;
      width: fit-content;
    }

    /* ==========================================================================
       TILE 4: CULTURE & ENGAGEMENT PULSE
       ========================================================================== */
    .p2-bento-sentiment-pill {
      font-size: 8.5px;
      font-weight: 700;
      color: #BE185D;
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.25);
      border-radius: 999px;
      padding: 1px 6px;
    }

    .p2-bento-sentiment-body {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 2px;
    }

    .p2-bento-gauge-wrap {
      position: relative;
      width: 62px;
      height: 62px;
      flex-shrink: 0;
    }

    .p2-bento-gauge-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .p2-bento-gauge-track {
      fill: none;
      stroke: rgba(226, 232, 240, 0.8);
      stroke-width: 5;
    }

    .p2-bento-gauge-fill {
      fill: none;
      stroke: url(#p2GaugeGrad);
      stroke-width: 5;
      stroke-linecap: round;
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: p2BentoGaugeDraw 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    @keyframes p2BentoGaugeDraw {
      0%, 30% { stroke-dashoffset: 100; }
      46%, 90% { stroke-dashoffset: 4; } /* 96% fill */
      98%, 100% { stroke-dashoffset: 100; }
    }

    .p2-bento-gauge-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .p2-bento-gauge-val {
      font-size: 13px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1;
      font-family: "Plus Jakarta Sans", sans-serif;
    }

    .p2-bento-gauge-sub {
      font-size: 8px;
      font-weight: 700;
      color: #7C3AED;
      letter-spacing: 0.04em;
    }

    .p2-bento-sentiment-right {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .p2-bento-avatar-stack {
      display: flex;
      align-items: center;
    }

    .p2-bento-micro-avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1.5px solid #FFFFFF;
      font-size: 8.5px;
      font-weight: 700;
      display: grid;
      place-items: center;
      position: relative;
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.1);
    }
    .p2-bento-micro-avatar:not(:first-child) {
      margin-left: -6px;
    }

    .p2-bento-micro-avatar.av-1 { background: #EDE9FE; color: #7C3AED; }
    .p2-bento-micro-avatar.av-2 { background: #E0F2FE; color: #0284C7; }
    .p2-bento-micro-avatar.av-3 { background: #ECFDF5; color: #059669; }

    .p2-bento-av-dot {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #10B981;
      border: 1px solid #FFFFFF;
    }

    .p2-bento-sentiment-sub {
      font-size: 8px;
      color: #64748B;
      font-weight: 600;
      margin-top: 4px;
    }

    /* Floating Celebration Reactions */
    .p2-bento-reaction-float {
      position: absolute;
      font-size: 13px;
      pointer-events: none;
      opacity: 0;
      filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.25));
    }

    .p2-bento-reaction-float.r-party {
      bottom: 6px;
      right: 12px;
      animation: p2BentoReactionFloat 6s ease-out infinite 1.2s;
    }
    .p2-bento-reaction-float.r-rocket {
      bottom: 4px;
      right: 28px;
      animation: p2BentoReactionFloat 6s ease-out infinite 3.2s;
    }
    .p2-bento-reaction-float.r-heart {
      bottom: 8px;
      right: 20px;
      animation: p2BentoReactionFloat 6s ease-out infinite 4.6s;
    }

    @keyframes p2BentoReactionFloat {
      0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
      15% { opacity: 1; transform: translate(-3px, -12px) scale(1.15); }
      50% { opacity: 0.9; transform: translate(5px, -30px) scale(1.0); }
      75% { opacity: 0; transform: translate(-2px, -44px) scale(0.85); }
      100% { opacity: 0; transform: translate(0, 0); }
    }

    /* ==========================================================================
       TILE 5: BOTTOM REAL-TIME OPERATIONS MARQUEE STREAM
       ========================================================================== */
    .p2-bento-ticker-tile {
      position: relative;
      z-index: 1;
      height: 30px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 10px;
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9px;
      overflow: hidden;
      box-sizing: border-box;
    }

    .p2-bento-ticker-label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #10B981;
      text-transform: uppercase;
      white-space: nowrap;
      padding-right: 7px;
      border-right: 1px solid rgba(255, 255, 255, 0.15);
      flex-shrink: 0;
    }

    .p2-bento-ticker-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
      animation: p2BentoBeaconPulse 1.4s ease infinite;
    }

    .p2-bento-ticker-window {
      flex: 1;
      overflow: hidden;
      mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
    }

    .p2-bento-ticker-track {
      display: flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
      will-change: transform;
      animation: p2BentoTicker 26s linear infinite;
    }

    .p2-bento-ticker-track:hover {
      animation-play-state: paused;
    }

    @keyframes p2BentoTicker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .p2-bento-ticker-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 10.5px;
      color: #E2E8F0;
      font-weight: 500;
    }

    .p2-bento-ticker-dot-metric {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }
    .p2-bento-ticker-dot-metric.green { background: #10B981; }
    .p2-bento-ticker-dot-metric.cyan { background: #06B6D4; }
    .p2-bento-ticker-dot-metric.purple { background: #8B5CF6; }
    .p2-bento-ticker-dot-metric.emerald { background: #34D399; }
    .p2-bento-ticker-dot-metric.amber { background: #F59E0B; }

    .p2-bento-ticker-sep {
      color: rgba(255, 255, 255, 0.25);
      font-size: 9px;
    }

    /* Accessibility for Page 2 */
    @media (prefers-reduced-motion: reduce) {
      .p2-bento-deck,
      .p2-bento-sparkline-path,
      .p2-bento-sparkline-fill,
      .p2-bento-sparkline-cursor,
      .p2-bento-sparkline-scan-beam,
      .p2-bento-ai-halo-1,
      .p2-bento-ai-halo-2,
      .p2-bento-eq-bar,
      .p2-bento-insight-item,
      .p2-bento-radar-beam,
      .p2-bento-radar-blip,
      .p2-bento-blip-ripple,
      .p2-bento-blip-tag,
      .p2-bento-gauge-fill,
      .p2-bento-reaction-float,
      .p2-bento-live-beacon,
      .p2-bento-ticker-dot,
      .p2-bento-ticker-track,
      .p2-bento-ambient-glow {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }

      .p2-bento-sparkline-path {
        stroke-dashoffset: 0 !important;
        opacity: 1 !important;
      }

      .p2-bento-sparkline-fill {
        opacity: 0.6 !important;
        transform: none !important;
      }

      .p2-bento-sparkline-cursor,
      .p2-bento-sparkline-scan-beam,
      .p2-bento-radar-beam,
      .p2-bento-reaction-float {
        display: none !important;
      }

      .p2-bento-blip-tag {
        opacity: 1 !important;
        transform: none !important;
      }

      .p2-bento-gauge-fill {
        stroke-dashoffset: 4 !important;
      }

      .p2-bento-insight-item {
        display: none !important;
      }

      .p2-bento-insight-item.insight-1 {
        display: flex !important;
        opacity: 1 !important;
        transform: none !important;
      }

      .p2-bento-ticker-track {
        transform: none !important;
      }
    }

    /* Responsive adjustments for Living Bento Command Deck */
    @media (max-width: 640px) {
      #v4WorkflowStageLiving {
        height: 280px;
      }
      .p2-bento-deck {
        max-width: 420px;
        height: 270px;
        padding: 6px 8px;
        gap: 5px;
        transform: none !important;
      }
      .p2-bento-chrome {
        height: 18px;
        padding-bottom: 3px;
      }
      .p2-bento-chrome-title {
        font-size: 8.5px;
      }
      .p2-bento-grid {
        grid-template-columns: 1.1fr 1fr;
        grid-template-rows: 96px 96px;
        gap: 5px;
      }
      .p2-bento-tile {
        padding: 5px 7px;
        border-radius: 9px;
      }
      .p2-bento-kpi-val {
        font-size: 15px;
      }
      .p2-bento-sparkline-canvas {
        height: 26px;
      }
      .p2-bento-radar-screen {
        width: 62px;
        height: 62px;
      }
      .p2-bento-radar-beam {
        width: 31px;
        height: 31px;
      }
      .p2-bento-radar-kpi {
        font-size: 14px;
      }
      .p2-bento-gauge-wrap {
        width: 48px;
        height: 48px;
      }
      .p2-bento-gauge-val {
        font-size: 11px;
      }
      .p2-bento-micro-avatar {
        width: 18px;
        height: 18px;
        font-size: 7.5px;
      }
      .p2-bento-ticker-tile {
        height: 24px;
        padding: 0 7px;
      }
      .p2-bento-ticker-item {
        font-size: 9.5px;
      }
      .v4-pagination-dock {
        bottom: 12px;
        padding: 4px;
      }
      .v4-page-btn {
        padding: 5px 10px;
        font-size: 11.5px;
      }
    }

    @media (max-width: 480px) {
      #v4WorkflowStageLiving {
        height: 270px;
      }
      .p2-bento-deck {
        max-width: 100%;
        height: 264px;
        padding: 5px 6px;
        gap: 4px;
      }
      .p2-bento-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 94px 94px;
        gap: 4px;
      }
      .p2-bento-chrome-status {
        display: none;
      }
      .p2-bento-retention-pill {
        display: none;
      }
      .p2-bento-sentiment-sub {
        display: none;
      }
      .p2-bento-ticker-label span:last-child {
        display: none;
      }
    }

              /* ==========================================================================
       PAGE 3: THE PROCESS-BASED CONNECTED HR ECOSYSTEM — 14.0s SEQUENTIAL STORY
       ========================================================================== */

    /* Stage Container */
    #p3ProcessStage {
      position: relative;
      width: 100%;
      max-width: 540px;
      height: 350px;
      perspective: 1000px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-top: 6px;
      contain: layout paint style;
      transform-style: preserve-3d;
    }

    /* 1. Subtle Technical Dot & Line Grid Pattern with Radial Mask */
    .p3-proc-grid-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: 20px;
      background-image: 
        radial-gradient(circle, rgba(124, 58, 237, 0.09) 1px, transparent 1px),
        linear-gradient(to right, rgba(124, 58, 237, 0.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(124, 58, 237, 0.025) 1px, transparent 1px);
      background-size: 20px 20px, 40px 40px, 40px 40px;
      background-position: center center;
      mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000000 45%, transparent 95%);
      -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000000 45%, transparent 95%);
      pointer-events: none;
      z-index: 1;
      opacity: 0.85;
    }

    /* 2. Soft Ambient Underlay Glow */
    .p3-proc-ambient {
      position: absolute;
      width: 340px;
      height: 230px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%);
      filter: blur(34px);
      pointer-events: none;
      z-index: 1;
    }

    /* 3. SVG Flow Lines & Optical Connectors */
    .p3-proc-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }

    .p3-proc-track-base {
      stroke: rgba(148, 163, 184, 0.22);
      stroke-width: 1.5px;
      stroke-dasharray: 3 3;
      fill: none;
    }

    .p3-proc-track-active {
      fill: none;
      stroke-width: 2.2px;
      stroke-linecap: round;
      stroke-dasharray: 144;
      stroke-dashoffset: 144;
      opacity: 0;
      will-change: stroke-dashoffset, stroke-width, opacity;
    }

    .p3-proc-line-1 {
      animation: p3ProcPath1Draw 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .p3-proc-line-2 {
      animation: p3ProcPath2Draw 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .p3-proc-line-3 {
      animation: p3ProcPath3Draw 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .p3-proc-line-4 {
      animation: p3ProcPath4Draw 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    /* 4. Photonic Light Particles navigating Bezier paths */
    .p3-proc-particle {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 4;
      opacity: 0;
      will-change: transform, opacity, offset-distance;
    }

    .p3-proc-particle-1 {
      background: #A855F7;
      box-shadow: 0 0 10px 2px #A855F7, 0 0 4px #FFFFFF;
      offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
      animation: p3ProcParticle1Cycle 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .p3-proc-particle-2 {
      background: #3B82F6;
      box-shadow: 0 0 10px 2px #3B82F6, 0 0 4px #FFFFFF;
      offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
      animation: p3ProcParticle2Cycle 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .p3-proc-particle-3 {
      background: #EC4899;
      box-shadow: 0 0 10px 2px #EC4899, 0 0 4px #FFFFFF;
      offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
      animation: p3ProcParticle3Cycle 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .p3-proc-particle-4 {
      background: #10B981;
      box-shadow: 0 0 10px 2px #10B981, 0 0 4px #FFFFFF;
      offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
      animation: p3ProcParticle4Cycle 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    /* 5. Central Miniature Dashboard Anchor (Living Command Center) */
    .p3-proc-dashboard {
      position: absolute;
      top: 102.5px;
      left: 162px;
      width: 216px;
      height: 145px;
      z-index: 5;
      background: #FFFFFF;
      border-radius: 13px;
      border: 1.5px solid rgba(124, 58, 237, 0.28);
      box-shadow: 
        0 20px 45px -10px rgba(124, 58, 237, 0.30),
        0 8px 20px -4px rgba(15, 23, 42, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.9);
      overflow: hidden;
      transform-origin: center center;
      will-change: transform, box-shadow, opacity;
      user-select: none;
      animation: p3ProcDashCycle 14s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
      transition: transform 0.15s ease-out;
    }

    .p3-proc-dash-chrome {
      height: 22px;
      padding: 0 8px;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }

    .p3-proc-dash-dots {
      display: flex;
      align-items: center;
      gap: 3.5px;
    }

    .p3-proc-dash-dot-red {
      width: 5.5px;
      height: 5.5px;
      border-radius: 50%;
      background: #EF4444;
    }

    .p3-proc-dash-dot-amber {
      width: 5.5px;
      height: 5.5px;
      border-radius: 50%;
      background: #F59E0B;
    }

    .p3-proc-dash-dot-green {
      width: 5.5px;
      height: 5.5px;
      border-radius: 50%;
      background: #10B981;
    }

    .p3-proc-dash-url {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8px;
      color: #64748B;
      font-weight: 500;
      letter-spacing: -0.2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .p3-proc-dash-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1px 5px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #059669;
      font-size: 7.5px;
      font-weight: 700;
      line-height: 1;
    }

    .p3-proc-dash-beacon {
      width: 4.5px;
      height: 4.5px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
      animation: p3ProcBeaconPulse 1.8s ease-in-out infinite;
    }

    @keyframes p3ProcBeaconPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.35); opacity: 0.6; }
    }

    .p3-proc-dash-body {
      position: relative;
      width: 100%;
      height: 123px;
      background: #0B0818;
      overflow: hidden;
    }

    .p3-proc-dash-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    /* Micro AI Insight Toast inside Dashboard */
    .p3-proc-dash-toast {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%) translateY(12px) scale(0.9);
      opacity: 0;
      background: rgba(15, 23, 42, 0.94);
      border: 1px solid rgba(168, 85, 247, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 7.5px;
      font-weight: 600;
      color: #FFFFFF;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      z-index: 8;
      pointer-events: none;
      animation: p3ProcDashToastCycle 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    .p3-proc-toast-sparkle {
      font-size: 8px;
      line-height: 1;
    }

    .p3-proc-toast-text {
      line-height: 1;
      letter-spacing: -0.1px;
    }

    /* 6. Module Cards (Quad Spoke Elements) */
    .p3-proc-card {
      position: absolute;
      width: 185px;
      min-height: 52px;
      padding: 6px 10px;
      background: #FFFFFF;
      border-radius: 12px;
      border: 1.5px solid #E2E8F0;
      box-shadow: 
        0 10px 25px -5px rgba(124, 58, 237, 0.12),
        0 0 0 1px rgba(255, 255, 255, 0.85);
      z-index: 6;
      display: flex;
      align-items: center;
      gap: 8px;
      will-change: transform, opacity, border-color, box-shadow;
      user-select: none;
    }

    .p3-proc-card-tl {
      top: 14px;
      left: 10px;
      animation: p3ProcCard1Cycle 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    .p3-proc-card-tr {
      top: 14px;
      right: 10px;
      animation: p3ProcCard2Cycle 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    .p3-proc-card-bl {
      bottom: 14px;
      left: 10px;
      animation: p3ProcCard3Cycle 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    .p3-proc-card-br {
      bottom: 14px;
      right: 10px;
      animation: p3ProcCard4Cycle 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    .p3-proc-card-icon-box {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .p3-proc-icon-purple {
      background: #EDE9FE;
      color: #7C3AED;
    }

    .p3-proc-icon-blue {
      background: #EFF6FF;
      color: #2563EB;
    }

    .p3-proc-icon-pink {
      background: #FDF2F8;
      color: #EC4899;
      animation: p3ProcSparkleBox 2.5s ease-in-out infinite;
    }

    @keyframes p3ProcSparkleBox {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(6deg); }
    }

    .p3-proc-icon-emerald {
      background: #ECFDF5;
      color: #10B981;
    }

    .p3-proc-card-body {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .p3-proc-card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
    }

    .p3-proc-card-tag {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    .p3-proc-tag-purple { color: #7C3AED; }
    .p3-proc-tag-blue { color: #2563EB; }
    .p3-proc-tag-pink { color: #EC4899; }
    .p3-proc-tag-emerald { color: #10B981; }

    .p3-proc-card-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #0F172A;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .p3-proc-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      margin-top: 1px;
      position: relative;
      min-height: 14px;
    }

    .p3-proc-card-sub {
      font-size: 8.5px;
      color: #64748B;
      white-space: nowrap;
    }

    /* Micro-interactions: Card 1 (Orientation) */
    .p3-proc-badge-check {
      display: inline-flex;
      align-items: center;
      font-size: 7.5px;
      font-weight: 700;
      color: #059669;
      background: rgba(16, 185, 129, 0.12);
      padding: 1px 5px;
      border-radius: 9999px;
      opacity: 0;
      transform: scale(0);
      will-change: transform, opacity;
      animation: p3ProcCheckmarkPop 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
    }

    .p3-proc-progress-track {
      width: 46px;
      height: 4px;
      background: #E2E8F0;
      border-radius: 9999px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .p3-proc-progress-bar {
      height: 100%;
      border-radius: 9999px;
      width: 0%;
      will-change: width;
    }

    .p3-proc-progress-purple {
      background: linear-gradient(90deg, #7C3AED, #A855F7);
      animation: p3ProcOnboardProgress 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    /* Micro-interactions: Card 2 (Department Tour) */
    .p3-proc-badge-blue {
      display: inline-flex;
      align-items: center;
      font-size: 7.5px;
      font-weight: 700;
      color: #0284C7;
      background: rgba(2, 132, 199, 0.1);
      padding: 1px 5px;
      border-radius: 9999px;
    }

    .p3-proc-avatar-stack {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .p3-proc-avatar {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      border: 1.5px solid #FFFFFF;
      font-size: 7px;
      font-weight: 700;
      display: grid;
      place-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-left: -4px;
      will-change: transform, opacity;
    }

    .p3-proc-av-1 {
      margin-left: 0;
      background: #EDE9FE;
      color: #7C3AED;
      animation: p3ProcAvatar1Pop 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
    }

    .p3-proc-av-2 {
      background: #EFF6FF;
      color: #2563EB;
      animation: p3ProcAvatar2Pop 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
    }

    .p3-proc-av-3 {
      background: #ECFDF5;
      color: #059669;
      animation: p3ProcAvatar3Pop 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
    }

    /* Micro-interactions: Card 3 (Ask HyIQ AI) */
    .p3-proc-badge-pink {
      display: inline-flex;
      align-items: center;
      font-size: 7.5px;
      font-weight: 700;
      color: #BE185D;
      background: rgba(236, 72, 153, 0.1);
      padding: 1px 5px;
      border-radius: 9999px;
    }

    .p3-proc-typewriter-container {
      display: inline-flex;
      align-items: center;
      max-width: 130px;
      overflow: hidden;
      white-space: nowrap;
    }

    .p3-proc-typewriter-text {
      font-size: 8px;
      color: #475569;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      animation: p3ProcTypewriterQuery 14s steps(22, end) infinite;
      will-change: width;
    }

    .p3-proc-typewriter-cursor {
      font-size: 8px;
      color: #EC4899;
      font-weight: 700;
      animation: p3ProcBlinkCursor 0.8s infinite;
      margin-left: 1px;
    }

    @keyframes p3ProcBlinkCursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .p3-proc-ai-response-pill {
      position: absolute;
      left: 0;
      top: 0;
      display: inline-flex;
      align-items: center;
      font-size: 7.5px;
      font-weight: 600;
      color: #9D174D;
      background: rgba(236, 72, 153, 0.12);
      border: 1px solid rgba(236, 72, 153, 0.28);
      border-radius: 9999px;
      padding: 1px 5px;
      white-space: nowrap;
      opacity: 0;
      will-change: opacity, transform;
      animation: p3ProcAiAnswerFade 14s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    /* Micro-interactions: Card 4 (1-on-1 Check-ins) */
    .p3-proc-badge-emerald {
      display: inline-flex;
      align-items: center;
      font-size: 7.5px;
      font-weight: 700;
      color: #047857;
      background: rgba(16, 185, 129, 0.12);
      padding: 1px 5px;
      border-radius: 9999px;
    }

    .p3-proc-date-pill {
      font-size: 8px;
      color: #059669;
      font-weight: 600;
      white-space: nowrap;
    }

    .p3-proc-goal-track {
      width: 44px;
      height: 4px;
      background: #E2E8F0;
      border-radius: 9999px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .p3-proc-goal-bar {
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #10B981, #059669);
      width: 0%;
      will-change: width;
      animation: p3ProcGoalProgress 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    /* ==========================================================================
       MASTER KEYFRAMES (14.0s SEQUENTIAL CYCLE)
       ========================================================================== */

    /* 1. Dashboard Master Cycle */
    @keyframes p3ProcDashCycle {
      0% {
        opacity: 0;
        transform: scale(0.92);
        box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.15);
      }
      6% {
        opacity: 1;
        transform: scale(1.02);
        box-shadow: 0 24px 50px -10px rgba(124, 58, 237, 0.35);
      }
      10% {
        opacity: 1;
        transform: scale(1.0);
        box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.28);
      }
      30% {
        transform: translateY(-2px) scale(1.0);
      }
      50% {
        transform: translateY(1.5px) scale(1.0);
      }
      70% {
        transform: translateY(0px) scale(1.0);
        box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.28);
      }
      80% {
        transform: translateY(-2px) scale(1.025);
        box-shadow: 
          0 30px 75px -10px rgba(124, 58, 237, 0.50),
          0 0 45px 6px rgba(124, 58, 237, 0.32),
          0 0 0 1.5px rgba(255, 255, 255, 0.95);
      }
      92% {
        transform: translateY(0px) scale(1.02);
        box-shadow: 
          0 30px 75px -10px rgba(124, 58, 237, 0.45),
          0 0 40px 4px rgba(124, 58, 237, 0.28);
        opacity: 1;
      }
      97% {
        opacity: 0.6;
        transform: scale(0.96);
        box-shadow: 0 14px 30px -6px rgba(124, 58, 237, 0.20);
      }
      100% {
        opacity: 0;
        transform: scale(0.92);
        box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.15);
      }
    }

    /* 2. Card 1 (Orientation) */
    @keyframes p3ProcCard1Cycle {
      0%, 15% {
        opacity: 0;
        transform: translate(-16px, -12px) scale(0.94);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      19% {
        opacity: 1;
        transform: translate(1px, 1px) scale(1.02);
        border-color: #7C3AED;
        box-shadow: 0 14px 32px -6px rgba(124, 58, 237, 0.32);
      }
      22% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(124, 58, 237, 0.5);
      }
      50% {
        transform: translate(0, -2px) scale(1.0);
      }
      75% {
        transform: translate(0, 1px) scale(1.0);
      }
      80% {
        transform: translate(-1px, -3px) scale(1.03);
        border-color: #7C3AED;
        box-shadow: 0 16px 36px -6px rgba(124, 58, 237, 0.38);
      }
      92% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(124, 58, 237, 0.5);
      }
      97% {
        opacity: 0.2;
        transform: translate(-12px, -8px) scale(0.96);
      }
      100% {
        opacity: 0;
        transform: translate(-16px, -12px) scale(0.94);
      }
    }

    /* 3. Card 2 (Department Tour) */
    @keyframes p3ProcCard2Cycle {
      0%, 32% {
        opacity: 0;
        transform: translate(16px, -12px) scale(0.94);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      36% {
        opacity: 1;
        transform: translate(-1px, 1px) scale(1.02);
        border-color: #3B82F6;
        box-shadow: 0 14px 32px -6px rgba(59, 130, 246, 0.32);
      }
      38% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(59, 130, 246, 0.5);
      }
      55% {
        transform: translate(0, -2px) scale(1.0);
      }
      75% {
        transform: translate(0, 1px) scale(1.0);
      }
      80% {
        transform: translate(1px, -3px) scale(1.03);
        border-color: #3B82F6;
        box-shadow: 0 16px 36px -6px rgba(59, 130, 246, 0.38);
      }
      92% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(59, 130, 246, 0.5);
      }
      97% {
        opacity: 0.2;
        transform: translate(12px, -8px) scale(0.96);
      }
      100% {
        opacity: 0;
        transform: translate(16px, -12px) scale(0.94);
      }
    }

    /* 4. Card 3 (Ask HyIQ AI) */
    @keyframes p3ProcCard3Cycle {
      0%, 48% {
        opacity: 0;
        transform: translate(-16px, 12px) scale(0.94);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      52% {
        opacity: 1;
        transform: translate(1px, -1px) scale(1.02);
        border-color: #EC4899;
        box-shadow: 0 14px 32px -6px rgba(236, 72, 153, 0.35);
      }
      54% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(236, 72, 153, 0.5);
      }
      65% {
        transform: translate(0, 2px) scale(1.0);
      }
      75% {
        transform: translate(0, -1px) scale(1.0);
      }
      80% {
        transform: translate(-1px, 3px) scale(1.03);
        border-color: #EC4899;
        box-shadow: 0 16px 36px -6px rgba(236, 72, 153, 0.40);
      }
      92% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(236, 72, 153, 0.5);
      }
      97% {
        opacity: 0.2;
        transform: translate(-12px, 8px) scale(0.96);
      }
      100% {
        opacity: 0;
        transform: translate(-16px, 12px) scale(0.94);
      }
    }

    /* 5. Card 4 (1-on-1 Check-ins) */
    @keyframes p3ProcCard4Cycle {
      0%, 64% {
        opacity: 0;
        transform: translate(16px, 12px) scale(0.94);
        border-color: #E2E8F0;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      }
      68% {
        opacity: 1;
        transform: translate(-1px, -1px) scale(1.02);
        border-color: #10B981;
        box-shadow: 0 14px 32px -6px rgba(16, 185, 129, 0.35);
      }
      70% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(16, 185, 129, 0.5);
      }
      75% {
        transform: translate(0, 2px) scale(1.0);
      }
      80% {
        transform: translate(1px, 3px) scale(1.03);
        border-color: #10B981;
        box-shadow: 0 16px 36px -6px rgba(16, 185, 129, 0.40);
      }
      92% {
        opacity: 1;
        transform: translate(0, 0) scale(1.0);
        border-color: rgba(16, 185, 129, 0.5);
      }
      97% {
        opacity: 0.2;
        transform: translate(12px, 8px) scale(0.96);
      }
      100% {
        opacity: 0;
        transform: translate(16px, 12px) scale(0.94);
      }
    }

    /* 6. Progressive Drawing of SVG Paths */
    @keyframes p3ProcPath1Draw {
      0%, 25% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      26% {
        opacity: 0.95;
      }
      31% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      78% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      80% {
        opacity: 1.0;
        stroke-width: 3.0px;
      }
      92% {
        opacity: 0.9;
        stroke-width: 2.8px;
        stroke-dashoffset: 0;
      }
      97% {
        opacity: 0.1;
        stroke-dashoffset: 0;
      }
      100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    @keyframes p3ProcPath2Draw {
      0%, 41% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      42% {
        opacity: 0.95;
      }
      47% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      78% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      80% {
        opacity: 1.0;
        stroke-width: 3.0px;
      }
      92% {
        opacity: 0.9;
        stroke-width: 2.8px;
        stroke-dashoffset: 0;
      }
      97% {
        opacity: 0.1;
        stroke-dashoffset: 0;
      }
      100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    @keyframes p3ProcPath3Draw {
      0%, 57% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      58% {
        opacity: 0.95;
      }
      63% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      78% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      80% {
        opacity: 1.0;
        stroke-width: 3.0px;
      }
      92% {
        opacity: 0.9;
        stroke-width: 2.8px;
        stroke-dashoffset: 0;
      }
      97% {
        opacity: 0.1;
        stroke-dashoffset: 0;
      }
      100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    @keyframes p3ProcPath4Draw {
      0%, 73% {
        stroke-dashoffset: 144;
        opacity: 0;
      }
      74% {
        opacity: 0.95;
      }
      79% {
        stroke-dashoffset: 0;
        opacity: 0.85;
      }
      78% {
        opacity: 0.85;
        stroke-width: 2.2px;
      }
      80% {
        opacity: 1.0;
        stroke-width: 3.0px;
      }
      92% {
        opacity: 0.9;
        stroke-width: 2.8px;
        stroke-dashoffset: 0;
      }
      97% {
        opacity: 0.1;
        stroke-dashoffset: 0;
      }
      100% {
        opacity: 0;
        stroke-dashoffset: 144;
      }
    }

    /* 7. Travelling Photonic Particles */
    @keyframes p3ProcParticle1Cycle {
      0%, 27% {
        offset-distance: 0%;
        opacity: 0;
        transform: scale(0.6);
      }
      28% {
        opacity: 1;
        transform: scale(1.2);
      }
      32% {
        offset-distance: 100%;
        opacity: 0.9;
        transform: scale(1);
      }
      33%, 79% {
        opacity: 0;
      }
      80% {
        offset-distance: 0%;
        opacity: 1;
      }
      86% {
        offset-distance: 100%;
        opacity: 0.8;
      }
      87%, 100% {
        opacity: 0;
      }
    }

    @keyframes p3ProcParticle2Cycle {
      0%, 43% {
        offset-distance: 0%;
        opacity: 0;
        transform: scale(0.6);
      }
      44% {
        opacity: 1;
        transform: scale(1.2);
      }
      48% {
        offset-distance: 100%;
        opacity: 0.9;
        transform: scale(1);
      }
      49%, 81% {
        opacity: 0;
      }
      82% {
        offset-distance: 0%;
        opacity: 1;
      }
      88% {
        offset-distance: 100%;
        opacity: 0.8;
      }
      89%, 100% {
        opacity: 0;
      }
    }

    @keyframes p3ProcParticle3Cycle {
      0%, 59% {
        offset-distance: 0%;
        opacity: 0;
        transform: scale(0.6);
      }
      60% {
        opacity: 1;
        transform: scale(1.2);
      }
      64% {
        offset-distance: 100%;
        opacity: 0.9;
        transform: scale(1);
      }
      65%, 83% {
        opacity: 0;
      }
      84% {
        offset-distance: 0%;
        opacity: 1;
      }
      90% {
        offset-distance: 100%;
        opacity: 0.8;
      }
      91%, 100% {
        opacity: 0;
      }
    }

    @keyframes p3ProcParticle4Cycle {
      0%, 75% {
        offset-distance: 0%;
        opacity: 0;
        transform: scale(0.6);
      }
      76% {
        opacity: 1;
        transform: scale(1.2);
      }
      80% {
        offset-distance: 100%;
        opacity: 0.9;
        transform: scale(1);
      }
      81%, 85% {
        opacity: 0;
      }
      86% {
        offset-distance: 0%;
        opacity: 1;
      }
      91% {
        offset-distance: 100%;
        opacity: 0.8;
      }
      92%, 100% {
        opacity: 0;
      }
    }

    /* 8. Micro-Interaction Keyframes */
    @keyframes p3ProcOnboardProgress {
      0%, 22% { width: 0%; }
      27%, 92% { width: 100%; }
      96%, 100% { width: 0%; }
    }

    @keyframes p3ProcCheckmarkPop {
      0%, 25% {
        opacity: 0;
        transform: scale(0);
      }
      27% {
        opacity: 1;
        transform: scale(1.2);
      }
      29%, 92% {
        opacity: 1;
        transform: scale(1);
      }
      95%, 100% {
        opacity: 0;
        transform: scale(0.8);
      }
    }

    @keyframes p3ProcAvatar1Pop {
      0%, 37% { opacity: 0; transform: scale(0); }
      39%, 92% { opacity: 1; transform: scale(1); }
      95%, 100% { opacity: 0; transform: scale(0); }
    }

    @keyframes p3ProcAvatar2Pop {
      0%, 39% { opacity: 0; transform: scale(0); }
      41%, 92% { opacity: 1; transform: scale(1); }
      95%, 100% { opacity: 0; transform: scale(0); }
    }

    @keyframes p3ProcAvatar3Pop {
      0%, 41% { opacity: 0; transform: scale(0); }
      43%, 92% { opacity: 1; transform: scale(1); }
      95%, 100% { opacity: 0; transform: scale(0); }
    }

    @keyframes p3ProcTypewriterQuery {
      0%, 53% { width: 0; }
      57%, 92% { width: 100%; }
      96%, 100% { width: 0; }
    }

    @keyframes p3ProcAiAnswerFade {
      0%, 58% {
        opacity: 0;
        transform: translateY(4px);
      }
      61%, 92% {
        opacity: 1;
        transform: translateY(0);
      }
      95%, 100% {
        opacity: 0;
        transform: translateY(4px);
      }
    }

    @keyframes p3ProcGoalProgress {
      0%, 70% { width: 0%; }
      75%, 92% { width: 85%; }
      96%, 100% { width: 0%; }
    }

    @keyframes p3ProcDashToastCycle {
      0%, 61% {
        opacity: 0;
        transform: translateX(-50%) translateY(10px) scale(0.9);
      }
      64% {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1.0);
      }
      90% {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1.0);
      }
      94%, 100% {
        opacity: 0;
        transform: translateX(-50%) translateY(8px) scale(0.9);
      }
    }

    /* 9. Responsive Adjustments */
    @media (max-width: 1024px) {
      #p3ProcessStage {
        transform: scale(0.94);
        transform-origin: center center;
      }
    }

    @media (max-width: 640px) {
      .v4-workflow-stage#p3ProcessStage {
        height: 280px;
      }
      #p3ProcessStage {
        transform: scale(0.76);
        transform-origin: center center;
      }
    }

    @media (max-width: 480px) {
      .v4-workflow-stage#p3ProcessStage {
        height: 270px;
      }
      #p3ProcessStage {
        transform: scale(0.68);
        transform-origin: center center;
      }
    }

    @media (max-width: 380px) {
      #p3ProcessStage {
        transform: scale(0.60);
        transform-origin: center center;
      }
    }

    /* 10. Reduced-Motion Accessibility Fallback */
    @media (prefers-reduced-motion: reduce) {
      .p3-proc-dashboard,
      .p3-proc-card,
      .p3-proc-track-active,
      .p3-proc-particle,
      .p3-proc-progress-bar,
      .p3-proc-badge-check,
      .p3-proc-avatar,
      .p3-proc-typewriter-text,
      .p3-proc-typewriter-cursor,
      .p3-proc-ai-response-pill,
      .p3-proc-goal-bar,
      .p3-proc-dash-toast,
      .p3-proc-dash-beacon,
      .p3-proc-icon-pink {
        animation: none !important;
        transition: none !important;
      }

      .p3-proc-dashboard {
        opacity: 1 !important;
        transform: none !important;
        box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.30) !important;
      }

      .p3-proc-card {
        opacity: 1 !important;
        transform: none !important;
        border-color: #E2E8F0 !important;
        box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.12) !important;
      }

      .p3-proc-track-active {
        stroke-dashoffset: 0 !important;
        opacity: 0.85 !important;
      }

      .p3-proc-particle {
        display: none !important;
      }

      .p3-proc-progress-bar {
        width: 100% !important;
      }

      .p3-proc-badge-check {
        opacity: 1 !important;
        transform: scale(1) !important;
      }

      .p3-proc-avatar {
        opacity: 1 !important;
        transform: scale(1) !important;
      }

      .p3-proc-typewriter-text {
        width: auto !important;
      }

      .p3-proc-typewriter-cursor {
        display: none !important;
      }

      .p3-proc-ai-response-pill {
        opacity: 1 !important;
        transform: none !important;
      }

      .p3-proc-goal-bar {
        width: 85% !important;
      }

      .p3-proc-dash-toast {
        opacity: 1 !important;
        transform: translateX(-50%) translateY(0) scale(1) !important;
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
                {activePage === 2 && (
                <Box
                  id="v4WorkflowStageLiving"
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
                  <Box
                    id="p2BentoDeck"
                    className="p2-bento-deck"
                    sx={{
                      transform: `perspective(1000px) rotateX(${v4Tilt.x * 0.6}deg) rotateY(${v4Tilt.y * 0.6}deg) translateZ(6px)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.15s ease-out',
                    }}
                  >
                    {/* Ambient Specular Glow Underlay */}
                    <div className="p2-bento-ambient-glow" aria-hidden="true" />

                    {/* Deck Chrome Header */}
                    <div className="p2-bento-chrome">
                      <div className="p2-bento-chrome-dots">
                        <span className="p2-bento-dot red" />
                        <span className="p2-bento-dot amber" />
                        <span className="p2-bento-dot green" />
                      </div>
                      <div className="p2-bento-chrome-title">
                        <span className="p2-bento-chrome-badge">BENTO OS 2.0</span>
                        <span className="p2-bento-chrome-url">app.hirerkey.com • Autonomous Command Deck</span>
                      </div>
                      <div className="p2-bento-chrome-status">
                        <span className="p2-bento-live-beacon" />
                        <span>LIVE TELEMETRY</span>
                      </div>
                    </div>

                    {/* Bento 2x2 Core Grid */}
                    <div className="p2-bento-grid">
                      {/* TILE 1: WORKFORCE VELOCITY & SINE SPARKLINE */}
                      <article className="p2-bento-tile p2-bento-tile-1" aria-label="Workforce Growth and Velocity">
                        <div className="p2-bento-tile-header">
                          <div className="p2-bento-badge cyan">
                            <span className="p2-bento-badge-dot" />
                            <span>GROWTH METRICS</span>
                          </div>
                          <span className="p2-bento-retention-pill">98.4% Retained</span>
                        </div>

                        <div className="p2-bento-kpi-row">
                          <div className="p2-bento-kpi-val">1,248</div>
                          <div className="p2-bento-trend-badge">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                              <polyline points="18 15 12 9 6 15" />
                            </svg>
                            <span>+14.2%</span>
                          </div>
                        </div>
                        <div className="p2-bento-kpi-sub">Active Global Headcount (MoM)</div>

                        {/* Animated Sine Sparkline Chart Canvas */}
                        <div className="p2-bento-sparkline-canvas">
                          <svg className="p2-bento-sparkline-svg" viewBox="0 0 240 38" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="p2SparklineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.9} />
                                <stop offset="50%" stopColor="#8B5CF6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#10B981" stopOpacity={1} />
                              </linearGradient>
                              <linearGradient id="p2SparklineFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.28} />
                                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
                              </linearGradient>
                              <filter id="p2NeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation={2} result="blur" />
                                <feMerge>
                                  <feMergeNode in="blur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>
                            <path className="p2-bento-sparkline-fill" d="M 0 32 Q 35 30 65 20 T 130 16 T 195 8 T 240 4 L 240 38 L 0 38 Z" />
                            <path className="p2-bento-sparkline-path" pathLength={280} d="M 0 32 Q 35 30 65 20 T 130 16 T 195 8 T 240 4" />
                          </svg>
                          <div className="p2-bento-sparkline-cursor" aria-hidden="true" />
                          <div className="p2-bento-sparkline-scan-beam" aria-hidden="true" />
                        </div>
                      </article>

                      {/* TILE 2: HyIQ™ AUTONOMOUS COPILOT */}
                      <article className="p2-bento-tile p2-bento-tile-2" aria-label="HyIQ Autonomous Copilot">
                        <div className="p2-bento-tile-header">
                          <div className="p2-bento-ai-brand">
                            <div className="p2-bento-ai-orb">
                              <div className="p2-bento-ai-halo-1" />
                              <div className="p2-bento-ai-halo-2" />
                              <span className="p2-bento-ai-icon">✨</span>
                            </div>
                            <div className="p2-bento-ai-meta">
                              <span className="p2-bento-ai-title">HyIQ™ Copilot</span>
                              <span className="p2-bento-ai-sub">Autonomous Mode</span>
                            </div>
                          </div>
                          {/* 5 Dancing Audio EQ Frequency Bars */}
                          <div className="p2-bento-eq-cluster" aria-hidden="true">
                            <span className="p2-bento-eq-bar bar-1" />
                            <span className="p2-bento-eq-bar bar-2" />
                            <span className="p2-bento-eq-bar bar-3" />
                            <span className="p2-bento-eq-bar bar-4" />
                            <span className="p2-bento-eq-bar bar-5" />
                          </div>
                        </div>

                        {/* Cycling AI Insight Stream */}
                        <div className="p2-bento-insight-viewport">
                          <div className="p2-bento-insight-item insight-1">
                            <span className="p2-bento-insight-bullet">✦</span>
                            <span className="p2-bento-insight-text">34 Onboarding milestones auto-verified</span>
                          </div>
                          <div className="p2-bento-insight-item insight-2">
                            <span className="p2-bento-insight-bullet">✦</span>
                            <span className="p2-bento-insight-text">Cross-dept 1-on-1 schedule synthesized</span>
                          </div>
                          <div className="p2-bento-insight-item insight-3">
                            <span className="p2-bento-insight-bullet">✦</span>
                            <span className="p2-bento-insight-text">Real-time payroll anomalies: 0 detected</span>
                          </div>
                        </div>

                        {/* Stream Progress Pips */}
                        <div className="p2-bento-insight-pips" aria-hidden="true">
                          <span className="p2-bento-insight-pip pip-1" />
                          <span className="p2-bento-insight-pip pip-2" />
                          <span className="p2-bento-insight-pip pip-3" />
                        </div>
                      </article>

                      {/* TILE 3: LIVE COMPLIANCE & APPROVAL RADAR */}
                      <article className="p2-bento-tile p2-bento-tile-3" aria-label="Smart Approvals Radar">
                        <div className="p2-bento-radar-layout">
                          {/* Circular Radar HUD Display */}
                          <div className="p2-bento-radar-screen">
                            <div className="p2-bento-radar-ring ring-1" />
                            <div className="p2-bento-radar-ring ring-2" />
                            <div className="p2-bento-radar-ring ring-3" />
                            <div className="p2-bento-radar-crosshair-h" />
                            <div className="p2-bento-radar-crosshair-v" />

                            {/* 360° Conic Sweep Beam */}
                            <div className="p2-bento-radar-beam" aria-hidden="true" />

                            {/* Radar Target Blips */}
                            <div className="p2-bento-radar-blip blip-pto" title="Time-off Approved">
                              <span className="p2-bento-blip-dot" />
                              <span className="p2-bento-blip-ripple" />
                              <span className="p2-bento-blip-tag">PTO ✓</span>
                            </div>
                            <div className="p2-bento-radar-blip blip-gear" title="Equipment Authorized">
                              <span className="p2-bento-blip-dot" />
                              <span className="p2-bento-blip-ripple" />
                              <span className="p2-bento-blip-tag">M3 Max ✓</span>
                            </div>
                          </div>

                          {/* Radar Telemetry & Key Metric */}
                          <div className="p2-bento-radar-meta">
                            <div className="p2-bento-badge emerald">
                              <span className="p2-bento-badge-dot" />
                              <span>SMART RADAR</span>
                            </div>
                            <div className="p2-bento-radar-kpi">4.2 <span className="p2-bento-radar-unit">min</span></div>
                            <div className="p2-bento-radar-sub">Avg Approval Turnaround</div>
                            <div className="p2-bento-radar-stat-pill">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={3}>
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>99.8% auto-cleared</span>
                            </div>
                          </div>
                        </div>
                      </article>

                      {/* TILE 4: CULTURE & ENGAGEMENT PULSE */}
                      <article className="p2-bento-tile p2-bento-tile-4" aria-label="Team Alignment and Sentiment">
                        <div className="p2-bento-tile-header">
                          <div className="p2-bento-badge rose">
                            <span className="p2-bento-badge-dot" />
                            <span>SENTIMENT PULSE</span>
                          </div>
                          <span className="p2-bento-sentiment-pill">96% Vibe</span>
                        </div>

                        <div className="p2-bento-sentiment-body">
                          {/* Radial SVG Arc Gauge (96% eNPS) */}
                          <div className="p2-bento-gauge-wrap">
                            <svg className="p2-bento-gauge-svg" viewBox="0 0 64 64">
                              <defs>
                                <linearGradient id="p2GaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#F43F5E" />
                                  <stop offset="50%" stopColor="#F59E0B" />
                                  <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                              </defs>
                              <circle className="p2-bento-gauge-track" cx="32" cy="32" r="26" />
                              <circle className="p2-bento-gauge-fill" cx="32" cy="32" r="26" pathLength={100} />
                            </svg>
                            <div className="p2-bento-gauge-center">
                              <span className="p2-bento-gauge-val">96%</span>
                              <span className="p2-bento-gauge-sub">eNPS</span>
                            </div>
                          </div>

                          {/* Avatar Stack & Reactions */}
                          <div className="p2-bento-sentiment-right">
                            <div className="p2-bento-avatar-stack">
                              <div className="p2-bento-micro-avatar av-1" title="Aisha K.">AK<span className="p2-bento-av-dot" /></div>
                              <div className="p2-bento-micro-avatar av-2" title="Rahul S.">RS<span className="p2-bento-av-dot" /></div>
                              <div className="p2-bento-micro-avatar av-3" title="Sara J.">SJ<span className="p2-bento-av-dot" /></div>
                            </div>
                            <div className="p2-bento-sentiment-sub">100% Weekly Participation</div>

                            {/* Floating Celebration Reactions */}
                            <div className="p2-bento-reaction-float r-party" aria-hidden="true">🎉</div>
                            <div className="p2-bento-reaction-float r-rocket" aria-hidden="true">🚀</div>
                            <div className="p2-bento-reaction-float r-heart" aria-hidden="true">❤️</div>
                          </div>
                        </div>
                      </article>
                    </div>

                    {/* TILE 5: REAL-TIME OPERATIONS MARQUEE STREAM */}
                    <div className="p2-bento-tile-5 p2-bento-ticker-tile" aria-label="Real-time Operations Stream">
                      <div className="p2-bento-ticker-label">
                        <span className="p2-bento-ticker-dot" />
                        <span>LIVE OPS</span>
                      </div>
                      <div className="p2-bento-ticker-window">
                        <div className="p2-bento-ticker-track">
                          {/* Loop items sequence */}
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric green" />Alex C. completed Day 1 Orientation</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric cyan" />Smart Contract: Equity grant auto-executed</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric purple" />HyIQ synthesized 18 performance reviews in 3.4s</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric emerald" />Sara J. PTO approved instantly (Manager AI-proxy)</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric amber" />Global Headcount milestone unlocked: 1,248</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          {/* Cloned seamless duplicate */}
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric green" />Alex C. completed Day 1 Orientation</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric cyan" />Smart Contract: Equity grant auto-executed</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric purple" />HyIQ synthesized 18 performance reviews in 3.4s</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric emerald" />Sara J. PTO approved instantly (Manager AI-proxy)</span>
                          <span className="p2-bento-ticker-sep">•</span>
                          <span className="p2-bento-ticker-item"><span className="p2-bento-ticker-dot-metric amber" />Global Headcount milestone unlocked: 1,248</span>
                        </div>
                      </div>
                    </div>
                  </Box>
                </Box>
                )}
                {activePage === 3 && (
                <Box
                  id="p3ProcessStage"
                  className="v4-workflow-stage"
                  onMouseMove={handleV4MouseMove}
                  onMouseLeave={handleV4MouseLeave}
                  aria-label="Hirerkey Connected HR Ecosystem Process Hero"
                  sx={{
                    width: '100%',
                    maxWidth: 540,
                    height: 350,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: 1000,
                    overflow: 'hidden',
                    mt: 0.75,
                    contain: 'layout paint style',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Subtle Technical Grid Background with Radial Mask */}
                  <div className="p3-proc-grid-bg" />

                  {/* Ambient Underlay Radial Glow Bloom */}
                  <div className="p3-proc-ambient" />

                  {/* SVG Connectors & Photonic Particles Layer */}
                  <svg className="p3-proc-svg" viewBox="0 0 540 350" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="p3ProcGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="p3ProcGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="p3ProcGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="p3ProcGrad4" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
                      </linearGradient>
                      <filter id="p3ProcFlowGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Base Ambient Dashed Guide Tracks */}
                    <path className="p3-proc-track-base" d="M 160 75 C 210 75, 230 145, 270 160" />
                    <path className="p3-proc-track-base" d="M 380 75 C 330 75, 310 145, 270 160" />
                    <path className="p3-proc-track-base" d="M 160 275 C 210 275, 230 205, 270 190" />
                    <path className="p3-proc-track-base" d="M 380 275 C 330 275, 310 205, 270 190" />

                    {/* Dynamic Active Connector Flow Lines */}
                    <path className="p3-proc-track-active p3-proc-line-1" id="p3ProcLine1" stroke="url(#p3ProcGrad1)" filter="url(#p3ProcFlowGlow)" d="M 160 75 C 210 75, 230 145, 270 160" />
                    <path className="p3-proc-track-active p3-proc-line-2" id="p3ProcLine2" stroke="url(#p3ProcGrad2)" filter="url(#p3ProcFlowGlow)" d="M 380 75 C 330 75, 310 145, 270 160" />
                    <path className="p3-proc-track-active p3-proc-line-3" id="p3ProcLine3" stroke="url(#p3ProcGrad3)" filter="url(#p3ProcFlowGlow)" d="M 160 275 C 210 275, 230 205, 270 190" />
                    <path className="p3-proc-track-active p3-proc-line-4" id="p3ProcLine4" stroke="url(#p3ProcGrad4)" filter="url(#p3ProcFlowGlow)" d="M 380 275 C 330 275, 310 205, 270 190" />
                  </svg>

                  {/* Travelling Photonic Light Particles */}
                  <div className="p3-proc-particle p3-proc-particle-1" />
                  <div className="p3-proc-particle p3-proc-particle-2" />
                  <div className="p3-proc-particle p3-proc-particle-3" />
                  <div className="p3-proc-particle p3-proc-particle-4" />

                  {/* CENTRAL MINIATURE DASHBOARD (Living Command Center Anchor) */}
                  <Box
                    id="p3DashboardAnchor"
                    className="p3-proc-dashboard"
                    style={{
                      transform: (v4Tilt.x || v4Tilt.y) ? `perspective(800px) rotateX(${v4Tilt.x * 0.8}deg) rotateY(${v4Tilt.y * 0.8}deg) translateZ(10px)` : undefined,
                    }}
                  >
                    <div className="p3-proc-dash-chrome">
                      <div className="p3-proc-dash-dots">
                        <span className="p3-proc-dash-dot-red" />
                        <span className="p3-proc-dash-dot-amber" />
                        <span className="p3-proc-dash-dot-green" />
                      </div>
                      <div className="p3-proc-dash-url">app.hirerkey.com</div>
                      <div className="p3-proc-dash-badge">
                        <span className="p3-proc-dash-beacon" />
                        <span>Live</span>
                      </div>
                    </div>
                    <div className="p3-proc-dash-body">
                      <img
                        src="assets/hirerkey_actual_dashboard.png"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.retry) {
                            target.dataset.retry = '1';
                            target.src = 'views/assets/hirerkey_actual_dashboard.png';
                          }
                        }}
                        alt="Hirerkey Executive Workspace"
                        className="p3-proc-dash-img"
                      />
                      
                      {/* Micro AI Insight Toast */}
                      <div className="p3-proc-dash-toast" id="p3DashToast">
                        <span className="p3-proc-toast-sparkle">✨</span>
                        <span className="p3-proc-toast-text">3 reviews synchronized</span>
                      </div>
                    </div>
                  </Box>

                  {/* CARD 1: ORIENTATION (Top-Left) */}
                  <div className="p3-proc-card p3-proc-card-tl" id="p3CardOrientation">
                    <div className="p3-proc-card-icon-box p3-proc-icon-purple">🧭</div>
                    <div className="p3-proc-card-body">
                      <div className="p3-proc-card-meta">
                        <span className="p3-proc-card-tag p3-proc-tag-purple">01 • ONBOARDING</span>
                        <span className="p3-proc-badge-check" id="p3Card1Check">✓ Completed</span>
                      </div>
                      <div className="p3-proc-card-title">Orientation</div>
                      <div className="p3-proc-card-footer">
                        <span className="p3-proc-card-sub">Welcome aboard!</span>
                        <div className="p3-proc-progress-track">
                          <div className="p3-proc-progress-bar p3-proc-progress-purple" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: DEPARTMENT TOUR (Top-Right) */}
                  <div className="p3-proc-card p3-proc-card-tr" id="p3CardTour">
                    <div className="p3-proc-card-icon-box p3-proc-icon-blue">🏢</div>
                    <div className="p3-proc-card-body">
                      <div className="p3-proc-card-meta">
                        <span className="p3-proc-card-tag p3-proc-tag-blue">02 • ALIGNMENT</span>
                        <span className="p3-proc-badge-blue">3/3 Met ✓</span>
                      </div>
                      <div className="p3-proc-card-title">Department Tour</div>
                      <div className="p3-proc-card-footer">
                        <span className="p3-proc-card-sub">Meet your team</span>
                        <div className="p3-proc-avatar-stack">
                          <span className="p3-proc-avatar p3-proc-av-1" title="Aisha K.">AK</span>
                          <span className="p3-proc-avatar p3-proc-av-2" title="Rahul S.">RS</span>
                          <span className="p3-proc-avatar p3-proc-av-3" title="Sara J.">SJ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: ASK HyIQ AI (Bottom-Left) */}
                  <div className="p3-proc-card p3-proc-card-bl" id="p3CardHyiq">
                    <div className="p3-proc-card-icon-box p3-proc-icon-pink">✨</div>
                    <div className="p3-proc-card-body">
                      <div className="p3-proc-card-meta">
                        <span className="p3-proc-card-tag p3-proc-tag-pink">03 • INTELLIGENCE</span>
                        <span className="p3-proc-badge-pink">12ms • AI</span>
                      </div>
                      <div className="p3-proc-card-title">Ask HyIQ™ AI</div>
                      <div className="p3-proc-card-footer">
                        <div className="p3-proc-typewriter-container">
                          <span className="p3-proc-typewriter-text">Show my pending tasks</span><span className="p3-proc-typewriter-cursor">|</span>
                        </div>
                        <div className="p3-proc-ai-response-pill">
                          <span>✨ 3 reviews due today</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: 1-ON-1 CHECK-INS (Bottom-Right) */}
                  <div className="p3-proc-card p3-proc-card-br" id="p3CardCheckin">
                    <div className="p3-proc-card-icon-box p3-proc-icon-emerald">📊</div>
                    <div className="p3-proc-card-body">
                      <div className="p3-proc-card-meta">
                        <span className="p3-proc-card-tag p3-proc-tag-emerald">04 • PERFORMANCE</span>
                        <span className="p3-proc-badge-emerald">85% On Track</span>
                      </div>
                      <div className="p3-proc-card-title">1-on-1 Check-ins</div>
                      <div className="p3-proc-card-footer">
                        <span className="p3-proc-date-pill">📅 Thu, 2:30 PM</span>
                        <div className="p3-proc-goal-track">
                          <div className="p3-proc-goal-bar" />
                        </div>
                      </div>
                    </div>
                  </div>
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
          onClick={() => setActivePage(2)}
          aria-label="Page 2: The Living Dashboard"
          title="The Living Dashboard (Key 2)"
          sx={{
            appearance: 'none',
            border: activePage === 2 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 2 ? '#FFFFFF' : 'transparent',
            color: activePage === 2 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 2 ? 700 : 600,
            boxShadow: activePage === 2 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
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
              bgcolor: activePage === 2 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>②</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Living Dashboard</Box>
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
              bgcolor: activePage === 2 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 2 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 2 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            2
          </Box>
        </Box>

        <Box sx={{ width: '1px', height: '18px', bgcolor: '#E2E8F0' }} />

        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(3)}
          aria-label="Page 3: The Process-Based Connected HR Ecosystem"
          title="The Process-Based Connected HR Ecosystem (Key 3)"
          sx={{
            appearance: 'none',
            border: activePage === 3 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 3 ? '#FFFFFF' : 'transparent',
            color: activePage === 3 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 3 ? 700 : 600,
            boxShadow: activePage === 3 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
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
              bgcolor: activePage === 3 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>③</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Process Flow</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              fontSize: '9px',
              fontWeight: 800,
              px: '6px',
              py: '1.5px',
              borderRadius: '9999px',
              bgcolor: '#EDE9FE',
              color: '#7C3AED',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            3D Stack
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
              bgcolor: activePage === 3 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 3 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 3 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            3
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
