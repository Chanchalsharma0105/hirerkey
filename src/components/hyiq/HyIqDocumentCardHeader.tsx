import React from 'react';
import { Box, Typography, Button } from '@mui/joy';
import { HyIqButton, HyIqPreset } from './HyIqButton';
import { FiEdit2, FiCheck } from 'react-icons/fi';

export interface HyIqDocumentCardHeaderProps {
  /** Title of the card (e.g. "Passport Details", "Work History") */
  title: string;
  /** Document type label (e.g. "Passport", "Visa", "Document") */
  docType?: string;
  /** Trigger callback for document extraction */
  onExtract: () => void;
  /** Edit callback for manual mode */
  onEdit?: () => void;
  /** Save callback when editing */
  onSave?: () => void;
  /** Whether the card is currently in edit mode */
  isEditing?: boolean;
  /** Visual preset for the AI button */
  preset?: HyIqPreset;
  /** Loading state for extraction */
  extractLoading?: boolean;
}

export const HyIqDocumentCardHeader: React.FC<HyIqDocumentCardHeaderProps> = ({
  title,
  docType = 'Document',
  onExtract,
  onEdit,
  onSave,
  isEditing = false,
  preset = 'nebula',
  extractLoading = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        pb: 1.5,
        mb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        level="title-sm"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'text.primary',
          fontSize: '13px',
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <HyIqButton
          label={`Extract from ${docType}`}
          onClick={onExtract}
          preset={preset}
          variant="header"
          iconType="document"
          loading={extractLoading}
        />

        {isEditing ? (
          onSave && (
            <Button
              size="sm"
              variant="solid"
              color="primary"
              onClick={onSave}
              startDecorator={<FiCheck size={14} />}
              sx={{ height: '34px', borderRadius: '8px', fontSize: '12px' }}
            >
              Save
            </Button>
          )
        ) : (
          onEdit && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={onEdit}
              startDecorator={<FiEdit2 size={13} />}
              sx={{ height: '34px', borderRadius: '8px', fontSize: '12px' }}
            >
              Edit
            </Button>
          )
        )}
      </Box>
    </Box>
  );
};
