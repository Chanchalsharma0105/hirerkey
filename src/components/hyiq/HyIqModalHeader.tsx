import React from 'react';
import { Box, Typography, ModalClose } from '@mui/joy';
import { HyIqButton, HyIqPreset } from './HyIqButton';

export interface HyIqModalHeaderProps {
  /** Title of the modal dialog (e.g. "Create KJR", "Create Pulse Survey") */
  title: string;
  /** Optional subtitle or step indicator */
  subtitle?: string;
  /** Label for the HyIQ button (defaults to "Draft with HyIQ") */
  aiLabel?: string;
  /** Trigger callback when AI action is clicked */
  onAiAction?: () => void;
  /** Whether the AI generation is in progress */
  aiLoading?: boolean;
  /** Visual preset for the AI button */
  preset?: HyIqPreset;
  /** Modal close callback */
  onClose?: () => void;
}

export const HyIqModalHeader: React.FC<HyIqModalHeaderProps> = ({
  title,
  subtitle,
  aiLabel = 'Draft with HyIQ',
  onAiAction,
  aiLoading = false,
  preset = 'royal',
  onClose,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        pb: 1.5,
        mb: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography
          level="title-lg"
          sx={{
            fontWeight: 700,
            color: 'primary.500',
            textTransform: 'capitalize',
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography level="body-xs" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {onAiAction && (
          <HyIqButton
            label={aiLabel}
            onClick={onAiAction}
            loading={aiLoading}
            preset={preset}
            variant="header"
            iconType="sparkles"
          />
        )}
        {onClose && (
          <ModalClose
            onClick={onClose}
            sx={{
              position: 'static',
              transform: 'none',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: 'neutral.100',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};
