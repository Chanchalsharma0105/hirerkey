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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
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
                              '&:hover': { textDecoration: 'underline' },
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
                            <FiExternalLink size={14} style={{ color: '#5B6173' }} />
                            Open case details
                          </MenuItem>

                          {onQuickView && (
                            <MenuItem
                              onClick={() => onQuickView(c.id)}
                              sx={{
                                fontFamily: 'Inter, system-ui, sans-serif',
                                gap: 1.25,
                                fontSize: '13px',
                                fontWeight: 500,
                                py: 1,
                              }}
                            >
                              <FiEye size={14} style={{ color: '#5B6173' }} />
                              Quick view summary
                            </MenuItem>
                          )}

                          {(c.stage === 1 || c.stage === 2) && (
                            <MenuItem
                              onClick={() => onSendExitInterview(c.id)}
                              sx={{
                                fontFamily: 'Inter, system-ui, sans-serif',
                                gap: 1.25,
                                fontSize: '13px',
                                fontWeight: 500,
                                py: 1,
                              }}
                            >
                              <FiMail size={14} style={{ color: '#5B6173' }} />
                              Send exit interview
                            </MenuItem>
                          )}

                          <MenuItem
                            onClick={() => onViewVacancies(c.id)}
                            sx={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              gap: 1.25,
                              fontSize: '13px',
                              fontWeight: 500,
                              py: 1,
                            }}
                          >
                            <MdOutlineChair size={15} style={{ color: '#5B6173' }} />
                            View in Vacancies
                          </MenuItem>

                          {c.stage < 2 && (
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
                          )}
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
    </Box>
  );
};
