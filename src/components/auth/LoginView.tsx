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
  const [activePage, setActivePage] = useState<1 | 2 | 3>((defaultView === 3 ? 3 : defaultView === 2 ? 2 : 1) as 1 | 2 | 3);

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
      } else if (e.key === 'ArrowLeft') {
        setActivePage((prev) => (prev === 1 ? 3 : ((prev - 1) as 1 | 2 | 3)));
      } else if (e.key === 'ArrowRight') {
        setActivePage((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)));
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
                 PAGE 2: THE LIVING DASHBOARD — 12.0s MASTER ANIMATION SYSTEM
                 ========================================================================== */
              .v4-mini-dashboard-living {
                position: absolute;
                z-index: 5;
                width: 254px;
                min-height: 184px;
                background: #FFFFFF;
                border-radius: 14px;
                border: 1px solid rgba(124, 58, 237, 0.28);
                box-shadow: 
                  0 20px 45px -10px rgba(124, 58, 237, 0.32),
                  0 8px 20px -4px rgba(15, 23, 42, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.9);
                overflow: hidden;
                animation: ldFrameMaster 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
                will-change: transform, box-shadow;
                user-select: none;
              }

              .v4-ld-chrome {
                padding: 5px 9px;
                background: #F8FAFC;
                border-bottom: 1px solid #E2E8F0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 23px;
              }

              .v4-ld-traffic-dots {
                display: flex;
                align-items: center;
                gap: 3.5px;
              }

              .v4-ld-dot {
                width: 5.5px;
                height: 5.5px;
                border-radius: 50%;
                display: inline-block;
              }
              .v4-ld-dot.red { background: #EF4444; }
              .v4-ld-dot.amber { background: #F59E0B; }
              .v4-ld-dot.green { background: #10B981; }

              .v4-ld-chrome-title {
                font-size: 8px;
                color: #64748B;
                font-family: monospace;
                letter-spacing: 0.02em;
              }

              .v4-ld-live-chip {
                display: inline-flex;
                align-items: center;
                gap: 3px;
                padding: 1.5px 5px;
                border-radius: 9999px;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                color: #059669;
                font-size: 7.5px;
                font-weight: 700;
              }

              .v4-ld-live-dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #10B981;
                box-shadow: 0 0 4px #10B981;
                animation: v4DotPulse 1.8s infinite;
                display: inline-block;
              }

              .v4-ld-body {
                position: relative;
                background: #FFFFFF;
                padding: 6px;
                min-height: 158px;
                display: flex;
                flex-direction: column;
              }

              .v4-ld-broadcast-toast {
                position: absolute;
                top: 6px;
                left: 6px;
                right: 6px;
                z-index: 20;
                background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
                color: #FFFFFF;
                border-radius: 8px;
                padding: 4px 8px;
                display: flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 8px 20px -2px rgba(124, 58, 237, 0.42);
                opacity: 0;
                transform: translateY(-16px) scale(0.92);
                pointer-events: none;
                animation: ldBroadcastSlide 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }

              .v4-ld-toast-icon { font-size: 11px; flex-shrink: 0; }
              .v4-ld-toast-text { display: flex; align-items: baseline; gap: 4px; flex: 1; min-width: 0; }
              .v4-ld-toast-badge {
                font-size: 7px;
                font-weight: 800;
                background: rgba(255, 255, 255, 0.25);
                padding: 1px 3.5px;
                border-radius: 3px;
                letter-spacing: 0.04em;
                flex-shrink: 0;
              }
              .v4-ld-toast-msg {
                font-size: 8px;
                font-weight: 600;
                color: #FFFFFF;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .v4-ld-toast-check {
                font-size: 8px;
                font-weight: 800;
                color: #D1FAE5;
                background: rgba(16, 185, 129, 0.25);
                width: 13px;
                height: 13px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
              }

              .v4-ld-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
                flex: 1;
              }

              .v4-ld-widget {
                background: #F8FAFC;
                border: 1px solid #E2E8F0;
                border-radius: 8px;
                padding: 5px 6px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
                min-height: 70px;
              }

              .v4-ld-w-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2px;
              }

              .v4-ld-w-title {
                font-size: 9px;
                font-weight: 700;
                color: #0F172A;
                display: inline-flex;
                align-items: center;
                gap: 3px;
                white-space: nowrap;
              }

              .v4-ld-w-icon { font-size: 9px; }
              .v4-ld-w-sub {
                font-size: 7.5px;
                color: #64748B;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 3px;
              }

              .v4-ld-badge-wrap {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: flex-end;
                height: 15px;
                min-width: 58px;
              }

              .v4-ld-pill-progress {
                font-size: 7.5px;
                font-weight: 700;
                padding: 1px 5px;
                border-radius: 9999px;
                background: #EDE9FE;
                color: #7C3AED;
                animation: ldPillProgress 12s ease infinite;
              }

              .v4-ld-pill-completed {
                position: absolute;
                top: 0;
                right: 0;
                font-size: 7.5px;
                font-weight: 700;
                padding: 1px 5px;
                border-radius: 9999px;
                background: #D1FAE5;
                color: #059669;
                opacity: 0;
                animation: ldPillCompleted 12s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
              }

              .v4-ld-bar-track-wrap {
                display: flex;
                align-items: center;
                gap: 4px;
              }

              .v4-ld-progress-bar-bg {
                flex: 1;
                height: 4px;
                border-radius: 9999px;
                background: #E2E8F0;
                overflow: hidden;
              }

              .v4-ld-progress-bar-fill {
                height: 100%;
                width: 65%;
                border-radius: 9999px;
                background: linear-gradient(90deg, #7C3AED, #9333EA);
                animation: ldOnboardFill 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                will-change: width, background;
              }

              .v4-ld-progress-pct {
                font-size: 7.5px;
                font-weight: 700;
                color: #64748B;
                min-width: 18px;
                text-align: right;
                animation: ldProgressPctColor 12s ease infinite;
              }

              .v4-ld-kpi-wrap {
                position: relative;
                overflow: hidden;
                display: inline-flex;
                align-items: center;
                border-radius: 4px;
                padding: 0 3px;
              }

              .v4-ld-kpi-val {
                font-size: 9.5px;
                font-weight: 800;
                color: #0F172A;
                animation: ldKpiValUpdate 12s ease infinite;
              }

              .v4-ld-kpi-sheen {
                position: absolute;
                inset: 0;
                background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.8) 50%, transparent 80%);
                transform: translateX(-100%);
                pointer-events: none;
                animation: ldSheenSweep 12s linear infinite;
              }

              .v4-ld-chart-bars {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                height: 32px;
                padding: 2px 2px 0 2px;
                gap: 3px;
              }

              .v4-ld-micro-col {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                flex: 1;
                height: 100%;
                justify-content: flex-end;
              }

              .v4-ld-micro-track {
                width: 100%;
                max-width: 10px;
                height: 22px;
                background: #E2E8F0;
                border-radius: 2px;
                display: flex;
                align-items: flex-end;
                overflow: hidden;
              }

              .v4-ld-micro-fill {
                width: 100%;
                border-radius: 2px;
                background: linear-gradient(180deg, #A855F7 0%, #7C3AED 100%);
                will-change: height;
              }

              .v4-ld-micro-fill.bar-1 { height: 42%; animation: ldBar1Rise 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
              .v4-ld-micro-fill.bar-2 { height: 50%; animation: ldBar2Rise 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
              .v4-ld-micro-fill.bar-3 { height: 45%; animation: ldBar3Rise 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
              .v4-ld-micro-fill.bar-4 { height: 58%; animation: ldBar4Rise 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
              .v4-ld-micro-fill.bar-5 { height: 52%; animation: ldBar5Rise 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

              .v4-ld-micro-lbl {
                font-size: 6.5px;
                font-weight: 700;
                color: #94A3B8;
              }

              .v4-ld-pill-pending {
                font-size: 7.5px;
                font-weight: 700;
                padding: 1px 5px;
                border-radius: 9999px;
                background: #FEF3C7;
                color: #D97706;
                animation: ldPillPending 12s ease infinite;
              }

              .v4-ld-pill-approved {
                position: absolute;
                top: 0;
                right: 0;
                font-size: 7.5px;
                font-weight: 700;
                padding: 1px 5px;
                border-radius: 9999px;
                background: #D1FAE5;
                color: #059669;
                opacity: 0;
                animation: ldPillApproved 12s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
              }

              .v4-ld-approval-actions {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 2px;
              }

              .v4-ld-action-tag {
                font-size: 7px;
                color: #94A3B8;
                font-weight: 600;
              }

              .v4-ld-btn-approve {
                appearance: none;
                border: none;
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                color: #FFFFFF;
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 7.5px;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 2px;
                cursor: pointer;
                box-shadow: 0 1px 4px rgba(16, 185, 129, 0.25);
                animation: ldApprovalBtnPress 12s ease infinite;
              }

              .v4-ld-widget-hyiq {
                background: #FAF5FF;
                border-color: rgba(216, 180, 254, 0.6);
                animation: ldHyiqGlow 12s ease infinite;
              }

              .v4-ld-hyiq-pill {
                display: inline-flex;
                align-items: center;
                gap: 3px;
                padding: 1px 5px;
                border-radius: 9999px;
                background: #FFFFFF;
                border: 1px solid rgba(216, 180, 254, 0.7);
                font-size: 8px;
                font-weight: 700;
                color: #7C3AED;
              }

              .v4-ld-sparkle { font-size: 8px; display: inline-block; }

              .v4-ld-hyiq-stage {
                position: relative;
                flex: 1;
                min-height: 28px;
                display: flex;
                align-items: center;
                margin-top: 2px;
              }

              .v4-ld-hyiq-query {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                animation: ldQueryFade 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }

              .v4-ld-hyiq-query span {
                font-size: 7.5px;
                font-style: italic;
                color: #64748B;
                background: #FFFFFF;
                border: 1px solid #E2E8F0;
                border-radius: 4px;
                padding: 2px 5px;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
              }

              .v4-ld-typing-dots {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                gap: 3px;
                padding-left: 4px;
                opacity: 0;
                animation: ldTypingDots 12s ease infinite;
              }

              .v4-ld-typing-dots span {
                width: 3.5px;
                height: 3.5px;
                border-radius: 50%;
                background: #7C3AED;
                animation: ldDotBounce 0.75s ease-in-out infinite;
              }
              .v4-ld-typing-dots span:nth-child(2) { animation-delay: 0.15s; }
              .v4-ld-typing-dots span:nth-child(3) { animation-delay: 0.3s; }

              .v4-ld-hyiq-toast {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 3px 6px;
                border-radius: 5px;
                background: linear-gradient(135deg, rgba(124, 58, 237, 0.95) 0%, rgba(109, 40, 217, 0.98) 100%);
                color: #FFFFFF;
                font-size: 7px;
                font-weight: 600;
                line-height: 1.2;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
                animation: ldToastReveal 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }

              .v4-ld-hyiq-sheen {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 50%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                transform: translateX(-100%);
                pointer-events: none;
                animation: ldAiShimmer 12s linear infinite;
              }

              .v4-ld-toast-sparkle {
                font-size: 8px;
                color: #F472B6;
                flex-shrink: 0;
              }

              .v4-ld-hyiq-ans {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              /* 12.0s Keyframe Animations */
              @keyframes ldFrameMaster {
                0% { opacity: 0.94; transform: scale(0.97) translateY(2px); box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24); }
                8.33% { opacity: 1; transform: scale(1.008) translateY(-2px); box-shadow: 0 24px 50px -10px rgba(124, 58, 237, 0.36); }
                12.5% { opacity: 1; transform: scale(1.0) translateY(0); box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.28); }
                25% { transform: scale(1.0) translateY(-1px); }
                37.5% { transform: scale(1.0) translateY(0); }
                50% { transform: scale(1.0) translateY(-1px); }
                62.5% { transform: scale(1.0) translateY(0); }
                75% { transform: scale(1.01) translateY(-2px); box-shadow: 0 28px 60px -10px rgba(124, 58, 237, 0.42), 0 0 30px rgba(124, 58, 237, 0.22); }
                87.5% { transform: scale(1.0) translateY(0); box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.28); }
                96% { opacity: 1; transform: scale(0.985) translateY(1px); box-shadow: 0 18px 40px -8px rgba(124, 58, 237, 0.24); }
                100% { opacity: 0.94; transform: scale(0.97) translateY(2px); box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24); }
              }

              @keyframes ldOnboardFill {
                0%, 12.5% { width: 65%; background: linear-gradient(90deg, #7C3AED, #9333EA); }
                15% { width: 68%; }
                23% { width: 100%; background: linear-gradient(90deg, #10B981, #059669); }
                25%, 82% { width: 100%; background: linear-gradient(90deg, #10B981, #059669); }
                90%, 100% { width: 65%; background: linear-gradient(90deg, #7C3AED, #9333EA); }
              }

              @keyframes ldPillProgress {
                0%, 15% { opacity: 1; transform: scale(1); }
                18% { opacity: 0; transform: scale(0.85); }
                86% { opacity: 0; transform: scale(0.85); }
                90%, 100% { opacity: 1; transform: scale(1); }
              }

              @keyframes ldPillCompleted {
                0%, 16% { opacity: 0; transform: scale(0.7); }
                20% { opacity: 1; transform: scale(1.15); }
                23%, 82% { opacity: 1; transform: scale(1); }
                87% { opacity: 0; transform: scale(0.85); }
                100% { opacity: 0; transform: scale(0.7); }
              }

              @keyframes ldProgressPctColor {
                0%, 15% { color: #64748B; }
                23%, 82% { color: #059669; }
                90%, 100% { color: #64748B; }
              }

              @keyframes ldBroadcastSlide {
                0%, 24% { opacity: 0; transform: translateY(-16px) scale(0.92); pointer-events: none; }
                26.5% { opacity: 1; transform: translateY(0) scale(1.0); pointer-events: auto; }
                34% { opacity: 1; transform: translateY(0) scale(1.0); }
                37% { opacity: 0; transform: translateY(-8px) scale(0.96); pointer-events: none; }
                100% { opacity: 0; transform: translateY(-16px) scale(0.92); pointer-events: none; }
              }

              @keyframes ldApprovalBtnPress {
                0%, 38% { transform: scale(1); opacity: 1; }
                40% { transform: scale(0.88); }
                42.5% { transform: scale(1); opacity: 0.25; pointer-events: none; }
                84% { opacity: 0.25; }
                89%, 100% { transform: scale(1); opacity: 1; pointer-events: auto; }
              }

              @keyframes ldPillPending {
                0%, 39% { opacity: 1; transform: scale(1); }
                42% { opacity: 0; transform: scale(0.85); }
                85% { opacity: 0; transform: scale(0.85); }
                89%, 100% { opacity: 1; transform: scale(1); }
              }

              @keyframes ldPillApproved {
                0%, 41% { opacity: 0; transform: scale(0.7); }
                44% { opacity: 1; transform: scale(1.18); }
                47%, 83% { opacity: 1; transform: scale(1); }
                87% { opacity: 0; transform: scale(0.85); }
                100% { opacity: 0; transform: scale(0.7); }
              }

              @keyframes ldBar1Rise { 0%, 50% { height: 42%; } 53% { height: 78%; } 82% { height: 78%; } 88%, 100% { height: 42%; } }
              @keyframes ldBar2Rise { 0%, 51.5% { height: 50%; } 54.5% { height: 88%; } 82% { height: 88%; } 88%, 100% { height: 50%; } }
              @keyframes ldBar3Rise { 0%, 53% { height: 45%; } 56% { height: 95%; } 82% { height: 95%; } 88%, 100% { height: 45%; } }
              @keyframes ldBar4Rise { 0%, 54.5% { height: 58%; } 57.5% { height: 92%; } 82% { height: 92%; } 88%, 100% { height: 58%; } }
              @keyframes ldBar5Rise { 0%, 56% { height: 52%; } 59% { height: 98%; } 82% { height: 98%; } 88%, 100% { height: 52%; } }

              @keyframes ldKpiValUpdate {
                0%, 52% { transform: scale(1); color: #0F172A; }
                54% { transform: scale(1.25); color: #7C3AED; }
                58%, 82% { transform: scale(1); color: #059669; }
                88%, 100% { transform: scale(1); color: #0F172A; }
              }

              @keyframes ldSheenSweep {
                0%, 53% { transform: translateX(-100%); opacity: 0; }
                54% { opacity: 1; }
                60% { transform: translateX(120%); opacity: 0; }
                100% { transform: translateX(120%); opacity: 0; }
              }

              @keyframes ldHyiqGlow {
                0%, 61% { box-shadow: 0 0 0 rgba(124, 58, 237, 0); border-color: rgba(216, 180, 254, 0.6); }
                64%, 79% { box-shadow: 0 0 16px rgba(168, 85, 247, 0.45); border-color: rgba(168, 85, 247, 0.7); }
                84%, 100% { box-shadow: 0 0 0 rgba(124, 58, 237, 0); border-color: rgba(216, 180, 254, 0.6); }
              }

              @keyframes ldQueryFade {
                0%, 62% { opacity: 1; transform: translateY(0); }
                64% { opacity: 0; transform: translateY(-6px); }
                83% { opacity: 0; }
                86%, 100% { opacity: 1; transform: translateY(0); }
              }

              @keyframes ldTypingDots {
                0%, 63% { opacity: 0; transform: scale(0.8); }
                65%, 70% { opacity: 1; transform: scale(1); }
                71.5% { opacity: 0; transform: scale(0.85); }
                100% { opacity: 0; }
              }

              @keyframes ldDotBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
              }

              @keyframes ldToastReveal {
                0%, 70.5% { opacity: 0; transform: translateY(8px) scale(0.92); pointer-events: none; }
                73%, 80% { opacity: 1; transform: translateY(0) scale(1); }
                83% { opacity: 0; transform: translateY(-6px) scale(0.96); }
                100% { opacity: 0; transform: translateY(8px) scale(0.92); pointer-events: none; }
              }

              @keyframes ldAiShimmer {
                0%, 72% { transform: translateX(-100%); }
                76% { transform: translateX(140%); }
                100% { transform: translateX(140%); }
              }

              /* Page 2 Orbiting Cards & Connectors */
              .v4-mod-1-p2 {
                top: 10px;
                left: 6px;
                animation: v4Card1MotionP2 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-mod-1-p2 .v4-card-icon-box { background: #EDE9FE; color: #7C3AED; }
              .v4-mod-1-p2 .v4-card-tag { color: #7C3AED; }

              .v4-mod-2-p2 {
                bottom: 24px;
                left: 12px;
                animation: v4Card2MotionP2 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-mod-2-p2 .v4-card-icon-box { background: #EFF6FF; color: #3B82F6; }
              .v4-mod-2-p2 .v4-card-tag { color: #3B82F6; }

              .v4-mod-3-p2 {
                top: 16px;
                right: 6px;
                animation: v4Card3MotionP2 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-mod-3-p2 .v4-card-icon-box { background: #FDF2F8; color: #EC4899; }
              .v4-mod-3-p2 .v4-card-tag { color: #EC4899; }

              .v4-mod-4-p2 {
                bottom: 18px;
                right: 14px;
                animation: v4Card4MotionP2 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-mod-4-p2 .v4-card-icon-box { background: #ECFDF5; color: #10B981; }
              .v4-mod-4-p2 .v4-card-tag { color: #059669; }

              .v4-sparkle-box-p2 {
                animation: v4SparkleShimmerP2 12s ease-in-out infinite;
              }

              .v4-progress-fill-p2 {
                height: 100%;
                width: 0%;
                border-radius: 9999px;
                background: linear-gradient(90deg, #10B981, #059669);
                animation: v4GoalProgressFlowP2 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }

              .v4-path-1-p2 { animation: v4Path1DrawP2 12s linear infinite; }
              .v4-path-2-p2 { animation: v4Path2DrawP2 12s linear infinite; }
              .v4-path-3-p2 { animation: v4Path3DrawP2 12s linear infinite; }
              .v4-path-4-p2 { animation: v4Path4DrawP2 12s linear infinite; }

              .v4-particle-1-p2 {
                position: absolute;
                top: 0;
                left: 0;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
                opacity: 0;
                background: #A855F7;
                box-shadow: 0 0 10px 2px #A855F7, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
                offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
                animation: v4Particle1MotionP2 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-2-p2 {
                position: absolute;
                top: 0;
                left: 0;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
                opacity: 0;
                background: #3B82F6;
                box-shadow: 0 0 10px 2px #3B82F6, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
                offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
                animation: v4Particle2MotionP2 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-3-p2 {
                position: absolute;
                top: 0;
                left: 0;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
                opacity: 0;
                background: #EC4899;
                box-shadow: 0 0 10px 2px #EC4899, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
                offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
                animation: v4Particle3MotionP2 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-4-p2 {
                position: absolute;
                top: 0;
                left: 0;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
                opacity: 0;
                background: #10B981;
                box-shadow: 0 0 10px 2px #10B981, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
                offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
                animation: v4Particle4MotionP2 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              @keyframes v4Card1MotionP2 {
                0%, 10% { opacity: 0; transform: translate(-14px, -8px) scale(0.96); border-color: #E2E8F0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); }
                16% { opacity: 1; transform: translate(1px, 1px) scale(1.02); border-color: #7C3AED; box-shadow: 0 14px 32px -6px rgba(124, 58, 237, 0.32); }
                22%, 78% { opacity: 1; transform: translate(0, 0) scale(1.0); border-color: rgba(124, 58, 237, 0.5); }
                88% { opacity: 0.8; border-color: #E2E8F0; }
                94%, 100% { opacity: 0; transform: translate(-14px, -8px) scale(0.96); }
              }

              @keyframes v4Card2MotionP2 {
                0%, 32% { opacity: 0; transform: translate(-14px, 8px) scale(0.96); border-color: #E2E8F0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); }
                38% { opacity: 1; transform: translate(1px, -1px) scale(1.02); border-color: #3B82F6; box-shadow: 0 14px 32px -6px rgba(59, 130, 246, 0.32); }
                44%, 78% { opacity: 1; transform: translate(0, 0) scale(1.0); border-color: rgba(59, 130, 246, 0.5); }
                88% { opacity: 0.8; border-color: #E2E8F0; }
                94%, 100% { opacity: 0; transform: translate(-14px, 8px) scale(0.96); }
              }

              @keyframes v4Card4MotionP2 {
                0%, 45% { opacity: 0; transform: translate(14px, 8px) scale(0.96); border-color: #E2E8F0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); }
                51% { opacity: 1; transform: translate(-1px, -1px) scale(1.02); border-color: #10B981; box-shadow: 0 14px 32px -6px rgba(16, 185, 129, 0.35); }
                57%, 78% { opacity: 1; transform: translate(0, 0) scale(1.0); border-color: rgba(16, 185, 129, 0.5); }
                88% { opacity: 0.8; border-color: #E2E8F0; }
                94%, 100% { opacity: 0; transform: translate(14px, 8px) scale(0.96); }
              }

              @keyframes v4Card3MotionP2 {
                0%, 58% { opacity: 0; transform: translate(14px, -8px) scale(0.96); border-color: #E2E8F0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); }
                64% { opacity: 1; transform: translate(-1px, 1px) scale(1.02); border-color: #EC4899; box-shadow: 0 14px 32px -6px rgba(236, 72, 153, 0.35); }
                70%, 80% { opacity: 1; transform: translate(0, 0) scale(1.0); border-color: rgba(236, 72, 153, 0.5); }
                88% { opacity: 0.8; border-color: #E2E8F0; }
                94%, 100% { opacity: 0; transform: translate(14px, -8px) scale(0.96); }
              }

              @keyframes v4Path1DrawP2 {
                0%, 10% { stroke-dashoffset: 144; opacity: 0; }
                14% { opacity: 0.9; }
                22%, 78% { stroke-dashoffset: 0; opacity: 0.85; }
                88% { opacity: 0.2; stroke-dashoffset: 0; }
                94%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path2DrawP2 {
                0%, 32% { stroke-dashoffset: 144; opacity: 0; }
                36% { opacity: 0.9; }
                44%, 78% { stroke-dashoffset: 0; opacity: 0.85; }
                88% { opacity: 0.2; stroke-dashoffset: 0; }
                94%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path4DrawP2 {
                0%, 45% { stroke-dashoffset: 144; opacity: 0; }
                49% { opacity: 0.9; }
                57%, 78% { stroke-dashoffset: 0; opacity: 0.85; }
                88% { opacity: 0.2; stroke-dashoffset: 0; }
                94%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path3DrawP2 {
                0%, 58% { stroke-dashoffset: 144; opacity: 0; }
                62% { opacity: 0.9; }
                70%, 80% { stroke-dashoffset: 0; opacity: 0.85; }
                88% { opacity: 0.2; stroke-dashoffset: 0; }
                94%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Particle1MotionP2 {
                0%, 14% { offset-distance: 0%; opacity: 0; }
                15% { opacity: 1; }
                22% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle2MotionP2 {
                0%, 36% { offset-distance: 0%; opacity: 0; }
                37% { opacity: 1; }
                44% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle4MotionP2 {
                0%, 49% { offset-distance: 0%; opacity: 0; }
                50% { opacity: 1; }
                57% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle3MotionP2 {
                0%, 62% { offset-distance: 0%; opacity: 0; }
                63% { opacity: 1; }
                70% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4GoalProgressFlowP2 {
                0%, 48% { width: 0%; opacity: 0; }
                50% { opacity: 1; }
                58%, 80% { width: 96%; opacity: 1; }
                88% { opacity: 0.4; }
                94%, 100% { width: 0%; opacity: 0; }
              }

              @keyframes v4SparkleShimmerP2 {
                0%, 60% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                65% { transform: scale(1.25) rotate(16deg); filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.7)); }
                70% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                75% { transform: scale(1.15) rotate(8deg); filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.5)); }
                80%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
              }

              @media (prefers-reduced-motion: reduce) {
                .v4-mini-dashboard-living,
                .v4-mod-1-p2,
                .v4-mod-2-p2,
                .v4-mod-3-p2,
                .v4-mod-4-p2,
                .v4-path-1-p2,
                .v4-path-2-p2,
                .v4-path-3-p2,
                .v4-path-4-p2,
                .v4-particle-1-p2,
                .v4-particle-2-p2,
                .v4-particle-3-p2,
                .v4-particle-4-p2,
                .v4-progress-fill-p2,
                .v4-sparkle-box-p2,
                .v4-ld-progress-bar-fill,
                .v4-ld-pill-progress,
                .v4-ld-pill-completed,
                .v4-ld-broadcast-toast,
                .v4-ld-btn-approve,
                .v4-ld-pill-pending,
                .v4-ld-pill-approved,
                .v4-ld-micro-fill,
                .v4-ld-kpi-val,
                .v4-ld-kpi-sheen,
                .v4-ld-widget-hyiq,
                .v4-ld-hyiq-query,
                .v4-ld-typing-dots,
                .v4-ld-hyiq-toast,
                .v4-ld-hyiq-sheen {
                  animation: none !important;
                  transition: none !important;
                }

                .v4-mini-dashboard-living {
                  opacity: 1 !important;
                  transform: none !important;
                }
                .v4-mod-1-p2 { border-color: rgba(124, 58, 237, 0.4) !important; opacity: 1 !important; transform: none !important; }
                .v4-mod-2-p2 { border-color: rgba(59, 130, 246, 0.4) !important; opacity: 1 !important; transform: none !important; }
                .v4-mod-3-p2 { border-color: rgba(236, 72, 153, 0.4) !important; opacity: 1 !important; transform: none !important; }
                .v4-mod-4-p2 { border-color: rgba(16, 185, 129, 0.4) !important; opacity: 1 !important; transform: none !important; }
                .v4-progress-fill-p2 { width: 96% !important; opacity: 1 !important; }
                .v4-ld-broadcast-toast { display: none !important; }
                .v4-ld-pill-progress { display: none !important; }
                .v4-ld-pill-completed { position: static !important; opacity: 1 !important; }
                .v4-ld-progress-bar-fill { width: 100% !important; background: linear-gradient(90deg, #10B981, #059669) !important; }
                .v4-ld-pill-pending { display: none !important; }
                .v4-ld-pill-approved { position: static !important; opacity: 1 !important; }
                .v4-ld-kpi-val { color: #059669 !important; }
                .v4-ld-micro-fill.bar-1 { height: 78% !important; }
                .v4-ld-micro-fill.bar-2 { height: 88% !important; }
                .v4-ld-micro-fill.bar-3 { height: 95% !important; }
                .v4-ld-micro-fill.bar-4 { height: 92% !important; }
                .v4-ld-micro-fill.bar-5 { height: 98% !important; }
                .v4-ld-hyiq-query { display: none !important; }
                .v4-ld-typing-dots { display: none !important; }
                .v4-ld-hyiq-toast { position: static !important; opacity: 1 !important; pointer-events: auto !important; }
              }

              @media (max-width: 640px) {
                .v4-mini-dashboard-living {
                  width: 200px;
                  min-height: 155px;
                }
                .v4-ld-grid { gap: 4px; }
                .v4-ld-widget { min-height: 56px; padding: 4px 5px; }
              }

              /* PAGE 3: THE EMPLOYEE JOURNEY (12.0s MASTER ANIMATION SYSTEM) */
              .v4-j-card {
                position: absolute;
                z-index: 6;
                background: #FFFFFF;
                border-radius: 14px;
                border: 1.5px solid #E2E8F0;
                box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.85);
                padding: 8px 10px;
                display: flex;
                align-items: center;
                gap: 9px;
                width: 164px;
                height: 58px;
                box-sizing: border-box;
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
                will-change: transform, opacity, box-shadow;
                user-select: none;
              }
              .v4-j-card:hover {
                transform: translateY(-2px) scale(1.03) !important;
                box-shadow: 0 16px 35px -8px rgba(124, 58, 237, 0.28) !important;
                z-index: 12 !important;
              }
              .v4-j-card-1 {
                top: 12px;
                left: 12px;
                animation: jCard1Motion 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-j-card-2 {
                top: 12px;
                left: 188px;
                animation: jCard2Motion 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-j-card-3 {
                top: 12px;
                right: 12px;
                animation: jCard3Motion 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-j-card-4 {
                bottom: 12px;
                right: 12px;
                animation: jCard4Motion 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-j-card-5 {
                bottom: 12px;
                left: 188px;
                animation: jCard5Motion 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              .v4-j-card-6 {
                bottom: 12px;
                left: 12px;
                animation: jCard6Motion 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }

              .v4-j-avatar-wrap {
                position: relative;
                width: 32px;
                height: 32px;
                flex-shrink: 0;
              }
              .v4-j-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
                color: #FFFFFF;
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 800;
                font-size: 11px;
                display: grid;
                place-items: center;
                box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
              }
              .v4-j-online-dot {
                position: absolute;
                bottom: -1px;
                right: -1px;
                width: 7.5px;
                height: 7.5px;
                border-radius: 50%;
                background: #10B981;
                border: 1.5px solid #FFFFFF;
                box-shadow: 0 0 6px #10B981;
                animation: jGreenPulse 2s ease-in-out infinite;
              }
              @keyframes jGreenPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                50% { transform: scale(1.15); box-shadow: 0 0 0 3.5px rgba(16, 185, 129, 0); }
              }

              .v4-j-icon-box {
                width: 28px;
                height: 28px;
                border-radius: 8px;
                display: grid;
                place-items: center;
                font-size: 14px;
                flex-shrink: 0;
              }
              .v4-j-icon-purple { background: rgba(124, 58, 237, 0.1); color: #7C3AED; }
              .v4-j-icon-blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
              .v4-j-icon-pink { background: rgba(236, 72, 153, 0.1); color: #EC4899; }
              .v4-j-icon-amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
              .v4-j-icon-green { background: rgba(16, 185, 129, 0.1); color: #10B981; }

              .v4-j-meta {
                flex: 1;
                min-width: 0;
                overflow: hidden;
              }
              .v4-j-tag-row {
                display: flex;
                align-items: center;
                gap: 4px;
                margin-bottom: 1px;
              }
              .v4-j-tag {
                font-size: 7.5px;
                font-weight: 800;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                line-height: 1;
                white-space: nowrap;
              }
              .v4-j-card-1 .v4-j-tag { color: #7C3AED; }
              .v4-j-card-2 .v4-j-tag { color: #7C3AED; }
              .v4-j-card-3 .v4-j-tag { color: #3B82F6; }
              .v4-j-card-4 .v4-j-tag { color: #EC4899; }
              .v4-j-card-5 .v4-j-tag { color: #D97706; }
              .v4-j-card-6 .v4-j-tag { color: #059669; }

              .v4-j-tag-new {
                font-size: 7.5px;
                font-weight: 800;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: #7C3AED;
                background: rgba(124, 58, 237, 0.08);
                padding: 1px 4.5px;
                border-radius: 3.5px;
                display: inline-block;
                line-height: 1.1;
                margin-bottom: 1px;
              }
              .v4-j-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 11px;
                font-weight: 700;
                color: #0F172A;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .v4-j-sub {
                font-size: 8.5px;
                color: #64748B;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
                margin-top: 1px;
              }
              .v4-j-sub-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 3px;
                margin-top: 1px;
              }
              .v4-j-badge-done {
                font-size: 8px;
                font-weight: 700;
                color: #059669;
                white-space: nowrap;
                flex-shrink: 0;
              }

              .v4-j-progress-row {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 2px;
              }
              .v4-j-progress-track {
                width: 44px;
                height: 3.5px;
                border-radius: 9999px;
                background: #E2E8F0;
                overflow: hidden;
                flex-shrink: 0;
              }
              .v4-j-progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #7C3AED, #A855F7);
                border-radius: 9999px;
                animation: jProgressFill 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
              @keyframes jProgressFill {
                0%, 12.5% { width: 0%; }
                25%, 95% { width: 100%; }
                100% { width: 0%; }
              }
              .v4-j-status-swap {
                position: relative;
                height: 12px;
                flex: 1;
                min-width: 0;
                display: inline-flex;
                align-items: center;
              }
              .v4-j-status-filling {
                position: absolute;
                left: 0;
                top: 0;
                font-size: 8px;
                font-weight: 600;
                color: #64748B;
                white-space: nowrap;
                animation: jStatusFilling 12s ease infinite;
              }
              .v4-j-status-done {
                position: absolute;
                left: 0;
                top: 0;
                font-size: 8px;
                font-weight: 700;
                color: #059669;
                white-space: nowrap;
                animation: jStatusDone 12s ease infinite;
              }
              @keyframes jStatusFilling {
                0%, 16% { opacity: 1; transform: translateY(0); }
                20%, 95% { opacity: 0; transform: translateY(-3px); pointer-events: none; }
                100% { opacity: 1; transform: translateY(0); }
              }
              @keyframes jStatusDone {
                0%, 18% { opacity: 0; transform: translateY(3px); }
                22%, 95% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(3px); }
              }

              .v4-j-stage-status {
                position: relative;
                height: 12px;
                display: inline-flex;
                align-items: center;
                min-width: 58px;
                justify-content: flex-end;
              }
              .v4-j-status-upcoming {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 8px;
                font-weight: 600;
                color: #94A3B8;
                white-space: nowrap;
                animation: jStatusUpcoming 12s ease infinite;
              }
              .v4-j-status-progress {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 8px;
                font-weight: 700;
                color: #3B82F6;
                white-space: nowrap;
                animation: jStatusProgress 12s ease infinite;
              }
              .v4-j-status-completed {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 8px;
                font-weight: 700;
                color: #059669;
                white-space: nowrap;
                animation: jStatusCompleted 12s ease infinite;
              }
              @keyframes jStatusUpcoming {
                0%, 38% { opacity: 1; transform: translateY(0); }
                41.67%, 100% { opacity: 0; transform: translateY(-3px); pointer-events: none; }
              }
              @keyframes jStatusProgress {
                0%, 38% { opacity: 0; transform: translateY(3px); }
                41.67%, 52% { opacity: 1; transform: translateY(0); }
                55%, 100% { opacity: 0; transform: translateY(-3px); pointer-events: none; }
              }
              @keyframes jStatusCompleted {
                0%, 52% { opacity: 0; transform: translateY(3px); }
                55%, 95% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(3px); }
              }

              .v4-j-goal-row {
                display: flex;
                align-items: center;
                gap: 4px;
                margin-top: 1px;
              }
              .v4-j-goal-pill {
                font-size: 8px;
                font-weight: 800;
                color: #059669;
                background: rgba(16, 185, 129, 0.12);
                padding: 1px 4px;
                border-radius: 3px;
                line-height: 1.1;
              }
              .v4-j-status-ontrack {
                font-size: 8px;
                font-weight: 700;
                color: #059669;
                line-height: 1.1;
              }

              .v4-j-payoff-capsule {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.85);
                z-index: 10;
                width: 310px;
                min-height: 48px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(14px) saturate(180%);
                -webkit-backdrop-filter: blur(14px) saturate(180%);
                border: 1.5px solid rgba(124, 58, 237, 0.38);
                border-radius: 9999px;
                box-shadow: 0 16px 38px -6px rgba(124, 58, 237, 0.32), 0 6px 14px -3px rgba(15, 23, 42, 0.08), inset 0 1px 1px rgba(255, 255, 255, 1);
                display: flex;
                align-items: center;
                padding: 6px 16px;
                gap: 11px;
                box-sizing: border-box;
                opacity: 0;
                animation: jPayoffBloom 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                user-select: none;
                will-change: transform, opacity, box-shadow;
              }
              .v4-j-payoff-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
                color: #FFFFFF;
                display: grid;
                place-items: center;
                font-size: 15px;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
              }
              .v4-j-payoff-content {
                flex: 1;
                min-width: 0;
              }
              .v4-j-payoff-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 11.5px;
                font-weight: 800;
                color: #0F172A;
                line-height: 1.25;
                white-space: nowrap;
              }
              .v4-j-payoff-subtitle {
                font-size: 9px;
                color: #7C3AED;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 4px;
                margin-top: 1px;
              }
              .v4-j-payoff-live-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #10B981;
                box-shadow: 0 0 5px #10B981;
                display: inline-block;
              }

              @keyframes jPayoffBloom {
                0%, 75% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); pointer-events: none; }
                79.17% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.92); }
                83.33% {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1.05);
                  box-shadow: 0 20px 48px -4px rgba(124, 58, 237, 0.45), 0 0 30px 4px rgba(168, 85, 247, 0.4), inset 0 1px 1px rgba(255, 255, 255, 1);
                }
                87.5% {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1.0);
                  box-shadow: 0 16px 38px -6px rgba(124, 58, 237, 0.32), 0 6px 14px -3px rgba(15, 23, 42, 0.08), inset 0 1px 1px rgba(255, 255, 255, 1);
                }
                95.83% { opacity: 1; transform: translate(-50%, -50%) scale(1.0); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); pointer-events: none; }
              }

              .v4-j-track-base {
                fill: none;
                stroke: rgba(124, 58, 237, 0.12);
                stroke-width: 2;
                stroke-linecap: round;
                stroke-dasharray: 4 4;
              }
              .v4-j-spline-active {
                fill: none;
                stroke-width: 2.5;
                stroke-linecap: round;
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: jSplineDraw 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }
              @keyframes jSplineDraw {
                0% { stroke-dashoffset: 1000; opacity: 0.4; }
                12.5% { stroke-dashoffset: 820; opacity: 1; }
                25% { stroke-dashoffset: 640; }
                41.67% { stroke-dashoffset: 460; }
                58.33% { stroke-dashoffset: 280; }
                70.83% { stroke-dashoffset: 140; }
                79.17% { stroke-dashoffset: 0; }
                95.83% { stroke-dashoffset: 0; opacity: 1; filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.8)); }
                100% { stroke-dashoffset: 0; opacity: 0.4; }
              }

              .v4-j-node-beacon {
                fill: #FFFFFF;
                stroke: #7C3AED;
                stroke-width: 2;
                animation: jBeaconPulse 12s ease-in-out infinite;
              }
              .v4-j-node-1 { animation-delay: 0s; }
              .v4-j-node-2 { animation-delay: 1.5s; stroke: #7C3AED; }
              .v4-j-node-3 { animation-delay: 3.0s; stroke: #3B82F6; }
              .v4-j-node-4 { animation-delay: 5.0s; stroke: #EC4899; }
              .v4-j-node-5 { animation-delay: 7.0s; stroke: #F59E0B; }
              .v4-j-node-6 { animation-delay: 8.5s; stroke: #10B981; }
              .v4-j-node-center { animation-delay: 9.5s; fill: #A855F7; stroke: #FFFFFF; stroke-width: 2; }

              @keyframes jBeaconPulse {
                0%, 90% { transform-origin: center; transform: scale(1); filter: drop-shadow(0 0 0 rgba(124, 58, 237, 0)); }
                10%, 20% { transform-origin: center; transform: scale(1.4); filter: drop-shadow(0 0 6px rgba(124, 58, 237, 0.8)); }
              }

              .v4-j-comet {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #FFFFFF;
                box-shadow: 0 0 12px 3px rgba(168, 85, 247, 0.9), 0 0 4px #FFFFFF;
                offset-path: path("M 94 41 L 270 41 L 446 41 C 516 41 526 100 526 175 C 526 250 516 309 446 309 L 270 309 L 94 309 C 30 309 18 250 20 190 C 22 135 90 140 180 155 L 270 175");
                pointer-events: none;
                z-index: 5;
                opacity: 0;
                will-change: transform, opacity;
              }
              .v4-j-comet-1 { animation: jComet1 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
              @keyframes jComet1 {
                0% { offset-distance: 0%; opacity: 0; }
                2% { opacity: 1; }
                12.5% { offset-distance: 18%; opacity: 1; }
                13.5% { opacity: 0; }
                100% { opacity: 0; }
              }
              .v4-j-comet-2 { animation: jComet2 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
              @keyframes jComet2 {
                0%, 12.5% { offset-distance: 18%; opacity: 0; }
                14% { opacity: 1; }
                25% { offset-distance: 36%; opacity: 1; }
                26% { opacity: 0; }
                100% { opacity: 0; }
              }
              .v4-j-comet-3 { animation: jComet3 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
              @keyframes jComet3 {
                0%, 25% { offset-distance: 36%; opacity: 0; }
                27% { opacity: 1; }
                41.67% { offset-distance: 54%; opacity: 1; }
                43% { opacity: 0; }
                100% { opacity: 0; }
              }
              .v4-j-comet-4 { animation: jComet4 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
              @keyframes jComet4 {
                0%, 41.67% { offset-distance: 54%; opacity: 0; }
                43.5% { opacity: 1; }
                58.33% { offset-distance: 72%; opacity: 1; }
                59.5% { opacity: 0; }
                100% { opacity: 0; }
              }
              .v4-j-comet-5 { animation: jComet5 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
              @keyframes jComet5 {
                0%, 58.33% { offset-distance: 72%; opacity: 0; }
                60% { opacity: 1; }
                79.17% { offset-distance: 100%; opacity: 1; }
                81% { opacity: 0; }
                100% { opacity: 0; }
              }
              .v4-j-comet-grand {
                animation: jCometGrand 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                width: 10px;
                height: 10px;
                box-shadow: 0 0 16px 4px rgba(168, 85, 247, 1), 0 0 6px #FFFFFF;
              }
              @keyframes jCometGrand {
                0%, 79.17% { offset-distance: 0%; opacity: 0; }
                80% { opacity: 1; }
                93% { offset-distance: 100%; opacity: 1; }
                95% { opacity: 0; }
                100% { opacity: 0; }
              }

              @keyframes jCard1Motion {
                0% { opacity: 0; transform: translateY(-8px) scale(0.96); border-color: #E2E8F0; }
                8.33% { opacity: 1; transform: translateY(0) scale(1.0); border-color: rgba(124, 58, 237, 0.5); box-shadow: 0 14px 30px -6px rgba(124, 58, 237, 0.28); }
                12.5% { opacity: 1; transform: translateY(0) scale(1.0); }
                95% { opacity: 1; transform: translateY(0) scale(1.0); }
                100% { opacity: 0; transform: translateY(-8px) scale(0.96); }
              }
              @keyframes jCard2Motion {
                0%, 10% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
                12.5% { opacity: 1; transform: translateY(-2px) scale(1.03); border-color: #7C3AED; box-shadow: 0 14px 30px -6px rgba(124, 58, 237, 0.3); }
                25% { opacity: 1; transform: translateY(0) scale(1.0); border-color: rgba(124, 58, 237, 0.4); }
                95% { opacity: 1; transform: translateY(0) scale(1.0); }
                100% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
              }
              @keyframes jCard3Motion {
                0%, 22% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
                25% { opacity: 1; transform: translateY(-2px) scale(1.03); border-color: #3B82F6; box-shadow: 0 14px 30px -6px rgba(59, 130, 246, 0.3); }
                37.5% { opacity: 1; transform: translateY(0) scale(1.0); border-color: rgba(59, 130, 246, 0.4); }
                95% { opacity: 1; transform: translateY(0) scale(1.0); }
                100% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
              }
              @keyframes jCard4Motion {
                0%, 38% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
                41.67% { opacity: 1; transform: translateY(-2px) scale(1.03); border-color: #EC4899; box-shadow: 0 14px 30px -6px rgba(236, 72, 153, 0.3); }
                58.33% { opacity: 1; transform: translateY(0) scale(1.0); border-color: rgba(236, 72, 153, 0.4); }
                95% { opacity: 1; transform: translateY(0) scale(1.0); }
                100% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
              }
              @keyframes jCard5Motion {
                0%, 55% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
                58.33% { opacity: 1; transform: translateY(-2px) scale(1.03); border-color: #F59E0B; box-shadow: 0 14px 30px -6px rgba(245, 158, 11, 0.3); }
                70.83% { opacity: 1; transform: translateY(0) scale(1.0); border-color: rgba(245, 158, 11, 0.4); }
                95% { opacity: 1; transform: translateY(0) scale(1.0); }
                100% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
              }
              @keyframes jCard6Motion {
                0%, 68% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
                70.83% { opacity: 1; transform: translateY(-2px) scale(1.03); border-color: #10B981; box-shadow: 0 14px 30px -6px rgba(16, 185, 129, 0.3); }
                79.17% { opacity: 1; transform: translateY(0) scale(1.0); border-color: rgba(16, 185, 129, 0.4); }
                95% { opacity: 1; transform: translateY(0) scale(1.0); }
                100% { opacity: 0.5; transform: scale(0.97); border-color: #E2E8F0; }
              }

              @media (max-width: 640px) {
                .v4-j-card { width: 140px; height: 52px; padding: 6px 8px; gap: 6px; }
                .v4-j-card-1 { left: 6px; }
                .v4-j-card-2 { left: 50%; transform: translateX(-50%); }
                .v4-j-card-3 { right: 6px; }
                .v4-j-card-4 { right: 6px; }
                .v4-j-card-5 { left: 50%; transform: translateX(-50%); }
                .v4-j-card-6 { left: 6px; }
                .v4-j-payoff-capsule { width: 260px; min-height: 44px; padding: 5px 12px; }
                .v4-j-payoff-title { font-size: 10px; }
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
                  {/* Dynamic SVG Flow Connectors & Luminescent Particles for Page 2 */}
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
                      <linearGradient id="v4Grad1_p2_tsx" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#A855F7" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad2_p2_tsx" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad3_p2_tsx" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#F472B6" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad4_p2_tsx" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#34D399" stopOpacity="0.95" />
                      </linearGradient>
                      <filter id="v4FlowGlow_p2_tsx" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <path className="v4-track-base" d="M 160 75 C 210 75, 230 145, 270 160" />
                    <path className="v4-track-base" d="M 160 275 C 210 275, 230 205, 270 190" />
                    <path className="v4-track-base" d="M 380 75 C 330 75, 310 145, 270 160" />
                    <path className="v4-track-base" d="M 380 275 C 330 275, 310 205, 270 190" />

                    <path className="v4-path-active v4-path-1-p2" stroke="url(#v4Grad1_p2_tsx)" d="M 160 75 C 210 75, 230 145, 270 160" filter="url(#v4FlowGlow_p2_tsx)" />
                    <path className="v4-path-active v4-path-2-p2" stroke="url(#v4Grad2_p2_tsx)" d="M 160 275 C 210 275, 230 205, 270 190" filter="url(#v4FlowGlow_p2_tsx)" />
                    <path className="v4-path-active v4-path-3-p2" stroke="url(#v4Grad3_p2_tsx)" d="M 380 75 C 330 75, 310 145, 270 160" filter="url(#v4FlowGlow_p2_tsx)" />
                    <path className="v4-path-active v4-path-4-p2" stroke="url(#v4Grad4_p2_tsx)" d="M 380 275 C 330 275, 310 205, 270 190" filter="url(#v4FlowGlow_p2_tsx)" />
                  </svg>

                  <div className="v4-particle v4-particle-1-p2" />
                  <div className="v4-particle v4-particle-2-p2" />
                  <div className="v4-particle v4-particle-3-p2" />
                  <div className="v4-particle v4-particle-4-p2" />

                  {/* MODULE 1: ORIENTATION (Top-Left) */}
                  <Box
                    className="v4-flow-card v4-mod-1-p2"
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
                        <span>Auto Assigned</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* MODULE 2: DEPARTMENT TOUR (Bottom-Left) */}
                  <Box
                    className="v4-flow-card v4-mod-2-p2"
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

                  {/* CENTRAL MINIATURE DASHBOARD (THE LIVING DASHBOARD) */}
                  <Box
                    id="v4MiniDashboardLiving"
                    className="v4-mini-dashboard v4-mini-dashboard-living"
                    sx={{
                      transform: `rotateX(${v4Tilt.x}deg) rotateY(${v4Tilt.y}deg)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* App Chrome */}
                    <div className="v4-ld-chrome">
                      <div className="v4-ld-traffic-dots">
                        <span className="v4-ld-dot red" />
                        <span className="v4-ld-dot amber" />
                        <span className="v4-ld-dot green" />
                      </div>
                      <div className="v4-ld-chrome-title">app.hirerkey.com • Living OS</div>
                      <div className="v4-ld-live-chip">
                        <span className="v4-ld-live-dot" />
                        <span>Live</span>
                      </div>
                    </div>

                    {/* Dashboard Body */}
                    <div className="v4-ld-body">
                      {/* Scene 3: Sliding Executive Broadcast Toast */}
                      <div className="v4-ld-broadcast-toast">
                        <span className="v4-ld-toast-icon">📢</span>
                        <div className="v4-ld-toast-text">
                          <span className="v4-ld-toast-badge">BROADCAST</span>
                          <span className="v4-ld-toast-msg">Team sync at 2 PM • Updated shift timings</span>
                        </div>
                        <span className="v4-ld-toast-check">✓</span>
                      </div>

                      {/* 2x2 Widgets Grid */}
                      <div className="v4-ld-grid">
                        {/* Widget 1: Onboarding Task (Scene 2) */}
                        <div className="v4-ld-widget v4-ld-widget-onboarding">
                          <div className="v4-ld-w-header">
                            <div className="v4-ld-w-title">
                              <span className="v4-ld-w-icon">🧭</span>
                              <span>Orientation</span>
                            </div>
                            <div className="v4-ld-badge-wrap">
                              <span className="v4-ld-pill-progress">In Progress</span>
                              <span className="v4-ld-pill-completed">Completed ✓</span>
                            </div>
                          </div>
                          <div className="v4-ld-w-sub">Alex C. • Design Ops</div>
                          <div className="v4-ld-bar-track-wrap">
                            <div className="v4-ld-progress-bar-bg">
                              <div className="v4-ld-progress-bar-fill" />
                            </div>
                            <span className="v4-ld-progress-pct">65%</span>
                          </div>
                        </div>

                        {/* Widget 2: Workforce Analytics (Scene 5) */}
                        <div className="v4-ld-widget v4-ld-widget-analytics">
                          <div className="v4-ld-w-header">
                            <div className="v4-ld-w-title">
                              <span className="v4-ld-w-icon">📊</span>
                              <span>Workforce</span>
                            </div>
                            <div className="v4-ld-kpi-wrap">
                              <span className="v4-ld-kpi-val">96%</span>
                              <div className="v4-ld-kpi-sheen" />
                            </div>
                          </div>
                          <div className="v4-ld-chart-bars">
                            <div className="v4-ld-micro-col">
                              <div className="v4-ld-micro-track"><div className="v4-ld-micro-fill bar-1" /></div>
                              <span className="v4-ld-micro-lbl">M</span>
                            </div>
                            <div className="v4-ld-micro-col">
                              <div className="v4-ld-micro-track"><div className="v4-ld-micro-fill bar-2" /></div>
                              <span className="v4-ld-micro-lbl">T</span>
                            </div>
                            <div className="v4-ld-micro-col">
                              <div className="v4-ld-micro-track"><div className="v4-ld-micro-fill bar-3" /></div>
                              <span className="v4-ld-micro-lbl">W</span>
                            </div>
                            <div className="v4-ld-micro-col">
                              <div className="v4-ld-micro-track"><div className="v4-ld-micro-fill bar-4" /></div>
                              <span className="v4-ld-micro-lbl">T</span>
                            </div>
                            <div className="v4-ld-micro-col">
                              <div className="v4-ld-micro-track"><div className="v4-ld-micro-fill bar-5" /></div>
                              <span className="v4-ld-micro-lbl">F</span>
                            </div>
                          </div>
                        </div>

                        {/* Widget 3: Leave Approval Workflow (Scene 4) */}
                        <div className="v4-ld-widget v4-ld-widget-approval">
                          <div className="v4-ld-w-header">
                            <div className="v4-ld-w-title">
                              <span className="v4-ld-w-icon">⚡</span>
                              <span>Leave Approval</span>
                            </div>
                            <div className="v4-ld-badge-wrap">
                              <span className="v4-ld-pill-pending">Pending</span>
                              <span className="v4-ld-pill-approved">Approved ✓</span>
                            </div>
                          </div>
                          <div className="v4-ld-w-sub">Sara J. • Leave</div>
                          <div className="v4-ld-approval-actions">
                            <span className="v4-ld-action-tag">Annual • 2d</span>
                            <button type="button" className="v4-ld-btn-approve" tabIndex={-1}>
                              <span>Approve</span>
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                          </div>
                        </div>

                        {/* Widget 4: Ask HyIQ™ AI Insight (Scene 6) */}
                        <div className="v4-ld-widget v4-ld-widget-hyiq">
                          <div className="v4-ld-w-header">
                            <div className="v4-ld-hyiq-pill">
                              <span className="v4-ld-sparkle">✨</span>
                              <span>Ask HyIQ™ AI</span>
                            </div>
                          </div>
                          <div className="v4-ld-hyiq-stage">
                            <div className="v4-ld-hyiq-query">
                              <span>“How is onboarding?”</span>
                            </div>
                            <div className="v4-ld-typing-dots">
                              <span />
                              <span />
                              <span />
                            </div>
                            <div className="v4-ld-hyiq-toast">
                              <div className="v4-ld-hyiq-sheen" />
                              <span className="v4-ld-toast-sparkle">✨</span>
                              <span className="v4-ld-hyiq-ans">Onboarding progress is on track</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </Box>

                  {/* MODULE 3: ASK HyIQ AI (Top-Right) */}
                  <Box
                    className="v4-flow-card v4-mod-3-p2"
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
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(236, 72, 153, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box v4-sparkle-box-p2"
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
                    className="v4-flow-card v4-mod-4-p2"
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
                          <div className="v4-progress-fill-p2" />
                        </div>
                        <span className="v4-progress-val">96%</span>
                      </div>
                    </Box>
                  </Box>
                </Box>
                )}
                {activePage === 3 && (
                <Box
                  id="v4WorkflowStageJourney"
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
                  {/* Master Curving Spline SVG & Anchor Beacons */}
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
                      <linearGradient id="v4GradJourneyReact" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="25%" stopColor="#7C3AED" />
                        <stop offset="50%" stopColor="#3B82F6" />
                        <stop offset="75%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                      <filter id="v4JourneyGlowReact" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Base Ambient Dashed Spline Track */}
                    <path
                      className="v4-j-track-base"
                      d="M 94 41 L 270 41 L 446 41 C 516 41 526 100 526 175 C 526 250 516 309 446 309 L 270 309 L 94 309 C 30 309 18 250 20 190 C 22 135 90 140 180 155 L 270 175"
                    />

                    {/* Progressive Animated Flow Spline (1000px Arc Length) */}
                    <path
                      className="v4-j-spline-active"
                      stroke="url(#v4GradJourneyReact)"
                      filter="url(#v4JourneyGlowReact)"
                      d="M 94 41 L 270 41 L 446 41 C 516 41 526 100 526 175 C 526 250 516 309 446 309 L 270 309 L 94 309 C 30 309 18 250 20 190 C 22 135 90 140 180 155 L 270 175"
                    />

                    {/* Node Connection Anchor Beacons */}
                    <circle className="v4-j-node-beacon v4-j-node-1" cx="94" cy="41" r="3.5" />
                    <circle className="v4-j-node-beacon v4-j-node-2" cx="270" cy="41" r="3.5" />
                    <circle className="v4-j-node-beacon v4-j-node-3" cx="446" cy="41" r="3.5" />
                    <circle className="v4-j-node-beacon v4-j-node-4" cx="446" cy="309" r="3.5" />
                    <circle className="v4-j-node-beacon v4-j-node-5" cx="270" cy="309" r="3.5" />
                    <circle className="v4-j-node-beacon v4-j-node-6" cx="94" cy="309" r="3.5" />
                    <circle className="v4-j-node-beacon v4-j-node-center" cx="270" cy="175" r="4.5" />
                  </svg>

                  {/* Travelling Photon Comet Particles */}
                  <div className="v4-j-comet v4-j-comet-1" />
                  <div className="v4-j-comet v4-j-comet-2" />
                  <div className="v4-j-comet v4-j-comet-3" />
                  <div className="v4-j-comet v4-j-comet-4" />
                  <div className="v4-j-comet v4-j-comet-5" />
                  <div className="v4-j-comet v4-j-comet-grand" />

                  {/* CARD 1: PROFILE CARD (Alex Chen • Product Designer) */}
                  <div className="v4-j-card v4-j-card-1">
                    <div className="v4-j-avatar-wrap">
                      <div className="v4-j-avatar">AC</div>
                      <span className="v4-j-online-dot" />
                    </div>
                    <div className="v4-j-meta">
                      <div className="v4-j-tag-row">
                        <span className="v4-j-tag-new">New employee</span>
                      </div>
                      <div className="v4-j-title">Alex Chen</div>
                      <div className="v4-j-sub">Product Designer</div>
                    </div>
                  </div>

                  {/* CARD 2: MILESTONE 1 (01 • Onboarding) */}
                  <div className="v4-j-card v4-j-card-2">
                    <div className="v4-j-icon-box v4-j-icon-purple">🚀</div>
                    <div className="v4-j-meta">
                      <div className="v4-j-tag">01 • ONBOARDING</div>
                      <div className="v4-j-title">Onboarding</div>
                      <div className="v4-j-progress-row">
                        <div className="v4-j-progress-track">
                          <div className="v4-j-progress-fill" />
                        </div>
                        <div className="v4-j-status-swap">
                          <span className="v4-j-status-filling">In Progress</span>
                          <span className="v4-j-status-done">Completed ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: MILESTONE 2 (02 • Orientation) */}
                  <div className="v4-j-card v4-j-card-3">
                    <div className="v4-j-icon-box v4-j-icon-blue">🧭</div>
                    <div className="v4-j-meta">
                      <div className="v4-j-tag">02 • ORIENTATION</div>
                      <div className="v4-j-title">Orientation</div>
                      <div className="v4-j-sub-row">
                        <span className="v4-j-sub">Workplace intro</span>
                        <span className="v4-j-badge-done">Completed ✓</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: MILESTONE 3 (03 • Department Tour) */}
                  <div className="v4-j-card v4-j-card-4">
                    <div className="v4-j-icon-box v4-j-icon-pink">🏢</div>
                    <div className="v4-j-meta">
                      <div className="v4-j-tag">03 • DEPARTMENT TOUR</div>
                      <div className="v4-j-title">Department Tour</div>
                      <div className="v4-j-sub-row">
                        <span className="v4-j-sub">Sales &amp; Marketing</span>
                        <div className="v4-j-stage-status">
                          <span className="v4-j-status-upcoming">Upcoming</span>
                          <span className="v4-j-status-progress">In Progress</span>
                          <span className="v4-j-status-completed">Completed ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 5: MILESTONE 4 (04 • Tasks & Activities) */}
                  <div className="v4-j-card v4-j-card-5">
                    <div className="v4-j-icon-box v4-j-icon-amber">⚡</div>
                    <div className="v4-j-meta">
                      <div className="v4-j-tag">04 • TASKS &amp; ACTIVITIES</div>
                      <div className="v4-j-title">Tasks &amp; Activities</div>
                      <div className="v4-j-sub-row">
                        <span className="v4-j-sub">Complete orientation</span>
                        <span className="v4-j-badge-done">Completed ✓</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 6: MILESTONE 5 (05 • Performance & Check-ins) */}
                  <div className="v4-j-card v4-j-card-6">
                    <div className="v4-j-icon-box v4-j-icon-green">🎯</div>
                    <div className="v4-j-meta">
                      <div className="v4-j-tag">05 • PERFORMANCE &amp; CHECK-INS</div>
                      <div className="v4-j-title">1-on-1 Check-ins</div>
                      <div className="v4-j-goal-row">
                        <span className="v4-j-goal-pill">Goal 96%</span>
                        <span className="v4-j-status-ontrack">On Track ✓</span>
                      </div>
                    </div>
                  </div>

                  {/* CENTRAL PAYOFF CAPSULE (Scene 7 Bloom) */}
                  <div
                    className="v4-j-payoff-capsule"
                    id="v4JourneyPayoffCapsule"
                    style={{
                      transform: `translate(-50%, -50%) perspective(800px) rotateX(${v4Tilt.x * 0.8}deg) rotateY(${v4Tilt.y * 0.8}deg) translateZ(8px)`,
                    }}
                  >
                    <div className="v4-j-payoff-icon">✨</div>
                    <div className="v4-j-payoff-content">
                      <div className="v4-j-payoff-title">Your journey, connected with Hirerkey.</div>
                      <div className="v4-j-payoff-subtitle">
                        <span className="v4-j-payoff-live-dot" />
                        <span>Empowered from Day 1</span>
                      </div>
                    </div>
                  </div>
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
          <span>Ecosystem</span>
          <Box
            component="span"
            sx={{
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
          <span>Living Dashboard</span>
          <Box
            component="span"
            sx={{
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
          aria-label="Page 3: The Employee Journey"
          title="The Employee Journey (Key 3)"
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
          <span>Employee Journey</span>
          <Box
            component="span"
            sx={{
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
            New
          </Box>
          <Box
            component="span"
            sx={{
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
