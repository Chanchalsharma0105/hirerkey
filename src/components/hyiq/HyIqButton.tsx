import React, { useState } from 'react';
import { Button, Tooltip, CircularProgress, Box, Typography } from '@mui/joy';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HiSparkles, HiOutlineDocumentText } from 'react-icons/hi2';
import { RiMagicFill, RiSparkling2Fill } from 'react-icons/ri';
import { BsStars } from 'react-icons/bs';
import { MdAutoAwesome } from 'react-icons/md';

// Create motion-enhanced Joy UI Button
const MotionButton = motion(Button);

export type HyIqPreset = 'royal' | 'nebula' | 'glass' | 'shimmer';
export type HyIqVariant = 'header' | 'field' | 'hero' | 'icon';
export type HyIqIconType = 'sparkles' | 'stars' | 'magic' | 'document' | 'auto';

export interface HyIqButtonProps {
  /** The button label (e.g. "Draft with HyIQ", "Refine with HyIQ", "Extract from Document") */
  label?: string;
  /** Click event handler */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visual preset adhering strictly to Hirerkey's primary palette */
  preset?: HyIqPreset;
  /** Sizing and layout variant */
  variant?: HyIqVariant;
  /** Icon library selection from react-icons */
  iconType?: HyIqIconType;
  /** Loading/busy state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Optional custom tooltip text */
  tooltip?: string;
  /** Optional custom CSS class */
  className?: string;
  /** Optional sx overrides for Joy UI */
  sx?: Record<string, any>;
}

