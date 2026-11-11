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
}) => {
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
      const nextInput = document.getElementById();
      nextInput?.focus();
    }
  };

  const handleV4OtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !v4OtpDigits[index] && index > 0) {
      const prevInput = document.getElementById();
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
        p: { xs: 2, md: 4 },
        backgroundColor: '#F6F1FF',
        backgroundImage: ,
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

                {/* Animated Workflow Stage */}
                <Box
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
