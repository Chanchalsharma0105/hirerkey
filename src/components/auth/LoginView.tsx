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
import { motion, AnimatePresence } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiFingerPrint, HiArrowRight, HiCheck, HiEye, HiEyeSlash } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoft } from 'react-icons/si';

export type AuthMode = 'otp' | 'password' | 'passkey';

export interface LoginViewProps {
  onSuccessLogin?: (email: string, method: AuthMode) => void;
  className?: string;
  defaultView?: 1 | 2 | 3 | 4;
}

const STORIES = [
  {
    quote: "“Hirerkey transformed how we manage people, performance, and daily feedback across our distributed teams. Effortless and intuitive.”",
    author: "Leena Al-Hashemi",
    role: "Head of People & Culture • Earth Hotels UAE"
  },
  {
    quote: "“The automated workflows and pulse surveys give our leadership team real-time visibility without administrative overhead.”",
    author: "Rahul Sharma",
    role: "VP of People Operations • Global Enterprises"
  },
  {
    quote: "“Enterprise-grade security, lightning-fast UX, and UAE data residency compliance make Hirerkey our trusted workforce system.”",
    author: "Aisha Al-Mansoor",
    role: "Chief Technology Officer • MENA FinTech"
  }
];

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccessLogin,
  className,
  defaultView = 4,
}) => {
  const [viewPage, setViewPage] = useState<1 | 2 | 3 | 4>(defaultView as 1 | 2 | 3 | 4);
  const [authTab, setAuthTab] = useState<'otp' | 'password'>('otp');
  const [step, setStep] = useState<'form' | 'otp_verify'>('form');
  const [email, setEmail] = useState('alex.chen@earthhotels.com');
  const [password, setPassword] = useState('EarthHotels2026!#');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [otpBoxes, setOtpBoxes] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(29);
  const [loading, setLoading] = useState(false);
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  // View 2 form states
  const [v2AuthMode, setV2AuthMode] = useState<'otp' | 'password'>('otp');
  const [v2OtpStep, setV2OtpStep] = useState<'input' | 'verify'>('input');
  const [v2OtpDigits, setV2OtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [v2OtpSecondsLeft, setV2OtpSecondsLeft] = useState(29);
  const [v2Email, setV2Email] = useState('alex.chen@earthhotels.com');
  const [v2Password, setV2Password] = useState('EarthHotels2026!#');
  const [v2ShowPassword, setV2ShowPassword] = useState(false);
  const [orbTilt, setOrbTilt] = useState({ x: 0, y: 0 });

  // View 3 form states (SyncWise inspired with 3D dashboard preview)
  const [v3AuthMode, setV3AuthMode] = useState<'password' | 'otp'>('password');
  const [v3Email, setV3Email] = useState('alex.chen@earthhotels.com');
  const [v3Password, setV3Password] = useState('EarthHotels2026!#');
  const [v3ShowPassword, setV3ShowPassword] = useState(false);
  const [v3RememberMe, setV3RememberMe] = useState(true);
  const [v3OtpStep, setV3OtpStep] = useState<'input' | 'verify'>('input');
  const [v3OtpDigits, setV3OtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [v3OtpSecondsLeft, setV3OtpSecondsLeft] = useState(29);
  const [v3IsHeroLeft, setV3IsHeroLeft] = useState(true);
  const [v3Tilt, setV3Tilt] = useState({ x: 10, y: -8 });

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

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOrbTilt({ x: -y * 14, y: x * 14 });
  };

  const handleHeroMouseLeave = () => {
    setOrbTilt({ x: 0, y: 0 });
  };

  const handleV3MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setV3Tilt({ x: 10 - y * 14, y: -8 + x * 16 });
  };

  const handleV3MouseLeave = () => {
    setV3Tilt({ x: 10, y: -8 });
  };

  const handleV4MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setV4Tilt({ x: -y * 12, y: x * 12 });
  };

  const handleV4MouseLeave = () => {
    setV4Tilt({ x: 0, y: 0 });
  };

  // Keyboard navigation for Four-View switching (1, 2, 3, 4, Left Arrow, Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === '1') setViewPage(1);
      if (e.key === '2') setViewPage(2);
      if (e.key === '3') setViewPage(3);
      if (e.key === '4') setViewPage(4);
      if (e.key === 'ArrowLeft') setViewPage((p) => (p === 1 ? 4 : ((p - 1) as 1 | 2 | 3 | 4)));
      if (e.key === 'ArrowRight') setViewPage((p) => (p === 4 ? 1 : ((p + 1) as 1 | 2 | 3 | 4)));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // View 4 OTP countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (viewPage === 4 && v4OtpStep === 'verify' && v4OtpSecondsLeft > 0) {
      timer = setInterval(() => {
        setV4OtpSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [viewPage, v4OtpStep, v4OtpSecondsLeft]);

  const handleV2Login = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v2Email || !v2Password) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v2Email.trim())) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v2Email, 'password');
    }, 800);
  };

  const handleV2SendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v2Email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v2Email.trim())) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setV2OtpStep('verify');
      setV2OtpSecondsLeft(29);
    }, 600);
  };

  const handleV2VerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const code = v2OtpDigits.join('');
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v2Email, 'otp');
    }, 800);
  };

  const handleV2OtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const nextDigits = [...v2OtpDigits];
    nextDigits[index] = clean ? clean[clean.length - 1] : '';
    setV2OtpDigits(nextDigits);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`v2-otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleV2OtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !v2OtpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`v2-otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  // View 2 OTP Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (v2OtpStep === 'verify' && v2OtpSecondsLeft > 0) {
      timer = setInterval(() => setV2OtpSecondsLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [v2OtpStep, v2OtpSecondsLeft]);

  // View 3 OTP Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (v3OtpStep === 'verify' && v3OtpSecondsLeft > 0) {
      timer = setInterval(() => setV3OtpSecondsLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [v3OtpStep, v3OtpSecondsLeft]);

  const handleV3Login = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v3Email || !v3Password) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v3Email.trim())) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v3Email, 'password');
    }, 800);
  };

  const handleV3SendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v3Email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v3Email.trim())) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setV3OtpStep('verify');
      setV3OtpSecondsLeft(29);
    }, 600);
  };

  const handleV3VerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const code = v3OtpDigits.join('');
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v3Email, 'otp');
    }, 800);
  };

  const handleV3OtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const nextDigits = [...v3OtpDigits];
    nextDigits[index] = clean ? clean[clean.length - 1] : '';
    setV3OtpDigits(nextDigits);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`v3-otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleV3OtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !v3OtpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`v3-otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

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

  // OTP Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp_verify' && otpSecondsLeft > 0) {
      timer = setInterval(() => setOtpSecondsLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpSecondsLeft]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep('otp_verify');
    setOtpSecondsLeft(29);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(email, 'password');
    }, 800);
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const copy = [...otpBoxes];
    copy[index] = clean.slice(-1);
    setOtpBoxes(copy);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`react-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpBoxes.join('').length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(email, 'otp');
    }, 1000);
  };

  const handlePasskeySuccess = () => {
    setPasskeyModalOpen(false);
    onSuccessLogin?.(email, 'passkey');
  };

  const nextStory = () => setStoryIndex((prev) => (prev + 1) % STORIES.length);
  const prevStory = () => setStoryIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);

  const isView1 = viewPage === 1;
  const isView2 = viewPage === 2;
  const isView3 = viewPage === 3;
  const isView4 = viewPage === 4;

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
        pb: { xs: 12, md: 14 },
        backgroundColor: isView1 ? '#0B0719' : isView2 ? '#EAE7F8' : isView3 ? '#EEF2F6' : '#ECE5FF',
        backgroundImage: isView1
          ? `
            radial-gradient(circle at 12% 22%, rgba(59, 130, 246, 0.42) 0%, rgba(99, 102, 241, 0.28) 32%, transparent 64%),
            radial-gradient(circle at 48% 14%, rgba(168, 85, 247, 0.48) 0%, rgba(124, 58, 237, 0.25) 36%, transparent 68%),
            radial-gradient(circle at 86% 20%, rgba(236, 72, 153, 0.52) 0%, rgba(244, 63, 94, 0.35) 28%, transparent 64%),
            radial-gradient(circle at 94% 68%, rgba(251, 146, 60, 0.38) 0%, rgba(245, 158, 11, 0.22) 32%, transparent 60%),
            radial-gradient(circle at 18% 84%, rgba(139, 92, 246, 0.36) 0%, rgba(109, 40, 217, 0.22) 35%, transparent 65%),
            linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5, 3, 12, 0.78) 100%)
          `
          : isView2
          ? `
            radial-gradient(circle at 14% 18%, rgba(216, 180, 254, 0.7) 0%, rgba(192, 132, 252, 0.35) 30%, transparent 65%),
            radial-gradient(circle at 86% 16%, rgba(244, 114, 182, 0.55) 0%, rgba(236, 72, 153, 0.28) 28%, transparent 60%),
            radial-gradient(circle at 50% 84%, rgba(167, 139, 250, 0.5) 0%, rgba(139, 92, 246, 0.22) 36%, transparent 65%),
            radial-gradient(circle at 88% 76%, rgba(56, 189, 248, 0.42) 0%, transparent 56%),
            radial-gradient(circle at 18% 78%, rgba(192, 132, 252, 0.42) 0%, transparent 58%),
            linear-gradient(rgba(124, 58, 237, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.045) 1px, transparent 1px)
          `
          : isView3
          ? `
            radial-gradient(circle at 14% 18%, rgba(216, 180, 254, 0.45) 0%, transparent 55%),
            radial-gradient(circle at 86% 16%, rgba(199, 210, 254, 0.45) 0%, transparent 55%),
            radial-gradient(circle at 50% 84%, rgba(224, 231, 255, 0.5) 0%, transparent 60%),
            linear-gradient(rgba(124, 58, 237, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.035) 1px, transparent 1px)
          `
          : `
            radial-gradient(circle at 45% 12%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 45%),
            radial-gradient(ellipse 65% 55% at 88% 12%, rgba(139, 92, 246, 0.72) 0%, rgba(124, 58, 237, 0.45) 30%, rgba(168, 85, 247, 0.22) 55%, transparent 75%),
            radial-gradient(ellipse 60% 50% at 10% 88%, rgba(109, 40, 217, 0.65) 0%, rgba(124, 58, 237, 0.42) 32%, rgba(167, 139, 250, 0.2) 58%, transparent 75%),
            radial-gradient(ellipse 50% 40% at 28% 42%, rgba(216, 180, 254, 0.45) 0%, rgba(233, 213, 255, 0.2) 40%, transparent 65%),
            radial-gradient(circle at 86% 82%, rgba(192, 132, 252, 0.4) 0%, rgba(168, 85, 247, 0.18) 45%, transparent 68%),
            linear-gradient(135deg, #F5F0FF 0%, #E9DEFF 25%, #E1D2FE 55%, #EDE4FF 82%, #F3ECFF 100%)
          `,
        backgroundSize: isView1
          ? '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 46px 46px, 46px 46px, 100% 100%'
          : isView2
          ? '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 46px 46px, 46px 46px'
          : isView3
          ? '100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px'
          : '100% 100%',
        color: isView1 ? '#FFFFFF' : '#0F172A',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        transition: 'background-color 0.45s ease',
      }}
    >
      <AnimatePresence mode="wait">
        {isView1 ? (
          <motion.div
            key="view-1"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {/* Central Glass Card (View 1) */}
            <Box
        sx={{
          width: '100%',
          maxWidth: '1050px',
          minHeight: '640px',
          background: 'rgba(22, 16, 36, 0.68)',
          backdropFilter: 'blur(40px) saturate(185%)',
          WebkitBackdropFilter: 'blur(40px) saturate(185%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '36px',
          boxShadow: '0 35px 100px -20px rgba(0, 0, 0, 0.85), 0 0 50px rgba(124, 58, 237, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.02fr 1.08fr' },
          p: { xs: 3, md: '34px 34px 34px 36px' },
          gap: { xs: 3, md: '34px' },
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* LEFT COLUMN: AUTH FORM */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: { xs: 1, md: '16px 14px 10px 10px' } }}>
          <Box>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(124, 58, 237, 0.12) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="3" width="6" height="15" rx="3" transform="rotate(-30 4 3)" fill="#C084FC" />
                  <rect x="13" y="3" width="6" height="15" rx="3" transform="rotate(-30 13 3)" fill="#F472B6" />
                  <circle cx="17" cy="18" r="3" fill="#EC4899" />
                </svg>
              </Box>
              <Typography level="title-lg" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: 25, letterSpacing: '-0.04em' }}>
                h<span style={{ color: '#C084FC' }}>i</span>rerke<span style={{ color: '#C084FC' }}>y</span>
              </Typography>
            </Box>

            <Typography level="h2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: 32, mb: 0.75, letterSpacing: '-0.03em' }}>
              Welcome back
            </Typography>
            <Typography level="body-sm" sx={{ color: '#94A3B8', mb: 2.75 }}>
              One platform to manage people, performance &amp; workflows
            </Typography>

            {/* Auth Mode Switcher */}
            <Box
              sx={{
                display: 'inline-flex',
                bgcolor: 'rgba(10, 7, 20, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                p: '3px',
                mb: 2.75,
                gap: '4px',
              }}
            >
              <Button
                variant="plain"
                size="sm"
                onClick={() => { setAuthTab('otp'); setStep('form'); }}
                sx={{
                  borderRadius: '9999px',
                  px: 2,
                  py: 0.5,
                  fontSize: 12.5,
                  fontWeight: 600,
                  bgcolor: authTab === 'otp' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(124, 58, 237, 0.2) 100%)' : 'transparent',
                  color: authTab === 'otp' ? '#FFFFFF' : '#94A3B8',
                  border: authTab === 'otp' ? '1px solid rgba(168, 85, 247, 0.4)' : 'none',
                }}
              >
                Email OTP
              </Button>
              <Button
                variant="plain"
                size="sm"
                onClick={() => { setAuthTab('password'); setStep('form'); }}
                sx={{
                  borderRadius: '9999px',
                  px: 2,
                  py: 0.5,
                  fontSize: 12.5,
                  fontWeight: 600,
                  bgcolor: authTab === 'password' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(124, 58, 237, 0.2) 100%)' : 'transparent',
                  color: authTab === 'password' ? '#FFFFFF' : '#94A3B8',
                  border: authTab === 'password' ? '1px solid rgba(168, 85, 247, 0.4)' : 'none',
                }}
              >
                Password
              </Button>
            </Box>

            <AnimatePresence mode="wait">
              {step === 'form' && authTab === 'otp' && (
                <motion.div
                  key="form-otp"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleSendOTP}>
                    <Box sx={{ mb: 2 }}>
                      <Typography level="body-xs" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1 }}>
                        Business Email <span style={{ color: '#F43F5E' }}>*</span>
                      </Typography>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your Email"
                        startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                        sx={{
                          height: 50,
                          borderRadius: '9999px',
                          bgcolor: 'rgba(12, 8, 24, 0.82)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          '--Input-focusedHighlight': '#A855F7',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.75 }}>
                      <Typography level="body-xs" sx={{ color: '#94A3B8' }}>
                        Not getting OTP?
                      </Typography>
                      <Button
                        variant="plain"
                        size="sm"
                        onClick={() => setPasskeyModalOpen(true)}
                        sx={{ color: '#A855F7', fontWeight: 600, p: 0, '&:hover': { bgcolor: 'transparent', color: '#DDD6FE' } }}
                      >
                        Sign in with Passkey
                      </Button>
                    </Box>

                    <Button
                      type="submit"
                      sx={{
                        width: '100%',
                        height: 52,
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #6D28D9 100%)',
                        fontWeight: 700,
                        fontSize: 15.5,
                        boxShadow: '0 10px 28px -4px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #B568F8 0%, #8B5CF6 50%, #7C3AED 100%)',
                        },
                      }}
                      endDecorator={<HiArrowRight />}
                    >
                      Send OTP
                    </Button>
                  </form>

                  <Box sx={{ textAlign: 'center', mt: 1.75 }}>
                    <Button
                      variant="plain"
                      size="sm"
                      onClick={() => setHelpModalOpen(true)}
                      sx={{ color: '#94A3B8', fontSize: 13, '&:hover': { color: '#CBD5E1' } }}
                    >
                      Can't access your login email?
                    </Button>
                  </Box>
                </motion.div>
              )}

              {step === 'form' && authTab === 'password' && (
                <motion.div
                  key="form-password"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handlePasswordLogin}>
                    <Box sx={{ mb: 2 }}>
                      <Typography level="body-xs" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1 }}>
                        Business Email <span style={{ color: '#F43F5E' }}>*</span>
                      </Typography>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex.chen@earthhotels.com"
                        startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                        sx={{
                          height: 50,
                          borderRadius: '9999px',
                          bgcolor: 'rgba(12, 8, 24, 0.82)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          '--Input-focusedHighlight': '#A855F7',
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography level="body-xs" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1 }}>
                        Password <span style={{ color: '#F43F5E' }}>*</span>
                      </Typography>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        startDecorator={<HiLockClosed color="#94A3B8" size={18} />}
                        endDecorator={
                          <Button
                            variant="plain"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ color: '#94A3B8', p: 0, minWidth: 28 }}
                          >
                            {showPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                          </Button>
                        }
                        sx={{
                          height: 50,
                          borderRadius: '9999px',
                          bgcolor: 'rgba(12, 8, 24, 0.82)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          '--Input-focusedHighlight': '#A855F7',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <input
                          type="checkbox"
                          checked={keepLoggedIn}
                          onChange={(e) => setKeepLoggedIn(e.target.checked)}
                          style={{ accentColor: '#7C3AED', cursor: 'pointer' }}
                        />
                        <Typography level="body-xs" sx={{ color: '#CBD5E1', cursor: 'pointer' }}>
                          Keep me logged in
                        </Typography>
                      </Box>
                      <Button
                        variant="plain"
                        size="sm"
                        onClick={() => setHelpModalOpen(true)}
                        sx={{ color: '#94A3B8', fontWeight: 500, p: 0, '&:hover': { color: '#CBD5E1' } }}
                      >
                        Forgot Password?
                      </Button>
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 52,
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #6D28D9 100%)',
                        fontWeight: 700,
                        fontSize: 15.5,
                        boxShadow: '0 10px 28px -4px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #B568F8 0%, #8B5CF6 50%, #7C3AED 100%)',
                        },
                      }}
                      endDecorator={<HiArrowRight />}
                    >
                      Sign in
                    </Button>
                  </form>
                </motion.div>
              )}

              {step === 'otp_verify' && (
                <motion.div
                  key="step-otp-verify"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography level="title-md" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: 24, mb: 0.5 }}>
                    Enter Verification Code
                  </Typography>
                  <Typography level="body-sm" sx={{ color: '#94A3B8', mb: 3 }}>
                    Dispatched 6-digit code to <strong style={{ color: '#FFFFFF' }}>{email}</strong>
                  </Typography>

                  <form onSubmit={handleVerifyOTP}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', mb: 3 }}>
                      {otpBoxes.map((val, idx) => (
                        <input
                          key={idx}
                          id={`react-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          style={{
                            width: 44,
                            height: 52,
                            borderRadius: 14,
                            backgroundColor: 'rgba(10, 8, 20, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            color: '#FFFFFF',
                            textAlign: 'center',
                            fontSize: 22,
                            fontWeight: 'bold',
                            outline: 'none',
                          }}
                        />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, fontSize: 13, color: '#94A3B8' }}>
                      <span>Didn't receive code?</span>
                      {otpSecondsLeft > 0 ? (
                        <span style={{ color: '#A855F7', fontWeight: 600 }}>0:{otpSecondsLeft < 10 ? `0${otpSecondsLeft}` : otpSecondsLeft}</span>
                      ) : (
                        <Button
                          variant="plain"
                          size="sm"
                          onClick={() => setOtpSecondsLeft(29)}
                          sx={{ color: '#A855F7', p: 0, fontWeight: 600 }}
                        >
                          Resend OTP
                        </Button>
                      )}
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 52,
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #6D28D9 100%)',
                        fontWeight: 700,
                      }}
                      endDecorator={<HiCheck />}
                    >
                      Verify &amp; Sign In
                    </Button>
                  </form>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="plain"
                      size="sm"
                      onClick={() => setStep('form')}
                      sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}
                    >
                      ← Back to Email entry
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Social SSO and Footer */}
          <Box sx={{ mt: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
              <Typography level="body-xs" sx={{ color: '#64748B', textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em', fontWeight: 600 }}>
                Or continue with
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Button
                variant="outlined"
                sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#FFFFFF', p: 0, minWidth: 44, border: 'none' }}
                onClick={() => onSuccessLogin?.(email, 'otp')}
              >
                <FcGoogle size={20} />
              </Button>
              <Button
                variant="outlined"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  p: 0,
                  minWidth: 44,
                }}
                onClick={() => onSuccessLogin?.(email, 'otp')}
              >
                <SiMicrosoft color="#00A4EF" size={16} />
              </Button>
              <Button
                variant="outlined"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  p: 0,
                  minWidth: 44,
                }}
                onClick={() => setPasskeyModalOpen(true)}
              >
                <HiFingerPrint color="#A855F7" size={20} />
              </Button>
            </Box>

            <Typography level="body-xs" sx={{ textAlign: 'center', color: '#64748B', fontSize: 11.5 }}>
              By continuing, you agree to our Terms of Use and Privacy Policy
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1.5, fontSize: 11, color: '#64748B' }}>
              <span>🛡️ Enterprise-Grade</span>
              <span>•</span>
              <span>🇦🇪 UAE Data Centers</span>
              <span>•</span>
              <span>🔒 GDPR Compliant</span>
            </Box>
          </Box>
        </Box>

        {/* RIGHT COLUMN: HERO & TESTIMONIAL SHOWCASE */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative', width: '100%', height: '100%' }}>
          {/* Dark Hero Card Container with Precise SVG Notch Background */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: 570,
              display: 'flex',
              flexDirection: 'column',
              p: '42px 38px 130px 38px',
              borderRadius: '28px',
              overflow: 'hidden',
            }}
          >
            {/* SVG Background Layer */}
            <Box
              component="svg"
              viewBox="0 0 460 580"
              preserveAspectRatio="none"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              <defs>
                <linearGradient id="react-hero-grad" x1="0%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#120C26" />
                  <stop offset="60%" stopColor="#080518" />
                  <stop offset="100%" stopColor="#04020D" />
                </linearGradient>
              </defs>
              <path
                d="M 28 0 H 345 C 368 0 378 16 386 34 C 392 48 406 58 424 58 H 432 A 28 28 0 0 1 460 86 V 552 A 28 28 0 0 1 432 580 H 28 A 28 28 0 0 1 0 552 V 28 A 28 28 0 0 1 28 0 Z"
                fill="url(#react-hero-grad)"
                stroke="rgba(255, 255, 255, 0.11)"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            </Box>

            {/* Radiant 16-Ray Starburst Background Motif */}
            <Box
              component="svg"
              viewBox="0 0 400 400"
              sx={{
                position: 'absolute',
                right: -30,
                bottom: 70,
                width: 360,
                height: 360,
                pointerEvents: 'none',
                opacity: 0.85,
                zIndex: 1,
              }}
            >
              <defs>
                <linearGradient id="react-starburst-grad" x1="15%" y1="10%" x2="90%" y2="90%">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="45%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
              <polygon points="200,200 200,175 200,40 206,175" fill="url(#react-starburst-grad)" opacity="0.9" />
              <polygon points="200,200 175,200 40,200 175,206" fill="url(#react-starburst-grad)" opacity="0.9" />
              <polygon points="200,200 200,225 200,360 194,225" fill="url(#react-starburst-grad)" opacity="0.9" />
              <polygon points="200,200 225,200 360,200 225,194" fill="url(#react-starburst-grad)" opacity="0.9" />
              <polygon points="200,200 182,182 86,86 186,178" fill="url(#react-starburst-grad)" opacity="0.85" />
              <polygon points="200,200 218,182 314,86 214,178" fill="url(#react-starburst-grad)" opacity="0.85" />
              <polygon points="200,200 182,218 86,314 178,214" fill="url(#react-starburst-grad)" opacity="0.85" />
              <polygon points="200,200 218,218 314,314 222,214" fill="url(#react-starburst-grad)" opacity="0.85" />
              <circle cx="200" cy="200" r="14" fill="url(#react-starburst-grad)" opacity="0.4" />
              <circle cx="200" cy="200" r="6" fill="#FFFFFF" opacity="0.95" />
            </Box>

            <Typography level="h3" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: 32, mb: 1, letterSpacing: '-0.03em', zIndex: 2 }}>
              What Leaders Say.
            </Typography>
            <Typography sx={{ color: '#A855F7', fontSize: 56, lineHeight: 0.8, mb: 1.5, zIndex: 2 }}>
              “
            </Typography>
            <Typography sx={{ color: '#CBD5E1', fontSize: 15, lineHeight: 1.6, mb: 3, minHeight: 70, zIndex: 2 }}>
              {STORIES[storyIndex].quote}
            </Typography>
            <Typography level="title-sm" sx={{ color: '#FFFFFF', fontWeight: 700, zIndex: 2 }}>
              {STORIES[storyIndex].author}
            </Typography>
            <Typography level="body-xs" sx={{ color: '#94A3B8', mb: 3, zIndex: 2 }}>
              {STORIES[storyIndex].role}
            </Typography>

            {/* Arrows */}
            <Box sx={{ display: 'flex', gap: 1.5, zIndex: 2 }}>
              <Button
                variant="solid"
                size="sm"
                onClick={prevStory}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                }}
              >
                ←
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={nextStory}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                }}
              >
                →
              </Button>
            </Box>
          </Box>

          {/* Overlapping White Floating Card (With Exact Organic Scoop Notch) */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -16,
              right: -16,
              width: 326,
              height: 194,
              zIndex: 10,
              filter: 'drop-shadow(0 24px 50px rgba(0, 0, 0, 0.72)) drop-shadow(0 4px 14px rgba(0, 0, 0, 0.25))',
              transition: 'transform 0.25s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
              },
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 326 194"
              preserveAspectRatio="none"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              <path
                d="M 24 0 H 182 C 200 0 212 12 220 24 C 228 34 238 38 252 38 H 302 A 24 24 0 0 1 326 62 V 170 A 24 24 0 0 1 302 194 H 24 A 24 24 0 0 1 0 170 V 24 A 24 24 0 0 1 24 0 Z"
                fill="#FFFFFF"
              />
            </Box>

            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                p: '22px 22px 18px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#0F172A',
              }}
            >
              <Box>
                <Typography level="title-md" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5, fontSize: 15 }}>
                  Workplace Intelligence AI
                </Typography>
                <Typography level="body-xs" sx={{ color: '#475569', mb: 2, lineHeight: 1.45, maxWidth: 260 }}>
                  Empower your modern workforce with continuous feedback, goal tracking, and automated approvals.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography level="body-xs" sx={{ color: '#059669', bgcolor: '#ECFDF5', px: 1, py: 0.5, borderRadius: '9999px', fontWeight: 600 }}>
                  UAE Data Centers
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="aisha_avatar.png"
                    alt="Aisha"
                    sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #FFFFFF' }}
                  />
                  <Box
                    component="img"
                    src="sara_avatar.png"
                    alt="Sara"
                    sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #FFFFFF', ml: -1 }}
                  />
                  <Box
                    component="img"
                    src="rahul_avatar.png"
                    alt="Rahul"
                    sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #FFFFFF', ml: -1 }}
                  />
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: '#0F172A',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF',
                      ml: -1,
                    }}
                  >
                    +48
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
            </Box>
          </motion.div>
        ) : viewPage === 2 ? (
          <motion.div
            key="view-2"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {/* VIEW 2: SMART AI ASSISTANT EXPERIENCE */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '1040px',
                minHeight: '640px',
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(45px) saturate(160%)',
                WebkitBackdropFilter: 'blur(45px) saturate(160%)',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                borderRadius: '36px',
                boxShadow:
                  '0 35px 85px -15px rgba(124, 58, 237, 0.16), 0 15px 35px -5px rgba(15, 23, 42, 0.06), inset 0 1px 2px rgba(255, 255, 255, 1)',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
                p: { xs: 2.5, md: '26px' },
                gap: { xs: 3, md: '28px' },
                position: 'relative',
                zIndex: 10,
              }}
            >
              {/* LEFT COLUMN: HERO SHOWCASE */}
              <Box
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                sx={{
                  position: 'relative',
                  borderRadius: '28px',
                  background: 'linear-gradient(145deg, #DDD6FE 0%, #E9D5FF 28%, #F5D0FE 62%, #E0E7FF 100%)',
                  overflow: 'hidden',
                  p: { xs: 3, md: '34px 32px 30px 32px' },
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: 'inset 0 2px 6px rgba(255, 255, 255, 0.8), 0 8px 24px rgba(124, 58, 237, 0.08)',
                }}
              >
                {/* Aura Blobs */}
                <Box
                  component={motion.div}
                  animate={{ x: [-15, 15, -15], y: [10, -10, 10] }}
                  transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    top: -40,
                    left: '10%',
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    bgcolor: 'rgba(244, 114, 182, 0.38)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <Box
                  component={motion.div}
                  animate={{ x: [15, -15, 15], y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 1 }}
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    right: -30,
                    width: 260,
                    height: 260,
                    borderRadius: '50%',
                    bgcolor: 'rgba(168, 85, 247, 0.4)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <Box
                  component={motion.div}
                  animate={{ x: [-10, 10, -10], y: [-15, 15, -15] }}
                  transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut', delay: 2 }}
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: '20%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    bgcolor: 'rgba(56, 189, 248, 0.32)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />

                {/* Top Tag & Typography */}
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '9999px',
                      bgcolor: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.75)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#6D28D9',
                      mb: 1.5,
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)',
                    }}
                  >
                    <Typography component="span" sx={{ color: '#A855F7', fontSize: 12 }}>✦</Typography>
                    <span>SMART AI ASSISTANCE</span>
                  </Box>

                  <Typography
                    level="h1"
                    sx={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 56,
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      lineHeight: 0.95,
                      background: 'linear-gradient(180deg, #FFFFFF 25%, rgba(255, 255, 255, 0.88) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 4px 18px rgba(124, 58, 237, 0.28))',
                      userSelect: 'none',
                    }}
                  >
                    SMART AI
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: 'rgba(255, 255, 255, 0.72)',
                      mt: 0.5,
                      userSelect: 'none',
                    }}
                  >
                    WORKPLACE INTELLIGENCE
                  </Typography>
                </Box>

                {/* 3D Iridescent Orb Stage */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 2,
                  }}
                >
                  {/* Floating Sparkles with Parallax Depth */}
                  <Box component={motion.div} animate={{ y: [-8, 4, -8], opacity: [0.9, 0.4, 0.9], x: orbTilt.y * 0.4 }} transition={{ repeat: Infinity, duration: 3.6 }} sx={{ position: 'absolute', top: '10%', left: '16%', color: '#FFFFFF', fontSize: 18, filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.85))', zIndex: 5 }}>✦</Box>
                  <Box component={motion.div} animate={{ y: [6, -10, 6], opacity: [0.95, 0.35, 0.95], x: -orbTilt.y * 0.5 }} transition={{ repeat: Infinity, duration: 4.2, delay: 0.8 }} sx={{ position: 'absolute', top: '30%', right: '14%', color: '#FFFFFF', fontSize: 14, filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.85))', zIndex: 5 }}>✦</Box>
                  <Box component={motion.div} animate={{ y: [-6, 6, -6], opacity: [0.85, 0.3, 0.85], x: orbTilt.y * 0.3 }} transition={{ repeat: Infinity, duration: 3.8, delay: 1.5 }} sx={{ position: 'absolute', bottom: '22%', left: '20%', color: '#FFFFFF', fontSize: 16, filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.85))', zIndex: 5 }}>✦</Box>

                  {/* Outer Parallax Tilt Stage */}
                  <motion.div
                    animate={{ rotateX: orbTilt.x, rotateY: orbTilt.y }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                    style={{ perspective: 800, transformStyle: 'preserve-3d', willChange: 'transform' }}
                  >
                    {/* Inner Levitating Orb */}
                    <Box
                      component={motion.div}
                      animate={{ y: [-20, 0, -20], rotate: [2, 0, 2], scale: [1.025, 1, 1.025] }}
                      transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                      sx={{
                        position: 'relative',
                        width: 164,
                        height: 164,
                        zIndex: 4,
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          position: 'relative',
                          background: 'radial-gradient(circle at 38% 30%, #FFFFFF 0%, #FDF2F8 12%, #F472B6 28%, #D946EF 46%, #A855F7 65%, #7C3AED 84%, #3B0764 100%)',
                          boxShadow: 'inset 0 -18px 32px rgba(34, 211, 238, 0.78), inset 0 14px 24px rgba(255, 255, 255, 0.98), inset 10px 0 18px rgba(244, 114, 182, 0.58), inset -10px 0 18px rgba(168, 85, 247, 0.58), 0 28px 55px -10px rgba(124, 58, 237, 0.48)',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Caustic Dispersion Highlight Ring */}
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 8,
                            borderRadius: '50%',
                            border: '1.5px solid rgba(255, 255, 255, 0.55)',
                            filter: 'blur(0.8px)',
                            boxShadow: 'inset 0 0 12px rgba(168, 85, 247, 0.5)',
                            pointerEvents: 'none',
                          }}
                        />
                        {/* Specular Highlight */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 24,
                            width: 72,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0) 100%)',
                            transform: 'rotate(-25deg)',
                            filter: 'blur(0.6px)',
                            pointerEvents: 'none',
                          }}
                        />
                        {/* Cyan Refraction Pool */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 80,
                            borderRadius: '0 0 82px 82px',
                            background: 'radial-gradient(circle at 50% 100%, rgba(45, 212, 191, 0.98) 0%, rgba(56, 189, 248, 0.8) 35%, transparent 75%)',
                            mixBlendMode: 'screen',
                            pointerEvents: 'none',
                          }}
                        />
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Recessed Pocket Slit Shelf and Upward Flare */}
                  <Box sx={{ position: 'relative', mt: '-14px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    {/* Upward Flare */}
                    <Box
                      component={motion.div}
                      animate={{ opacity: [0.9, 0.45, 0.9], scale: [1, 1.15, 1], y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                      sx={{
                        position: 'absolute',
                        top: -30,
                        width: 180,
                        height: 40,
                        background: 'radial-gradient(ellipse at 50% 100%, rgba(34, 211, 238, 0.45) 0%, rgba(168, 85, 247, 0.3) 40%, transparent 75%)',
                        filter: 'blur(6px)',
                        pointerEvents: 'none',
                      }}
                    />
                    <Box
                      sx={{
                        width: 236,
                        height: 12,
                        borderRadius: '9999px',
                        background: 'linear-gradient(180deg, #1E1035 0%, #2E1065 60%, #4C1D95 100%)',
                        position: 'relative',
                        boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.55), inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(255, 255, 255, 0.85), 0 0 22px rgba(168, 85, 247, 0.5)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        component={motion.div}
                        animate={{ opacity: [1, 0.72, 1], scaleX: [1, 0.92, 1] }}
                        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                        sx={{
                          position: 'absolute',
                          top: 1,
                          width: '85%',
                          height: 2.5,
                          background: 'linear-gradient(90deg, transparent 0%, #22D3EE 20%, #FFFFFF 50%, #E879F9 80%, transparent 100%)',
                          filter: 'blur(0.6px)',
                          boxShadow: '0 0 10px #22D3EE, 0 0 16px rgba(168, 85, 247, 0.85)',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          width: 48,
                          height: 3,
                          borderRadius: '9999px',
                          bgcolor: '#FFFFFF',
                          boxShadow: '0 0 8px #FFFFFF, 0 0 16px #38BDF8',
                          filter: 'blur(0.4px)',
                        }}
                      />
                    </Box>
                    {/* Dynamic Breathing Shadow */}
                    <Box
                      component={motion.div}
                      animate={{ scaleX: [1, 0.78, 1], scaleY: [1, 0.7, 1], opacity: [0.55, 0.24, 0.55] }}
                      transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                      sx={{
                        width: 160,
                        height: 16,
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse at center, rgba(109, 40, 217, 0.55) 0%, rgba(91, 33, 182, 0.22) 50%, transparent 75%)',
                        mt: 0.75,
                        filter: 'blur(5px)',
                      }}
                    />
                  </Box>
                </Box>

                {/* Bottom Headline & Description */}
                <Box sx={{ position: 'relative', zIndex: 2, mt: 1 }}>
                  <Typography level="h3" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em', mb: 1 }}>
                    Intelligent AI Assistance
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: '#475569', lineHeight: 1.55 }}>
                    Experience smarter conversations with AI-powered responses, personalized insights &amp; seamless productivity across every interaction.
                  </Typography>
                </Box>
              </Box>

              {/* RIGHT COLUMN: AUTHENTICATION FORM */}
              <Box sx={{ p: { xs: 1, md: '10px 14px 6px 14px' }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  {/* Floating Hirerkey Monogram Badge */}
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      bgcolor: '#FFFFFF',
                      border: '1px solid rgba(124, 58, 237, 0.16)',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                      <rect width="28" height="28" rx="8" fill="url(#v2-badge-grad-react)" />
                      <path d="M8 7v14M8 14c1.5-3 6.5-3.5 8 0v7M16 14c1.5-3 6-3 6 0v7" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="21" cy="9" r="2.2" fill="#F472B6" />
                      <defs>
                        <linearGradient id="v2-badge-grad-react" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#A855F7" />
                          <stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </Box>

                  <Typography level="h2" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 30, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em', mb: 0.5 }}>
                    Welcome Back
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: '#64748B', mb: 2.5 }}>
                    Sign in to access your unified workplace
                  </Typography>

                  {/* Auth Mode Segmented Pill Switcher (Primary Purple) */}
                  <Box
                    sx={{
                      display: 'flex',
                      bgcolor: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      borderRadius: '9999px',
                      p: '4px',
                      mb: 2.5,
                      gap: 0.5,
                      width: '100%',
                    }}
                  >
                    <Box
                      component="button"
                      type="button"
                      onClick={() => { setV2AuthMode('otp'); setV2OtpStep('input'); }}
                      sx={{
                        flex: 1,
                        py: 1,
                        px: 2,
                        borderRadius: '9999px',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.75,
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: v2AuthMode === 'otp' ? '#7C3AED' : 'transparent',
                        color: v2AuthMode === 'otp' ? '#FFFFFF' : '#64748B',
                        boxShadow: v2AuthMode === 'otp' ? '0 4px 14px rgba(124, 58, 237, 0.32)' : 'none',
                        '&:hover': {
                          color: v2AuthMode === 'otp' ? '#FFFFFF' : '#0F172A',
                        },
                      }}
                    >
                      <HiEnvelope size={15} />
                      <span>Email OTP</span>
                    </Box>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setV2AuthMode('password')}
                      sx={{
                        flex: 1,
                        py: 1,
                        px: 2,
                        borderRadius: '9999px',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.75,
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: v2AuthMode === 'password' ? '#7C3AED' : 'transparent',
                        color: v2AuthMode === 'password' ? '#FFFFFF' : '#64748B',
                        boxShadow: v2AuthMode === 'password' ? '0 4px 14px rgba(124, 58, 237, 0.32)' : 'none',
                        '&:hover': {
                          color: v2AuthMode === 'password' ? '#FFFFFF' : '#0F172A',
                        },
                      }}
                    >
                      <HiLockClosed size={15} />
                      <span>Password</span>
                    </Box>
                  </Box>

                  {/* Mode A: Email OTP */}
                  {v2AuthMode === 'otp' ? (
                    v2OtpStep === 'input' ? (
                      <Box>
                        <form onSubmit={handleV2SendOTP}>
                          <Box sx={{ mb: 1.75 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 0.75 }}>Business Email</Typography>
                            <Input
                              type="email"
                              value={v2Email}
                              onChange={(e) => setV2Email(e.target.value)}
                              startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                              placeholder="you@example.com"
                              required
                              sx={{
                                height: 48,
                                borderRadius: '14px',
                                bgcolor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                color: '#0F172A',
                                fontSize: 14,
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                                '&:focus-within': {
                                  bgcolor: '#FFFFFF',
                                  borderColor: '#7C3AED',
                                  boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15), 0 1px 3px rgba(0, 0, 0, 0.04)',
                                },
                              }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, fontSize: 13 }}>
                            <Typography sx={{ color: '#64748B', fontSize: 13 }}>Not getting OTP?</Typography>
                            <Typography
                              component="a"
                              href="#"
                              onClick={(e) => { e.preventDefault(); setPasskeyModalOpen(true); }}
                              sx={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 600, fontSize: 13, '&:hover': { textDecoration: 'underline' } }}
                            >
                              Sign in with Passkey
                            </Typography>
                          </Box>

                          <Button
                            type="submit"
                            loading={loading}
                            endDecorator={<HiArrowRight />}
                            sx={{
                              width: '100%',
                              height: 48,
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                              color: '#FFFFFF',
                              fontWeight: 600,
                              fontSize: 15,
                              boxShadow: '0 10px 24px -4px rgba(168, 85, 247, 0.45)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #B568F8 0%, #6D28D9 100%)',
                                boxShadow: '0 14px 28px -4px rgba(124, 58, 237, 0.58)',
                              },
                            }}
                          >
                            Send OTP
                          </Button>
                        </form>

                        <Typography sx={{ textAlign: 'center', mt: 2 }}>
                          <Typography
                            component="span"
                            sx={{ color: '#7C3AED', fontSize: 12, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#6D28D9', textDecoration: 'underline' } }}
                            onClick={() => setHelpModalOpen(true)}
                          >
                            Can't access your account?
                          </Typography>
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Typography level="h3" sx={{ fontSize: 20, fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                          Enter Verification Code
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: '#64748B', mb: 2 }}>
                          We sent a 6-digit code to <strong style={{ color: '#7C3AED' }}>{v2Email}</strong>
                        </Typography>

                        <form onSubmit={handleV2VerifyOTP}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                            {v2OtpDigits.map((digit, idx) => (
                              <Box
                                key={idx}
                                component="input"
                                id={`v2-otp-digit-${idx}`}
                                type="text"
                                maxLength={1}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={digit}
                                onChange={(e: any) => handleV2OtpDigitChange(idx, e.target.value)}
                                onKeyDown={(e: any) => handleV2OtpKeyDown(idx, e)}
                                sx={{
                                  width: 46,
                                  height: 52,
                                  borderRadius: '12px',
                                  bgcolor: '#FFFFFF',
                                  border: '1.5px solid #E2E8F0',
                                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                                  fontSize: 22,
                                  fontWeight: 700,
                                  color: '#0F172A',
                                  textAlign: 'center',
                                  outline: 'none',
                                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                                  '&:focus': {
                                    borderColor: '#7C3AED',
                                    boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.18)',
                                  },
                                }}
                              />
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, fontSize: 13 }}>
                            <Typography sx={{ color: '#64748B', fontSize: 13 }}>Didn't receive code?</Typography>
                            {v2OtpSecondsLeft > 0 ? (
                              <Typography sx={{ color: '#94A3B8', fontSize: 13 }}>
                                Resend in <strong style={{ color: '#7C3AED' }}>0:{v2OtpSecondsLeft < 10 ? `0${v2OtpSecondsLeft}` : v2OtpSecondsLeft}</strong>
                              </Typography>
                            ) : (
                              <Typography
                                component="span"
                                sx={{ color: '#7C3AED', fontWeight: 600, fontSize: 13, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                onClick={() => { setV2OtpSecondsLeft(29); }}
                              >
                                Resend OTP
                              </Typography>
                            )}
                          </Box>

                          <Button
                            type="submit"
                            loading={loading}
                            endDecorator={<HiArrowRight />}
                            sx={{
                              width: '100%',
                              height: 48,
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                              color: '#FFFFFF',
                              fontWeight: 600,
                              fontSize: 15,
                              boxShadow: '0 10px 24px -4px rgba(168, 85, 247, 0.45)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #B568F8 0%, #6D28D9 100%)',
                                boxShadow: '0 14px 28px -4px rgba(124, 58, 237, 0.58)',
                              },
                            }}
                          >
                            Verify &amp; Sign In
                          </Button>
                        </form>

                        <Typography sx={{ textAlign: 'center', mt: 2 }}>
                          <Typography
                            component="span"
                            sx={{ color: '#7C3AED', fontSize: 12, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#6D28D9', textDecoration: 'underline' } }}
                            onClick={() => setV2OtpStep('input')}
                          >
                            ← Back to Email entry
                          </Typography>
                        </Typography>
                      </Box>
                    )
                  ) : (
                    /* Mode B: Password */
                    <Box>
                      <form onSubmit={handleV2Login}>
                        <Box sx={{ mb: 1.75 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 0.75 }}>Email</Typography>
                          <Input
                            type="email"
                            value={v2Email}
                            onChange={(e) => setV2Email(e.target.value)}
                            startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                            placeholder="you@example.com"
                            required
                            sx={{
                              height: 48,
                              borderRadius: '14px',
                              bgcolor: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              color: '#0F172A',
                              fontSize: 14,
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                              '&:focus-within': {
                                bgcolor: '#FFFFFF',
                                borderColor: '#7C3AED',
                                boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15), 0 1px 3px rgba(0, 0, 0, 0.04)',
                              },
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 1.75 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 0.75 }}>Password</Typography>
                          <Input
                            type={v2ShowPassword ? 'text' : 'password'}
                            value={v2Password}
                            onChange={(e) => setV2Password(e.target.value)}
                            startDecorator={<HiLockClosed color="#94A3B8" size={18} />}
                            endDecorator={
                              <Box
                                component="button"
                                type="button"
                                onClick={() => setV2ShowPassword(!v2ShowPassword)}
                                sx={{ background: 'none', border: 'none', p: 0, cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' }}
                              >
                                {v2ShowPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                              </Box>
                            }
                            placeholder="••••••••"
                            required
                            sx={{
                              height: 48,
                              borderRadius: '14px',
                              bgcolor: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              color: '#0F172A',
                              fontSize: 14,
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                              '&:focus-within': {
                                bgcolor: '#FFFFFF',
                                borderColor: '#7C3AED',
                                boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15), 0 1px 3px rgba(0, 0, 0, 0.04)',
                              },
                            }}
                          />
                        </Box>

                        {/* Forgot Password */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2.5 }}>
                          <Typography
                            component="a"
                            href="#"
                            onClick={(e) => { e.preventDefault(); setHelpModalOpen(true); }}
                            sx={{ color: '#64748B', textDecoration: 'none', fontWeight: 500, fontSize: 12.5, '&:hover': { color: '#7C3AED', textDecoration: 'underline' } }}
                          >
                            Forgot Password?
                          </Typography>
                        </Box>

                        {/* Sign In Button */}
                        <Button
                          type="submit"
                          loading={loading}
                          endDecorator={<HiArrowRight />}
                          sx={{
                            width: '100%',
                            height: 48,
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            fontSize: 15,
                            boxShadow: '0 10px 24px -4px rgba(168, 85, 247, 0.45)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #B568F8 0%, #6D28D9 100%)',
                              boxShadow: '0 14px 28px -4px rgba(124, 58, 237, 0.58)',
                            },
                          }}
                        >
                          Sign In
                        </Button>
                      </form>

                      {/* Recovery Link: Small and Purple */}
                      <Typography sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography
                          component="span"
                          sx={{ color: '#7C3AED', fontSize: 12, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#6D28D9', textDecoration: 'underline' } }}
                          onClick={() => setHelpModalOpen(true)}
                        >
                          Can't access your account?
                        </Typography>
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Enterprise Trust Footnote */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, fontSize: 11, color: '#94A3B8' }}>
                    <span>🛡️ Enterprise-Grade</span>
                    <span>•</span>
                    <span>🇦🇪 UAE Data Centers</span>
                    <span>•</span>
                    <span>🔒 GDPR Compliant</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ) : viewPage === 3 ? (
          <motion.div
            key="view-3"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {/* VIEW 3: SYNCWISE-INSPIRED MODERN SPLIT WITH 3D DASHBOARD PREVIEW */}
            <Box
              className="v3-card-shell"
              sx={{
                width: '100%',
                maxWidth: '1080px',
                minHeight: '640px',
                bgcolor: '#FFFFFF',
                borderRadius: '32px',
                border: '1px solid rgba(226, 232, 240, 0.85)',
                boxShadow:
                  '0 35px 85px -15px rgba(124, 58, 237, 0.12), 0 15px 35px -5px rgba(15, 23, 42, 0.06), 0 0 1px rgba(0, 0, 0, 0.08)',
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: v3IsHeroLeft ? '1.15fr 1fr' : '1fr 1.15fr',
                },
                p: { xs: 2.5, md: '24px' },
                gap: { xs: 3, md: '28px' },
                position: 'relative',
                zIndex: 10,
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* DARK HERO SHOWCASE PANEL (WITH 3D HIRERKEY DASHBOARD MOCKUP) */}
              <Box
                onMouseMove={handleV3MouseMove}
                onMouseLeave={handleV3MouseLeave}
                sx={{
                  order: { xs: 2, md: v3IsHeroLeft ? 1 : 2 },
                  borderRadius: '26px',
                  background: 'linear-gradient(145deg, #120C24 0%, #1A0F36 45%, #0B0818 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.22)',
                  p: { xs: 3, sm: '32px 32px 28px 32px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 20px 45px -10px rgba(18, 12, 36, 0.6)',
                  perspective: '1200px',
                }}
              >
                {/* Hexagonal Grid Pattern SVG */}
                <Box
                  component="svg"
                  viewBox="0 0 400 400"
                  fill="none"
                  preserveAspectRatio="none"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.85,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  <defs>
                    <pattern id="v3-react-hex-pattern" width="40" height="69.282" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 20 11.547 L 0 0 L 0 23.094 L 20 34.641 L 40 23.094 Z M 0 34.641 L 20 46.188 L 0 57.735 L 0 80.829 L 20 92.376 L 40 80.829 L 40 57.735 L 20 46.188 Z"
                        stroke="rgba(168, 85, 247, 0.14)"
                        strokeWidth="1.2"
                        fill="none"
                      />
                      <path
                        d="M 20 34.641 L 40 46.188 L 20 57.735 L 0 46.188 Z"
                        stroke="rgba(124, 58, 237, 0.18)"
                        strokeWidth="1.2"
                        fill="none"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#v3-react-hex-pattern)" />
                </Box>

                {/* Glow Blobs */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-60px',
                    left: '-40px',
                    width: 260,
                    height: 260,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
                    filter: 'blur(35px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '-70px',
                    right: '-40px',
                    width: 280,
                    height: 280,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.32) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />

                {/* Hero Headline */}
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.6,
                      borderRadius: '9999px',
                      background: 'rgba(124, 58, 237, 0.22)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      color: '#E9D5FF',
                      fontSize: 12,
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    <span style={{ color: '#A855F7' }}>✦</span>
                    <span>Workforce Intelligence Platform</span>
                  </Box>
                  <Typography
                    level="h2"
                    sx={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: { xs: 26, sm: 30 },
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      mb: 1.5,
                    }}
                  >
                    Redefine Your<br />Workforce Experience!
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      color: 'rgba(226, 232, 240, 0.78)',
                      lineHeight: 1.6,
                      maxWidth: 420,
                    }}
                  >
                    Unshackle yourself from traditional HR friction and immerse yourself in the boundless intelligence that Hirerkey brings to your daily routine.
                  </Typography>
                </Box>

                {/* 3D Perspective Floating Dashboard Mockup Card */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 3,
                    mt: { xs: 3, sm: 4 },
                    perspective: '1200px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 440,
                      background: 'rgba(15, 10, 30, 0.92)',
                      borderRadius: '16px',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.75), 0 0 35px rgba(124, 58, 237, 0.3)',
                      overflow: 'hidden',
                      transform: `rotateX(${v3Tilt.x}deg) rotateY(${v3Tilt.y}deg)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                    }}
                  >
                    {/* Window Chrome Header */}
                    <Box
                      sx={{
                        p: '9px 14px',
                        background: 'linear-gradient(180deg, rgba(30, 20, 55, 0.95) 0%, rgba(20, 12, 38, 0.95) 100%)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#EF4444' }} />
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#10B981' }} />
                      </Box>
                      <Typography sx={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                        dashboard.hirerkey.com
                      </Typography>
                      <Box sx={{ width: 28 }} />
                    </Box>

                    {/* Dashboard Image */}
                    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#0B0818' }}>
                      <Box
                        component="img"
                        src="/hirerkey_dashboard_mockup.png"
                        alt="Hirerkey Intelligence Dashboard"
                        sx={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </Box>

                    {/* Floating Micro-Badges */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 44,
                        right: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: '9999px',
                        background: 'rgba(15, 23, 42, 0.88)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#FFFFFF',
                        fontSize: 10.5,
                        fontWeight: 700,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                      }}
                    >
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                      <span>Ask HyIQ™ • Real-time AI</span>
                    </Box>

                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.2,
                        py: 0.45,
                        borderRadius: '9999px',
                        background: 'rgba(15, 23, 42, 0.88)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(168, 85, 247, 0.35)',
                        color: '#E9D5FF',
                        fontSize: 10.5,
                        fontWeight: 600,
                      }}
                    >
                      <span>⚡ 12ms UAE Cloud</span>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* CLEAN WHITE AUTHENTICATION FORM PANEL */}
              <Box
                sx={{
                  order: { xs: 1, md: v3IsHeroLeft ? 2 : 1 },
                  p: { xs: 1, sm: '16px 20px 12px 20px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  {/* Brand Row + Flip Layout Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '12px',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(99, 102, 241, 0.06) 100%)',
                          border: '1px solid rgba(124, 58, 237, 0.25)',
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <rect x="4" y="3" width="6" height="15" rx="3" transform="rotate(-30 4 3)" fill="#7C3AED" />
                          <rect x="13" y="3" width="6" height="15" rx="3" transform="rotate(-30 13 3)" fill="#A855F7" />
                          <circle cx="17" cy="18" r="3" fill="#EC4899" />
                        </svg>
                      </Box>
                      <Box sx={{ display: 'inline-flex', alignItems: 'baseline', fontSize: 23, fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A' }}>
                        <span>h<span style={{ color: '#7C3AED' }}>i</span>rerke<span style={{ position: 'relative', display: 'inline-block' }}>y<svg style={{ position: 'absolute', bottom: -2, left: -6, width: 28, height: 6 }} viewBox="0 0 46 8" fill="none"><path d="M1 5.5C12 1.5 34 1.5 45 6" stroke="#7C3AED" strokeWidth="2.8" strokeLinecap="round"/></svg></span></span>
                      </Box>
                    </Box>

                    {/* Interactive Flip Layout Button */}
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setV3IsHeroLeft((prev) => !prev)}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.5,
                        py: 0.6,
                        borderRadius: '9999px',
                        border: '1px solid #E2E8F0',
                        bgcolor: '#F8FAFC',
                        color: '#64748B',
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        '&:hover': { bgcolor: '#F1F5F9', color: '#7C3AED', borderColor: '#C4B5FD' },
                      }}
                      title="Switch showcase to left/right"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/>
                      </svg>
                      <span>{v3IsHeroLeft ? 'Showcase Right' : 'Showcase Left'}</span>
                    </Box>
                  </Box>

                  {/* Form Title & Subtitle */}
                  <Typography level="h1" sx={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', color: '#0F172A', mb: 1 }}>
                    Welcome Back!
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.55, mb: 3 }}>
                    Hirerkey empowers you to manage, enhance, and streamline your workforce, putting you in control of your organisation.
                  </Typography>

                  {/* Auth Mode Switcher */}
                  <Box
                    sx={{
                      display: 'flex',
                      bgcolor: '#F1F5F9',
                      p: '4px',
                      borderRadius: '9999px',
                      gap: '4px',
                      mb: 3,
                    }}
                  >
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setV3AuthMode('otp')}
                      sx={{
                        flex: 1,
                        py: 1,
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.75,
                        fontSize: 13,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: v3AuthMode === 'otp' ? '#7C3AED' : 'transparent',
                        color: v3AuthMode === 'otp' ? '#FFFFFF' : '#64748B',
                        boxShadow: v3AuthMode === 'otp' ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                      }}
                    >
                      <HiEnvelope size={15} />
                      <span>Email OTP</span>
                    </Box>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setV3AuthMode('password')}
                      sx={{
                        flex: 1,
                        py: 1,
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.75,
                        fontSize: 13,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: v3AuthMode === 'password' ? '#7C3AED' : 'transparent',
                        color: v3AuthMode === 'password' ? '#FFFFFF' : '#64748B',
                        boxShadow: v3AuthMode === 'password' ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                      }}
                    >
                      <HiLockClosed size={15} />
                      <span>Password</span>
                    </Box>
                  </Box>

                  {/* MODE A: PASSWORD LOGIN */}
                  {v3AuthMode === 'password' && (
                    <Box component="form" onSubmit={handleV3Login}>
                      {/* Email */}
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 0.75 }}>Email</Typography>
                        <Input
                          type="email"
                          value={v3Email}
                          onChange={(e) => setV3Email(e.target.value)}
                          placeholder="Enter your email"
                          startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                          sx={{
                            height: 48,
                            borderRadius: '9999px',
                            bgcolor: '#FFFFFF',
                            border: '1.5px solid #E2E8F0',
                            fontSize: 14,
                            '&:focus-within': { borderColor: '#7C3AED', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)' },
                          }}
                          required
                        />
                      </Box>

                      {/* Password */}
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 0.75 }}>Password</Typography>
                        <Input
                          type={v3ShowPassword ? 'text' : 'password'}
                          value={v3Password}
                          onChange={(e) => setV3Password(e.target.value)}
                          placeholder="••••••••"
                          startDecorator={<HiLockClosed color="#94A3B8" size={18} />}
                          endDecorator={
                            <Box
                              component="button"
                              type="button"
                              onClick={() => setV3ShowPassword((prev) => !prev)}
                              sx={{ border: 'none', bgcolor: 'transparent', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}
                            >
                              {v3ShowPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                            </Box>
                          }
                          sx={{
                            height: 48,
                            borderRadius: '9999px',
                            bgcolor: '#FFFFFF',
                            border: '1.5px solid #E2E8F0',
                            fontSize: 14,
                            '&:focus-within': { borderColor: '#7C3AED', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)' },
                          }}
                          required
                        />
                      </Box>

                      {/* Remember me & Forgot password */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Box
                          component="label"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', fontSize: 13, color: '#475569' }}
                        >
                          <input
                            type="checkbox"
                            checked={v3RememberMe}
                            onChange={(e) => setV3RememberMe(e.target.checked)}
                            style={{ accentColor: '#7C3AED', width: 16, height: 16 }}
                          />
                          <span>Remember me</span>
                        </Box>
                        <Typography
                          onClick={() => setHelpModalOpen(true)}
                          sx={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                          Forgot password
                        </Typography>
                      </Box>

                      {/* Primary Sign In Button */}
                      <Button
                        type="submit"
                        loading={loading}
                        sx={{
                          width: '100%',
                          height: 48,
                          borderRadius: '9999px',
                          bgcolor: '#7C3AED',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: 15,
                          boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: '#6D28D9', transform: 'translateY(-1px)' },
                          mb: 1.5,
                        }}
                      >
                        Sign in
                      </Button>

                      {/* Google SSO Button */}
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => onSuccessLogin?.('alex.chen@earthhotels.com', 'passkey')}
                        startDecorator={<FcGoogle size={18} />}
                        sx={{
                          width: '100%',
                          height: 48,
                          borderRadius: '9999px',
                          borderColor: '#E2E8F0',
                          bgcolor: '#FFFFFF',
                          color: '#0F172A',
                          fontWeight: 600,
                          fontSize: 14,
                          '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' },
                        }}
                      >
                        Sign in with Google
                      </Button>

                      {/* Can't access your login mail link */}
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography
                          onClick={() => setHelpModalOpen(true)}
                          sx={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                          Can't access your login mail?
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* MODE B: EMAIL OTP ENTRY */}
                  {v3AuthMode === 'otp' && v3OtpStep === 'input' && (
                    <Box component="form" onSubmit={handleV3SendOTP}>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 0.75 }}>Email</Typography>
                        <Input
                          type="email"
                          value={v3Email}
                          onChange={(e) => setV3Email(e.target.value)}
                          placeholder="Enter your email"
                          startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                          sx={{
                            height: 48,
                            borderRadius: '9999px',
                            bgcolor: '#FFFFFF',
                            border: '1.5px solid #E2E8F0',
                            fontSize: 14,
                            '&:focus-within': { borderColor: '#7C3AED', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)' },
                          }}
                          required
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography sx={{ fontSize: 13, color: '#64748B' }}>Instant one-time passcode</Typography>
                        <Typography
                          onClick={() => setPasskeyModalOpen(true)}
                          sx={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                          Sign in with Passkey
                        </Typography>
                      </Box>

                      <Button
                        type="submit"
                        loading={loading}
                        sx={{
                          width: '100%',
                          height: 48,
                          borderRadius: '9999px',
                          bgcolor: '#7C3AED',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: 15,
                          boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: '#6D28D9', transform: 'translateY(-1px)' },
                          mb: 1.5,
                        }}
                      >
                        Send OTP
                      </Button>

                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography
                          onClick={() => setHelpModalOpen(true)}
                          sx={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                          Can't access your login mail?
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* MODE C: OTP 6-DIGIT VERIFICATION */}
                  {v3AuthMode === 'otp' && v3OtpStep === 'verify' && (
                    <Box component="form" onSubmit={handleV3VerifyOTP}>
                      <Typography level="h3" sx={{ fontSize: 20, fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                        Enter Verification Code
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: '#64748B', mb: 2 }}>
                        We sent a 6-digit code to <strong style={{ color: '#7C3AED' }}>{v3Email}</strong>
                      </Typography>

                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: { xs: 1, sm: 1.25 }, mb: 2.5 }}>
                        {v3OtpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`v3-otp-digit-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleV3OtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleV3OtpKeyDown(idx, e)}
                            style={{
                              width: '100%',
                              height: 52,
                              textAlign: 'center',
                              fontSize: 22,
                              fontWeight: 800,
                              borderRadius: 12,
                              border: '1.5px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              color: '#0F172A',
                              outline: 'none',
                              transition: 'all 0.15s ease',
                            }}
                          />
                        ))}
                      </Box>

                      {/* Resend OTP */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2.5, fontSize: 13 }}>
                        <Typography sx={{ color: '#64748B' }}>Didn't receive code?</Typography>
                        {v3OtpSecondsLeft > 0 ? (
                          <Typography sx={{ color: '#94A3B8' }}>
                            Resend in <strong style={{ color: '#7C3AED' }}>0:{v3OtpSecondsLeft < 10 ? `0${v3OtpSecondsLeft}` : v3OtpSecondsLeft}</strong>
                          </Typography>
                        ) : (
                          <Typography
                            onClick={() => setV3OtpSecondsLeft(29)}
                            sx={{ color: '#7C3AED', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                          >
                            Resend OTP
                          </Typography>
                        )}
                      </Box>

                      <Button
                        type="submit"
                        loading={loading}
                        sx={{
                          width: '100%',
                          height: 48,
                          borderRadius: '9999px',
                          bgcolor: '#7C3AED',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: 15,
                          boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: '#6D28D9', transform: 'translateY(-1px)' },
                          mb: 1.5,
                        }}
                      >
                        Verify &amp; Sign In
                      </Button>

                      <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Typography
                          onClick={() => setV3OtpStep('input')}
                          sx={{ fontSize: 13, color: '#7C3AED', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                          ← Back to Email entry
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Terms of Use & Privacy Policy and Enterprise Badges */}
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>
                    By signing in, you agree to our{' '}
                    <Typography component="span" sx={{ color: '#7C3AED', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      Terms of Use
                    </Typography>{' '}
                    and{' '}
                    <Typography component="span" sx={{ color: '#7C3AED', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      Privacy Policy
                    </Typography>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, fontSize: 11, color: '#94A3B8', mt: 1.5 }}>
                    <span>🛡️ Enterprise-Grade</span>
                    <span>•</span>
                    <span>🇦🇪 UAE Data Centers</span>
                    <span>•</span>
                    <span>🔒 GDPR Compliant</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="view-4"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: '1220px', display: 'flex', justifyContent: 'center' }}
          >
            <style>{`
              @keyframes v4DashTravel { to { stroke-dashoffset: -100; } }
              @keyframes v4GlowPulse { 0%, 100% { stroke-dashoffset: 0; opacity: 0.3; } 50% { stroke-dashoffset: -120; opacity: 1; } }
              @keyframes v4DotPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.5; } }
              @keyframes v4DashPulse { 0%, 100% { transform: scale(1) translateY(0); box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.32); } 50% { transform: scale(1.02) translateY(-4px); box-shadow: 0 26px 55px -10px rgba(124, 58, 237, 0.42); } }
              @keyframes v4Pop1 { 0%, 25%, 100% { transform: scale(1.04) translateY(-3px); border-color: #7C3AED; box-shadow: 0 14px 30px -6px rgba(124, 58, 237, 0.35); } 35%, 90% { transform: scale(1) translateY(0); border-color: #E2E8F0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); } }
              @keyframes v4Pop2 { 0%, 20% { transform: scale(1) translateY(0); border-color: #E2E8F0; } 25%, 50% { transform: scale(1.04) translateY(-3px); border-color: #3B82F6; box-shadow: 0 14px 30px -6px rgba(59, 130, 246, 0.35); } 60%, 100% { transform: scale(1) translateY(0); border-color: #E2E8F0; } }
              @keyframes v4Pop3 { 0%, 45% { transform: scale(1) translateY(0); border-color: #E2E8F0; } 50%, 75% { transform: scale(1.04) translateY(-3px); border-color: #EC4899; box-shadow: 0 14px 30px -6px rgba(236, 72, 153, 0.35); } 85%, 100% { transform: scale(1) translateY(0); border-color: #E2E8F0; } }
              @keyframes v4Pop4 { 0%, 70% { transform: scale(1) translateY(0); border-color: #E2E8F0; } 75%, 98% { transform: scale(1.04) translateY(-3px); border-color: #10B981; box-shadow: 0 14px 30px -6px rgba(16, 185, 129, 0.35); } 100% { transform: scale(1) translateY(0); border-color: #E2E8F0; } }
              @keyframes v4GlowDrift {
                0% { transform: scale(1) translate(0, 0); }
                50% { transform: scale(1.08) translate(15px, -12px); }
                100% { transform: scale(0.96) translate(-10px, 14px); }
              }
            `}</style>

            {/* Ambient Purple Gradient Backdrop Elements (Matching Image 2 Inspiration) */}
            <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }} aria-hidden="true">
              <Box
                sx={{
                  position: 'absolute',
                  top: -120,
                  right: -80,
                  width: 640,
                  height: 640,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.55) 0%, rgba(124, 58, 237, 0.35) 45%, transparent 70%)',
                  filter: 'blur(50px)',
                  animation: 'v4GlowDrift 14s ease-in-out infinite alternate',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -100,
                  left: -80,
                  width: 620,
                  height: 620,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(109, 40, 217, 0.58) 0%, rgba(124, 58, 237, 0.38) 45%, transparent 70%)',
                  filter: 'blur(50px)',
                  animation: 'v4GlowDrift 16s ease-in-out infinite alternate-reverse',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -140,
                  right: '18%',
                  width: 520,
                  height: 780,
                  borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.6) 0%, rgba(216, 180, 254, 0.35) 45%, rgba(124, 58, 237, 0.2) 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.75)',
                  filter: 'blur(32px)',
                  transform: 'rotate(28deg)',
                  opacity: 0.85,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -90,
                  left: '2%',
                  width: 460,
                  height: 520,
                  borderRadius: '58% 42% 62% 38% / 50% 60% 40% 50%',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(124, 58, 237, 0.25) 50%, rgba(255, 255, 255, 0.5) 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.7)',
                  filter: 'blur(28px)',
                  transform: 'rotate(-18deg)',
                  opacity: 0.85,
                }}
              />
            </Box>

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
                  A smarter way<br />
                  to manage your{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    people
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
                  {/* SVG Flow Lines */}
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
                      <linearGradient id="v4ReactLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#A855F7" stopOpacity="0.9" />
                      </linearGradient>
                      <filter id="v4ReactGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Base Paths */}
                    <path
                      d="M 160 75 C 210 75, 230 145, 270 160"
                      fill="none"
                      stroke="rgba(124, 58, 237, 0.22)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      style={{ animation: 'v4DashTravel 20s linear infinite' }}
                    />
                    <path
                      d="M 160 275 C 210 275, 230 205, 270 190"
                      fill="none"
                      stroke="rgba(124, 58, 237, 0.22)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      style={{ animation: 'v4DashTravel 20s linear infinite' }}
                    />
                    <path
                      d="M 270 160 C 310 145, 330 75, 380 75"
                      fill="none"
                      stroke="rgba(124, 58, 237, 0.22)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      style={{ animation: 'v4DashTravel 20s linear infinite' }}
                    />
                    <path
                      d="M 270 190 C 310 205, 330 275, 380 275"
                      fill="none"
                      stroke="rgba(124, 58, 237, 0.22)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      style={{ animation: 'v4DashTravel 20s linear infinite' }}
                    />

                    {/* Glowing Pulses */}
                    <path
                      d="M 160 75 C 210 75, 230 145, 270 160"
                      fill="none"
                      stroke="url(#v4ReactLineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="30 180"
                      filter="url(#v4ReactGlow)"
                      style={{ animation: 'v4GlowPulse 4s ease-in-out infinite' }}
                    />
                    <path
                      d="M 160 275 C 210 275, 230 205, 270 190"
                      fill="none"
                      stroke="url(#v4ReactLineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="30 180"
                      filter="url(#v4ReactGlow)"
                      style={{ animation: 'v4GlowPulse 4s ease-in-out infinite', animationDelay: '-2s' }}
                    />
                    <path
                      d="M 270 160 C 310 145, 330 75, 380 75"
                      fill="none"
                      stroke="url(#v4ReactLineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="30 180"
                      filter="url(#v4ReactGlow)"
                      style={{ animation: 'v4GlowPulse 4s ease-in-out infinite', animationDelay: '-1s' }}
                    />
                    <path
                      d="M 270 190 C 310 205, 330 275, 380 275"
                      fill="none"
                      stroke="url(#v4ReactLineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="30 180"
                      filter="url(#v4ReactGlow)"
                      style={{ animation: 'v4GlowPulse 4s ease-in-out infinite', animationDelay: '-3s' }}
                    />
                  </svg>

                  {/* Module 1: Orientation (Top-Left) */}
                  <Box
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
                      animation: 'v4Pop1 9s ease-in-out infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        borderColor: '#7C3AED',
                        boxShadow: '0 16px 35px -8px rgba(124, 58, 237, 0.25)',
                      },
                    }}
                  >
                    <Box
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
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        <span>Active • Automated</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* Module 2: Department Tour (Bottom-Left) */}
                  <Box
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
                      animation: 'v4Pop2 9s ease-in-out infinite',
                      animationDelay: '2.25s',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        borderColor: '#3B82F6',
                        boxShadow: '0 16px 35px -8px rgba(59, 130, 246, 0.25)',
                      },
                    }}
                  >
                    <Box
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
                        Sales &amp; Marketing
                      </Typography>
                    </Box>
                  </Box>

                  {/* Central Mini Dashboard */}
                  <Box
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
                      animation: 'v4DashPulse 6s ease-in-out infinite',
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
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'v4DotPulse 1.8s infinite', display: 'inline-block' }} />
                        <span>Live Sync</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* Module 3: Ask HyIQ AI (Top-Right) */}
                  <Box
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
                      animation: 'v4Pop3 9s ease-in-out infinite',
                      animationDelay: '4.5s',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        borderColor: '#EC4899',
                        boxShadow: '0 16px 35px -8px rgba(236, 72, 153, 0.25)',
                      },
                    }}
                  >
                    <Box
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
                      <Typography sx={{ fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        Real-time • 12ms
                      </Typography>
                    </Box>
                  </Box>

                  {/* Module 4: 1-on-1 Check-ins (Bottom-Right) */}
                  <Box
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
                      animation: 'v4Pop4 9s ease-in-out infinite',
                      animationDelay: '6.75s',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        borderColor: '#10B981',
                        boxShadow: '0 16px 35px -8px rgba(16, 185, 129, 0.25)',
                      },
                    }}
                  >
                    <Box
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
                      <Typography sx={{ fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        Goal Tracking ↗
                      </Typography>
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
                {/* Top Contact Admin Row */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.6, fontSize: 13, color: '#64748B', mb: 2.5 }}>
                  <span>New to Hirerkey?</span>
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
                      cursor: 'pointer',
                      fontSize: 13,
                      '&:hover': { color: '#6D28D9', textDecoration: 'underline' },
                    }}
                  >
                    Contact your admin
                  </Box>
                </Box>

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
        )}
      </AnimatePresence>

      {/* ======================================================================
          BOTTOM PAGINATION DOCK (COMMERCIAL WEBSITE / DASHBOARD ENCIRCLED 1, 2, 3, 4)
          ====================================================================== */}
      <Box
        component="nav"
        role="navigation"
        aria-label="Login View Switcher"
        sx={{
          position: 'fixed',
          bottom: { xs: 12, sm: 20 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          p: { xs: '5px 10px', sm: '6px 14px 6px 16px' },
          maxWidth: 'calc(100vw - 20px)',
          borderRadius: '9999px',
          bgcolor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.5), 0 0 24px rgba(124, 58, 237, 0.25)',
          userSelect: 'none',
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'inline-flex' }, alignItems: 'center', gap: 0.75, color: '#C084FC', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>PAGES</span>
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '1px', height: 20, bgcolor: 'rgba(255, 255, 255, 0.14)' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75 } }}>
          {/* Prev button */}
          <Box
            component="button"
            type="button"
            onClick={() => setViewPage((p) => (p === 1 ? 4 : ((p - 1) as 1 | 2 | 3 | 4)))}
            title="Previous Page (Key: Left Arrow)"
            aria-label="Previous Page"
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' },
            }}
          >
            ‹
          </Box>

          {/* Encircled 1: Page 1 / View 1 */}
          <Box
            component="button"
            type="button"
            onClick={() => setViewPage(1)}
            title="Page 1: View 1 — Frosted Obsidian Bento (Key: 1)"
            aria-label="Page 1: View 1"
            aria-current={viewPage === 1 ? 'page' : undefined}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 0.75, sm: 1.5 },
              py: 0.5,
              borderRadius: '9999px',
              border: '1.5px solid',
              borderColor: viewPage === 1 ? '#A855F7' : 'rgba(255, 255, 255, 0.16)',
              bgcolor: viewPage === 1 ? 'rgba(124, 58, 237, 0.28)' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: viewPage === 1 ? '0 0 18px rgba(124, 58, 237, 0.45)' : 'none',
              transition: 'all 0.22s ease',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: viewPage === 1 ? '#7C3AED' : 'rgba(255, 255, 255, 0.1)',
                background: viewPage === 1 ? 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid',
                borderColor: viewPage === 1 ? '#E9D5FF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13.5,
                fontWeight: 800,
                boxShadow: viewPage === 1 ? '0 0 14px rgba(168, 85, 247, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.8)' : 'none',
              }}
            >
              1
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>Page 1</Typography>
          </Box>

          {/* Encircled 2: Page 2 */}
          <Box
            component="button"
            type="button"
            onClick={() => setViewPage(2)}
            title="Page 2 (Key: 2)"
            aria-label="Page 2"
            aria-current={viewPage === 2 ? 'page' : undefined}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 0.75, sm: 1.5 },
              py: 0.5,
              borderRadius: '9999px',
              border: '1.5px solid',
              borderColor: viewPage === 2 ? '#A855F7' : 'rgba(255, 255, 255, 0.16)',
              bgcolor: viewPage === 2 ? 'rgba(124, 58, 237, 0.28)' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: viewPage === 2 ? '0 0 18px rgba(124, 58, 237, 0.45)' : 'none',
              transition: 'all 0.22s ease',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: viewPage === 2 ? '#7C3AED' : 'rgba(255, 255, 255, 0.1)',
                background: viewPage === 2 ? 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid',
                borderColor: viewPage === 2 ? '#E9D5FF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13.5,
                fontWeight: 800,
                boxShadow: viewPage === 2 ? '0 0 14px rgba(168, 85, 247, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.8)' : 'none',
              }}
            >
              2
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>Page 2</Typography>
          </Box>

          {/* Encircled 3: Page 3 */}
          <Box
            component="button"
            type="button"
            onClick={() => setViewPage(3)}
            title="Page 3 (Key: 3)"
            aria-label="Page 3"
            aria-current={viewPage === 3 ? 'page' : undefined}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 0.75, sm: 1.5 },
              py: 0.5,
              borderRadius: '9999px',
              border: '1.5px solid',
              borderColor: viewPage === 3 ? '#A855F7' : 'rgba(255, 255, 255, 0.16)',
              bgcolor: viewPage === 3 ? 'rgba(124, 58, 237, 0.28)' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: viewPage === 3 ? '0 0 18px rgba(124, 58, 237, 0.45)' : 'none',
              transition: 'all 0.22s ease',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: viewPage === 3 ? '#7C3AED' : 'rgba(255, 255, 255, 0.1)',
                background: viewPage === 3 ? 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid',
                borderColor: viewPage === 3 ? '#E9D5FF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13.5,
                fontWeight: 800,
                boxShadow: viewPage === 3 ? '0 0 14px rgba(168, 85, 247, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.8)' : 'none',
              }}
            >
              3
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>Page 3</Typography>
          </Box>

          {/* Encircled 4: Page 4 */}
          <Box
            component="button"
            type="button"
            onClick={() => setViewPage(4)}
            title="Page 4 (Key: 4)"
            aria-label="Page 4"
            aria-current={viewPage === 4 ? 'page' : undefined}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 0.75, sm: 1.5 },
              py: 0.5,
              borderRadius: '9999px',
              border: '1.5px solid',
              borderColor: viewPage === 4 ? '#A855F7' : 'rgba(255, 255, 255, 0.16)',
              bgcolor: viewPage === 4 ? 'rgba(124, 58, 237, 0.28)' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: viewPage === 4 ? '0 0 18px rgba(124, 58, 237, 0.45)' : 'none',
              transition: 'all 0.22s ease',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: viewPage === 4 ? '#7C3AED' : 'rgba(255, 255, 255, 0.1)',
                background: viewPage === 4 ? 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid',
                borderColor: viewPage === 4 ? '#E9D5FF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13.5,
                fontWeight: 800,
                boxShadow: viewPage === 4 ? '0 0 14px rgba(168, 85, 247, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.8)' : 'none',
              }}
            >
              4
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>Page 4</Typography>
          </Box>

          {/* Next button */}
          <Box
            component="button"
            type="button"
            onClick={() => setViewPage((p) => (p === 4 ? 1 : ((p + 1) as 1 | 2 | 3 | 4)))}
            title="Next Page (Key: Right Arrow)"
            aria-label="Next Page"
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' },
            }}
          >
            ›
          </Box>
        </Box>
      </Box>

      {/* Passkey Biometrics Modal */}
      <Modal open={passkeyModalOpen} onClose={() => setPasskeyModalOpen(false)}>
        <ModalDialog
          sx={{
            bgcolor: '#120D24',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            color: '#FFFFFF',
            textAlign: 'center',
            p: 4,
            maxWidth: 420,
          }}
        >
          <ModalClose />
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
            <HiFingerPrint color="#A855F7" size={64} />
          </Box>
          <Typography level="title-lg" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
            Sign in with Passkey
          </Typography>
          <Typography level="body-sm" sx={{ color: '#94A3B8', mb: 3 }}>
            Touch ID or Face ID biometric authentication with your hardware key.
          </Typography>
          <Button
            onClick={handlePasskeySuccess}
            sx={{
              height: 50,
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
              fontWeight: 700,
            }}
          >
            Authenticate with Biometrics
          </Button>
        </ModalDialog>
      </Modal>

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