export const HyIqButton: React.FC<HyIqButtonProps> = ({
  label = 'Draft with HyIQ',
  onClick,
  preset = 'royal',
  variant = 'header',
  iconType = 'sparkles',
  loading = false,
  disabled = false,
  tooltip,
  className,
  sx = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // 1. Icon Selection from react-icons
  const renderIcon = () => {
    const iconSize = variant === 'field' ? 12 : variant === 'hero' ? 16 : 14;
    switch (iconType) {
      case 'stars':
        return <BsStars size={iconSize} />;
      case 'magic':
        return <RiMagicFill size={iconSize} />;
      case 'document':
        return <HiOutlineDocumentText size={iconSize} />;
      case 'auto':
        return <MdAutoAwesome size={iconSize} />;
      case 'sparkles':
      default:
        return <HiSparkles size={iconSize} />;
    }
  };

  // 2. Preset Style Mapping (strictly Hirerkey Primary Colors)
  const getPresetStyles = () => {
    switch (preset) {
      case 'nebula':
        return {
          background: 'linear-gradient(135deg, #6F42C1 0%, #7C3AED 50%, #2563EB 100%)',
          color: '#ffffff',
          border: '1px solid rgba(53, 184, 255, 0.45)',
          boxShadow: isHovered
            ? '0 0 24px 1px rgba(53, 184, 255, 0.65), 0 6px 18px rgba(124, 58, 237, 0.5)'
            : '0 0 16px -2px rgba(53, 184, 255, 0.38), 0 4px 12px rgba(111, 66, 193, 0.3)',
        };
      case 'glass':
        return {
          background: isHovered
            ? 'linear-gradient(135deg, #EDE9FE 0%, #E0E7FF 50%, #CCFBF1 100%)'
            : 'linear-gradient(135deg, rgba(245, 243, 255, 0.92) 0%, rgba(238, 242, 255, 0.85) 50%, rgba(240, 253, 250, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          color: isHovered ? '#4C1D95' : '#5B21B6',
          border: '1.5px solid #DDD6FE',
          boxShadow: isHovered
            ? '0 4px 16px rgba(124, 58, 237, 0.22), inset 0 1px 0 rgba(255, 255, 255, 1)'
            : '0 2px 10px rgba(124, 58, 237, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        };
      case 'shimmer':
        return {
          background: 'linear-gradient(135deg, #4C1D95 0%, #312E81 100%)',
          color: '#ffffff',
          border: '1px solid rgba(167, 139, 250, 0.4)',
          boxShadow: isHovered
            ? '0 6px 22px -1px rgba(76, 29, 149, 0.65)'
            : '0 4px 14px -2px rgba(76, 29, 149, 0.45)',
        };
      case 'royal':
      default:
        return {
          background: isHovered
            ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 55%, #4338CA 100%)'
            : 'linear-gradient(135deg, #7C3AED 0%, #6366F1 55%, #4F46E5 100%)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: isHovered
            ? '0 6px 20px -2px rgba(124, 58, 237, 0.6), inset 0 1px 1.5px rgba(255, 255, 255, 0.5)'
            : '0 4px 14px -2px rgba(124, 58, 237, 0.42), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        };
    }
  };

  // 3. Variant Dimension Specs
  const getVariantDimensions = () => {
    switch (variant) {
      case 'field':
        return {
          height: '24px',
          px: '8px',
          fontSize: '11px',
          fontWeight: 600,
          borderRadius: '6px',
        };
      case 'hero':
        return {
          height: '40px',
          px: '18px',
          fontSize: '13px',
          fontWeight: 600,
          borderRadius: '10px',
        };
      case 'icon':
        return {
          width: '32px',
          height: '32px',
          p: 0,
          borderRadius: '50%',
        };
      case 'header':
      default:
        return {
          height: '34px',
          px: '14px',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '8px',
        };
    }
  };

  const presetStyle = getPresetStyles();
  const dimensionStyle = getVariantDimensions();

  // 4. Framer Motion Animation Variants
  const motionProps = shouldReduceMotion
    ? {}
    : {
        whileHover: disabled || loading ? {} : { scale: 1.025, y: -1.5 },
        whileTap: disabled || loading ? {} : { scale: 0.96, y: 0.5 },
        transition: { type: 'spring', stiffness: 450, damping: 20 },
      };

  const buttonElement = (
    <MotionButton
      {...motionProps}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled}
      className={className}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : loading ? 'wait' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        letterSpacing: '-0.01em',
        opacity: disabled ? 0.5 : 1,
        ...dimensionStyle,
        ...presetStyle,
        ...sx,
      }}
    >
      {/* Motion Graphics: Sweeping Shimmer Beam Overlay for Shimmer/Nebula */}
      {(preset === 'shimmer' || preset === 'nebula') && !disabled && !shouldReduceMotion && (
        <motion.div
          animate={{
            x: ['-160%', '160%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: 'linear',
            repeatDelay: 1.2,
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background:
              'linear-gradient(60deg, transparent 35%, rgba(255, 255, 255, 0.28) 50%, transparent 65%)',
            transform: 'rotate(25deg)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Animated Icon / Loading Cross-Fade with AnimatePresence */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="spinner"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <CircularProgress
              size="sm"
              thickness={3}
              sx={{
                '--CircularProgress-size': variant === 'field' ? '12px' : '14px',
                color: preset === 'glass' ? '#5B21B6' : '#ffffff',
              }}
            />
          </motion.span>
        ) : (
          <motion.span
            key="icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: isHovered && !shouldReduceMotion ? 18 : 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 15 }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            {renderIcon()}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Label Text (hidden in icon variant) */}
      {variant !== 'icon' && (
        <Typography
          component="span"
          sx={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            lineHeight: 1,
          }}
        >
          {loading ? 'Processing...' : label}
        </Typography>
      )}
    </MotionButton>
  );

  // Wrap in Joy UI Tooltip if tooltip or icon variant is used
  if (tooltip || variant === 'icon') {
    return (
      <Tooltip
        title={tooltip || label}
        variant="solid"
        size="sm"
        arrow
        placement="top"
        sx={{
          bgcolor: '#1E1B4B',
          fontSize: '11px',
          fontWeight: 500,
          borderRadius: '6px',
        }}
      >
        <Box component="span" sx={{ display: 'inline-flex' }}>
          {buttonElement}
        </Box>
      </Tooltip>
    );
  }

  return buttonElement;
};
