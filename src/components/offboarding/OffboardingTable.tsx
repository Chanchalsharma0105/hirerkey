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
    const cardWidth = isSara ? 300 : isRahul ? 312 : isLeena ? 380 : 310;
    const cardHeight = isSara ? 490 : isRahul ? 140 : isLeena ? 220 : 260;
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
              width: isSara ? 300 : isRahul ? 312 : isLeena ? 380 : 320,
              height: isSara ? 490 : undefined,
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderLeft: isRahul ? '4.5px solid #7C3AED' : '1px solid #E2E8F0',
              borderRadius: isSara ? '26px' : isRahul ? '14px' : isLeena ? '20px' : '16px',
              boxShadow: isRahul
                ? '0 12px 28px -6px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)'
                : isSara
                ? '0 20px 48px -10px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(15, 23, 42, 0.06)'
                : isLeena
                ? '0 24px 50px -12px rgba(0, 23, 65, 0.22), 0 4px 12px rgba(15, 23, 42, 0.05)'
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
              /* Format 5: Oceanic Geometric Badge Style (Sara Khan - Row 5 per media_1791352602983.png) */
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 490,
                  bgcolor: '#FFFFFF',
                  overflow: 'hidden',
                  borderRadius: '26px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxSizing: 'border-box',
                }}
              >
                {/* Background Waves & Low-Poly Facet Watermarks */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                  viewBox="0 0 300 490"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  {/* Faceted Low-Poly Prism Watermark */}
                  <g opacity="0.04" stroke="#0B2545" strokeWidth="0.75" fill="none">
                    <polygon points="0,0 120,40 60,160 0,110" />
                    <polygon points="120,40 240,0 200,120 60,160" />
                    <polygon points="240,0 300,60 260,180 200,120" />
                    <polygon points="260,180 300,240 220,280 200,120" />
                    <polygon points="0,200 80,260 40,360 0,330" />
                    <polygon points="80,260 180,320 120,420 40,360" />
                    <polygon points="180,320 300,310 240,430 120,420" />
                    <polygon points="240,430 300,410 300,490 190,490" />
                  </g>

                  {/* Top-Left Sweeping Wave Ribbons */}
                  <path d="M 0 0 L 160 0 C 120 70, 70 120, 0 160 Z" fill="#E0F2FE" />
                  <path d="M 0 0 L 135 0 C 100 60, 60 100, 0 135 Z" fill="#74BACB" />
                  <path d="M 0 0 L 75 0 C 55 35, 35 55, 0 75 Z" fill="#183E62" />
                  <path d="M 0 145 C 75 110, 110 75, 145 0" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.7" />

                  {/* Bottom-Right Sweeping Wave Ribbons */}
                  <path d="M 300 490 L 140 490 C 180 420, 230 370, 300 330 Z" fill="#E0F2FE" />
                  <path d="M 300 490 L 165 490 C 200 430, 240 390, 300 355 Z" fill="#74BACB" />
                  <path d="M 300 490 L 225 490 C 245 455, 265 435, 300 415 Z" fill="#183E62" />
                  <path d="M 155 490 C 225 425, 265 385, 300 345" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.7" />
                </svg>

                {/* Top Centered Brand Logo (Winged Emblem + BORCELLE) */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: '18px',
                    userSelect: 'none',
                  }}
                >
                  <svg width="44" height="34" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 16 C20 10, 12 5, 2 8 C8 14, 15 16, 20 20 Z" fill="#38BDF8" />
                    <path d="M23 18 C18 13, 10 11, 4 14 C10 19, 16 20, 20 23 Z" fill="#0284C7" />
                    <path d="M22 21 C18 17, 12 17, 8 20 C13 23, 17 24, 20 25 Z" fill="#183E62" />
                    <path d="M24 16 C28 10, 36 5, 46 8 C40 14, 33 16, 28 20 Z" fill="#38BDF8" />
                    <path d="M25 18 C30 13, 38 11, 44 14 C38 19, 32 20, 28 23 Z" fill="#0284C7" />
                    <path d="M26 21 C30 17, 36 17, 40 20 C35 23, 31 24, 28 25 Z" fill="#183E62" />
                    <path d="M24 6 L22 14 L24 22 L26 14 Z" fill="#183E62" />
                    <circle cx="24" cy="10" r="2.5" fill="#38BDF8" />
                    <path d="M24 22 L21 28 L24 26 L27 28 Z" fill="#0284C7" />
                  </svg>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 900,
                      color: '#183E62',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      mt: '4px',
                      lineHeight: 1.1,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    BORCELLE
                  </Typography>
                </Box>

                {/* Centered Circular Avatar Photo */}
                <Box sx={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', mt: '12px' }}>
                  <Box
                    sx={{
                      width: 132,
                      height: 132,
                      borderRadius: '50%',
                      bgcolor: '#FFFFFF',
                      border: '3px solid #183E62',
                      boxShadow: '0 8px 24px rgba(24, 62, 98, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="./sara_avatar.png"
                      alt={hoveredCase.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'public/sara_avatar.png';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Box>
                </Box>

                {/* Middle Identity Section */}
                <Box sx={{ position: 'relative', zIndex: 3, mt: '18px', textAlign: 'center', px: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 900,
                      color: '#183E62',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      lineHeight: 1.2,
                    }}
                  >
                    {hoveredCase.name.toUpperCase()}
                  </Typography>
                  <Box sx={{ width: 170, height: '2px', bgcolor: '#183E62', borderRadius: '1px', my: '6px', mx: 'auto' }} />
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#183E62',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      lineHeight: 1.2,
                    }}
                  >
                    {(hoveredCase.designation || hoveredCase.title || 'FRONT DESK MANAGER').toUpperCase()}
                  </Typography>
                </Box>

                {/* Barcode & ID Section */}
                <Box sx={{ position: 'relative', zIndex: 3, mt: '18px', textAlign: 'center', px: '20px' }}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#183E62',
                      letterSpacing: '0.04em',
                      mb: '6px',
                    }}
                  >
                    ID 123-456-7890
                  </Typography>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy('123-456-7890', 'email');
                    }}
                    sx={{
                      width: 170,
                      mx: 'auto',
                      cursor: 'pointer',
                      p: '2px',
                      borderRadius: '4px',
                      transition: 'transform 0.15s ease, opacity 0.15s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        opacity: 0.85,
                      },
                    }}
                    title="Click to copy employee ID"
                  >
                    <svg style={{ width: '100%', height: 34, display: 'block' }} viewBox="0 0 170 34" fill="#183E62" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0" y="0" width="170" height="1.5" />
                      <rect x="0" y="32.5" width="170" height="1.5" />
                      <rect x="5" y="3" width="3" height="28" />
                      <rect x="11" y="3" width="1.5" height="28" />
                      <rect x="15" y="3" width="4" height="28" />
                      <rect x="22" y="3" width="2" height="28" />
                      <rect x="27" y="3" width="1.5" height="28" />
                      <rect x="31" y="3" width="5" height="28" />
                      <rect x="39" y="3" width="2" height="28" />
                      <rect x="44" y="3" width="3.5" height="28" />
                      <rect x="50" y="3" width="1.5" height="28" />
                      <rect x="54" y="3" width="4" height="28" />
                      <rect x="61" y="3" width="2" height="28" />
                      <rect x="66" y="3" width="1.5" height="28" />
                      <rect x="70" y="3" width="5" height="28" />
                      <rect x="78" y="3" width="2" height="28" />
                      <rect x="83" y="3" width="3" height="28" />
                      <rect x="89" y="3" width="1.5" height="28" />
                      <rect x="93" y="3" width="4" height="28" />
                      <rect x="100" y="3" width="2" height="28" />
                      <rect x="105" y="3" width="1.5" height="28" />
                      <rect x="109" y="3" width="5" height="28" />
                      <rect x="117" y="3" width="2" height="28" />
                      <rect x="122" y="3" width="3.5" height="28" />
                      <rect x="128" y="3" width="1.5" height="28" />
                      <rect x="132" y="3" width="4" height="28" />
                      <rect x="139" y="3" width="2" height="28" />
                      <rect x="144" y="3" width="1.5" height="28" />
                      <rect x="148" y="3" width="5" height="28" />
                      <rect x="156" y="3" width="2" height="28" />
                      <rect x="161" y="3" width="4" height="28" />
                    </svg>
                  </Box>
                </Box>

                {/* Bottom-Right Crown Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 18,
                    zIndex: 3,
                    width: 46,
                    height: 28,
                    borderRadius: '14px',
                    bgcolor: '#354E5B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                  }}
                  title="Authorized Access Pass"
                >
                  <svg width="18" height="14" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 15L1.5 5L7 9.5L12 2L17 9.5L22.5 5L21 15H3Z" fill="#FFFFFF" />
                    <rect x="3" y="16" width="18" height="2" rx="0.5" fill="#FFFFFF" />
                    <circle cx="1.5" cy="4" r="1.5" fill="#FFFFFF" />
                    <circle cx="12" cy="1.5" r="1.5" fill="#FFFFFF" />
                    <circle cx="22.5" cy="4" r="1.5" fill="#FFFFFF" />
                  </svg>
                </Box>
              </Box>
            ) : isRahul ? (
              /* Format 4: Sleek Left-Spine ID Card (Rahul Mehta - Row 4/2) */
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  bgcolor: '#FFFFFF',
                  p: '12px 14px 11px 13px',
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

                    {/* Employee Info: Name + Email + Role Pill */}
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
                          maxWidth: 180,
                        }}
                      >
                        {hoveredCase.name}
                      </Typography>
                      <Typography
                        component="a"
                        href={`mailto:${hoveredCase.email || 'rahul.mehta@hirerkey.com'}`}
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
                          maxWidth: 180,
                          '&:hover': { color: '#7C3AED', textDecoration: 'underline' },
                        }}
                      >
                        {hoveredCase.email
                          ? hoveredCase.email.length > 20
                            ? hoveredCase.email.substring(0, 6) + '..@' + (hoveredCase.email.split('@')[1] || 'hirerkey.com')
                            : hoveredCase.email
                          : 'rahul..@hirerkey.com'}
                      </Typography>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: '8px',
                          py: '2px',
                          bgcolor: '#F3EEFF',
                          color: '#6D28D9',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          lineHeight: 1.2,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Manager
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
                      {hoveredCase.designation || hoveredCase.title || 'Product Manager'}
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
                      {hoveredCase.department || hoveredCase.dept || 'Product'}
                    </Typography>
                  </Box>

                  {/* 3. Level (Users/Team) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }} title="Hierarchy Level">
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
                      Manager
                    </Typography>
                  </Box>

                  {/* 4. Employee Code / ID (ID Card Badge [A ≡]) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }} title="Employee ID Code">
                    <Box sx={{ width: 15, height: 15, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="16" rx="3" />
                        <path d="M7 15l1.8-6.5h.4L11 15" />
                        <path d="M7.7 13.2h2.6" />
                        <line x1="14" y1="10" x2="18" y2="10" />
                        <line x1="14" y1="14" x2="18" y2="14" />
                      </svg>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#475569',
                        fontFamily: 'JetBrains Mono, monospace',
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      HK-EMP-0234
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : isLeena ? (
              /* Format 3: Curved Arc & Navy Wave Style (Leena Joseph - Row 4 per media_1791308293272.png) */
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  minHeight: 220,
                  bgcolor: '#FFFFFF',
                  overflow: 'hidden',
                  borderRadius: '20px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {/* Right Curved Navy Panel & Purple Wave Accent */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                  viewBox="0 0 380 220"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Purple Accent Ribbon Wave */}
                  <path d="M 220 0 C 290 60, 290 160, 204 220 L 380 220 L 380 0 Z" fill="#7C3AED" />
                  {/* Deep Navy Dark Panel */}
                  <path d="M 238 0 C 298 65, 298 155, 224 220 L 380 220 L 380 0 Z" fill="#001741" />
                </svg>

                {/* Authentic Hirerkey White Wordmark in Navy Section */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 15,
                    right: 18,
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                    userSelect: 'none',
                  }}
                >
                  <span>hirer</span>
                  <Box component="span" sx={{ position: 'relative', display: 'inline-block' }}>
                    key
                    <svg
                      style={{
                        position: 'absolute',
                        left: -6,
                        bottom: -5,
                        width: 'calc(100% + 10px)',
                        height: 6,
                        pointerEvents: 'none',
                      }}
                      viewBox="0 0 63 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M 2 2.5 C 5 7, 10 9.5, 16 9.5 L 48 9.5 C 54 9.5, 58.5 7, 60.5 2.5" stroke="#FFFFFF" strokeWidth={2.8} strokeLinecap="round" />
                    </svg>
                  </Box>
                </Box>

                {/* Left Content Column */}
                <Box sx={{ position: 'relative', zIndex: 3, p: '18px 20px', maxWidth: 245, display: 'flex', flexDirection: 'column' }}>
                  {/* Top Identity Row: Avatar with Ring & Purple Arc + Name & Subtitles */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '14px' }}>
                    <Box sx={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                      <svg style={{ position: 'absolute', top: -2, left: -2, width: 56, height: 56, pointerEvents: 'none' }} viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="26" fill="none" stroke="#F1F5F9" strokeWidth={2.5} />
                        <circle cx="28" cy="28" r="26" fill="none" stroke="#7C3AED" strokeWidth={2.5} strokeDasharray="40 125" strokeDashoffset="10" strokeLinecap="round" />
                      </svg>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          m: '2px',
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
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <Typography sx={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {hoveredCase.name.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#475569', mt: '2px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {hoveredCase.designation || hoveredCase.title || 'Housekeeping Supervisor'}
                      </Typography>
                      <Typography sx={{ fontSize: '10.5px', fontWeight: 500, color: '#94A3B8', mt: '1px', whiteSpace: 'nowrap' }}>
                        {`${hoveredCase.department || 'Operations'} · Seat ${hoveredCase.seat || 'HKS-03'} · #EMP-${hoveredCase.id.toString().padStart(4, '0')}`}
                      </Typography>
                    </Box>
                  </Box>

                  {/* 4 Details Rows with Vibrant Purple Circular Badges */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8.5px' }}>
                    {/* 1. Phone */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: '#7C3AED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.28)',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, fontSize: '11.5px', lineHeight: 1.3 }}>
                        <Typography
                          component="a"
                          href={`tel:${(hoveredCase.contact || hoveredCase.phone || '+971 55 904 1128').replace(/\s+/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#1E293B',
                            fontWeight: 500,
                            fontSize: '11.5px',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            '&:hover': { color: '#7C3AED', textDecoration: 'underline' },
                          }}
                        >
                          {hoveredCase.contact || hoveredCase.phone || '+971 55 904 1128'}
                        </Typography>
                        <IconButton
                          size="sm"
                          variant="plain"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(hoveredCase.contact || hoveredCase.phone || '+971 55 904 1128', 'contact');
                          }}
                          sx={{ minWidth: 20, minHeight: 20, p: 0.25, color: copiedField === 'contact' ? '#16A34A' : '#94A3B8', '&:hover': { color: '#7C3AED', bgcolor: '#EDE9FE' } }}
                        >
                          {copiedField === 'contact' ? <FiCheck size={12} /> : <FiCopy size={11} />}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* 2. Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: '#7C3AED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.28)',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, fontSize: '11.5px', lineHeight: 1.3 }}>
                        <Typography
                          component="a"
                          href={`mailto:${hoveredCase.email || 'leena.joseph@noisiv.com'}`}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#1E293B',
                            fontWeight: 500,
                            fontSize: '11.5px',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            '&:hover': { color: '#7C3AED', textDecoration: 'underline' },
                          }}
                        >
                          {hoveredCase.email || 'leena.joseph@noisiv.com'}
                        </Typography>
                        <IconButton
                          size="sm"
                          variant="plain"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(hoveredCase.email || 'leena.joseph@noisiv.com', 'email');
                          }}
                          sx={{ minWidth: 20, minHeight: 20, p: 0.25, color: copiedField === 'email' ? '#16A34A' : '#94A3B8', '&:hover': { color: '#7C3AED', bgcolor: '#EDE9FE' } }}
                        >
                          {copiedField === 'email' ? <FiCheck size={12} /> : <FiCopy size={11} />}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* 3. Department */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: '#7C3AED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.28)',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, fontSize: '11.5px', lineHeight: 1.3 }}>
                        <Typography sx={{ color: '#334155', fontWeight: 500, fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {`${hoveredCase.department || 'Housekeeping'} Department`}
                        </Typography>
                      </Box>
                    </Box>

                    {/* 4. Location Pin */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: '#7C3AED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.28)',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, fontSize: '11.5px', lineHeight: 1.3 }}>
                        <Typography sx={{ color: '#334155', fontWeight: 500, fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {`Dubai, UAE · Seat ${hoveredCase.seat || 'HKS-03'}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : isAisha ? (
              /* Format 2: Straight Purple Header Style (Aisha Noor - Row 2) */
              <Box sx={{ position: 'relative', bgcolor: '#FFFFFF', overflow: 'hidden', borderRadius: '16px' }}>
              {/* Straight Purple Header (Straight bottom edge, no curve) */}
              <Box sx={{ width: '100%', height: 52, bgcolor: '#7C3AED', background: 'linear-gradient(135deg, #9185F8 0%, #7C3AED 100%)' }} />

              {/* Centered Overlapping Circular Avatar */}
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mt: '-34px', zIndex: 2 }}>
                <Box
                  sx={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    bgcolor: '#DDD6FE',
                    border: '3.5px solid #FFFFFF',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.22), 0 1px 3px rgba(15, 23, 42, 0.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/aisha_avatar.png"
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
                    bottom: 2,
                    right: 'calc(50% - 31px)',
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    bgcolor: '#10B981',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.3)',
                    zIndex: 3,
                  }}
                />
              </Box>

              {/* Centered Name: AISHA NOOR */}
              <Typography
                sx={{
                  fontSize: '15.5px',
                  fontWeight: 800,
                  color: '#0F172A',
                  textAlign: 'center',
                  mt: '7px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {hoveredCase.name.toUpperCase()}
              </Typography>

              {/* Centered Badges Row: ID Chip + Department Chip */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.9, mt: '5px', mb: '12px' }}>
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
                    py: '1.5px',
                    lineHeight: 1.2,
                  }}
                >
                  {`#EMP-${hoveredCase.id.toString().padStart(4, '0')}`}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    bgcolor: '#EDE9FE',
                    color: '#5B21B6',
                    border: '1px solid #DDD6FE',
                    fontSize: '11px',
                    fontWeight: 600,
                    px: '12px',
                    py: '2px',
                    borderRadius: '999px',
                    display: 'inline-block',
                    letterSpacing: '0.02em',
                    lineHeight: 1.25,
                  }}
                >
                  {hoveredCase.department || 'Front Office'}
                </Box>
              </Box>

              {/* Colon-Aligned Key-Value Metadata List: Only Designation, Position, Email, Phone */}
              <Box sx={{ px: 2, pb: 1.75, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Designation */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'center', fontSize: '11.5px', lineHeight: 1.35 }}>
                  <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '11.5px', whiteSpace: 'nowrap' }}>Designation</Typography>
                  <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '11.5px', textAlign: 'center' }}>:</Typography>
                  <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '11.5px' }}>
                    {hoveredCase.designation || hoveredCase.title}
                  </Typography>
                </Box>

                {/* Position */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'center', fontSize: '11.5px', lineHeight: 1.35 }}>
                  <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '11.5px', whiteSpace: 'nowrap' }}>Position</Typography>
                  <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '11.5px', textAlign: 'center' }}>:</Typography>
                  <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '11.5px' }}>
                    {hoveredCase.position || `Specialist · Seat ${hoveredCase.seat}`}
                  </Typography>
                </Box>

                {/* E-mail */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'center', fontSize: '11.5px', lineHeight: 1.35 }}>
                  <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '11.5px', whiteSpace: 'nowrap' }}>E-mail</Typography>
                  <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '11.5px', textAlign: 'center' }}>:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, minWidth: 0 }}>
                    <Typography
                      component="a"
                      href={`mailto:${hoveredCase.email || 'aisha.noor@noisiv.com'}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        color: '#2563EB',
                        fontWeight: 600,
                        fontSize: '11.5px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '&:hover': { textDecoration: 'underline', color: '#1D4ED8' },
                      }}
                    >
                      {hoveredCase.email || 'aisha.noor@noisiv.com'}
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="plain"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(hoveredCase.email || 'aisha.noor@noisiv.com', 'email');
                      }}
                      sx={{ minWidth: 20, minHeight: 20, p: 0.25, color: copiedField === 'email' ? '#16A34A' : '#94A3B8', '&:hover': { color: '#7C3AED', bgcolor: '#EDE9FE' } }}
                    >
                      {copiedField === 'email' ? <FiCheck size={12} /> : <FiCopy size={11} />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Phone */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'center', fontSize: '11.5px', lineHeight: 1.35 }}>
                  <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '11.5px', whiteSpace: 'nowrap' }}>Phone</Typography>
                  <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '11.5px', textAlign: 'center' }}>:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, minWidth: 0 }}>
                    <Typography
                      component="a"
                      href={`tel:${(hoveredCase.contact || hoveredCase.phone || '+971 54 712 3390').replace(/\s+/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        color: '#2563EB',
                        fontWeight: 600,
                        fontSize: '11.5px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '&:hover': { textDecoration: 'underline', color: '#1D4ED8' },
                      }}
                    >
                      {hoveredCase.contact || hoveredCase.phone || '+971 54 712 3390'}
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="plain"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(hoveredCase.contact || hoveredCase.phone || '+971 54 712 3390', 'contact');
                      }}
                      sx={{ minWidth: 20, minHeight: 20, p: 0.25, color: copiedField === 'contact' ? '#16A34A' : '#94A3B8', '&:hover': { color: '#7C3AED', bgcolor: '#EDE9FE' } }}
                    >
                      {copiedField === 'contact' ? <FiCheck size={12} /> : <FiCopy size={11} />}
                    </IconButton>
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
