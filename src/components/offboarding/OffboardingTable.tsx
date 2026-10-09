import React from 'react';
import {
  Box,
  Table,
  Sheet,
  Typography,
  Chip,
  IconButton,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Avatar,
  Select,
  Option,
} from '@mui/joy';
import {
  FiMoreHorizontal,
  FiExternalLink,
  FiMail,
  FiCornerUpLeft,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit,
  FiPhone,
  FiBriefcase,
  FiLayers,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import { MdOutlineChair } from 'react-icons/md';
import {
  OffboardingCase,
  STAGE_CONFIGS,
  REASONS_LIST,
} from './types';

export interface OffboardingTableProps {
  cases: OffboardingCase[];
  onOpenCase: (caseId: number) => void;
  onQuickView?: (caseId: number) => void;
  onSendExitInterview: (caseId: number) => void;
  onViewVacancies: (caseId: number) => void;
  onWithdrawOffboarding: (caseId: number) => void;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
}

export const OffboardingTable: React.FC<OffboardingTableProps> = ({
  cases,
  onOpenCase,
  onQuickView,
  onSendExitInterview,
  onViewVacancies,
  onWithdrawOffboarding,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Employee Hover Card State & Controllers
  const [hoveredCase, setHoveredCase] = React.useState<OffboardingCase | null>(null);
  const [hoverPos, setHoverPos] = React.useState<{ top: number; left: number } | null>(null);
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copiedField, setCopiedField] = React.useState<'email' | 'contact' | null>(null);

  const handleEmpMouseEnter = (e: React.MouseEvent<HTMLElement>, caseItem: OffboardingCase) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const isSara = (caseItem.name && caseItem.name.toLowerCase().includes('sara')) || caseItem.id === 1;
    const isRahul = !isSara && ((caseItem.name && caseItem.name.toLowerCase().includes('rahul')) || caseItem.id === 2);
    const isLeena = !isSara && !isRahul && ((caseItem.name && caseItem.name.toLowerCase().includes('leena')) || caseItem.id === 4);
    const isAisha = !isSara && !isRahul && !isLeena && ((caseItem.name && caseItem.name.toLowerCase().includes('aisha')) || caseItem.id === 3);
    const cardWidth = (isSara || isLeena) ? 415 : isAisha ? 450 : isRahul ? 345 : 310;
    const cardHeight = isSara ? 130 : isRahul ? 140 : isLeena ? 140 : isAisha ? 190 : 260;
    let left = rect.right + 12;
    let top = rect.top - 8;
    if (typeof window !== 'undefined') {
      if (left + cardWidth > window.innerWidth - 16) {
        left = rect.left - cardWidth - 12;
      }
      if (left < 16) left = 16;
      if (top + cardHeight > window.innerHeight - 16) {
        top = window.innerHeight - cardHeight - 16;
      }
      if (top < 16) top = 16;
    }
    setHoverPos({ top, left });
    setHoveredCase(caseItem);
  };

  const handleEmpMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCase(null);
      setHoverPos(null);
    }, 180);
  };

  const handleCardMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleCopy = (text: string, type: 'email' | 'contact') => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(type);
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  const getReasonLabel = (val: string) => {
    const found = REASONS_LIST.find((r) => r.value === val);
    return found ? found.label : val;
  };

  const getStageChip = (stageNum: number) => {
    const conf = STAGE_CONFIGS[stageNum] || STAGE_CONFIGS[0];
    const colorMap: Record<string, { bg: string; text: string }> = {
      warn: { bg: '#FDF0E1', text: '#9A5B13' },
      pri: { bg: '#EDE9FE', text: '#7C3AED' },
      bad: { bg: '#FCE4E4', text: '#8A1C1C' },
      ok: { bg: '#E3FBE3', text: '#1F7A1F' },
    };
    const style = colorMap[conf.chipTone] || colorMap.warn;

    return (
      <Chip
        size="sm"
        sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          bgcolor: style.bg,
          color: style.text,
          fontWeight: 600,
          fontSize: '12px',
          borderRadius: '999px',
          px: 1.25,
          py: '2px',
        }}
      >
        {conf.label}
      </Chip>
    );
  };

  const getReasonChip = (val: string) => {
    const label = getReasonLabel(val);
    const reasonStyles: Record<string, { bg: string; text: string; border: string }> = {
      resignation: { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
      retirement: { bg: '#F0FDFA', text: '#0D9488', border: '#CCFBF1' },
      termination: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
      death_in_service: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
    };
    const style = reasonStyles[val] || reasonStyles.resignation;

    return (
      <Chip
        size="sm"
        sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          bgcolor: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
          fontWeight: 500,
          fontSize: '11.5px',
          borderRadius: '6px',
          px: 1,
          py: '2px',
        }}
      >
        {label}
      </Chip>
    );
  };

  const getDueChip = (dueText: string, tone: 'neu' | 'bad' | 'warn' | 'ok') => {
    const toneStyles: Record<string, { bg: string; text: string; border?: string }> = {
      bad: { bg: '#FCE4E4', text: '#8A1C1C', border: '#FCA5A5' },
      warn: { bg: '#FDF0E1', text: '#9A5B13', border: '#FDE68A' },
      ok: { bg: '#E3FBE3', text: '#1F7A1F', border: '#BBF7D0' },
      neu: { bg: '#F0F4F8', text: '#32383E', border: '#E2E8F0' },
    };
    const current = toneStyles[tone] || toneStyles.neu;
    const isToday = dueText.toLowerCase() === 'today';

    return (
      <Chip
        size="sm"
        sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          bgcolor: current.bg,
          color: current.text,
          border: current.border ? `1px solid ${current.border}` : 'none',
          fontWeight: isToday ? 700 : 500,
          fontSize: '11px',
          borderRadius: '999px',
          px: 1,
          mt: 0.5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {isToday && (
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: '#DC2626',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite',
            }}
          />
        )}
        {dueText}
      </Chip>
    );
  };

  // Pagination calculation
  const totalCases = cases.length;
  const totalPages = Math.max(1, Math.ceil(totalCases / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleCases = cases.slice(startIndex, startIndex + rowsPerPage);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* 1. Main Data Table with Hirerkey Scroll Shadow Sheet */}
      <Sheet
        variant="outlined"
        className="table-scroll-shadow"
        sx={{
          borderRadius: '12px',
          overflowX: 'auto',
          borderColor: 'neutral.outlinedBorder',
          bgcolor: 'background.surface',
          boxShadow: '0 1px 3px rgba(0, 23, 65, 0.05)',
        }}
      >
        <Table
          hoverRow
          stickyHeader
          className="table-base table-sticky-last-col"
          sx={{
            minWidth: 880,
            fontFamily: 'Inter, system-ui, sans-serif',
            '& th': {
              bgcolor: '#EEEBFF',
              color: '#7C3AED',
              fontWeight: 600,
              fontSize: '13px',
              py: 1.5,
              px: 2,
              whiteSpace: 'nowrap',
              borderBottom: '1px solid #E5E7EF',
              letterSpacing: '-0.01em',
            },
            '& td': {
              py: 1.5,
              px: 2,
              fontSize: '13px',
              verticalAlign: 'middle',
              borderBottom: '1px solid #EEF0F4',
              color: 'text.primary',
            },
            '& tbody tr': {
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              '&:hover': {
                bgcolor: '#F5F3FF',
                '& > td:last-child': {
                  bgcolor: '#EDE9FE',
                },
              },
            },
            '& th:last-child, & td:last-child': {
              position: 'sticky',
              right: 0,
              bgcolor: 'background.surface',
              zIndex: 2,
            },
            '& th:last-child': {
              bgcolor: '#EEEBFF',
            },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: '4%', textAlign: 'center' }}>S. No.</th>
              <th style={{ width: '19%' }}>Employee</th>
              <th style={{ width: '18%' }}>Position & Seat</th>
              <th style={{ width: '11%' }}>Department</th>
              <th style={{ width: '13%' }}>Departure Reason</th>
              <th style={{ width: '11%' }}>Start Date</th>
              <th style={{ width: '12%' }}>Last Working Day</th>
              <th style={{ width: '8%' }}>Stage</th>
              <th style={{ width: '4%', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleCases.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '64px 20px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: '#F1F5F9',
                        color: '#94A3B8',
                        display: 'grid',
                        placeItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <FiAlertCircle size={24} />
                    </Box>
                    <Typography
                      level="title-sm"
                      sx={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 600,
                        color: '#1E293B',
                        fontSize: '14px',
                      }}
                    >
                      No offboarding records found
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{
                        color: '#64748B',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        maxWidth: 360,
                        fontSize: '12.5px',
                      }}
                    >
                      No employee departures match your current filters. Try changing or clearing your filters above.
                    </Typography>
                  </Box>
                </td>
              </tr>
            ) : (
              visibleCases.map((c, index) => {
                const sNo = startIndex + index + 1;
                const hasNoSuccessor = c.stage < 3 && !c.successor;

                return (
                  <tr key={c.id} onClick={() => onOpenCase(c.id)}>
                    {/* S. No. */}
                    <td style={{ textAlign: 'center' }}>
                      <Typography
                        level="body-sm"
                        sx={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontVariantNumeric: 'tabular-nums',
                          color: 'text.tertiary',
                          fontWeight: 500,
                        }}
                      >
                        {sNo}
                      </Typography>
                    </td>

                    {/* Employee */}
                    <td>
                      <Box
                        onMouseEnter={(e) => handleEmpMouseEnter(e, c)}
                        onMouseLeave={handleEmpMouseLeave}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          cursor: 'pointer',
                        }}
                      >
                        <Avatar
                          size="sm"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#EDE9FE',
                            color: '#5B21B6',
                            fontWeight: 700,
                            fontSize: '12px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            border: '1px solid #DDD6FE',
                            transition: 'all 0.16s ease',
                            '&:hover': {
                              transform: 'scale(1.08)',
                              boxShadow: '0 0 0 2.5px rgba(124, 58, 237, 0.35)',
                            },
                          }}
                        >
                          {c.initials}
                        </Avatar>
                        <Box>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              color: '#7C3AED',
                              fontWeight: 600,
                              fontSize: '13.5px',
                              lineHeight: 1.3,
                              '&:hover': { textDecoration: 'underline', color: '#6D28D9' },
                            }}
                          >
                            {c.name}
                          </Typography>
                          <Typography
                            level="body-xs"
                            sx={{
                              fontFamily: 'JetBrains Mono, monospace',
                              color: 'text.tertiary',
                              fontSize: '11px',
                            }}
                          >
                            {c.seat}
                          </Typography>
                        </Box>
                      </Box>
                    </td>

                    {/* Position + Seat Code + Successor Warning */}
                    <td>
                      <Box>
                        <Typography
                          level="body-sm"
                          sx={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 500,
                            color: 'text.primary',
                          }}
                        >
                          {c.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '11px',
                              color: 'text.secondary',
                              bgcolor: '#F1F5F9',
                              px: '6px',
                              py: '1.5px',
                              borderRadius: '4px',
                              border: '1px solid #E2E8F0',
                            }}
                          >
                            {c.seat}
                          </Typography>
                          {c.successor && (
                            <Typography
                              level="body-xs"
                              sx={{
                                fontFamily: 'Inter, system-ui, sans-serif',
                                color: 'text.tertiary',
                                fontSize: '11.5px',
                              }}
                            >
                              → {c.successor}
                            </Typography>
                          )}
                        </Box>
                        {hasNoSuccessor && (
                          <Chip
                            size="sm"
                            variant="soft"
                            color="danger"
                            startDecorator={<FiAlertCircle size={12} />}
                            sx={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              bgcolor: '#FEE2E2',
                              color: '#DC2626',
                              fontWeight: 600,
                              fontSize: '11px',
                              borderRadius: '6px',
                              mt: 0.5,
                              px: 0.75,
                              py: '1px',
                            }}
                          >
                            No successor
                          </Chip>
                        )}
                      </Box>
                    </td>

                    {/* Department */}
                    <td>
                      <Typography
                        level="body-sm"
                        sx={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          color: 'text.secondary',
                          fontWeight: 500,
                        }}
                      >
                        {c.department}
                      </Typography>
                    </td>

                    {/* Departure Reason */}
                    <td>
                      <Chip
                        variant="outlined"
                        size="sm"
                        sx={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          borderColor: 'neutral.outlinedBorder',
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '12px',
                          bgcolor: 'background.surface',
                        }}
                      >
                        {getReasonLabel(c.reason)}
                      </Chip>
                    </td>

                    {/* Start Date */}
                    <td>
                      <Box>
                        <Typography
                          level="body-sm"
                          sx={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 600,
                            color: 'text.primary',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {c.startDate || c.noticeGivenDate || c.joinDate || '—'}
                        </Typography>
                        <Typography
                          level="body-xs"
                          sx={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            color: 'text.tertiary',
                            fontSize: '11px',
                          }}
                        >
                          Notice start
                        </Typography>
                      </Box>
                    </td>

                    {/* Last Working Day */}
                    <td>
                      <Box>
                        <Typography
                          level="body-sm"
                          sx={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 600,
                            color: 'text.primary',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {c.lastWorkingDay}
                        </Typography>
                        {getDueChip(c.dueText, c.dueTone)}
                      </Box>
                    </td>

                    {/* Stage */}
                    <td>{getStageChip(c.stage)}</td>

                    {/* Action 3-dots Menu (Sticky Right) */}
                    <td
                      style={{ textAlign: 'center' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown>
                        <MenuButton
                          slots={{ root: IconButton }}
                          slotProps={{
                            root: {
                              size: 'sm',
                              variant: 'plain',
                              color: 'neutral',
                              sx: {
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                color: 'text.secondary',
                                '&:hover': { bgcolor: 'neutral.softBg', color: 'text.primary' },
                              },
                            },
                          }}
                          aria-label={`Actions for ${c.name}`}
                        >
                          <FiMoreHorizontal size={16} />
                        </MenuButton>
                        <Menu
                          size="sm"
                          placement="bottom-end"
                          sx={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            minWidth: 200,
                            borderRadius: '10px',
                            boxShadow: '0 10px 30px rgba(0,23,65,.14)',
                            p: 0.5,
                            zIndex: 10,
                          }}
                        >
                          <MenuItem
                            onClick={() => onOpenCase(c.id)}
                            sx={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              gap: 1.25,
                              fontSize: '13px',
                              fontWeight: 500,
                              py: 1,
                            }}
                          >
                            <FiEdit size={14} style={{ color: '#5B6173' }} />
                            Edit
                          </MenuItem>

                          <MenuItem
                            onClick={() => onWithdrawOffboarding(c.id)}
                            sx={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              gap: 1.25,
                              fontSize: '13px',
                              fontWeight: 500,
                              py: 1,
                              color: '#8A1C1C',
                              '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' },
                            }}
                          >
                            <FiCornerUpLeft size={14} style={{ color: '#DC2626' }} />
                            Withdraw offboarding
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* 2. Production Hirerkey Pagination Footer */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 1,
          pt: 0.5,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Left: Rows Per Page */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            level="body-sm"
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              color: 'text.secondary',
              fontSize: '13px',
            }}
          >
            Rows per page:
          </Typography>
          <Select
            size="sm"
            value={rowsPerPage}
            onChange={(_, val) => val && onRowsPerPageChange?.(Number(val))}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              minWidth: 70,
              height: 32,
              borderRadius: '8px',
              fontSize: '12.5px',
            }}
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={40}>40</Option>
          </Select>
        </Box>

        {/* Center: Numeric Page Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="sm"
            variant="plain"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            sx={{ width: 30, height: 30, borderRadius: '6px' }}
          >
            <FiChevronLeft size={16} />
          </IconButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <IconButton
              key={p}
              size="sm"
              variant={p === currentPage ? 'solid' : 'plain'}
              color={p === currentPage ? 'primary' : 'neutral'}
              onClick={() => onPageChange?.(p)}
              sx={{
                fontFamily: 'Inter, system-ui, sans-serif',
                width: 30,
                height: 30,
                borderRadius: '50%',
                fontSize: '12.5px',
                fontWeight: p === currentPage ? 700 : 500,
                bgcolor: p === currentPage ? '#7C3AED' : 'transparent',
                color: p === currentPage ? '#ffffff' : 'text.primary',
                '&:hover': {
                  bgcolor: p === currentPage ? '#6D28D9' : 'neutral.softBg',
                },
              }}
            >
              {p}
            </IconButton>
          ))}

          <IconButton
            size="sm"
            variant="plain"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            sx={{ width: 30, height: 30, borderRadius: '6px' }}
          >
            <FiChevronRight size={16} />
          </IconButton>
        </Box>

        {/* Right: Showing Range */}
        <Typography
          level="body-sm"
          sx={{
            fontFamily: 'Inter, system-ui, sans-serif',
            color: 'text.secondary',
            fontSize: '13px',
          }}
        >
          Showing {totalCases === 0 ? 0 : startIndex + 1}–
          {Math.min(startIndex + rowsPerPage, totalCases)} of {totalCases}
        </Typography>
      </Box>

      {/* Floating Employee Hover Card (Supports 3 distinct card styles: Format 1 Badge for Mark, Format 2 Straight Header for Aisha, Format 3 Glassmorphism for Leena) */}
      {hoveredCase && hoverPos && (() => {
        const isSara = (hoveredCase.name && hoveredCase.name.toLowerCase().includes('sara')) || hoveredCase.id === 1;
        const isRahul = !isSara && ((hoveredCase.name && hoveredCase.name.toLowerCase().includes('rahul')) || hoveredCase.id === 2);
        const isLeena = !isSara && !isRahul && ((hoveredCase.name && hoveredCase.name.toLowerCase().includes('leena')) || hoveredCase.id === 4);
        const isAisha = !isSara && !isRahul && !isLeena && ((hoveredCase.name && hoveredCase.name.toLowerCase().includes('aisha')) || hoveredCase.id === 3);

        return (
          <Box
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleEmpMouseLeave}
            sx={{
              position: 'fixed',
              top: hoverPos.top,
              left: hoverPos.left,
              width: (isSara || isLeena) ? 415 : isAisha ? 450 : isRahul ? 345 : 320,
              height: isLeena ? 140 : undefined,
              bgcolor: '#FFFFFF',
              border: isLeena ? '1px solid #EBE8F6' : (isAisha || isSara) ? '1px solid #EEF2F6' : '1px solid #E2E8F0',
              borderRadius: isRahul ? '14px' : isLeena ? '18px' : '16px',
              boxShadow: isRahul
                ? '0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)'
                : (isSara || isAisha)
                ? '0 16px 36px -8px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)'
                : isLeena
                ? '0 16px 36px -8px rgba(15, 23, 42, 0.11), 0 2px 6px rgba(15, 23, 42, 0.04)'
                : '0 20px 40px -8px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(124, 58, 237, 0.06), 0 2px 4px rgba(15, 23, 42, 0.04)',
              zIndex: 99999,
              overflow: 'hidden',
              p: 0,
              animation: 'empCardFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: 'Inter, system-ui, sans-serif',
              '@keyframes empCardFadeIn': {
                from: { opacity: 0, transform: 'translateY(6px) scale(0.97)' },
                to: { opacity: 1, transform: 'translateY(0) scale(1)' },
              },
            }}
          >
            {isSara ? (
              /* Format 5: Compact Horizontal Profile Style (Sara Khan - Row 1 / ID 1 per media_1791547902745.png) */
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  bgcolor: '#FFFFFF',
                  p: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  boxSizing: 'border-box',
                  borderRadius: '16px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {/* Circular Avatar with Online Status Dot */}
                <Box sx={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      bgcolor: '#EDE9FE',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={hoveredCase.avatar || '/sara_avatar.png'}
                      alt={hoveredCase.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/sara_avatar.png';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      bgcolor: '#10B981',
                      border: '2.5px solid #FFFFFF',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
                    }}
                  />
                </Box>

                {/* Right Profile Metadata Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, flex: 1 }}>
                  {/* Line 1: Name */}
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    {hoveredCase.name}
                  </Typography>

                  {/* Line 2: Title • Department */}
                  <Box
                    sx={{
                      mt: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#1E293B',
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    <Typography component="span" sx={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>
                      {hoveredCase.designation || hoveredCase.title || 'Front Desk Manager'}
                    </Typography>
                    <Typography component="span" sx={{ mx: '6px', color: '#94A3B8', fontSize: '12px' }}>
                      •
                    </Typography>
                    <Typography component="span" sx={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>
                      {hoveredCase.department || 'Front Office'}
                    </Typography>
                  </Box>

                  {/* Line 3: Email • Phone */}
                  <Box
                    sx={{
                      mt: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '12.5px',
                      fontWeight: 400,
                      color: '#64748B',
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    <Typography
                      component="a"
                      href={`mailto:${hoveredCase.email || 'sara.khan@noisiv.com'}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: '12.5px',
                        color: '#64748B',
                        textDecoration: 'none',
                        '&:hover': { color: '#6366F1', textDecoration: 'underline' },
                      }}
                    >
                      {hoveredCase.email || 'sara.khan@noisiv.com'}
                    </Typography>
                    <Typography component="span" sx={{ mx: '6px', color: '#94A3B8', fontSize: '12px' }}>
                      •
                    </Typography>
                    <Typography
                      component="a"
                      href={`tel:${(hoveredCase.phone || hoveredCase.contact || '+971 50 492 8812').replace(/\s+/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: '12.5px',
                        color: '#64748B',
                        textDecoration: 'none',
                        '&:hover': { color: '#6366F1', textDecoration: 'underline' },
                      }}
                    >
                      {hoveredCase.phone || hoveredCase.contact || '+971 50 492 8812'}
                    </Typography>
                  </Box>

                  {/* Line 4: Dual Badges (Role Pill | Seat Chip) */}
                  <Box sx={{ mt: '8px', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.5,
                        py: '3.5px',
                        bgcolor: '#EEF2FF',
                        color: '#6366F1',
                        border: '1px solid rgba(99, 102, 241, 0.14)',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Inter, system-ui, sans-serif',
                      }}
                    >
                      {hoveredCase.level || 'Manager'}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.25,
                        py: '3.5px',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #C7D2FE',
                        color: '#6366F1',
                        borderRadius: '8px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {hoveredCase.seat || 'FDM-01'}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : isRahul ? (
              /* Format 4: Sleek Corporate ID Card (Rahul Mehta - Row 4/2) */
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  bgcolor: '#FFFFFF',
                  p: '12px 14px',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {/* Top Section: Avatar + Identity + Sparkle */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1.25,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
                    {/* Avatar with Green Beacon */}
                    <Box sx={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                      <Box
                        component="img"
                        src="./rahul_avatar.png"
                        alt={hoveredCase.name}
                        onError={(e: any) => {
                          e.target.src = 'public/rahul_avatar.png';
                        }}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          display: 'block',
                          bgcolor: '#EDE9FE',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 11,
                          height: 11,
                          borderRadius: '50%',
                          bgcolor: '#22C55E',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                        }}
                        title="Active Online"
                      />
                    </Box>

                    {/* Employee Info: Name + Email + Dual Chips (Manager + Seat Code) */}
                    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography
                        sx={{
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: '#0F172A',
                          lineHeight: 1.2,
                          mb: '2px',
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 215,
                        }}
                      >
                        {hoveredCase.name}
                      </Typography>
                      <Typography
                        component="a"
                        href={`mailto:${hoveredCase.email || 'rahul.mehta@noisiv.com'}`}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          fontSize: '11.5px',
                          color: '#64748B',
                          fontWeight: 400,
                          lineHeight: 1.25,
                          mb: '5px',
                          letterSpacing: '-0.01em',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 215,
                          '&:hover': { color: '#7C3AED', textDecoration: 'underline' },
                        }}
                      >
                        {hoveredCase.email || 'rahul.mehta@noisiv.com'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: '8px',
                            py: '2px',
                            bgcolor: '#F3EEFF',
                            border: '1px solid rgba(124, 58, 237, 0.12)',
                            color: '#6D28D9',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: 600,
                            lineHeight: 1.2,
                            letterSpacing: '-0.01em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Manager
                        </Box>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: '7px',
                            py: '2px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid #DDD6FE',
                            color: '#6D28D9',
                            borderRadius: '6px',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '10px',
                            fontWeight: 600,
                            lineHeight: 1.2,
                            letterSpacing: '0.02em',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 1px 2px rgba(109, 40, 217, 0.05)',
                          }}
                        >
                          {hoveredCase.seat || 'SC-02'}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Top-Right 5-dot Sparkle */}
                  <Box
                    sx={{
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: '2px',
                      flexShrink: 0,
                      opacity: 0.8,
                    }}
                    title="Verified Member"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#64748B">
                      <circle cx="12" cy="12" r="2.2" />
                      <circle cx="12" cy="4" r="1.8" />
                      <circle cx="12" cy="20" r="1.8" />
                      <circle cx="4" cy="12" r="1.8" />
                      <circle cx="20" cy="12" r="1.8" />
                    </svg>
                  </Box>
                </Box>

                {/* Divider */}
                <Box sx={{ height: '1px', bgcolor: '#F1F5F9', my: '8px' }} />

                {/* Bottom 2x2 Metadata Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '7px 12px',
                  }}
                >
                  {/* 1. Designation (Briefcase) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }} title="Designation">
                    <Box sx={{ width: 15, height: 15, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#1E293B',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {hoveredCase.designation || hoveredCase.title || 'Sous Chef'}
                    </Typography>
                  </Box>

                  {/* 2. Department (Office Building) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }} title="Department">
                    <Box sx={{ width: 15, height: 15, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 22V7a3 3 0 0 1 6 0v15" />
                        <path d="M12 12h4a2 2 0 0 1 2 2v8" />
                        <path d="M9 18h.01" />
                        <path d="M9 14h.01" />
                        <path d="M9 10h.01" />
                      </svg>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#1E293B',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {hoveredCase.department || hoveredCase.dept || 'Kitchen'}
                    </Typography>
                  </Box>

                  {/* 3. Contact (Phone) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }} title="Contact">
                    <Box sx={{ width: 15, height: 15, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </Box>
                    <Typography
                      component="a"
                      href={`tel:${(hoveredCase.contact || hoveredCase.phone || '+971 52 381 9940').replace(/\s+/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#1E293B',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textDecoration: 'none',
                        '&:hover': { color: '#7C3AED', textDecoration: 'underline' },
                      }}
                    >
                      {hoveredCase.contact || hoveredCase.phone || '+971 52 381 9940'}
                    </Typography>
                  </Box>

                  {/* 4. Position (Team / Position Name) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }} title="Position">
                    <Box sx={{ width: 15, height: 15, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#1E293B',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {hoveredCase.position ? hoveredCase.position.split('·')[0].trim() : 'Culinary Production Lead'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : isLeena ? (
              /* Format 3: Split-Tone Modern ID Card (Leena Joseph - Row 4) */
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  bgcolor: '#FFFFFF',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                {/* Left Panel: Soft Lavender Profile Column */}
                <Box
                  sx={{
                    flex: '0 0 160px',
                    width: 160,
                    maxWidth: 160,
                    background: 'linear-gradient(180deg, #F8F5FF 0%, #F3EEFD 100%)',
                    borderRight: '1px solid #EBE8F6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: '14px 8px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  {/* Circular Avatar with Online Status Dot */}
                  <Box sx={{ position: 'relative', width: 48, height: 48, mb: '6px', flexShrink: 0 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        bgcolor: '#EDE9FE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src="./leena_avatar.jpg"
                        alt={hoveredCase.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'public/leena_avatar.jpg';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </Box>
                    {/* Active Online Green Dot */}
                    <Box
                      title="Active Online"
                      sx={{
                        position: 'absolute',
                        bottom: 1,
                        right: 1,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: '#22C55E',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
                      }}
                    />
                  </Box>

                  {/* Name */}
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.25,
                      letterSpacing: '-0.015em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '148px',
                    }}
                  >
                    {hoveredCase.name || 'Leena Joseph'}
                  </Typography>

                  {/* Email - Full without truncation */}
                  <Typography
                    component="a"
                    href={`mailto:${hoveredCase.email || 'leena.joseph@noisiv.com'}`}
                    onClick={(e) => e.stopPropagation()}
                    title={hoveredCase.email || 'leena.joseph@noisiv.com'}
                    sx={{
                      fontSize: '10.5px',
                      fontWeight: 400,
                      color: '#64748B',
                      mt: '2px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      maxWidth: '148px',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.25,
                      '&:hover': { color: '#7C3AED', textDecoration: 'underline' },
                    }}
                  >
                    {hoveredCase.email || 'leena.joseph@noisiv.com'}
                  </Typography>

                  {/* Dual-Chip Row: Role Pill + Position Code Chip */}
                  <Box
                    sx={{
                      mt: '7px',
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexWrap: 'nowrap',
                    }}
                  >
                    {/* Role Pill */}
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: '8px',
                        py: '2px',
                        bgcolor: '#EFE9FE',
                        border: '1px solid rgba(124, 58, 237, 0.12)',
                        color: '#6D28D9',
                        fontSize: '10px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Manager
                    </Box>

                    {/* Position Code Chip */}
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: '7px',
                        py: '2px',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #DDD6FE',
                        color: '#6D28D9',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        letterSpacing: '0.02em',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(109, 40, 217, 0.05)',
                      }}
                    >
                      {hoveredCase.seat || 'HKS-03'}
                    </Box>
                  </Box>
                </Box>

                {/* Right Panel: Clean White Metadata List (Department, Designation, Position) */}
                <Box
                  sx={{
                    flex: 1,
                    width: 'calc(100% - 160px)',
                    maxWidth: 'calc(100% - 160px)',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '11px',
                    p: '16px 18px 16px 16px',
                    boxSizing: 'border-box',
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  {/* 1. Department (Office Building) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, width: '100%', overflow: 'hidden' }} title="Department">
                    <Box sx={{ width: 15, height: 15, color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 22V7a3 3 0 0 1 6 0v15" />
                        <path d="M12 12h4a2 2 0 0 1 2 2v8" />
                        <path d="M9 18h.01" />
                        <path d="M9 14h.01" />
                        <path d="M9 10h.01" />
                      </svg>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {hoveredCase.department || 'Housekeeping'}
                    </Typography>
                  </Box>

                  {/* 2. Designation (Briefcase) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, width: '100%', overflow: 'hidden' }} title="Designation">
                    <Box sx={{ width: 15, height: 15, color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {hoveredCase.designation || hoveredCase.title || 'Housekeeping Supervisor'}
                    </Typography>
                  </Box>

                  {/* 3. Position (Team / Position - Position Title ONLY) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, width: '100%', overflow: 'hidden' }} title="Position">
                    <Box sx={{ width: 15, height: 15, color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {(hoveredCase.position ? hoveredCase.position.split('·')[0].trim() : 'Operations Supervisor')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : isAisha ? (
              /* Format 2: Quad Grid Metadata Style (Aisha Noor - Row 2 per media_1791547643632.png) */
              <Box sx={{ position: 'relative', bgcolor: '#FFFFFF', overflow: 'hidden', borderRadius: '16px', width: '100%' }}>
                {/* Top Profile Header Bar */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '16px 18px 14px 18px',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                    <Box sx={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: '#EDE9FE',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={hoveredCase.avatar || '/aisha_avatar.png'}
                          alt={hoveredCase.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/aisha_avatar_clean.png';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: '#10B981',
                          border: '2.5px solid #FFFFFF',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
                        }}
                      />
                    </Box>

                    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#0F172A',
                          lineHeight: 1.2,
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        {hoveredCase.name}
                      </Typography>
                      <Typography
                        component="a"
                        href={`mailto:${hoveredCase.email || 'aisha.noor@noisiv.com'}`}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          fontSize: '12.5px',
                          color: '#64748B',
                          fontWeight: 400,
                          lineHeight: 1.3,
                          mt: '3px',
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textDecoration: 'none',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          '&:hover': { color: '#6366F1', textDecoration: 'underline' },
                        }}
                      >
                        {hoveredCase.email || 'aisha.noor@noisiv.com'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Header Actions: Role Pill + Seat Chip + More Menu */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9, flexShrink: 0 }}>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.5,
                        py: '3.5px',
                        bgcolor: '#EEF2FF',
                        color: '#6366F1',
                        border: '1px solid rgba(99, 102, 241, 0.14)',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Inter, system-ui, sans-serif',
                      }}
                    >
                      {hoveredCase.level || 'Manager'}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.25,
                        py: '3.5px',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #C7D2FE',
                        color: '#6366F1',
                        borderRadius: '8px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {hoveredCase.seat || 'GR-04'}
                    </Box>
                    <IconButton
                      size="sm"
                      variant="plain"
                      sx={{
                        p: 0.5,
                        color: '#64748B',
                        minWidth: 'auto',
                        minHeight: 'auto',
                        borderRadius: '6px',
                        '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' },
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.8" />
                        <circle cx="12" cy="12" r="1.8" />
                        <circle cx="12" cy="19" r="1.8" />
                      </svg>
                    </IconButton>
                  </Box>
                </Box>

                {/* Horizontal Divider Line */}
                <Box sx={{ width: '100%', height: 1, bgcolor: '#F1F5F9' }} />

                {/* 2x2 Metadata Grid with cross borders */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  {/* Quadrant 1: Top-Left (Contact) */}
                  <Box
                    sx={{
                      p: '13px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      borderRight: '1px solid #F1F5F9',
                      borderBottom: '1px solid #F1F5F9',
                      minWidth: 0,
                    }}
                  >
                    <Box sx={{ width: 20, height: 20, flexShrink: 0, color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '1px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <Typography
                        component="a"
                        href={`tel:${(hoveredCase.phone || hoveredCase.contact || '+971 54 712 3390').replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: '#0F172A',
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textDecoration: 'none',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          '&:hover': { color: '#6366F1', textDecoration: 'underline' },
                        }}
                      >
                        {hoveredCase.phone || hoveredCase.contact || '+971 54 712 3390'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#64748B',
                          lineHeight: 1.25,
                          mt: '3px',
                          letterSpacing: '-0.01em',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Contact
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quadrant 2: Top-Right (Department) */}
                  <Box
                    sx={{
                      p: '13px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      borderBottom: '1px solid #F1F5F9',
                      minWidth: 0,
                    }}
                  >
                    <Box sx={{ width: 20, height: 20, flexShrink: 0, color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '1px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                        <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
                        <path d="M10 6h4" />
                        <path d="M10 10h4" />
                        <path d="M10 14h4" />
                        <path d="M10 18h4" />
                      </svg>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: '#0F172A',
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        {hoveredCase.department || hoveredCase.dept || 'Front Office'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#64748B',
                          lineHeight: 1.25,
                          mt: '3px',
                          letterSpacing: '-0.01em',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Department
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quadrant 3: Bottom-Left (Position) */}
                  <Box
                    sx={{
                      p: '13px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      borderRight: '1px solid #F1F5F9',
                      minWidth: 0,
                    }}
                  >
                    <Box sx={{ width: 20, height: 20, flexShrink: 0, color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '1px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0F172A',
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        {(hoveredCase.position ? hoveredCase.position.split('·')[0].trim() : 'Guest Services Associate')}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#64748B',
                          lineHeight: 1.25,
                          mt: '3px',
                          letterSpacing: '-0.01em',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Position
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quadrant 4: Bottom-Right (Designation) */}
                  <Box
                    sx={{
                      p: '13px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      minWidth: 0,
                    }}
                  >
                    <Box sx={{ width: 20, height: 20, flexShrink: 0, color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '1px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0F172A',
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        {hoveredCase.designation || hoveredCase.title || 'Guest Relations Executive'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#64748B',
                          lineHeight: 1.25,
                          mt: '3px',
                          letterSpacing: '-0.01em',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        Designation
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
          ) : (
            /* Format 1: Corporate ID Badge Style (Mark D'Souza - Row 1) */
            <>
              {/* Top Lanyard Slot Notch Cutout Accent */}
              <Box
                sx={{
                  width: 38,
                  height: 5,
                  borderRadius: '999px',
                  bgcolor: '#CBD5E1',
                  mx: 'auto',
                  mt: 1,
                  mb: 0.5,
                  boxShadow: 'inset 0 1.5px 2px rgba(15, 23, 42, 0.35), 0 1px 0 rgba(255, 255, 255, 0.9)',
                }}
              />

              <Box sx={{ p: '10px 14px 12px 14px' }}>
            {/* Primary ID Section: Avatar + Name + Badge Code & Clearance */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.35 }}>
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '13px',
                    background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                    color: '#6D28D9',
                    fontWeight: 700,
                    fontSize: '16px',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 3px 8px rgba(109, 40, 217, 0.15), 0 0 0 1px #E2E8F0',
                  }}
                >
                  {hoveredCase.initials}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#10B981',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.25)',
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  level="title-sm"
                  sx={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0F172A',
                    lineHeight: 1.25,
                    letterSpacing: '-0.015em',
                    mb: 0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {hoveredCase.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <Typography
                    sx={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color: '#6D28D9',
                      bgcolor: '#F5F3FF',
                      border: '1px solid #DDD6FE',
                      borderRadius: '5px',
                      px: 0.75,
                      py: '1px',
                      lineHeight: 1.2,
                    }}
                  >
                    {`#EMP-${hoveredCase.id.toString().padStart(4, '0')}`}
                  </Typography>
                  <Box
                    sx={{
                      fontSize: '8.5px',
                      fontWeight: 700,
                      color: '#059669',
                      bgcolor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      borderRadius: '4px',
                      px: 0.65,
                      py: '1px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      lineHeight: 1.2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      '&::before': {
                        content: '""',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: '#10B981',
                      },
                    }}
                  >
                    {hoveredCase.seat ? `Seat ${hoveredCase.seat}` : 'ACTIVE ACCESS'}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Details Box: All 5 attributes cleanly organized */}
            <Box
              sx={{
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '11px',
                p: '9px 11px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {/* 1. Designation */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  sx={{
                    width: 21,
                    height: 21,
                    borderRadius: '6px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    mt: '1px',
                  }}
                >
                  <FiBriefcase size={11} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    level="body-xs"
                    sx={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#94A3B8',
                      lineHeight: 1.1,
                      mb: 0.2,
                    }}
                  >
                    Designation
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E293B',
                      lineHeight: 1.35,
                    }}
                  >
                    {hoveredCase.designation || hoveredCase.title}
                  </Typography>
                </Box>
              </Box>

              {/* 2. Department */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  sx={{
                    width: 21,
                    height: 21,
                    borderRadius: '6px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    mt: '1px',
                  }}
                >
                  <FiLayers size={11} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    level="body-xs"
                    sx={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#94A3B8',
                      lineHeight: 1.1,
                      mb: 0.2,
                    }}
                  >
                    Department
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E293B',
                      lineHeight: 1.35,
                    }}
                  >
                    {hoveredCase.department}
                  </Typography>
                </Box>
              </Box>

              {/* 3. Position */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  sx={{
                    width: 21,
                    height: 21,
                    borderRadius: '6px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    mt: '1px',
                  }}
                >
                  <MdOutlineChair size={12} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    level="body-xs"
                    sx={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#94A3B8',
                      lineHeight: 1.1,
                      mb: 0.2,
                    }}
                  >
                    Position
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#334155',
                      lineHeight: 1.35,
                    }}
                  >
                    {hoveredCase.position || `Senior Specialist · Seat ${hoveredCase.seat}`}
                  </Typography>
                </Box>
              </Box>

              {/* 4. Email */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  sx={{
                    width: 21,
                    height: 21,
                    borderRadius: '6px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    mt: '1px',
                  }}
                >
                  <FiMail size={11} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    level="body-xs"
                    sx={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#94A3B8',
                      lineHeight: 1.1,
                      mb: 0.2,
                    }}
                  >
                    Email
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
                    <Typography
                      component="a"
                      href={`mailto:${hoveredCase.email || hoveredCase.name.toLowerCase().replace(/\s+/g, '.') + '@noisiv.com'}`}
                      level="body-sm"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#2563EB',
                        textDecoration: 'none',
                        wordBreak: 'break-all',
                        '&:hover': { textDecoration: 'underline', color: '#1D4ED8' },
                      }}
                    >
                      {hoveredCase.email || hoveredCase.name.toLowerCase().replace(/\s+/g, '.') + '@noisiv.com'}
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="plain"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(hoveredCase.email || hoveredCase.name.toLowerCase().replace(/\s+/g, '.') + '@noisiv.com', 'email');
                      }}
                      sx={{ minWidth: 20, minHeight: 20, p: 0.25, color: copiedField === 'email' ? '#16A34A' : '#94A3B8', '&:hover': { color: '#7C3AED', bgcolor: '#EDE9FE' } }}
                    >
                      {copiedField === 'email' ? <FiCheck size={12} /> : <FiCopy size={11} />}
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* 5. Contact */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  sx={{
                    width: 21,
                    height: 21,
                    borderRadius: '6px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    mt: '1px',
                  }}
                >
                  <FiPhone size={11} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    level="body-xs"
                    sx={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#94A3B8',
                      lineHeight: 1.1,
                      mb: 0.2,
                    }}
                  >
                    Contact
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
                    <Typography
                      component="a"
                      href={`tel:${(hoveredCase.contact || hoveredCase.phone || '+971 50 492 8812').replace(/\s+/g, '')}`}
                      level="body-sm"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#2563EB',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline', color: '#1D4ED8' },
                      }}
                    >
                      {hoveredCase.contact || hoveredCase.phone || '+971 50 492 8812'}
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="plain"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(hoveredCase.contact || hoveredCase.phone || '+971 50 492 8812', 'contact');
                      }}
                      sx={{ minWidth: 20, minHeight: 20, p: 0.25, color: copiedField === 'contact' ? '#16A34A' : '#94A3B8', '&:hover': { color: '#7C3AED', bgcolor: '#EDE9FE' } }}
                    >
                      {copiedField === 'contact' ? <FiCheck size={12} /> : <FiCopy size={11} />}
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
        );
      })()}
    </Box>
  );
};
