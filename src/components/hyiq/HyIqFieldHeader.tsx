import React from 'react';
import { Box, FormLabel } from '@mui/joy';
import { HyIqButton, HyIqPreset } from './HyIqButton';

export interface HyIqFieldHeaderProps {
  /** Field label text (e.g. "Rationale for Rating", "Broadcast Message") */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Refine trigger callback */
  onRefine: () => void;
  /** Label for the action button */
  aiLabel?: string;
  /** Visual preset for the button */
  preset?: HyIqPreset;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

export const HyIqFieldHeader: React.FC<HyIqFieldHeaderProps> = ({
  label,
  required = false,
  onRefine,
  aiLabel = 'Refine with HyIQ',
  preset = 'royal',
  disabled = false,
  loading = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 0.75,
      }}
    >
      <FormLabel
        sx={{
          fontWeight: 600,
          fontSize: '13px',
          color: 'text.primary',
          m: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
        }}
      >
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </FormLabel>

      <HyIqButton
        label={aiLabel}
        onClick={onRefine}
        variant="field"
        preset={preset}
        iconType="magic"
        disabled={disabled}
        loading={loading}
      />
    </Box>
  );
};
