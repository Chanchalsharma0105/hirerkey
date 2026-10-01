import React from 'react';
import { Card, Box, Typography, Chip, LinearProgress } from '@mui/joy';
import { colors, radii, shadows } from '../../theme/tokens';

export interface ClearanceItem {
  id: string;
  department: string;
  title: string;
  owner: string;
  status: 'cleared' | 'pending' | 'overdue';
  completedItems: number;
  totalItems: number;
}

export interface MobileClearanceListProps {
  items: ClearanceItem[];
  onItemClick?: (item: ClearanceItem) => void;
}

export const MobileClearanceList: React.FC<MobileClearanceListProps> = ({
  items,
  onItemClick,
}) => {
  const clearedCount = items.filter((i) => i.status === 'cleared').length;
  const progressPercent = Math.round((clearedCount / items.length) * 100);

  return (
    <Card
      sx={{
        width: '100%',
        padding: '16px',
        borderRadius: radii.card,
        backgroundColor: '#FFFFFF',
        border: `1px solid ${colors.neutral[200]}`,
        boxShadow: shadows.card,
      }}
    >
      {/* Header with Progress Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography level="title-md" sx={{ fontWeight: 700, color: colors.neutral[900], fontSize: '14.5px' }}>
          Departmental Clearance
        </Typography>
        <Typography level="body-xs" sx={{ fontWeight: 600, color: colors.primary[600] }}>
          {clearedCount} of {items.length} Cleared ({progressPercent}%)
        </Typography>
      </Box>

      <LinearProgress
        determinate
        value={progressPercent}
        sx={{
          color: colors.primary[500],
          backgroundColor: colors.neutral[100],
          height: '6px',
          borderRadius: radii.pill,
          mb: 2,
        }}
      />

      {/* Item List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => {
          const isCleared = item.status === 'cleared';
          const isOverdue = item.status === 'overdue';

          return (
            <Box
              key={item.id}
              onClick={() => onItemClick && onItemClick(item)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: radii.md,
                backgroundColor: colors.surfaces.surfaceAlt,
                border: `1px solid ${colors.neutral[100]}`,
                cursor: onItemClick ? 'pointer' : 'default',
                transition: 'background-color 0.16s ease',
                '&:active': {
                  backgroundColor: colors.neutral[100],
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Status Indicator Icon */}
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: isCleared
                      ? colors.success.bg
                      : isOverdue
                      ? colors.danger.bg
                      : colors.warning.bg,
                    color: isCleared
                      ? colors.success[700]
                      : isOverdue
                      ? colors.danger[700]
                      : colors.warning[700],
                  }}
                >
                  {isCleared ? '✓' : isOverdue ? '!' : '⋯'}
                </Box>
                <Box>
                  <Typography level="body-sm" sx={{ fontWeight: 600, color: colors.neutral[800], fontSize: '13px' }}>
                    {item.department} — {item.title}
                  </Typography>
                  <Typography level="caption" sx={{ color: colors.neutral[400], fontSize: '11px' }}>
                    Owner: {item.owner} • {item.completedItems}/{item.totalItems} items
                  </Typography>
                </Box>
              </Box>

              <Chip
                size="sm"
                color={isCleared ? 'success' : isOverdue ? 'danger' : 'warning'}
                variant="soft"
                sx={{ fontSize: '11px', fontWeight: 600 }}
              >
                {isCleared ? 'Cleared' : isOverdue ? 'Overdue' : 'In Progress'}
              </Chip>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};
