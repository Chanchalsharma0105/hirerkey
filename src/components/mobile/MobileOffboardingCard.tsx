import React from 'react';
import { Card, Box, Typography, Chip, Avatar } from '@mui/joy';
import { colors, radii, shadows } from '../../theme/tokens';

export interface MobileOffboardingCardProps {
  name: string;
  role: string;
  department: string;
  seatId: string;
  avatarInitials: string;
  noticeDaysLeft: number;
  stageBadge?: string;
  lineManager: string;
  serviceLength: string;
  successor: string;
  onViewCase?: () => void;
}

export const MobileOffboardingCard: React.FC<MobileOffboardingCardProps> = ({
  name,
  role,
  department,
  seatId,
  avatarInitials,
  noticeDaysLeft,
  stageBadge = 'Serving notice',
  lineManager,
  serviceLength,
  successor,
  onViewCase,
}) => {
  return (
    <Card
      sx={{
        width: '100%',
        padding: '16px',
        borderRadius: radii.card,
        backgroundColor: '#FFFFFF',
        border: `1px solid ${colors.neutral[200]}`,
        boxShadow: shadows.card,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Top Identity Row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            size="lg"
            sx={{
              backgroundColor: colors.primary[100],
              color: colors.primary[700],
              fontWeight: 700,
              fontSize: '15px',
              border: `2px solid ${colors.primary[300]}`,
            }}
          >
            {avatarInitials}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: colors.neutral[900], fontSize: '15px' }}>
                {name}
              </Typography>
              <Typography
                level="mono-sm"
                sx={{
                  backgroundColor: colors.neutral[100],
                  color: colors.neutral[600],
                  padding: '1px 6px',
                  borderRadius: radii.xs,
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {seatId}
              </Typography>
            </Box>
            <Typography level="body-xs" sx={{ color: colors.neutral[500], marginTop: '2px' }}>
              {role} • {department}
            </Typography>
          </Box>
        </Box>

        {/* Notice countdown chip */}
        <Chip
          color="warning"
          variant="soft"
          size="sm"
          sx={{
            fontWeight: 700,
            fontSize: '11px',
            backgroundColor: colors.warning.bg,
            color: colors.warning[700],
            border: `1px solid ${colors.warning.border}`,
          }}
        >
          {noticeDaysLeft}d Left
        </Chip>
      </Box>

      {/* Stage Badge Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Chip
          color="primary"
          variant="soft"
          size="sm"
          sx={{
            backgroundColor: colors.primary[50],
            color: colors.primary[700],
            border: `1px solid ${colors.primary[200]}`,
            fontSize: '11.5px',
          }}
        >
          ● {stageBadge}
        </Chip>
      </Box>

      {/* 2x2 Mini-Metric Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          paddingTop: '4px',
          borderTop: `1px solid ${colors.neutral[100]}`,
        }}
      >
        <Box sx={{ backgroundColor: colors.surfaces.surfaceAlt, padding: '8px 10px', borderRadius: radii.md }}>
          <Typography level="caption" sx={{ color: colors.neutral[400], fontSize: '11px', fontWeight: 500 }}>
            Line Manager
          </Typography>
          <Typography level="body-sm" sx={{ color: colors.neutral[800], fontWeight: 600, fontSize: '12.5px', mt: '2px' }}>
            {lineManager}
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: colors.surfaces.surfaceAlt, padding: '8px 10px', borderRadius: radii.md }}>
          <Typography level="caption" sx={{ color: colors.neutral[400], fontSize: '11px', fontWeight: 500 }}>
            Tenure
          </Typography>
          <Typography level="body-sm" sx={{ color: colors.neutral[800], fontWeight: 600, fontSize: '12.5px', mt: '2px' }}>
            {serviceLength}
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: colors.surfaces.surfaceAlt, padding: '8px 10px', borderRadius: radii.md }}>
          <Typography level="caption" sx={{ color: colors.neutral[400], fontSize: '11px', fontWeight: 500 }}>
            Successor Cover
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              color: successor !== 'None' ? colors.success.trend : colors.neutral[500],
              fontWeight: 600,
              fontSize: '12.5px',
              mt: '2px',
            }}
          >
            {successor}
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: colors.surfaces.surfaceAlt, padding: '8px 10px', borderRadius: radii.md }}>
          <Typography level="caption" sx={{ color: colors.neutral[400], fontSize: '11px', fontWeight: 500 }}>
            Notice Period
          </Typography>
          <Typography level="body-sm" sx={{ color: colors.warning[700], fontWeight: 600, fontSize: '12.5px', mt: '2px' }}>
            30 Days Total
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
