import React from 'react';
import { Box, Typography } from '@mui/joy';
import { colors, radii, shadows } from '../../theme/tokens';

export interface MobileHyiqCapsuleProps {
  onAskClick?: () => void;
  onVoiceClick?: () => void;
}

export const MobileHyiqCapsule: React.FC<MobileHyiqCapsuleProps> = ({
  onAskClick,
  onVoiceClick,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        height: '46px',
        borderRadius: radii.pill,
        backgroundColor: '#FFFFFF',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '3px 12px 3px 4px',
        border: '1.5px solid transparent',
        backgroundImage: `linear-gradient(#FFFFFF, #FFFFFF), ${colors.hyiq.borderGradient}`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: colors.hyiq.glow,
      }}
    >
      {/* Left Pill Button: Ask HyIQ */}
      <Box
        component="button"
        onClick={onAskClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '38px',
          padding: '0 16px 0 10px',
          borderRadius: radii.pill,
          background: colors.hyiq.gradient,
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)',
          transition: 'transform 0.16s ease, filter 0.16s ease',
          '&:active': {
            transform: 'scale(0.96)',
            filter: 'brightness(0.95)',
          },
        }}
      >
        {/* Robot Icon */}
        <Box
          sx={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="6" width="16" height="12" rx="3" fill="#FFFFFF" />
            <circle cx="8.5" cy="11.5" r="1.5" fill="#7C3AED" />
            <circle cx="15.5" cy="11.5" r="1.5" fill="#38BDF8" />
            <path d="M10 15h4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="2" x2="12" y2="6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Box>
        <Typography level="title-sm" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13.5px' }}>
          Ask HyIQ
        </Typography>
      </Box>

      {/* Right Trigger: Voice Waveform */}
      <Box
        component="button"
        onClick={onVoiceClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          padding: '4px 6px',
          cursor: 'pointer',
          borderRadius: radii.sm,
          transition: 'opacity 0.16s ease',
          '&:active': {
            opacity: 0.7,
          },
        }}
      >
        {/* 4 Oscillating Waveform Bars */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
          <Box
            sx={{
              width: '3px',
              height: '10px',
              borderRadius: '2px',
              backgroundColor: colors.hyiq.softPurple,
              animation: 'hyiqWave 1.2s ease-in-out infinite alternate',
            }}
          />
          <Box
            sx={{
              width: '3px',
              height: '18px',
              borderRadius: '2px',
              backgroundColor: colors.hyiq.indigo,
              animation: 'hyiqWave 1.4s ease-in-out 0.2s infinite alternate',
            }}
          />
          <Box
            sx={{
              width: '3px',
              height: '13px',
              borderRadius: '2px',
              backgroundColor: colors.hyiq.blue,
              animation: 'hyiqWave 1.1s ease-in-out 0.4s infinite alternate',
            }}
          />
          <Box
            sx={{
              width: '3px',
              height: '8px',
              borderRadius: '2px',
              backgroundColor: colors.hyiq.cyan,
              animation: 'hyiqWave 1.3s ease-in-out 0.1s infinite alternate',
            }}
          />
        </Box>
        <Typography level="body-sm" sx={{ fontWeight: 600, color: colors.neutral[800], fontSize: '13px' }}>
          Voice
        </Typography>
      </Box>
    </Box>
  );
};
