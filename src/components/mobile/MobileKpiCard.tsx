import React from 'react';
import { Card, Box, Typography } from '@mui/joy';
import { colors, radii, shadows } from '../../theme/tokens';

export interface MobileKpiCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  onClick?: () => void;
}

export const MobileKpiCard: React.FC<MobileKpiCardProps> = ({
  label,
  value,
  trend,
  trendDirection = 'up',
  highlight = false,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: '116px',
        padding: '16px 18px',
        borderRadius: radii.card, // 18px (View 2 radius)
        backgroundColor: highlight ? 'transparent' : '#FFFFFF',
        background: highlight
          ? `linear-gradient(145deg, ${colors.navy.cardStart} 0%, ${colors.navy.cardEnd} 100%)`
          : '#FFFFFF',
        color: highlight ? '#FFFFFF' : colors.neutral[900],
        border: highlight ? 'none' : `1px solid ${colors.neutral[200]}`,
        boxShadow: highlight ? shadows.kpiHighlight : shadows.card,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.16s ease, box-shadow 0.16s ease',
        '&:active': onClick ? { transform: 'scale(0.98)' } : {},
      }}
    >
      {/* Header: Label and Mini Arrow Action */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          level="title-sm"
          sx={{
            fontWeight: 600,
            fontSize: '13px',
            color: highlight ? 'rgba(255, 255, 255, 0.8)' : colors.neutral[500],
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: `1px solid ${highlight ? 'rgba(255, 255, 255, 0.2)' : colors.neutral[200]}`,
            display: 'grid',
            placeItems: 'center',
            color: highlight ? '#FFFFFF' : colors.neutral[500],
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </Box>
      </Box>

      {/* Main Metric Value */}
      <Typography
        level="display-1"
        sx={{
          fontSize: '28px',
          fontWeight: 800,
          margin: '8px 0 4px 0',
          color: highlight ? '#FFFFFF' : colors.neutral[900],
          letterSpacing: '-0.025em',
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      {/* Trend Row */}
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography
            level="body-xs"
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: highlight
                ? 'rgba(255, 255, 255, 0.75)'
                : trendDirection === 'up'
                ? colors.success.trend
                : colors.danger.main,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '•'} {trend}
          </Typography>
        </Box>
      )}
    </Card>
  );
};
