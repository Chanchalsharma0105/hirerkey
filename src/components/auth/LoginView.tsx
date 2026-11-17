import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Input,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
} from '@mui/joy';
import { motion } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiArrowRight, HiEye, HiEyeSlash } from 'react-icons/hi2';

export type AuthMode = 'otp' | 'password';

export interface LoginViewProps {
  onSuccessLogin?: (email: string, method: AuthMode) => void;
  className?: string;
  defaultView?: number;
}

interface V3MinimalStageProps {
  active?: boolean;
}

const V3MinimalStage: React.FC<V3MinimalStageProps> = ({ active = true }) => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Micro-interaction states
  // Card 1
  const [card1Progress, setCard1Progress] = useState<string>('0%');
  const [card1CheckVisible, setCard1CheckVisible] = useState<boolean>(false);

  // Card 2
  const [card2Av1, setCard2Av1] = useState<boolean>(false);
  const [card2Av2, setCard2Av2] = useState<boolean>(false);
  const [card2Av3, setCard2Av3] = useState<boolean>(false);
  const [card2Completed, setCard2Completed] = useState<boolean>(false);

  // Card 3
  const [card3TypedText, setCard3TypedText] = useState<string>('');
  const [card3Thinking, setCard3Thinking] = useState<boolean>(false);
  const [card3AiVisible, setCard3AiVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCurrentCard(0);
      setIsExiting(false);
      setCard1Progress('80%');
      setCard1CheckVisible(true);
      return;
    }

    let isMounted = true;
    let cardTimer: NodeJS.Timeout;
    let exitTimer: NodeJS.Timeout;
    let microTimers: (NodeJS.Timeout | number)[] = [];

    const clearTimers = () => {
      clearTimeout(cardTimer);
      clearTimeout(exitTimer);
      microTimers.forEach((t) => {
        if (typeof t === 'number') {
          clearInterval(t);
          clearTimeout(t);
        } else {
          clearTimeout(t);
        }
      });
      microTimers = [];
    };

    const runCard = (idx: number) => {
      if (!isMounted) return;
      clearTimers();
      setIsExiting(false);
      setCurrentCard(idx);

      // Reset micro-interactions
      setCard1Progress('0%');
      setCard1CheckVisible(false);
      setCard2Av1(false);
      setCard2Av2(false);
      setCard2Av3(false);
      setCard2Completed(false);
      setCard3TypedText('');
      setCard3Thinking(false);
      setCard3AiVisible(false);

      if (idx === 0) {
        // Card 1: Orientation Progress & Checkmark
        microTimers.push(setTimeout(() => { if (isMounted) setCard1Progress('80%'); }, 300));
        microTimers.push(setTimeout(() => { if (isMounted) setCard1CheckVisible(true); }, 1400));
      } else if (idx === 1) {
        // Card 2: Department Tour Avatars & Completed Pill
        microTimers.push(setTimeout(() => { if (isMounted) setCard2Av1(true); }, 250));
        microTimers.push(setTimeout(() => { if (isMounted) setCard2Av2(true); }, 550));
        microTimers.push(setTimeout(() => { if (isMounted) setCard2Av3(true); }, 850));
        microTimers.push(setTimeout(() => { if (isMounted) setCard2Completed(true); }, 1250));
      } else if (idx === 2) {
        // Card 3: Ask HyIQ Typewriter, Thinking Wave, & AI Response
        const textToType = 'Show my pending tasks';
        let charIdx = 0;
        const typeInterval = setInterval(() => {
          if (!isMounted) { clearInterval(typeInterval); return; }
          if (charIdx <= textToType.length) {
            setCard3TypedText(textToType.slice(0, charIdx));
            charIdx++;
          } else {
            clearInterval(typeInterval);
          }
        }, 35);
        microTimers.push(typeInterval as unknown as NodeJS.Timeout);

        microTimers.push(setTimeout(() => { if (isMounted) setCard3Thinking(true); }, 1050));
        microTimers.push(setTimeout(() => {
          if (isMounted) {
            setCard3Thinking(false);
            setCard3AiVisible(true);
          }
        }, 1750));
      }

      // Graceful exit start at 3.05s
      exitTimer = setTimeout(() => {
        if (isMounted) setIsExiting(true);
      }, 3050);

      // Next card transition at 3.5s
      cardTimer = setTimeout(() => {
        if (isMounted) {
          runCard((idx + 1) % 4);
        }
      }, 3500);
    };

    runCard(0);

    return () => {
      isMounted = false;
      clearTimers();
    };
  }, [active]);

  return (
    <Box
      id="v3MinimalStage"
      className="v3-minimal-stage"
      role="region"
      aria-label="Hirerkey Features Overview"
    >
      {/* Central Dashboard Anchor (~340px wide, continuous floating animation) */}
      <Box className="v3-dashboard" id="v3Dashboard">
        {/* Browser Chrome Bar */}
        <Box className="v3-chrome">
          <Box className="v3-chrome-dots">
            <span className="v3-dot v3-dot-red" />
            <span className="v3-dot v3-dot-yellow" />
            <span className="v3-dot v3-dot-green" />
          </Box>
          <Box className="v3-chrome-url">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>app.hirerkey.com/dashboard</span>
          </Box>
          <Box className="v3-chrome-sync">
            <span className="v3-sync-dot" />
            <span className="v3-sync-text">Live Sync</span>
          </Box>
        </Box>

        {/* Dashboard Preview Image */}
        <Box className="v3-dashboard-canvas">
          <img
            src="assets/hirerkey_actual_dashboard.png"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'views/assets/hirerkey_actual_dashboard.png';
            }}
            alt="Hirerkey Central Dashboard Preview"
            className="v3-dashboard-img"
            loading="eager"
          />
        </Box>
      </Box>

      {/* Floating Feature Card Deck (Only 1 Active Card at a Time, positioned bottom-right ~280px wide) */}
      <Box className="v3-card-deck" id="v3CardDeck">
        {/* Card 1: Orientation */}
        <Box
          className={`v3-feature-card ${currentCard === 0 ? (isExiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v3Card1"
          aria-hidden={currentCard !== 0}
        >
          <Box className="v3-card-header">
            <Box className="v3-card-tag-wrap">
              <span className="v3-card-icon-pill v3-pill-purple">
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Orientation</span>
              </span>
              <span className="v3-status-pill v3-status-success">
                <svg
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Active</span>
              </span>
            </Box>
          </Box>
          <Box className="v3-card-body">
            <h4 className="v3-card-title">Welcome aboard!</h4>
            <p className="v3-card-desc">
              Employee onboarding progress: <strong className="v3-card-accent">80%</strong>
            </p>
            <Box className="v3-progress-container">
              <Box className="v3-progress-track">
                <Box
                  className="v3-progress-bar"
                  id="v3ProgressFill1"
                  sx={{ width: card1Progress }}
                />
              </Box>
              <Box
                className={`v3-check-badge ${card1CheckVisible ? 'is-visible' : ''}`}
                id="v3CheckBadge1"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Card 2: Department Tour */}
        <Box
          className={`v3-feature-card ${currentCard === 1 ? (isExiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v3Card2"
          aria-hidden={currentCard !== 1}
        >
          <Box className="v3-card-header">
            <Box className="v3-card-tag-wrap">
              <span className="v3-card-icon-pill v3-pill-indigo">
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Department Tour</span>
              </span>
              <span
                className={`v3-status-pill v3-status-completed ${card2Completed ? 'is-visible' : ''}`}
                id="v3CompletedPill2"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Completed</span>
              </span>
            </Box>
          </Box>
          <Box className="v3-card-body">
            <h4 className="v3-card-title">Meet your team</h4>
            <p className="v3-card-desc">Connected with 3 department leads</p>
            <Box className="v3-avatar-deck">
              <Box className="v3-avatar-group">
                <Box className={`v3-avatar v3-av-1 ${card2Av1 ? 'is-visible' : ''}`} title="Maya Santos">
                  <span>MS</span>
                </Box>
                <Box className={`v3-avatar v3-av-2 ${card2Av2 ? 'is-visible' : ''}`} title="James Liu">
                  <span>JL</span>
                </Box>
                <Box className={`v3-avatar v3-av-3 ${card2Av3 ? 'is-visible' : ''}`} title="Sarah Khan">
                  <span>SK</span>
                </Box>
              </Box>
              <span className="v3-avatar-summary">+ 8 teammates</span>
            </Box>
          </Box>
        </Box>

        {/* Card 3: Ask HyIQ */}
        <Box
          className={`v3-feature-card ${currentCard === 2 ? (isExiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v3Card3"
          aria-hidden={currentCard !== 2}
        >
          <Box className="v3-card-header">
            <Box className="v3-card-tag-wrap">
              <span className="v3-card-icon-pill v3-pill-ai">
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                <span>Ask HyIQ</span>
              </span>
              <span className="v3-status-pill v3-status-ai">
                <span className="v3-ai-sparkle">✦</span>
                <span>AI Copilot</span>
              </span>
            </Box>
          </Box>
          <Box className="v3-card-body">
            <Box className="v3-chat-user-bubble">
              <span className="v3-bubble-prefix">User:</span>
              <span className="v3-typewriter-text" id="v3PromptText">
                {card3TypedText}
              </span>
              <span className="v3-typewriter-cursor" id="v3PromptCursor">
                |
              </span>
            </Box>
            <Box
              className={`v3-thinking-wave ${card3Thinking ? 'is-active' : ''}`}
              id="v3ThinkingWave"
            >
              <span />
              <span />
              <span />
            </Box>
            <Box
              className={`v3-chat-ai-bubble ${card3AiVisible ? 'is-visible' : ''}`}
              id="v3AiResponse"
            >
              <span className="v3-ai-avatar">✨</span>
              <span className="v3-ai-msg">
                You have <strong style={{ color: '#7C3AED' }}>3 tasks</strong> awaiting completion.
              </span>
            </Box>
          </Box>
        </Box>

        {/* Card 4: 1-on-1 Check-in */}
        <Box
          className={`v3-feature-card ${currentCard === 3 ? (isExiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v3Card4"
          aria-hidden={currentCard !== 3}
        >
          <Box className="v3-card-header">
            <Box className="v3-card-tag-wrap">
              <span className="v3-card-icon-pill v3-pill-blue">
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>1-on-1 Check-in</span>
              </span>
              <span className="v3-status-pill v3-status-scheduled">
                <span className="v3-radar-ring">
                  <span className="v3-radar-pulse" />
                  <span className="v3-radar-core" />
                </span>
                <span>Scheduled</span>
              </span>
            </Box>
          </Box>
          <Box className="v3-card-body">
            <h4 className="v3-card-title">Upcoming check-in</h4>
            <Box className="v3-schedule-row">
              <Box className="v3-schedule-time">
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Today · 3:30 PM</span>
              </Box>
              <span className="v3-schedule-tag">Sync with Manager</span>
            </Box>
            <Box className="v3-schedule-footer">
              <Box className="v3-agenda-bullet">
                <span className="v3-bullet-dot" />
                <span>Monthly milestone review &amp; feedback</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface V4EcosystemStageProps {
  active?: boolean;
}

const V4EcosystemStage: React.FC<V4EcosystemStageProps> = ({ active = true }) => {
  // Visibility and exiting states for 4 cards
  const [card1Active, setCard1Active] = useState<boolean>(false);
  const [card1Exiting, setCard1Exiting] = useState<boolean>(false);
  const [card1Progress, setCard1Progress] = useState<string>('0%');
  const [card1CheckVisible, setCard1CheckVisible] = useState<boolean>(false);

  const [card2Active, setCard2Active] = useState<boolean>(false);
  const [card2Exiting, setCard2Exiting] = useState<boolean>(false);
  const [card2Av1, setCard2Av1] = useState<boolean>(false);
  const [card2Av2, setCard2Av2] = useState<boolean>(false);
  const [card2Av3, setCard2Av3] = useState<boolean>(false);
  const [card2Completed, setCard2Completed] = useState<boolean>(false);

  const [card3Active, setCard3Active] = useState<boolean>(false);
  const [card3Exiting, setCard3Exiting] = useState<boolean>(false);
  const [card3TypedText, setCard3TypedText] = useState<string>('');
  const [card3Thinking, setCard3Thinking] = useState<boolean>(false);
  const [card3AiVisible, setCard3AiVisible] = useState<boolean>(false);

  const [card4Active, setCard4Active] = useState<boolean>(false);
  const [card4Exiting, setCard4Exiting] = useState<boolean>(false);

  // SVG lines active/exiting states
  const [line1Active, setLine1Active] = useState<boolean>(false);
  const [line1Exiting, setLine1Exiting] = useState<boolean>(false);
  const [line2Active, setLine2Active] = useState<boolean>(false);
  const [line2Exiting, setLine2Exiting] = useState<boolean>(false);
  const [line3Active, setLine3Active] = useState<boolean>(false);
  const [line3Exiting, setLine3Exiting] = useState<boolean>(false);
  const [line4Active, setLine4Active] = useState<boolean>(false);
  const [line4Exiting, setLine4Exiting] = useState<boolean>(false);

  // Dashboard overlays
  const [dashBlooming, setDashBlooming] = useState<boolean>(false);
  const [goalUpdated, setGoalUpdated] = useState<boolean>(false);
  const [goalVal, setGoalVal] = useState<string>('88%');
  const [aiNoticeVisible, setAiNoticeVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCard1Active(true);
      setCard1Exiting(false);
      setCard1Progress('80%');
      setCard1CheckVisible(true);
      setLine1Active(true);

      setCard3Active(true);
      setCard3Exiting(false);
      setCard3TypedText('Show my pending tasks');
      setCard3AiVisible(true);
      setLine3Active(true);

      setGoalVal('100%');
      return;
    }

    let isMounted = true;
    let loopTimer: NodeJS.Timeout;
    const sceneTimers: (NodeJS.Timeout | number)[] = [];
    let typeInterval: NodeJS.Timeout | number | null = null;

    const clearTimers = () => {
      clearTimeout(loopTimer);
      if (typeInterval) {
        clearInterval(typeInterval as number);
        typeInterval = null;
      }
      sceneTimers.forEach((t) => {
        clearTimeout(t as NodeJS.Timeout);
      });
      sceneTimers.length = 0;
    };

    const resetState = () => {
      setCard1Active(false);
      setCard1Exiting(false);
      setCard1Progress('0%');
      setCard1CheckVisible(false);
      setLine1Active(false);
      setLine1Exiting(false);

      setCard2Active(false);
      setCard2Exiting(false);
      setCard2Av1(false);
      setCard2Av2(false);
      setCard2Av3(false);
      setCard2Completed(false);
      setLine2Active(false);
      setLine2Exiting(false);

      setCard3Active(false);
      setCard3Exiting(false);
      setCard3TypedText('');
      setCard3Thinking(false);
      setCard3AiVisible(false);
      setLine3Active(false);
      setLine3Exiting(false);

      setCard4Active(false);
      setCard4Exiting(false);
      setLine4Active(false);
      setLine4Exiting(false);

      setDashBlooming(false);
      setGoalUpdated(false);
      setGoalVal('88%');
      setAiNoticeVisible(false);
    };

    const runMasterLoop = () => {
      if (!isMounted) return;
      clearTimers();
      resetState();

      // SCENE 1: Dashboard Genesis & Ambient Float (0.0s - 2.2s)

      // SCENE 2: Orientation Connects (2.2s - 5.7s)
      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1Active(true);
        setCard1Exiting(false);
        setLine1Active(true);
        setLine1Exiting(false);
      }, 2200));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1Progress('80%');
      }, 2500));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1CheckVisible(true);
        setGoalUpdated(true);
        setGoalVal('91%');
      }, 3600));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1Exiting(true);
        setLine1Exiting(true);
      }, 5200));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1Active(false);
        setCard1Exiting(false);
        setLine1Active(false);
        setLine1Exiting(false);
        setGoalUpdated(false);
      }, 5700));

      // SCENE 3: Department Tour Connects (5.7s - 9.2s)
      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard2Active(true);
        setCard2Exiting(false);
        setLine2Active(true);
        setLine2Exiting(false);
      }, 5700));

      sceneTimers.push(setTimeout(() => { if (isMounted) setCard2Av1(true); }, 6000));
      sceneTimers.push(setTimeout(() => { if (isMounted) setCard2Av2(true); }, 6350));
      sceneTimers.push(setTimeout(() => { if (isMounted) setCard2Av3(true); }, 6700));
      sceneTimers.push(setTimeout(() => { if (isMounted) setCard2Completed(true); }, 7150));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard2Exiting(true);
        setLine2Exiting(true);
      }, 8700));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard2Active(false);
        setCard2Exiting(false);
        setLine2Active(false);
        setLine2Exiting(false);
      }, 9200));

      // SCENE 4: Ask HyIQ Intelligence (9.2s - 13.0s)
      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard3Active(true);
        setCard3Exiting(false);
        setLine3Active(true);
        setLine3Exiting(false);
      }, 9200));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        const textToType = 'Show my pending tasks';
        let charIdx = 0;
        const interval = setInterval(() => {
          if (!isMounted) {
            clearInterval(interval);
            return;
          }
          if (charIdx <= textToType.length) {
            setCard3TypedText(textToType.slice(0, charIdx));
            charIdx++;
          } else {
            clearInterval(interval);
          }
        }, 32);
        typeInterval = interval;
      }, 9550));

      sceneTimers.push(setTimeout(() => {
        if (isMounted) setCard3Thinking(true);
      }, 10300));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard3Thinking(false);
        setCard3AiVisible(true);
        setAiNoticeVisible(true);
      }, 11100));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard3Exiting(true);
        setLine3Exiting(true);
        setAiNoticeVisible(false);
      }, 12500));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard3Active(false);
        setCard3Exiting(false);
        setLine3Active(false);
        setLine3Exiting(false);
      }, 13000));

      // SCENE 5: 1-on-1 Check-in Connects (13.0s - 16.5s)
      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard4Active(true);
        setCard4Exiting(false);
        setLine4Active(true);
        setLine4Exiting(false);
        setGoalUpdated(true);
        setGoalVal('94%');
      }, 13000));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard4Exiting(true);
        setLine4Exiting(true);
      }, 16000));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard4Active(false);
        setCard4Exiting(false);
        setLine4Active(false);
        setLine4Exiting(false);
        setGoalUpdated(false);
      }, 16500));

      // SCENE 6: Two-Module Ecosystem (16.5s - 20.5s)
      // Card 1 (Upper-Left) AND Card 3 (Upper-Right) appear TOGETHER!
      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1Active(true);
        setCard1Exiting(false);
        setCard1Progress('80%');
        setCard1CheckVisible(true);
        setLine1Active(true);
        setLine1Exiting(false);

        setCard3Active(true);
        setCard3Exiting(false);
        setCard3TypedText('Show my pending tasks');
        setCard3AiVisible(true);
        setLine3Active(true);
        setLine3Exiting(false);

        setAiNoticeVisible(true);
      }, 16500));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1Exiting(true);
        setLine1Exiting(true);
        setCard3Exiting(true);
        setLine3Exiting(true);
        setAiNoticeVisible(false);
      }, 20000));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setCard1Active(false);
        setCard1Exiting(false);
        setLine1Active(false);
        setLine1Exiting(false);
        setCard3Active(false);
        setCard3Exiting(false);
        setLine3Active(false);
        setLine3Exiting(false);
      }, 20500));

      // SCENE 7: Climax Bloom & Reset (20.5s - 23.0s)
      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setDashBlooming(true);
        setGoalUpdated(true);
        setGoalVal('100% ✨');
      }, 20500));

      sceneTimers.push(setTimeout(() => {
        if (!isMounted) return;
        setDashBlooming(false);
      }, 22200));

      // Seamless Restart
      loopTimer = setTimeout(() => {
        if (isMounted) {
          runMasterLoop();
        }
      }, 23000);
    };

    runMasterLoop();

    return () => {
      isMounted = false;
      clearTimers();
    };
  }, [active]);

  return (
    <Box
      id="v4EcoStage"
      className="v4-eco-stage"
      role="region"
      aria-label="The Connected HR Ecosystem"
    >
      {/* SVG CONNECTING PATHS & TRAVELLING PARTICLES */}
      <svg className="v4-eco-svg-canvas" viewBox="0 0 540 380" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="v4EcoGrad1React" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="v4EcoGrad2React" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="v4EcoGrad3React" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="v4EcoGrad4React" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
          </linearGradient>
          <filter id="v4EcoGlowReact" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines */}
        <path
          className={`v4-eco-line ${line1Active ? (line1Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoLine1"
          stroke="url(#v4EcoGrad1React)"
          d="M 175 80 C 205 90, 220 110, 235 130"
          filter="url(#v4EcoGlowReact)"
        />
        <path
          className={`v4-eco-line ${line2Active ? (line2Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoLine2"
          stroke="url(#v4EcoGrad2React)"
          d="M 365 300 C 335 290, 320 270, 305 250"
          filter="url(#v4EcoGlowReact)"
        />
        <path
          className={`v4-eco-line ${line3Active ? (line3Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoLine3"
          stroke="url(#v4EcoGrad3React)"
          d="M 365 80 C 335 90, 320 110, 305 130"
          filter="url(#v4EcoGlowReact)"
        />
        <path
          className={`v4-eco-line ${line4Active ? (line4Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoLine4"
          stroke="url(#v4EcoGrad4React)"
          d="M 175 300 C 205 290, 220 270, 235 250"
          filter="url(#v4EcoGlowReact)"
        />

        {/* Travelling Particles */}
        <circle
          className={`v4-eco-particle ${line1Active ? (line1Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoParticle1"
          r="3"
          fill="#8B5CF6"
          filter="url(#v4EcoGlowReact)"
        >
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M 175 80 C 205 90, 220 110, 235 130" />
        </circle>
        <circle
          className={`v4-eco-particle ${line2Active ? (line2Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoParticle2"
          r="3"
          fill="#10B981"
          filter="url(#v4EcoGlowReact)"
        >
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M 365 300 C 335 290, 320 270, 305 250" />
        </circle>
        <circle
          className={`v4-eco-particle ${line3Active ? (line3Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoParticle3"
          r="3"
          fill="#EC4899"
          filter="url(#v4EcoGlowReact)"
        >
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M 365 80 C 335 90, 320 110, 305 130" />
        </circle>
        <circle
          className={`v4-eco-particle ${line4Active ? (line4Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoParticle4"
          r="3"
          fill="#3B82F6"
          filter="url(#v4EcoGlowReact)"
        >
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M 175 300 C 205 290, 220 270, 235 250" />
        </circle>
      </svg>

      {/* CENTRAL MINIATURE DASHBOARD HUB */}
      <Box
        className={`v4-eco-dashboard ${dashBlooming ? 'is-blooming' : ''}`}
        id="v4EcoDashboard"
      >
        <Box className="v4-eco-chrome">
          <Box className="v4-eco-chrome-dots">
            <span className="v4-eco-dot v4-eco-dot-red" />
            <span className="v4-eco-dot v4-eco-dot-yellow" />
            <span className="v4-eco-dot v4-eco-dot-green" />
          </Box>
          <Box className="v4-eco-chrome-url">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>app.hirerkey.com/dashboard</span>
          </Box>
          <Box className="v4-eco-chrome-sync">
            <span className="v4-eco-sync-dot" />
            <span className="v4-eco-sync-text">Live Sync</span>
          </Box>
        </Box>

        <Box className="v4-eco-dash-canvas">
          <img
            src="assets/hirerkey_actual_dashboard.png"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'views/assets/hirerkey_actual_dashboard.png';
            }}
            alt="Hirerkey Ecosystem Hub"
            className="v4-eco-dash-img"
            loading="eager"
          />

          {/* Goal Metric */}
          <Box className={`v4-eco-goal-metric ${goalUpdated ? 'is-updated' : ''}`} id="v4EcoGoalMetric">
            <span className="v4-eco-goal-icon">🎯</span>
            <span className="v4-eco-goal-text">Q4 Goals: <strong id="v4EcoGoalVal">{goalVal}</strong></span>
          </Box>

          {/* AI Notice */}
          <Box className={`v4-eco-ai-notice ${aiNoticeVisible ? 'is-visible' : ''}`} id="v4EcoAiNotice">
            <span className="v4-eco-ai-notice-sparkle">✨</span>
            <span className="v4-eco-ai-notice-text">HyIQ: 3 tasks awaiting completion</span>
          </Box>
        </Box>
      </Box>

      {/* 4 FLOATING MODULE CARDS */}
      <Box className="v4-eco-card-deck" id="v4EcoCardDeck">
        {/* Card 1: Orientation (Upper-Left) */}
        <Box
          className={`v4-eco-card v4-eco-card-1 ${card1Active ? (card1Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoCard1"
          aria-hidden={!card1Active}
        >
          <Box className="v4-eco-card-header">
            <span className="v4-eco-pill v4-pill-purple">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Orientation</span>
            </span>
            <span className="v4-eco-pill v4-pill-success">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Active</span>
            </span>
          </Box>
          <Box className="v4-eco-card-body">
            <h4 className="v4-eco-card-title">Welcome aboard!</h4>
            <p className="v4-eco-card-desc">Onboarding: <strong className="v4-eco-card-accent">80%</strong></p>
            <Box className="v4-eco-progress-row">
              <Box className="v4-eco-progress-track">
                <Box className="v4-eco-progress-fill" style={{ width: card1Progress }} />
              </Box>
              <Box className={`v4-eco-check-badge ${card1CheckVisible ? 'is-visible' : ''}`}>
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Card 2: Department Tour (Lower-Right) */}
        <Box
          className={`v4-eco-card v4-eco-card-2 ${card2Active ? (card2Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoCard2"
          aria-hidden={!card2Active}
        >
          <Box className="v4-eco-card-header">
            <span className="v4-eco-pill v4-pill-indigo">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Department Tour</span>
            </span>
            <span className={`v4-eco-pill v4-pill-completed ${card2Completed ? 'is-visible' : ''}`}>
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Done</span>
            </span>
          </Box>
          <Box className="v4-eco-card-body">
            <h4 className="v4-eco-card-title">Meet your team</h4>
            <p className="v4-eco-card-desc">Connected with 3 leads</p>
            <Box className="v4-eco-avatar-row">
              <Box className="v4-eco-avatar-group">
                <Box className={`v4-eco-av v4-av-ms ${card2Av1 ? 'is-visible' : ''}`} title="Maya Santos"><span>MS</span></Box>
                <Box className={`v4-eco-av v4-av-jl ${card2Av2 ? 'is-visible' : ''}`} title="James Liu"><span>JL</span></Box>
                <Box className={`v4-eco-av v4-av-sk ${card2Av3 ? 'is-visible' : ''}`} title="Sarah Khan"><span>SK</span></Box>
              </Box>
              <span className="v4-eco-avatar-extra">+8 team</span>
            </Box>
          </Box>
        </Box>

        {/* Card 3: Ask HyIQ (Upper-Right) */}
        <Box
          className={`v4-eco-card v4-eco-card-3 ${card3Active ? (card3Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoCard3"
          aria-hidden={!card3Active}
        >
          <Box className="v4-eco-card-header">
            <span className="v4-eco-pill v4-pill-ai">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              <span>Ask HyIQ</span>
            </span>
            <span className="v4-eco-pill v4-pill-ai-status">
              <span className="v4-eco-sparkle">✦</span>
              <span>Copilot</span>
            </span>
          </Box>
          <Box className="v4-eco-card-body">
            <Box className="v4-eco-user-bubble">
              <span className="v4-eco-bubble-prefix">User:</span>
              <span className="v4-eco-type-text">{card3TypedText}</span>
              <span className="v4-eco-type-cursor">|</span>
            </Box>
            <Box className={`v4-eco-thinking-wave ${card3Thinking ? 'is-active' : ''}`}>
              <span /><span /><span />
            </Box>
            <Box className={`v4-eco-ai-bubble ${card3AiVisible ? 'is-visible' : ''}`}>
              <span className="v4-eco-ai-icon">✨</span>
              <span className="v4-eco-ai-text">You have <strong style={{ color: '#7C3AED' }}>3 tasks</strong> awaiting completion.</span>
            </Box>
          </Box>
        </Box>

        {/* Card 4: 1-on-1 Check-in (Lower-Left) */}
        <Box
          className={`v4-eco-card v4-eco-card-4 ${card4Active ? (card4Exiting ? 'is-exiting' : 'is-active') : ''}`}
          id="v4EcoCard4"
          aria-hidden={!card4Active}
        >
          <Box className="v4-eco-card-header">
            <span className="v4-eco-pill v4-pill-blue">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>1-on-1 Check-in</span>
            </span>
            <span className="v4-eco-pill v4-pill-radar">
              <span className="v4-eco-radar-core" />
              <span className="v4-eco-radar-ring" />
              <span>Scheduled</span>
            </span>
          </Box>
          <Box className="v4-eco-card-body">
            <h4 className="v4-eco-card-title">Upcoming check-in</h4>
            <Box className="v4-eco-time-badge">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Today · 3:30 PM</span>
            </Box>
            <Box className="v4-eco-agenda-note">
              <span className="v4-eco-agenda-dot" />
              <span>Milestone review &amp; feedback</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface V6BrandStageProps {
  active?: boolean;
}

const V6BrandStage: React.FC<V6BrandStageProps> = ({ active = true }) => {
  // Node 1: Orientation
  const [node1Active, setNode1Active] = useState<boolean>(false);
  const [node1Exiting, setNode1Exiting] = useState<boolean>(false);
  const [node1Progress, setNode1Progress] = useState<string>('106.8');
  const [node1CheckVisible, setNode1CheckVisible] = useState<boolean>(false);

  // Node 2: Team Tour
  const [node2Active, setNode2Active] = useState<boolean>(false);
  const [node2Exiting, setNode2Exiting] = useState<boolean>(false);
  const [node2TriadPulsing, setNode2TriadPulsing] = useState<boolean>(false);

  // Node 3: Ask HyIQ
  const [node3Active, setNode3Active] = useState<boolean>(false);
  const [node3Exiting, setNode3Exiting] = useState<boolean>(false);
  const [node3SparklePulsing, setNode3SparklePulsing] = useState<boolean>(false);

  // Node 4: 1-on-1 Check-ins
  const [node4Active, setNode4Active] = useState<boolean>(false);
  const [node4Exiting, setNode4Exiting] = useState<boolean>(false);
  const [node4ResonancePulsing, setNode4ResonancePulsing] = useState<boolean>(false);

  // SVG Lines & Photons
  const [line1Active, setLine1Active] = useState<boolean>(false);
  const [line1Exiting, setLine1Exiting] = useState<boolean>(false);
  const [line2Active, setLine2Active] = useState<boolean>(false);
  const [line2Exiting, setLine2Exiting] = useState<boolean>(false);
  const [line3Active, setLine3Active] = useState<boolean>(false);
  const [line3Exiting, setLine3Exiting] = useState<boolean>(false);
  const [line4Active, setLine4Active] = useState<boolean>(false);
  const [line4Exiting, setLine4Exiting] = useState<boolean>(false);

  // Central Orb states
  const [orbBlooming, setOrbBlooming] = useState<boolean>(false);
  const [orbNucleusIlluminated, setOrbNucleusIlluminated] = useState<boolean>(false);
  const [orbTilt, setOrbTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOrbTilt({ x: -y * 12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setOrbTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setNode1Active(true);
      setNode1Progress('0');
      setNode1CheckVisible(true);
      setLine1Active(true);

      setNode2Active(true);
      setLine2Active(true);

      setNode3Active(true);
      setLine3Active(true);

      setNode4Active(true);
      setLine4Active(true);

      setOrbNucleusIlluminated(true);
      return;
    }

    let isMounted = true;
    let loopTimer: NodeJS.Timeout;
    const sceneTimers: (NodeJS.Timeout | number)[] = [];

    const clearTimers = () => {
      clearTimeout(loopTimer);
      sceneTimers.forEach((t) => clearTimeout(t as NodeJS.Timeout));
      sceneTimers.length = 0;
    };

    const resetState = () => {
      setNode1Active(false);
      setNode1Exiting(false);
      setNode1Progress('106.8');
      setNode1CheckVisible(false);
      setLine1Active(false);
      setLine1Exiting(false);

      setNode2Active(false);
      setNode2Exiting(false);
      setNode2TriadPulsing(false);
      setLine2Active(false);
      setLine2Exiting(false);

      setNode3Active(false);
      setNode3Exiting(false);
      setNode3SparklePulsing(false);
      setLine3Active(false);
      setLine3Exiting(false);

      setNode4Active(false);
      setNode4Exiting(false);
      setNode4ResonancePulsing(false);
      setLine4Active(false);
      setLine4Exiting(false);

      setOrbBlooming(false);
      setOrbNucleusIlluminated(false);
    };

    const runMasterLoop = () => {
      if (!isMounted) return;
      clearTimers();
      resetState();

      // Scene 2: Flow 1 — Orientation (3.0s - 6.5s)
      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine1Active(true);
          setNode1Active(true);
        }, 3000)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setNode1Progress('0');
        }, 3300)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setNode1CheckVisible(true);
        }, 4400)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine1Active(false);
          setLine1Exiting(true);
          setNode1Active(false);
          setNode1Exiting(true);
        }, 5900)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine1Exiting(false);
          setNode1Exiting(false);
          setNode1Progress('106.8');
          setNode1CheckVisible(false);
        }, 6500)
      );

      // Scene 3: Flow 2 — Department Tour (6.5s - 10.0s)
      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine2Active(true);
          setNode2Active(true);
        }, 6500)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setNode2TriadPulsing(true);
        }, 6800)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine2Active(false);
          setLine2Exiting(true);
          setNode2Active(false);
          setNode2Exiting(true);
        }, 9400)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine2Exiting(false);
          setNode2Exiting(false);
          setNode2TriadPulsing(false);
        }, 10000)
      );

      // Scene 4: Flow 3 — Ask HyIQ (10.0s - 13.5s)
      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine3Active(true);
          setNode3Active(true);
        }, 10000)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setNode3SparklePulsing(true);
        }, 10300)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setOrbNucleusIlluminated(true);
        }, 10800)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine3Active(false);
          setLine3Exiting(true);
          setNode3Active(false);
          setNode3Exiting(true);
          setOrbNucleusIlluminated(false);
        }, 12900)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine3Exiting(false);
          setNode3Exiting(false);
          setNode3SparklePulsing(false);
        }, 13500)
      );

      // Scene 5: Flow 4 — 1-on-1 Check-ins (13.5s - 17.0s)
      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine4Active(true);
          setNode4Active(true);
        }, 13500)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setNode4ResonancePulsing(true);
        }, 13800)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine4Active(false);
          setLine4Exiting(true);
          setNode4Active(false);
          setNode4Exiting(true);
        }, 16400)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine4Exiting(false);
          setNode4Exiting(false);
          setNode4ResonancePulsing(false);
        }, 17000)
      );

      // Scene 6: Convergence & Unified Ecosystem (17.0s - 21.0s)
      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine1Active(true);
          setLine2Active(true);
          setLine3Active(true);
          setLine4Active(true);

          setNode1Active(true);
          setNode1Progress('0');
          setNode1CheckVisible(true);

          setNode2Active(true);
          setNode2TriadPulsing(true);

          setNode3Active(true);
          setNode3SparklePulsing(true);

          setNode4Active(true);
          setNode4ResonancePulsing(true);

          setOrbBlooming(true);
          setOrbNucleusIlluminated(true);
        }, 17000)
      );

      sceneTimers.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLine1Active(false); setLine1Exiting(true);
          setLine2Active(false); setLine2Exiting(true);
          setLine3Active(false); setLine3Exiting(true);
          setLine4Active(false); setLine4Exiting(true);

          setNode1Active(false); setNode1Exiting(true);
          setNode2Active(false); setNode2Exiting(true);
          setNode3Active(false); setNode3Exiting(true);
          setNode4Active(false); setNode4Exiting(true);

          setOrbBlooming(false);
          setOrbNucleusIlluminated(false);
        }, 20300)
      );

      // Loop restart at 21.0s
      loopTimer = setTimeout(() => {
        if (isMounted) runMasterLoop();
      }, 21000);
    };

    runMasterLoop();

    return () => {
      isMounted = false;
      clearTimers();
    };
  }, [active]);

  return (
    <Box
      id="v6BrandStage"
      className="v6-brand-stage"
      role="region"
      aria-label="The Living Hirerkey Form"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG Canvas with Connecting Paths & Travelling Photons */}
      <svg className="v6-brand-svg-canvas" viewBox="0 0 540 380" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="v6Grad1React" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="v6Grad2React" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="v6Grad3React" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="v6Grad4React" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
          </linearGradient>
          <filter id="v6GlowReact" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Guide Lines */}
        <path className="v6-guide-line" d="M 95 80 C 160 85, 205 130, 235 160" />
        <path className="v6-guide-line" d="M 95 300 C 160 295, 205 250, 235 220" />
        <path className="v6-guide-line" d="M 445 80 C 380 85, 335 130, 305 160" />
        <path className="v6-guide-line" d="M 445 300 C 380 295, 335 250, 305 220" />

        {/* Dynamic Lines */}
        <path
          className={`v6-brand-line ${line1Active ? 'is-active' : ''} ${line1Exiting ? 'is-exiting' : ''}`}
          stroke="url(#v6Grad1React)"
          d="M 95 80 C 160 85, 205 130, 235 160"
          filter="url(#v6GlowReact)"
        />
        <path
          className={`v6-brand-line ${line2Active ? 'is-active' : ''} ${line2Exiting ? 'is-exiting' : ''}`}
          stroke="url(#v6Grad2React)"
          d="M 95 300 C 160 295, 205 250, 235 220"
          filter="url(#v6GlowReact)"
        />
        <path
          className={`v6-brand-line ${line3Active ? 'is-active' : ''} ${line3Exiting ? 'is-exiting' : ''}`}
          stroke="url(#v6Grad3React)"
          d="M 445 80 C 380 85, 335 130, 305 160"
          filter="url(#v6GlowReact)"
        />
        <path
          className={`v6-brand-line ${line4Active ? 'is-active' : ''} ${line4Exiting ? 'is-exiting' : ''}`}
          stroke="url(#v6Grad4React)"
          d="M 445 300 C 380 295, 335 250, 305 220"
          filter="url(#v6GlowReact)"
        />

        {/* Photons */}
        <circle
          className={`v6-photon ${line1Active ? 'is-active' : ''} ${line1Exiting ? 'is-exiting' : ''}`}
          r="3.5"
          fill="#10B981"
          filter="url(#v6GlowReact)"
        >
          <animateMotion dur="1.7s" repeatCount="indefinite" path="M 95 80 C 160 85, 205 130, 235 160" />
        </circle>
        <circle
          className={`v6-photon ${line2Active ? 'is-active' : ''} ${line2Exiting ? 'is-exiting' : ''}`}
          r="3.5"
          fill="#6366F1"
          filter="url(#v6GlowReact)"
        >
          <animateMotion dur="1.7s" repeatCount="indefinite" path="M 95 300 C 160 295, 205 250, 235 220" />
        </circle>
        <circle
          className={`v6-photon ${line3Active ? 'is-active' : ''} ${line3Exiting ? 'is-exiting' : ''}`}
          r="3.5"
          fill="#EC4899"
          filter="url(#v6GlowReact)"
        >
          <animateMotion dur="1.7s" repeatCount="indefinite" path="M 445 80 C 380 85, 335 130, 305 160" />
        </circle>
        <circle
          className={`v6-photon ${line4Active ? 'is-active' : ''} ${line4Exiting ? 'is-exiting' : ''}`}
          r="3.5"
          fill="#06B6D4"
          filter="url(#v6GlowReact)"
        >
          <animateMotion dur="1.7s" repeatCount="indefinite" path="M 445 300 C 380 295, 335 250, 305 220" />
        </circle>
      </svg>

      {/* Central Living Form (Hirerkey Orb) */}
      <Box
        id="v6BrandOrb"
        className={`v6-brand-orb-container ${orbBlooming ? 'is-blooming' : ''}`}
        sx={{
          transform: `translate(-50%, -50%) perspective(800px) rotateX(${orbTilt.x}deg) rotateY(${orbTilt.y}deg) translateZ(8px)`,
        }}
      >
        <Box className="v6-orb-halo" id="v6OrbHalo" />
        <Box className="v6-orb-core" id="v6OrbCore">
          <Box className="v6-orb-sheen" />
        </Box>
        <Box
          className={`v6-orb-nucleus ${orbNucleusIlluminated ? 'is-illuminated' : ''}`}
          id="v6OrbNucleus"
        >
          <span className="v6-emblem-h">H</span>
        </Box>
      </Box>

      {/* 4 Satellite Jewel Nodes */}
      {/* Node 1: Orientation */}
      <Box
        className={`v6-node v6-node-1 ${node1Active ? 'is-active' : ''} ${node1Exiting ? 'is-exiting' : ''}`}
        id="v6Node1"
        style={{ left: 95, top: 80 }}
      >
        <Box className="v6-node-jewel">
          <svg className="v6-ring-svg" viewBox="0 0 44 44" aria-hidden="true">
            <circle className="v6-ring-bg" cx="22" cy="22" r="17" />
            <circle
              className="v6-ring-progress"
              id="v6RingProgress1"
              cx="22"
              cy="22"
              r="17"
              style={{ strokeDashoffset: node1Progress }}
            />
          </svg>
          <svg
            className={`v6-check-icon ${node1CheckVisible ? 'is-visible' : ''}`}
            id="v6CheckBadge1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </Box>
        <span className="v6-node-label">Orientation</span>
      </Box>

      {/* Node 2: Team Tour */}
      <Box
        className={`v6-node v6-node-2 ${node2Active ? 'is-active' : ''} ${node2Exiting ? 'is-exiting' : ''}`}
        id="v6Node2"
        style={{ left: 95, top: 300 }}
      >
        <Box className="v6-node-jewel">
          <svg
            className={`v6-triad-svg ${node2TriadPulsing ? 'is-pulsing' : ''}`}
            id="v6Triad"
            viewBox="0 0 30 30"
            aria-hidden="true"
          >
            <line x1="15" y1="7" x2="8" y2="21" className="v6-triad-line" />
            <line x1="15" y1="7" x2="22" y2="21" className="v6-triad-line" />
            <line x1="8" y1="21" x2="22" y2="21" className="v6-triad-line" />
            <circle cx="15" cy="7" r="3.6" className="v6-triad-dot v6-triad-dot-1" fill="#6366F1" />
            <circle cx="8" cy="21" r="3.6" className="v6-triad-dot v6-triad-dot-2" fill="#6366F1" />
            <circle cx="22" cy="21" r="3.6" className="v6-triad-dot v6-triad-dot-3" fill="#6366F1" />
          </svg>
        </Box>
        <span className="v6-node-label">Team Tour</span>
      </Box>

      {/* Node 3: Ask HyIQ */}
      <Box
        className={`v6-node v6-node-3 ${node3Active ? 'is-active' : ''} ${node3Exiting ? 'is-exiting' : ''}`}
        id="v6Node3"
        style={{ left: 445, top: 80 }}
      >
        <Box className="v6-node-jewel">
          <svg
            className={`v6-sparkle-svg ${node3SparklePulsing ? 'is-pulsing' : ''}`}
            id="v6Sparkle"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#EC4899" />
          </svg>
        </Box>
        <span className="v6-node-label">Ask HyIQ™</span>
      </Box>

      {/* Node 4: 1-on-1 Check-ins */}
      <Box
        className={`v6-node v6-node-4 ${node4Active ? 'is-active' : ''} ${node4Exiting ? 'is-exiting' : ''}`}
        id="v6Node4"
        style={{ left: 445, top: 300 }}
      >
        <Box className="v6-node-jewel">
          <svg
            className={`v6-resonance-svg ${node4ResonancePulsing ? 'is-pulsing' : ''}`}
            id="v6Resonance"
            viewBox="0 0 28 28"
            aria-hidden="true"
          >
            <circle className="v6-res-circle v6-res-1" cx="11" cy="14" r="7" fill="none" stroke="#06B6D4" strokeWidth="2" />
            <circle className="v6-res-circle v6-res-2" cx="17" cy="14" r="7" fill="none" stroke="#06B6D4" strokeWidth="2" />
          </svg>
        </Box>
        <span className="v6-node-label">1-on-1 Check-ins</span>
      </Box>
    </Box>
  );
};

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccessLogin,
  className,
  defaultView,
}) => {
  // Active page state (1: The Connected HR Ecosystem, 2: How Hirerkey Works, 3: How Hirerkey Works Replica, 4: The Connected HR Ecosystem V4, 5: How Hirerkey Works Copy, 6: The Living Hirerkey Form)
  const [activePage, setActivePage] = useState<1 | 2 | 3 | 4 | 5 | 6>((defaultView === 6 ? 6 : defaultView === 5 ? 5 : defaultView === 4 ? 4 : defaultView === 3 ? 3 : defaultView === 2 ? 2 : 1) as 1 | 2 | 3 | 4 | 5 | 6);

  // View 4 form states (ApprovalMax Inspired Workflow Animation & Modern Split)
  const [v4AuthMode, setV4AuthMode] = useState<'otp' | 'password'>('otp');
  const [v4OtpStep, setV4OtpStep] = useState<'input' | 'verify'>('input');
  const [v4OtpDigits, setV4OtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [v4OtpSecondsLeft, setV4OtpSecondsLeft] = useState(29);
  const [v4Email, setV4Email] = useState('alex.chen@earthhotels.com');
  const [v4Password, setV4Password] = useState('EarthHotels2026!#');
  const [v4ShowPassword, setV4ShowPassword] = useState(false);
  const [v4RememberMe, setV4RememberMe] = useState(true);
  const [v4Tilt, setV4Tilt] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const handleV4MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setV4Tilt({ x: -y * 12, y: x * 12 });
  };

  const handleV4MouseLeave = () => {
    setV4Tilt({ x: 0, y: 0 });
  };

  // View 4 OTP countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (v4OtpStep === 'verify' && v4OtpSecondsLeft > 0) {
      timer = setInterval(() => {
        setV4OtpSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [v4OtpStep, v4OtpSecondsLeft]);

  // Keyboard Shortcuts: [1]–[6], [ArrowLeft], [ArrowRight]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) {
        return;
      }
      if (e.key === '1') {
        setActivePage(1);
      } else if (e.key === '2') {
        setActivePage(2);
      } else if (e.key === '3') {
        setActivePage(3);
      } else if (e.key === '4') {
        setActivePage(4);
      } else if (e.key === '5') {
        setActivePage(5);
      } else if (e.key === '6') {
        setActivePage(6);
      } else if (e.key === 'ArrowLeft') {
        setActivePage((prev) => (prev === 1 ? 6 : ((prev - 1) as 1 | 2 | 3 | 4 | 5 | 6)));
      } else if (e.key === 'ArrowRight') {
        setActivePage((prev) => (prev === 6 ? 1 : ((prev + 1) as 1 | 2 | 3 | 4 | 5 | 6)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // View 4 Form Handlers
  const handleV4SendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v4Email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setV4OtpStep('verify');
      setV4OtpSecondsLeft(29);
      setV4OtpDigits(['', '', '', '', '', '']);
    }, 450);
  };

  const handleV4VerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const code = v4OtpDigits.join('');
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v4Email, 'otp');
    }, 600);
  };

  const handleV4PasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v4Email || !v4Password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin?.(v4Email, 'password');
    }, 600);
  };

  const handleV4OtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const nextDigits = [...v4OtpDigits];
    nextDigits[index] = clean ? clean[clean.length - 1] : '';
    setV4OtpDigits(nextDigits);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`v4-otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleV4OtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !v4OtpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`v4-otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendV4Code = () => {
    setV4OtpSecondsLeft(29);
    setV4OtpDigits(['', '', '', '', '', '']);
  };

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 }, pb: { xs: 8, sm: 10 },
        backgroundColor: '#F6F1FF',
        backgroundImage:
          "url('v4_bg_gradient.png'), radial-gradient(ellipse 65% 55% at 90% 10%, rgba(168, 85, 247, 0.55) 0%, rgba(192, 132, 252, 0.25) 45%, transparent 75%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(147, 51, 234, 0.5) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 75%), linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 35%, #F3E8FF 70%, #EDE9FE 100%)",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: '#0F172A',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      <motion.div
            key="view-4"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: '1220px', display: 'flex', justifyContent: 'center' }}
          >
            <style>{`
              @keyframes v4DotPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.4); opacity: 0.5; }
              }

              /* 1. CENTRAL MINI DASHBOARD */
              @keyframes v4DashMaster {
                0% {
                  opacity: 0.92;
                  transform: scale(0.97) translateY(2px);
                  box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24);
                }
                10% {
                  opacity: 1;
                  transform: scale(1.008) translateY(-3px);
                  box-shadow: 0 24px 50px -10px rgba(124, 58, 237, 0.36);
                }
                15% {
                  opacity: 1;
                  transform: scale(1.0) translateY(0px);
                  box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.30);
                }
                35% {
                  transform: scale(1.0) translateY(-2px);
                }
                50% {
                  transform: scale(1.0) translateY(1px);
                }
                60% {
                  transform: scale(1.0) translateY(0px);
                  box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.32);
                }
                70% {
                  transform: scale(1.025) translateY(-3px);
                  box-shadow: 
                    0 30px 70px -10px rgba(124, 58, 237, 0.46),
                    0 0 35px 4px rgba(124, 58, 237, 0.26),
                    0 0 0 1px rgba(255, 255, 255, 0.9);
                }
                80% {
                  transform: scale(1.0) translateY(0px);
                  box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.32);
                }
                94% {
                  opacity: 1;
                  transform: scale(0.985) translateY(1px);
                  box-shadow: 0 18px 40px -8px rgba(124, 58, 237, 0.26);
                }
                100% {
                  opacity: 0.92;
                  transform: scale(0.97) translateY(2px);
                  box-shadow: 0 16px 36px -8px rgba(124, 58, 237, 0.24);
                }
              }

              /* 2. CARD 1: ORIENTATION (Top-Left) */
              @keyframes v4Card1Motion {
                0%, 14% {
                  opacity: 0;
                  transform: translate(-14px, -8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                20% {
                  opacity: 1;
                  transform: translate(1px, 1px) scale(1.02);
                  border-color: #7C3AED;
                  box-shadow: 0 14px 32px -6px rgba(124, 58, 237, 0.32);
                }
                24% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(124, 58, 237, 0.6);
                }
                50% {
                  transform: translate(0, -2px) scale(1.0);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(-1px, -3px) scale(1.03);
                  border-color: #7C3AED;
                  box-shadow: 0 16px 36px -6px rgba(124, 58, 237, 0.38);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(124, 58, 237, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(-14px, -8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(-14px, -8px) scale(0.96);
                }
              }

              /* 3. CARD 2: DEPARTMENT TOUR (Bottom-Left) */
              @keyframes v4Card2Motion {
                0%, 24% {
                  opacity: 0;
                  transform: translate(-14px, 8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                30% {
                  opacity: 1;
                  transform: translate(1px, -1px) scale(1.02);
                  border-color: #3B82F6;
                  box-shadow: 0 14px 32px -6px rgba(59, 130, 246, 0.32);
                }
                34% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(59, 130, 246, 0.6);
                }
                55% {
                  transform: translate(0, 2px) scale(1.0);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(-1px, 3px) scale(1.03);
                  border-color: #3B82F6;
                  box-shadow: 0 16px 36px -6px rgba(59, 130, 246, 0.38);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(59, 130, 246, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(-14px, 8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(-14px, 8px) scale(0.96);
                }
              }

              /* 4. CARD 3: ASK HyIQ™ AI (Top-Right) */
              @keyframes v4Card3Motion {
                0%, 34% {
                  opacity: 0;
                  transform: translate(14px, -8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                40% {
                  opacity: 1;
                  transform: translate(-1px, 1px) scale(1.02);
                  border-color: #EC4899;
                  box-shadow: 0 14px 32px -6px rgba(236, 72, 153, 0.35);
                }
                44% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(236, 72, 153, 0.6);
                }
                55% {
                  transform: translate(0, -2px) scale(1.0);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(1px, -3px) scale(1.03);
                  border-color: #EC4899;
                  box-shadow: 0 16px 36px -6px rgba(236, 72, 153, 0.40);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(236, 72, 153, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(14px, -8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(14px, -8px) scale(0.96);
                }
              }

              /* 5. CARD 4: 1-ON-1 CHECK-INS (Bottom-Right) */
              @keyframes v4Card4Motion {
                0%, 47% {
                  opacity: 0;
                  transform: translate(14px, 8px) scale(0.96);
                  border-color: #E2E8F0;
                  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
                }
                53% {
                  opacity: 1;
                  transform: translate(-1px, -1px) scale(1.02);
                  border-color: #10B981;
                  box-shadow: 0 14px 32px -6px rgba(16, 185, 129, 0.35);
                }
                57% {
                  opacity: 1;
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(16, 185, 129, 0.6);
                }
                60% {
                  transform: translate(0, 0) scale(1.0);
                }
                70% {
                  transform: translate(1px, 3px) scale(1.03);
                  border-color: #10B981;
                  box-shadow: 0 16px 36px -6px rgba(16, 185, 129, 0.40);
                }
                80% {
                  transform: translate(0, 0) scale(1.0);
                  border-color: rgba(16, 185, 129, 0.5);
                }
                88% {
                  opacity: 0.8;
                  border-color: #E2E8F0;
                }
                94% {
                  opacity: 0;
                  transform: translate(14px, 8px) scale(0.96);
                }
                100% {
                  opacity: 0;
                  transform: translate(14px, 8px) scale(0.96);
                }
              }

              /* 6. CONNECTOR PATHS */
              @keyframes v4Path1Draw {
                0%, 14% { stroke-dashoffset: 144; opacity: 0; }
                16% { opacity: 0.9; }
                24% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path2Draw {
                0%, 24% { stroke-dashoffset: 144; opacity: 0; }
                26% { opacity: 0.9; }
                34% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path3Draw {
                0%, 34% { stroke-dashoffset: 144; opacity: 0; }
                36% { opacity: 0.9; }
                45% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              @keyframes v4Path4Draw {
                0%, 47% { stroke-dashoffset: 144; opacity: 0; }
                49% { opacity: 0.9; }
                57% { stroke-dashoffset: 0; opacity: 0.85; }
                60% { opacity: 0.85; stroke-width: 2.2px; }
                70% { opacity: 1.0; stroke-width: 2.8px; }
                80% { opacity: 0.85; stroke-width: 2.2px; stroke-dashoffset: 0; }
                90% { opacity: 0.15; stroke-dashoffset: 0; }
                95%, 100% { opacity: 0; stroke-dashoffset: 144; }
              }

              /* 7. LUMINESCENT PARTICLES */
              @keyframes v4Particle1Motion {
                0%, 18% { offset-distance: 0%; opacity: 0; }
                19% { opacity: 1; }
                25% { offset-distance: 100%; opacity: 0; }
                61% { offset-distance: 0%; opacity: 0; }
                62% { opacity: 1; }
                68% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle2Motion {
                0%, 28% { offset-distance: 0%; opacity: 0; }
                29% { opacity: 1; }
                35% { offset-distance: 100%; opacity: 0; }
                64% { offset-distance: 0%; opacity: 0; }
                65% { opacity: 1; }
                71% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle3Motion {
                0%, 38% { offset-distance: 0%; opacity: 0; }
                39% { opacity: 1; }
                46% { offset-distance: 100%; opacity: 0; }
                67% { offset-distance: 0%; opacity: 0; }
                68% { opacity: 1; }
                74% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              @keyframes v4Particle4Motion {
                0%, 51% { offset-distance: 0%; opacity: 0; }
                52% { opacity: 1; }
                59% { offset-distance: 100%; opacity: 0; }
                70% { offset-distance: 0%; opacity: 0; }
                71% { opacity: 1; }
                77% { offset-distance: 100%; opacity: 0; }
                100% { offset-distance: 100%; opacity: 0; }
              }

              /* 8. MINI DASHBOARD AI INSIGHT TOAST */
              @keyframes v4AiToastFlow {
                0%, 37% { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.92); pointer-events: none; }
                42% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1.0); }
                78% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1.0); }
                85% { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.95); }
                100% { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.92); }
              }

              /* 9. GOAL PROGRESS BAR */
              @keyframes v4GoalProgressFlow {
                0%, 48% { width: 0%; opacity: 0; }
                50% { opacity: 1; }
                58% { width: 85%; }
                80% { width: 85%; opacity: 1; }
                88% { opacity: 0.4; }
                94%, 100% { width: 0%; opacity: 0; }
              }

              /* 10. SPARKLE ICON ROTATION */
              @keyframes v4SparkleShimmer {
                0%, 36% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                41% { transform: scale(1.22) rotate(14deg); filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.7)); }
                46% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                70% { transform: scale(1.15) rotate(8deg); filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.5)); }
                76% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(236, 72, 153, 0)); }
                100% { transform: scale(1) rotate(0deg); }
              }

              /* Component CSS Styles */
              .v4-track-base {
                fill: none;
                stroke: rgba(148, 163, 184, 0.22);
                stroke-width: 1.5;
                stroke-dasharray: 4 4;
              }

              .v4-path-active {
                fill: none;
                stroke-width: 2.2;
                stroke-linecap: round;
                stroke-dasharray: 144;
                stroke-dashoffset: 144;
                will-change: stroke-dashoffset, opacity;
              }

              .v4-path-1 { animation: v4Path1Draw 10s linear infinite; }
              .v4-path-2 { animation: v4Path2Draw 10s linear infinite; }
              .v4-path-3 { animation: v4Path3Draw 10s linear infinite; }
              .v4-path-4 { animation: v4Path4Draw 10s linear infinite; }

              .v4-particle {
                position: absolute;
                top: 0;
                left: 0;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
                opacity: 0;
                will-change: transform, opacity, offset-distance;
              }

              .v4-particle-1 {
                background: #A855F7;
                box-shadow: 0 0 10px 2px #A855F7, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
                offset-path: path("M 160 75 C 210 75, 230 145, 270 160");
                animation: v4Particle1Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-2 {
                background: #3B82F6;
                box-shadow: 0 0 10px 2px #3B82F6, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
                offset-path: path("M 160 275 C 210 275, 230 205, 270 190");
                animation: v4Particle2Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-3 {
                background: #EC4899;
                box-shadow: 0 0 10px 2px #EC4899, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
                offset-path: path("M 380 75 C 330 75, 310 145, 270 160");
                animation: v4Particle3Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-particle-4 {
                background: #10B981;
                box-shadow: 0 0 10px 2px #10B981, 0 0 4px #FFFFFF;
                -webkit-offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
                offset-path: path("M 380 275 C 330 275, 310 205, 270 190");
                animation: v4Particle4Motion 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              }

              .v4-sparkle-box {
                animation: v4SparkleShimmer 10s ease-in-out infinite;
              }

              .v4-pulse-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #10B981;
                box-shadow: 0 0 6px #10B981;
                animation: v4DotPulse 1.8s infinite;
                display: inline-block;
              }

              .v4-ai-pulse {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #EC4899;
                box-shadow: 0 0 6px #EC4899;
                animation: v4DotPulse 1.8s infinite;
                display: inline-block;
              }

              .v4-mini-dash-toast {
                position: absolute;
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%) translateY(12px) scale(0.92);
                background: rgba(15, 23, 42, 0.92);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border: 1px solid rgba(168, 85, 247, 0.45);
                border-radius: 9999px;
                padding: 3px 9px;
                display: flex;
                align-items: center;
                gap: 5px;
                color: #FFFFFF;
                font-size: 8px;
                font-weight: 600;
                white-space: nowrap;
                z-index: 8;
                opacity: 0;
                animation: v4AiToastFlow 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
              }

              .v4-toast-icon {
                font-size: 8px;
                color: #F472B6;
              }

              .v4-toast-text {
                font-size: 8px;
                color: #FFFFFF;
              }

              .v4-progress-status {
                display: flex;
                align-items: center;
                gap: 5px;
              }

              .v4-progress-label {
                font-size: 10px;
                color: #64748B;
              }

              .v4-progress-track {
                width: 44px;
                height: 4px;
                border-radius: 9999px;
                background: #E2E8F0;
                overflow: hidden;
                position: relative;
              }

              .v4-progress-fill {
                height: 100%;
                width: 0%;
                border-radius: 9999px;
                background: linear-gradient(90deg, #10B981, #059669);
                animation: v4GoalProgressFlow 10s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }

              .v4-progress-val {
                font-size: 9.5px;
                font-weight: 700;
                color: #059669;
              }

              @media (prefers-reduced-motion: reduce) {
                .v4-mini-dashboard,
                .v4-flow-card,
                .v4-path-active,
                .v4-sparkle-box,
                .v4-mini-dash-toast,
                .v4-progress-fill,
                .v4-pulse-dot,
                .v4-ai-pulse {
                  animation: none !important;
                  transition: none !important;
                }

                .v4-path-active {
                  stroke-dashoffset: 0 !important;
                  opacity: 0.8 !important;
                }

                .v4-particle {
                  display: none !important;
                }

                .v4-mini-dash-toast {
                  opacity: 1 !important;
                  transform: translateX(-50%) translateY(0) !important;
                }

                .v4-progress-fill {
                  width: 85% !important;
                  opacity: 1 !important;
                }
              }


                /* ==========================================================================
                   VIEW 3: MINIMAL HERO ANIMATION (ONE DASHBOARD + 1 CARD AT A TIME)
                   ========================================================================== */
                .v3-minimal-stage {
                  width: 100%;
                  max-width: 540px;
                  height: 380px;
                  position: relative;
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  user-select: none;
                  -webkit-user-select: none;
                }

                .v3-dashboard {
                  position: absolute;
                  top: 14px;
                  left: 20px;
                  width: 340px;
                  background: #FFFFFF;
                  border-radius: 14px;
                  border: 1px solid rgba(226, 232, 240, 0.95);
                  box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.12), 0 4px 16px -2px rgba(15, 23, 42, 0.05);
                  overflow: hidden;
                  z-index: 2;
                  animation: v3DashboardFloat 6s ease-in-out infinite alternate;
                  will-change: transform;
                }

                @keyframes v3DashboardFloat {
                  0% { transform: translateY(0px) rotate(0deg); }
                  100% { transform: translateY(-8px) rotate(0.35deg); }
                }

                .v3-chrome {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 7px 12px;
                  background: #F8FAFC;
                  border-bottom: 1px solid #E2E8F0;
                  gap: 10px;
                }

                .v3-chrome-dots {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  flex-shrink: 0;
                }

                .v3-dot {
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  display: inline-block;
                }

                .v3-dot-red { background: #EF4444; }
                .v3-dot-yellow { background: #F59E0B; }
                .v3-dot-green { background: #10B981; }

                .v3-chrome-url {
                  display: inline-flex;
                  align-items: center;
                  gap: 5px;
                  background: #FFFFFF;
                  border: 1px solid #E2E8F0;
                  border-radius: 6px;
                  padding: 3px 8px;
                  font-size: 10.5px;
                  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                  color: #64748B;
                  flex: 1;
                  max-width: 200px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                .v3-chrome-url svg {
                  color: #94A3B8;
                  flex-shrink: 0;
                }

                .v3-chrome-sync {
                  display: inline-flex;
                  align-items: center;
                  gap: 5px;
                  font-size: 10px;
                  font-weight: 700;
                  color: #059669;
                  background: rgba(16, 185, 129, 0.1);
                  border: 1px solid rgba(16, 185, 129, 0.2);
                  padding: 2px 7px;
                  border-radius: 999px;
                  flex-shrink: 0;
                }

                .v3-sync-dot {
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background: #10B981;
                  box-shadow: 0 0 6px #10B981;
                  animation: v3LiveDotPulse 2s ease-in-out infinite;
                }

                @keyframes v3LiveDotPulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.4; transform: scale(0.85); }
                }

                .v3-dashboard-canvas {
                  width: 100%;
                  background: #F1F5F9;
                  line-height: 0;
                }

                .v3-dashboard-img {
                  width: 100%;
                  height: auto;
                  display: block;
                  object-fit: cover;
                }

                .v3-card-deck {
                  position: absolute;
                  inset: 0;
                  pointer-events: none;
                  z-index: 5;
                }

                .v3-feature-card {
                  position: absolute;
                  right: 16px;
                  bottom: 16px;
                  width: 280px;
                  background: #FFFFFF;
                  border-radius: 16px;
                  border: 1px solid rgba(226, 232, 240, 0.95);
                  box-shadow: 0 20px 40px -10px rgba(124, 58, 237, 0.18), 0 8px 20px -4px rgba(15, 23, 42, 0.08);
                  padding: 14px 16px;
                  opacity: 0;
                  visibility: hidden;
                  transform: translateY(18px) scale(0.96);
                  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                              visibility 0.5s;
                  pointer-events: none;
                  will-change: transform, opacity;
                }

                .v3-feature-card.is-active {
                  opacity: 1;
                  visibility: visible;
                  transform: translateY(0) scale(1);
                  pointer-events: auto;
                }

                .v3-feature-card.is-exiting {
                  opacity: 0;
                  visibility: hidden;
                  transform: translateY(-14px) scale(0.98);
                  transition: opacity 0.35s cubic-bezier(0.4, 0, 1, 1),
                              transform 0.35s cubic-bezier(0.4, 0, 1, 1),
                              visibility 0.35s;
                }

                .v3-card-header {
                  margin-bottom: 10px;
                }

                .v3-card-tag-wrap {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 8px;
                }

                .v3-card-icon-pill {
                  display: inline-flex;
                  align-items: center;
                  gap: 5px;
                  font-size: 11px;
                  font-weight: 700;
                  padding: 3px 8px;
                  border-radius: 999px;
                }

                .v3-pill-purple {
                  background: #F3EEFF;
                  color: #7C3AED;
                  border: 1px solid #E9D5FF;
                }

                .v3-pill-indigo {
                  background: #EEF2FF;
                  color: #4F46E5;
                  border: 1px solid #C7D2FE;
                }

                .v3-pill-ai {
                  background: linear-gradient(135deg, #F3EEFF 0%, #EEF2FF 100%);
                  color: #7C3AED;
                  border: 1px solid #DDD6FE;
                }

                .v3-pill-blue {
                  background: #EFF6FF;
                  color: #2563EB;
                  border: 1px solid #BFDBFE;
                }

                .v3-status-pill {
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 10px;
                  font-weight: 700;
                  padding: 2.5px 7px;
                  border-radius: 999px;
                }

                .v3-status-success {
                  background: #ECFDF5;
                  color: #059669;
                  border: 1px solid #A7F3D0;
                }

                .v3-status-completed {
                  background: #ECFDF5;
                  color: #059669;
                  border: 1px solid #A7F3D0;
                  transform: scale(0.9);
                  opacity: 0.6;
                  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .v3-status-completed.is-visible {
                  transform: scale(1);
                  opacity: 1;
                }

                .v3-status-ai {
                  background: #FAF5FF;
                  color: #9333EA;
                  border: 1px solid #E9D5FF;
                }

                .v3-ai-sparkle {
                  font-size: 11px;
                  animation: v3SparkleSpin 3s ease-in-out infinite;
                }

                @keyframes v3SparkleSpin {
                  0%, 100% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.25) rotate(15deg); }
                }

                .v3-status-scheduled {
                  background: #EFF6FF;
                  color: #2563EB;
                  border: 1px solid #BFDBFE;
                }

                .v3-radar-ring {
                  position: relative;
                  width: 8px;
                  height: 8px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                }

                .v3-radar-core {
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background: #2563EB;
                }

                .v3-radar-pulse {
                  position: absolute;
                  inset: -3px;
                  border-radius: 50%;
                  background: rgba(37, 99, 235, 0.35);
                  animation: v3RadarPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                @keyframes v3RadarPing {
                  0% { transform: scale(0.8); opacity: 0.9; }
                  100% { transform: scale(2.2); opacity: 0; }
                }

                .v3-card-body {
                  display: flex;
                  flex-direction: column;
                  gap: 6px;
                }

                .v3-card-title {
                  font-size: 14.5px;
                  font-weight: 700;
                  color: #0F172A;
                  margin: 0;
                  letter-spacing: -0.01em;
                }

                .v3-card-desc {
                  font-size: 12px;
                  color: #64748B;
                  margin: 0;
                  line-height: 1.4;
                }

                .v3-card-accent {
                  color: #7C3AED;
                  font-weight: 700;
                }

                .v3-progress-container {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  margin-top: 4px;
                }

                .v3-progress-track {
                  flex: 1;
                  height: 7px;
                  background: #F1F5F9;
                  border-radius: 999px;
                  overflow: hidden;
                  position: relative;
                }

                .v3-progress-bar {
                  height: 100%;
                  background: linear-gradient(90deg, #7C3AED 0%, #10B981 100%);
                  border-radius: 999px;
                  width: 0%;
                  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v3-check-badge {
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: #10B981;
                  color: #FFFFFF;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transform: scale(0);
                  opacity: 0;
                  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
                  flex-shrink: 0;
                  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.35);
                }

                .v3-check-badge.is-visible {
                  transform: scale(1);
                  opacity: 1;
                }

                .v3-avatar-deck {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  margin-top: 4px;
                }

                .v3-avatar-group {
                  display: flex;
                  align-items: center;
                }

                .v3-avatar {
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #FFFFFF;
                  font-size: 11px;
                  font-weight: 700;
                  border: 2px solid #FFFFFF;
                  margin-left: -7px;
                  transform: scale(0);
                  opacity: 0;
                  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
                  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
                }

                .v3-avatar:first-child {
                  margin-left: 0;
                }

                .v3-avatar.is-visible {
                  transform: scale(1);
                  opacity: 1;
                }

                .v3-av-1 { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); }
                .v3-av-2 { background: linear-gradient(135deg, #2563EB 0%, #38BDF8 100%); }
                .v3-av-3 { background: linear-gradient(135deg, #059669 0%, #34D399 100%); }

                .v3-avatar-summary {
                  font-size: 11.5px;
                  font-weight: 600;
                  color: #64748B;
                }

                .v3-chat-user-bubble {
                  background: #F8FAFC;
                  border: 1px solid #E2E8F0;
                  border-radius: 8px;
                  padding: 5px 8px;
                  font-size: 11.5px;
                  color: #1E293B;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  min-height: 28px;
                }

                .v3-bubble-prefix {
                  font-weight: 700;
                  color: #64748B;
                  font-size: 10.5px;
                }

                .v3-typewriter-text {
                  color: #0F172A;
                  font-weight: 500;
                }

                .v3-typewriter-cursor {
                  color: #7C3AED;
                  font-weight: 700;
                  animation: v3BlinkCursor 0.8s infinite;
                }

                @keyframes v3BlinkCursor {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }

                .v3-thinking-wave {
                  display: none;
                  align-items: center;
                  gap: 4px;
                  padding: 2px 6px;
                }

                .v3-thinking-wave.is-active {
                  display: inline-flex;
                }

                .v3-thinking-wave span {
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  background: #7C3AED;
                  animation: v3WaveBounce 1s infinite ease-in-out;
                }

                .v3-thinking-wave span:nth-child(2) { animation-delay: 0.2s; }
                .v3-thinking-wave span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes v3WaveBounce {
                  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                  40% { transform: translateY(-4px); opacity: 1; }
                }

                .v3-chat-ai-bubble {
                  display: flex;
                  align-items: center;
                  gap: 7px;
                  background: #F3EEFF;
                  border: 1px solid #E9D5FF;
                  border-radius: 8px;
                  padding: 6px 9px;
                  font-size: 11.5px;
                  color: #3B0764;
                  line-height: 1.35;
                  opacity: 0;
                  transform: translateY(6px);
                  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v3-chat-ai-bubble.is-visible {
                  opacity: 1;
                  transform: translateY(0);
                }

                .v3-ai-avatar {
                  font-size: 12px;
                  flex-shrink: 0;
                }

                .v3-schedule-row {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  flex-wrap: wrap;
                  margin-top: 2px;
                }

                .v3-schedule-time {
                  display: inline-flex;
                  align-items: center;
                  gap: 5px;
                  background: #EFF6FF;
                  color: #1D4ED8;
                  font-size: 11.5px;
                  font-weight: 700;
                  padding: 3px 8px;
                  border-radius: 6px;
                  border: 1px solid #DBEAFE;
                }

                .v3-schedule-tag {
                  font-size: 11.5px;
                  color: #475569;
                  font-weight: 500;
                }

                .v3-schedule-footer {
                  margin-top: 2px;
                }

                .v3-agenda-bullet {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 11px;
                  color: #64748B;
                }

                .v3-bullet-dot {
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  background: #3B82F6;
                  flex-shrink: 0;
                }

                @media (max-width: 640px) {
                  .v3-minimal-stage {
                    height: 360px;
                  }
                  .v3-dashboard {
                    left: 12px;
                    top: 12px;
                    width: calc(100% - 24px);
                    max-width: 320px;
                  }
                  .v3-feature-card {
                    right: 12px;
                    bottom: 12px;
                    width: calc(100% - 24px);
                    max-width: 270px;
                  }
                }

                /* ==========================================================================
                   VIEW 4: THE CONNECTED HR ECOSYSTEM — DELICATE 4-QUADRANT SVG HERO
                   Central Dashboard Hub + 4 Dedicated Quadrant Cards + Travelling Particles
                   ========================================================================== */
                .v4-eco-stage {
                  width: 100%;
                  max-width: 540px;
                  height: 380px;
                  position: relative;
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  contain: layout style;
                  user-select: none;
                  -webkit-user-select: none;
                }

                /* Central Miniature Dashboard Hub (~280px wide, Centered) */
                .v4-eco-dashboard {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  width: 280px;
                  background: #FFFFFF;
                  border-radius: 14px;
                  border: 1px solid rgba(226, 232, 240, 0.95);
                  box-shadow: 0 16px 36px -10px rgba(15, 23, 42, 0.12), 0 4px 14px -2px rgba(15, 23, 42, 0.05);
                  overflow: hidden;
                  z-index: 2;
                  animation: v4EcoDashFloat 5s ease-in-out infinite;
                  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                              box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                              border-color 0.6s ease;
                  will-change: transform, box-shadow;
                }

                @keyframes v4EcoDashFloat {
                  0%, 100% {
                    transform: translate(-50%, -50%) translateY(0px);
                  }
                  50% {
                    transform: translate(-50%, -50%) translateY(-6px);
                  }
                }

                /* Climax Bloom Aura on Central Dashboard */
                .v4-eco-dashboard.is-blooming {
                  box-shadow: 0 0 45px rgba(124, 58, 237, 0.42), 0 20px 48px -10px rgba(124, 58, 237, 0.28);
                  border-color: rgba(168, 85, 247, 0.55);
                  transform: translate(-50%, -50%) scale(1.025);
                }

                /* Browser Chrome Bar */
                .v4-eco-chrome {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 6px 10px;
                  background: #F8FAFC;
                  border-bottom: 1px solid #E2E8F0;
                  gap: 8px;
                }

                .v4-eco-chrome-dots {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  flex-shrink: 0;
                }

                .v4-eco-dot {
                  width: 7px;
                  height: 7px;
                  border-radius: 50%;
                  display: inline-block;
                }

                .v4-eco-dot-red { background: #EF4444; }
                .v4-eco-dot-yellow { background: #F59E0B; }
                .v4-eco-dot-green { background: #10B981; }

                .v4-eco-chrome-url {
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  background: #FFFFFF;
                  border: 1px solid #E2E8F0;
                  border-radius: 5px;
                  padding: 2.5px 7px;
                  font-size: 10px;
                  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                  color: #64748B;
                  flex: 1;
                  max-width: 175px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                .v4-eco-chrome-url svg {
                  color: #94A3B8;
                  flex-shrink: 0;
                }

                .v4-eco-chrome-sync {
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 9.5px;
                  font-weight: 700;
                  color: #059669;
                  background: rgba(16, 185, 129, 0.1);
                  border: 1px solid rgba(16, 185, 129, 0.2);
                  padding: 1.5px 6px;
                  border-radius: 999px;
                  flex-shrink: 0;
                }

                .v4-eco-sync-dot {
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  background: #10B981;
                  box-shadow: 0 0 5px #10B981;
                  animation: v4EcoSyncPulse 2s ease-in-out infinite;
                }

                @keyframes v4EcoSyncPulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.4; transform: scale(0.85); }
                }

                .v4-eco-dash-canvas {
                  width: 100%;
                  background: #F1F5F9;
                  line-height: 0;
                  position: relative;
                }

                .v4-eco-dash-img {
                  width: 100%;
                  height: auto;
                  display: block;
                  object-fit: cover;
                }

                /* Live Overlays on Dashboard */
                .v4-eco-goal-metric {
                  position: absolute;
                  bottom: 8px;
                  right: 8px;
                  background: rgba(255, 255, 255, 0.94);
                  backdrop-filter: blur(8px);
                  -webkit-backdrop-filter: blur(8px);
                  border: 1px solid rgba(226, 232, 240, 0.9);
                  border-radius: 999px;
                  padding: 2.5px 8px;
                  font-size: 9.5px;
                  font-weight: 700;
                  color: #0F172A;
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.08);
                  z-index: 3;
                  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v4-eco-goal-metric.is-updated {
                  transform: scale(1.06);
                  border-color: #A7F3D0;
                  background: rgba(236, 253, 245, 0.96);
                }

                .v4-eco-ai-notice {
                  position: absolute;
                  top: 8px;
                  left: 8px;
                  right: 8px;
                  background: rgba(243, 238, 255, 0.96);
                  backdrop-filter: blur(8px);
                  -webkit-backdrop-filter: blur(8px);
                  border: 1px solid rgba(216, 180, 254, 0.85);
                  border-radius: 7px;
                  padding: 4px 8px;
                  font-size: 9.5px;
                  font-weight: 600;
                  color: #581C87;
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
                  opacity: 0;
                  transform: translateY(-8px);
                  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                  pointer-events: none;
                  z-index: 4;
                }

                .v4-eco-ai-notice.is-visible {
                  opacity: 1;
                  transform: translateY(0);
                }

                .v4-eco-ai-notice-sparkle {
                  font-size: 11px;
                  animation: v4EcoSparkle 2s ease-in-out infinite;
                }

                @keyframes v4EcoSparkle {
                  0%, 100% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.2) rotate(15deg); }
                }

                /* SVG Layer: Connecting Lines & Travelling Glowing Particles */
                .v4-eco-svg-canvas {
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  pointer-events: none;
                  z-index: 3;
                }

                .v4-eco-line {
                  fill: none;
                  stroke-width: 1.75px;
                  stroke-dasharray: 100;
                  stroke-dashoffset: 100;
                  opacity: 0;
                  transition: stroke-dashoffset 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                              opacity 0.4s ease;
                }

                .v4-eco-line.is-active {
                  stroke-dashoffset: 0;
                  opacity: 1;
                }

                .v4-eco-line.is-exiting {
                  opacity: 0;
                  transition: opacity 0.35s ease;
                }

                .v4-eco-particle {
                  opacity: 0;
                  transition: opacity 0.4s ease;
                }

                .v4-eco-particle.is-active {
                  opacity: 1;
                }

                .v4-eco-particle.is-exiting {
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                /* Floating Cards Deck & Dedicated Quadrants */
                .v4-eco-card-deck {
                  position: absolute;
                  inset: 0;
                  pointer-events: none;
                  z-index: 5;
                }

                .v4-eco-card {
                  position: absolute;
                  width: 190px;
                  background: #FFFFFF;
                  border-radius: 14px;
                  border: 1px solid rgba(226, 232, 240, 0.95);
                  box-shadow: 0 16px 34px -8px rgba(124, 58, 237, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.06);
                  padding: 10px 12px;
                  opacity: 0;
                  visibility: hidden;
                  transform: translateY(14px) scale(0.96);
                  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                              transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                              visibility 0.45s;
                  pointer-events: none;
                  will-change: transform, opacity;
                  contain: layout style;
                }

                .v4-eco-card.is-active {
                  opacity: 1;
                  visibility: visible;
                  transform: translateY(0) scale(1);
                  pointer-events: auto;
                }

                .v4-eco-card.is-exiting {
                  opacity: 0;
                  visibility: hidden;
                  transform: translateY(-10px) scale(0.97);
                  transition: opacity 0.35s cubic-bezier(0.4, 0, 1, 1),
                              transform 0.35s cubic-bezier(0.4, 0, 1, 1),
                              visibility 0.35s;
                }

                /* Quadrant Placements */
                .v4-eco-card-1 {
                  top: 20px;
                  left: 16px;
                }

                .v4-eco-card-2 {
                  bottom: 24px;
                  right: 16px;
                }

                .v4-eco-card-3 {
                  top: 20px;
                  right: 16px;
                }

                .v4-eco-card-4 {
                  bottom: 24px;
                  left: 16px;
                }

                /* Internal Card Header & Badges */
                .v4-eco-card-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 6px;
                  margin-bottom: 7px;
                }

                .v4-eco-pill {
                  display: inline-flex;
                  align-items: center;
                  gap: 3.5px;
                  font-size: 9.5px;
                  font-weight: 700;
                  padding: 2px 6px;
                  border-radius: 999px;
                }

                .v4-pill-purple {
                  background: #F3EEFF;
                  color: #7C3AED;
                  border: 1px solid #E9D5FF;
                }

                .v4-pill-success {
                  background: #ECFDF5;
                  color: #059669;
                  border: 1px solid #A7F3D0;
                }

                .v4-pill-indigo {
                  background: #EEF2FF;
                  color: #4F46E5;
                  border: 1px solid #C7D2FE;
                }

                .v4-pill-completed {
                  background: #ECFDF5;
                  color: #059669;
                  border: 1px solid #A7F3D0;
                  transform: scale(0.9);
                  opacity: 0.5;
                  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .v4-pill-completed.is-visible {
                  transform: scale(1);
                  opacity: 1;
                }

                .v4-pill-ai {
                  background: linear-gradient(135deg, #F3EEFF 0%, #EEF2FF 100%);
                  color: #7C3AED;
                  border: 1px solid #DDD6FE;
                }

                .v4-pill-ai-status {
                  background: #FAF5FF;
                  color: #9333EA;
                  border: 1px solid #E9D5FF;
                }

                .v4-eco-sparkle {
                  font-size: 10px;
                  animation: v4EcoSparkle 2s ease-in-out infinite;
                }

                .v4-pill-blue {
                  background: #EFF6FF;
                  color: #2563EB;
                  border: 1px solid #BFDBFE;
                }

                .v4-pill-radar {
                  position: relative;
                  background: #EFF6FF;
                  color: #2563EB;
                  border: 1px solid #BFDBFE;
                }

                .v4-eco-radar-core {
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  background: #2563EB;
                  display: inline-block;
                  margin-right: 2px;
                }

                .v4-eco-radar-ring {
                  position: absolute;
                  left: 5px;
                  top: 50%;
                  width: 5px;
                  height: 5px;
                  margin-top: -2.5px;
                  border-radius: 50%;
                  background: rgba(37, 99, 235, 0.4);
                  animation: v4EcoRadarPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                @keyframes v4EcoRadarPing {
                  0% { transform: scale(0.8); opacity: 0.9; }
                  100% { transform: scale(2.4); opacity: 0; }
                }

                /* Card Body */
                .v4-eco-card-body {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                }

                .v4-eco-card-title {
                  font-size: 12.5px;
                  font-weight: 700;
                  color: #0F172A;
                  margin: 0;
                  letter-spacing: -0.01em;
                }

                .v4-eco-card-desc {
                  font-size: 10.5px;
                  color: #64748B;
                  margin: 0;
                  line-height: 1.35;
                }

                .v4-eco-card-accent {
                  color: #7C3AED;
                  font-weight: 700;
                }

                /* Card 1 Progress & Checkmark */
                .v4-eco-progress-row {
                  display: flex;
                  align-items: center;
                  gap: 7px;
                  margin-top: 3px;
                }

                .v4-eco-progress-track {
                  flex: 1;
                  height: 6px;
                  background: #F1F5F9;
                  border-radius: 999px;
                  overflow: hidden;
                }

                .v4-eco-progress-fill {
                  height: 100%;
                  background: linear-gradient(90deg, #7C3AED 0%, #10B981 100%);
                  border-radius: 999px;
                  width: 0%;
                  transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v4-eco-check-badge {
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: #10B981;
                  color: #FFFFFF;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transform: scale(0);
                  opacity: 0;
                  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
                  flex-shrink: 0;
                  box-shadow: 0 2px 5px rgba(16, 185, 129, 0.35);
                }

                .v4-eco-check-badge.is-visible {
                  transform: scale(1);
                  opacity: 1;
                }

                /* Card 2 Avatars */
                .v4-eco-avatar-row {
                  display: flex;
                  align-items: center;
                  gap: 7px;
                  margin-top: 3px;
                }

                .v4-eco-avatar-group {
                  display: flex;
                  align-items: center;
                }

                .v4-eco-av {
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #FFFFFF;
                  font-size: 8.5px;
                  font-weight: 700;
                  border: 1.5px solid #FFFFFF;
                  margin-left: -5px;
                  transform: scale(0);
                  opacity: 0;
                  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
                  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.12);
                }

                .v4-eco-av:first-child { margin-left: 0; }
                .v4-eco-av.is-visible { transform: scale(1); opacity: 1; }
                .v4-av-ms { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); }
                .v4-av-jl { background: linear-gradient(135deg, #2563EB 0%, #38BDF8 100%); }
                .v4-av-sk { background: linear-gradient(135deg, #059669 0%, #34D399 100%); }

                .v4-eco-avatar-extra {
                  font-size: 9.5px;
                  font-weight: 600;
                  color: #64748B;
                }

                /* Card 3 Chat & Typewriter */
                .v4-eco-user-bubble {
                  background: #F8FAFC;
                  border: 1px solid #E2E8F0;
                  border-radius: 6px;
                  padding: 3px 6px;
                  font-size: 9.5px;
                  color: #1E293B;
                  display: flex;
                  align-items: center;
                  gap: 3px;
                  min-height: 22px;
                }

                .v4-eco-bubble-prefix {
                  font-weight: 700;
                  color: #64748B;
                  font-size: 9px;
                }

                .v4-eco-type-text {
                  color: #0F172A;
                  font-weight: 500;
                }

                .v4-eco-type-cursor {
                  color: #7C3AED;
                  font-weight: 700;
                  animation: v4EcoBlinkCursor 0.8s infinite;
                }

                @keyframes v4EcoBlinkCursor {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }

                .v4-eco-thinking-wave {
                  display: none;
                  align-items: center;
                  gap: 3px;
                  padding: 2px 4px;
                }

                .v4-eco-thinking-wave.is-active {
                  display: inline-flex;
                }

                .v4-eco-thinking-wave span {
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background: #7C3AED;
                  animation: v4EcoWaveBounce 1s infinite ease-in-out;
                }

                .v4-eco-thinking-wave span:nth-child(2) { animation-delay: 0.2s; }
                .v4-eco-thinking-wave span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes v4EcoWaveBounce {
                  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                  40% { transform: translateY(-3px); opacity: 1; }
                }

                .v4-eco-ai-bubble {
                  display: flex;
                  align-items: flex-start;
                  gap: 5px;
                  background: #F3EEFF;
                  border: 1px solid #E9D5FF;
                  border-radius: 7px;
                  padding: 4px 7px;
                  font-size: 9.5px;
                  color: #3B0764;
                  line-height: 1.3;
                  opacity: 0;
                  transform: translateY(4px);
                  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                  margin-top: 2px;
                }

                .v4-eco-ai-bubble.is-visible {
                  opacity: 1;
                  transform: translateY(0);
                }

                .v4-eco-ai-icon {
                  font-size: 10px;
                  flex-shrink: 0;
                }

                /* Card 4 1-on-1 */
                .v4-eco-time-badge {
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  background: #EFF6FF;
                  color: #1D4ED8;
                  font-size: 10px;
                  font-weight: 700;
                  padding: 2px 6px;
                  border-radius: 5px;
                  border: 1px solid #DBEAFE;
                  margin-top: 2px;
                }

                .v4-eco-agenda-note {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 9px;
                  color: #64748B;
                  margin-top: 2px;
                }

                .v4-eco-agenda-dot {
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background: #3B82F6;
                  flex-shrink: 0;
                }

                /* Responsive Adjustments */
                @media (max-width: 640px) {
                  .v4-eco-stage {
                    height: 360px;
                  }
                  .v4-eco-dashboard {
                    width: 240px;
                  }
                  .v4-eco-card {
                    width: 160px;
                    padding: 8px 10px;
                  }
                  .v4-eco-card-1 { top: 12px; left: 10px; }
                  .v4-eco-card-2 { bottom: 16px; right: 10px; }
                  .v4-eco-card-3 { top: 12px; right: 10px; }
                  .v4-eco-card-4 { bottom: 16px; left: 10px; }
                }

                /* Reduced Motion */
                @media (prefers-reduced-motion: reduce) {
                  .v4-eco-dashboard {
                    animation: none !important;
                    transition: none !important;
                  }
                  .v4-eco-card,
                  .v4-eco-line,
                  .v4-eco-particle,
                  .v4-eco-progress-fill,
                  .v4-eco-check-badge,
                  .v4-eco-av,
                  .v4-eco-ai-bubble,
                  .v4-eco-ai-notice {
                    transition: none !important;
                  }
                  .v4-eco-particle animateMotion {
                    dur: 0s !important;
                  }
                  .v4-eco-radar-ring {
                    animation: none !important;
                  }
                }

                /* ==========================================================================
                   VIEW 6: THE LIVING HIRERKEY FORM — ABSTRACT BRAND-LED ANIMATION
                   Central Organic Morphing Purple Orb + 4 Abstract Satellite Jewel Nodes +
                   Progressive Bézier Connective Paths + Glowing Photons (21.0s Master Loop)
                   ========================================================================== */
                .v6-brand-stage {
                  width: 100%;
                  max-width: 540px;
                  height: 380px;
                  position: relative;
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  contain: layout style;
                  user-select: none;
                  -webkit-user-select: none;
                }

                /* SVG Connective Layer */
                .v6-brand-svg-canvas {
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  pointer-events: none;
                  z-index: 2;
                }

                .v6-guide-line {
                  fill: none;
                  stroke: rgba(124, 58, 237, 0.12);
                  stroke-width: 1.5px;
                  stroke-dasharray: 3 4;
                }

                .v6-brand-line {
                  fill: none;
                  stroke-width: 2.25px;
                  stroke-dasharray: 200;
                  stroke-dashoffset: 200;
                  stroke-linecap: round;
                  opacity: 0;
                  transition: stroke-dashoffset 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                              opacity 0.4s ease;
                }

                .v6-brand-line.is-active {
                  stroke-dashoffset: 0;
                  opacity: 1;
                }

                .v6-brand-line.is-exiting {
                  opacity: 0;
                  transition: opacity 0.35s ease;
                }

                .v6-photon {
                  opacity: 0;
                  transition: opacity 0.35s ease;
                }

                .v6-photon.is-active {
                  opacity: 1;
                }

                .v6-photon.is-exiting {
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                /* Central Organic Translucent Purple Orb */
                .v6-brand-orb-container {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  width: 136px;
                  height: 136px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 4;
                  pointer-events: none;
                  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v6-orb-halo {
                  position: absolute;
                  inset: -26px;
                  border-radius: 50%;
                  background: radial-gradient(circle, rgba(124, 58, 237, 0.42) 0%, rgba(147, 51, 234, 0.22) 42%, rgba(124, 58, 237, 0) 72%);
                  filter: blur(14px);
                  animation: v6AuraBreathe 6s ease-in-out infinite;
                  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                              opacity 0.8s ease,
                              filter 0.8s ease,
                              background 0.8s ease;
                  will-change: transform, opacity;
                  pointer-events: none;
                }

                @keyframes v6AuraBreathe {
                  0%, 100% {
                    transform: scale(0.96);
                    opacity: 0.75;
                  }
                  50% {
                    transform: scale(1.08);
                    opacity: 1;
                  }
                }

                .v6-brand-orb-container.is-blooming .v6-orb-halo {
                  transform: scale(1.35);
                  opacity: 1;
                  filter: blur(20px);
                  background: radial-gradient(circle, rgba(168, 85, 247, 0.65) 0%, rgba(124, 58, 237, 0.4) 45%, rgba(124, 58, 237, 0) 75%);
                }

                .v6-orb-core {
                  position: relative;
                  width: 130px;
                  height: 130px;
                  border-radius: 60% 40% 55% 45% / 48% 58% 42% 52%;
                  background: radial-gradient(circle at 35% 30%, #D8B4FE 0%, #A855F7 28%, #7C3AED 58%, #581C87 95%);
                  box-shadow: 0 16px 36px -6px rgba(124, 58, 237, 0.45),
                              0 0 24px rgba(147, 51, 234, 0.35),
                              inset 0 3px 10px rgba(255, 255, 255, 0.5),
                              inset 0 -8px 20px rgba(76, 29, 149, 0.7);
                  animation: v6OrbMorph 12s ease-in-out infinite alternate;
                  overflow: hidden;
                  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                              box-shadow 0.6s ease;
                  will-change: border-radius, transform, box-shadow;
                }

                @keyframes v6OrbMorph {
                  0% {
                    border-radius: 60% 40% 55% 45% / 48% 58% 42% 52%;
                    transform: rotate(0deg) scale(1);
                  }
                  33% {
                    border-radius: 46% 54% 42% 58% / 56% 44% 56% 44%;
                    transform: rotate(4deg) scale(1.02);
                  }
                  66% {
                    border-radius: 54% 46% 58% 42% / 44% 56% 46% 54%;
                    transform: rotate(-3deg) scale(0.98);
                  }
                  100% {
                    border-radius: 48% 52% 44% 56% / 54% 46% 54% 46%;
                    transform: rotate(2deg) scale(1.01);
                  }
                }

                .v6-brand-orb-container.is-blooming .v6-orb-core {
                  transform: scale(1.1);
                  box-shadow: 0 20px 48px rgba(124, 58, 237, 0.6),
                              0 0 45px rgba(192, 132, 252, 0.7),
                              inset 0 4px 14px rgba(255, 255, 255, 0.75),
                              inset 0 -8px 24px rgba(88, 28, 135, 0.85);
                }

                .v6-orb-sheen {
                  position: absolute;
                  inset: 0;
                  border-radius: inherit;
                  background: radial-gradient(ellipse at 32% 22%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.18) 32%, transparent 62%),
                              linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 48%);
                  mix-blend-mode: overlay;
                  pointer-events: none;
                }

                /* Central Glowing 'H' Emblem Nucleus */
                .v6-orb-nucleus {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  width: 48px;
                  height: 48px;
                  border-radius: 14px;
                  background: rgba(255, 255, 255, 0.2);
                  backdrop-filter: blur(8px);
                  -webkit-backdrop-filter: blur(8px);
                  border: 1px solid rgba(255, 255, 255, 0.45);
                  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15),
                              inset 0 0 12px rgba(255, 255, 255, 0.35);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 5;
                  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                              box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                              background-color 0.5s ease;
                }

                .v6-orb-nucleus.is-illuminated {
                  transform: translate(-50%, -50%) scale(1.15);
                  background: rgba(255, 255, 255, 0.38);
                  border-color: rgba(255, 255, 255, 0.85);
                  box-shadow: 0 0 32px rgba(255, 255, 255, 0.9),
                              0 0 50px rgba(236, 72, 153, 0.65),
                              inset 0 0 16px rgba(255, 255, 255, 0.8);
                }

                .v6-emblem-h {
                  font-family: var(--font-display);
                  font-size: 24px;
                  font-weight: 800;
                  color: #FFFFFF;
                  text-shadow: 0 2px 8px rgba(124, 58, 237, 0.8),
                               0 0 12px rgba(255, 255, 255, 0.9);
                  line-height: 1;
                  transform: translateY(-0.5px);
                }

                /* 4 Abstract Satellite Jewel Nodes */
                .v6-node {
                  position: absolute;
                  width: 50px;
                  height: 50px;
                  transform: translate(-50%, -50%);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  z-index: 5;
                  contain: layout style;
                  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v6-node-jewel {
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.92);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 1.5px solid rgba(226, 232, 240, 0.9);
                  box-shadow: 0 8px 18px -4px rgba(15, 23, 42, 0.08),
                              0 2px 6px -1px rgba(124, 58, 237, 0.05);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v6-node-label {
                  position: absolute;
                  top: calc(100% + 7px);
                  left: 50%;
                  transform: translateX(-50%);
                  font-size: 9px;
                  font-weight: 700;
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                  color: #64748B;
                  white-space: nowrap;
                  transition: color 0.35s ease, transform 0.35s ease;
                  pointer-events: none;
                }

                /* Node 1 Active: Orientation (#10B981) */
                .v6-node-1.is-active .v6-node-jewel {
                  border-color: #10B981;
                  box-shadow: 0 0 22px rgba(16, 185, 129, 0.38),
                              0 8px 22px -3px rgba(16, 185, 129, 0.22);
                  transform: scale(1.08);
                }
                .v6-node-1.is-active .v6-node-label {
                  color: #059669;
                  transform: translateX(-50%) translateY(1px);
                }

                /* Node 2 Active: Team Tour (#6366F1) */
                .v6-node-2.is-active .v6-node-jewel {
                  border-color: #6366F1;
                  box-shadow: 0 0 22px rgba(99, 102, 241, 0.38),
                              0 8px 22px -3px rgba(99, 102, 241, 0.22);
                  transform: scale(1.08);
                }
                .v6-node-2.is-active .v6-node-label {
                  color: #4F46E5;
                  transform: translateX(-50%) translateY(1px);
                }

                /* Node 3 Active: Ask HyIQ (#EC4899) */
                .v6-node-3.is-active .v6-node-jewel {
                  border-color: #EC4899;
                  box-shadow: 0 0 22px rgba(236, 72, 153, 0.38),
                              0 8px 22px -3px rgba(236, 72, 153, 0.22);
                  transform: scale(1.08);
                }
                .v6-node-3.is-active .v6-node-label {
                  color: #DB2777;
                  transform: translateX(-50%) translateY(1px);
                }

                /* Node 4 Active: 1-on-1 Check-ins (#06B6D4) */
                .v6-node-4.is-active .v6-node-jewel {
                  border-color: #06B6D4;
                  box-shadow: 0 0 22px rgba(6, 182, 212, 0.38),
                              0 8px 22px -3px rgba(6, 182, 212, 0.22);
                  transform: scale(1.08);
                }
                .v6-node-4.is-active .v6-node-label {
                  color: #0891B2;
                  transform: translateX(-50%) translateY(1px);
                }

                /* Node Exiting Transitions */
                .v6-node.is-exiting .v6-node-jewel {
                  transform: scale(1);
                  box-shadow: 0 8px 18px -4px rgba(15, 23, 42, 0.08);
                  border-color: rgba(226, 232, 240, 0.9);
                  transition: all 0.35s ease;
                }
                .v6-node.is-exiting .v6-node-label {
                  color: #64748B;
                  transform: translateX(-50%);
                  transition: all 0.35s ease;
                }

                /* Node 1 Internal: Progress Ring & Checkmark */
                .v6-ring-svg {
                  width: 40px;
                  height: 40px;
                  transform: rotate(-90deg);
                  position: absolute;
                }

                .v6-ring-bg {
                  fill: none;
                  stroke: rgba(226, 232, 240, 0.8);
                  stroke-width: 2.5px;
                }

                .v6-ring-progress {
                  fill: none;
                  stroke: #10B981;
                  stroke-width: 2.5px;
                  stroke-linecap: round;
                  stroke-dasharray: 106.8;
                  stroke-dashoffset: 106.8;
                  transition: stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .v6-check-icon {
                  width: 18px;
                  height: 18px;
                  opacity: 0;
                  transform: scale(0.4);
                  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  position: relative;
                  z-index: 2;
                }

                .v6-check-icon.is-visible {
                  opacity: 1;
                  transform: scale(1);
                }

                /* Node 2 Internal: Triad Interconnected Circles */
                .v6-triad-svg {
                  width: 30px;
                  height: 30px;
                }

                .v6-triad-line {
                  stroke: rgba(99, 102, 241, 0.45);
                  stroke-width: 1.4px;
                }

                .v6-triad-dot {
                  transition: transform 0.3s ease, fill 0.3s ease;
                }

                .v6-triad-svg.is-pulsing .v6-triad-dot-1 {
                  animation: v6TriadPulse 1.2s ease-in-out infinite alternate;
                }
                .v6-triad-svg.is-pulsing .v6-triad-dot-2 {
                  animation: v6TriadPulse 1.2s ease-in-out infinite 0.3s alternate;
                }
                .v6-triad-svg.is-pulsing .v6-triad-dot-3 {
                  animation: v6TriadPulse 1.2s ease-in-out infinite 0.6s alternate;
                }

                @keyframes v6TriadPulse {
                  0% {
                    transform: scale(1);
                    opacity: 0.8;
                  }
                  100% {
                    transform: scale(1.3);
                    opacity: 1;
                    filter: drop-shadow(0 0 4px #6366F1);
                  }
                }

                /* Node 3 Internal: 4-Point Diamond Sparkle */
                .v6-sparkle-svg {
                  width: 24px;
                  height: 24px;
                  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                              filter 0.35s ease;
                }

                .v6-sparkle-svg.is-pulsing {
                  animation: v6SparklePulse 1.4s ease-in-out infinite;
                  filter: drop-shadow(0 0 6px #EC4899);
                }

                @keyframes v6SparklePulse {
                  0%, 100% {
                    transform: scale(1) rotate(0deg);
                  }
                  50% {
                    transform: scale(1.28) rotate(10deg);
                  }
                }

                /* Node 4 Internal: Resonant Overlapping Circles */
                .v6-resonance-svg {
                  width: 28px;
                  height: 28px;
                }

                .v6-res-circle {
                  transition: transform 0.3s ease, opacity 0.3s ease;
                }

                .v6-resonance-svg.is-pulsing .v6-res-1 {
                  animation: v6ResonancePulse1 1.5s ease-in-out infinite alternate;
                }
                .v6-resonance-svg.is-pulsing .v6-res-2 {
                  animation: v6ResonancePulse2 1.5s ease-in-out infinite alternate;
                }

                @keyframes v6ResonancePulse1 {
                  0% {
                    stroke-width: 2px;
                    opacity: 0.7;
                  }
                  100% {
                    stroke-width: 2.6px;
                    opacity: 1;
                    filter: drop-shadow(0 0 4px #06B6D4);
                  }
                }

                @keyframes v6ResonancePulse2 {
                  0% {
                    stroke-width: 2px;
                    opacity: 0.7;
                  }
                  100% {
                    stroke-width: 2.6px;
                    opacity: 1;
                    filter: drop-shadow(0 0 4px #06B6D4);
                  }
                }

                /* Responsive Adjustments for View 6 */
                @media (max-width: 640px) {
                  .v6-brand-stage {
                    height: 360px;
                  }
                  .v6-brand-orb-container {
                    width: 110px;
                    height: 110px;
                  }
                  .v6-orb-core {
                    width: 104px;
                    height: 104px;
                  }
                  .v6-orb-nucleus {
                    width: 40px;
                    height: 40px;
                  }
                  .v6-emblem-h {
                    font-size: 20px;
                  }
                  .v6-node {
                    width: 44px;
                    height: 44px;
                  }
                  .v6-node-jewel {
                    width: 44px;
                    height: 44px;
                  }
                }

                /* View 6 Prefers Reduced Motion */
                @media (prefers-reduced-motion: reduce) {
                  .v6-orb-halo,
                  .v6-orb-core,
                  .v6-triad-svg.is-pulsing .v6-triad-dot-1,
                  .v6-triad-svg.is-pulsing .v6-triad-dot-2,
                  .v6-triad-svg.is-pulsing .v6-triad-dot-3,
                  .v6-sparkle-svg.is-pulsing,
                  .v6-resonance-svg.is-pulsing .v6-res-1,
                  .v6-resonance-svg.is-pulsing .v6-res-2 {
                    animation: none !important;
                  }
                  .v6-brand-line,
                  .v6-photon,
                  .v6-ring-progress,
                  .v6-check-icon,
                  .v6-node,
                  .v6-node-jewel,
                  .v6-node-label,
                  .v6-orb-nucleus {
                    transition: none !important;
                  }
                  .v6-photon animateMotion {
                    dur: 0s !important;
                  }
                }

              `}</style>
            <Box
              sx={{
                width: '100%',
                maxWidth: '1220px',
                minHeight: '640px',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.95fr' },
                gap: { xs: 4, lg: '36px' },
                alignItems: 'center',
                position: 'relative',
                zIndex: 10,
              }}
            >
              {/* LEFT COLUMN: HERO SHOWCASE WITH APPROVALMAX-STYLE WORKFLOW ANIMATION */}
              <Box
                sx={{
                  p: { xs: 1, sm: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Brand Logo Header & People Performance Progress Subtag */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2.75, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.45)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: 20,
                      }}
                    >
                      H
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: 24,
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.035em',
                      }}
                    >
                      Hirerkey<span style={{ color: '#7C3AED' }}>.</span>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '9999px',
                      background: 'rgba(124, 58, 237, 0.08)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      color: '#7C3AED',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span>PEOPLE • PERFORMANCE • PROGRESS</span>
                  </Box>
                </Box>

                {/* Headline */}
                <Typography
                  level="h1"
                  sx={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: { xs: 34, sm: 44 },
                    fontWeight: 800,
                    lineHeight: 1.14,
                    letterSpacing: '-0.035em',
                    color: '#0F172A',
                    mb: 1.75,
                  }}
                >
                  Make worklife{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    easy
                  </span>
                </Typography>

                {/* Subtitle */}
                <Typography
                  sx={{
                    fontSize: 16,
                    color: '#475569',
                    lineHeight: 1.55,
                    maxWidth: 480,
                    mb: 3,
                  }}
                >
                  Everything you need to build, manage and grow a high-performing team.
                </Typography>

                {/* ANIMATED WORKFLOW STAGE (PAGE 1 vs PAGE 2) */}
                {activePage === 1 && (
                <Box
                  id="v4WorkflowStage"
                  onMouseMove={handleV4MouseMove}
                  onMouseLeave={handleV4MouseLeave}
                  sx={{
                    width: '100%',
                    maxWidth: 540,
                    height: 350,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: 1000,
                    mt: 0.75,
                  }}
                >
                  {/* Dynamic SVG Flow Connectors & Luminescent Particles */}
                  <svg
                    viewBox="0 0 540 350"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  >
                    <defs>
                      {/* Multi-Stop Cosmic Gradient for Live Stream */}
                      <linearGradient id="v4Grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="v4Grad4" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                      </linearGradient>

                      {/* Soft Bloom Filter for Flow Lines */}
                      <filter id="v4FlowGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>

                      {/* Intense Radial Bloom for Particles */}
                      <filter id="v4ParticleGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Base Ambient Dashed Tracks */}
                    <path className="v4-track-base" d="M 160 75 C 210 75, 230 145, 270 160" />
                    <path className="v4-track-base" d="M 160 275 C 210 275, 230 205, 270 190" />
                    <path className="v4-track-base" d="M 380 75 C 330 75, 310 145, 270 160" />
                    <path className="v4-track-base" d="M 380 275 C 330 275, 310 205, 270 190" />

                    {/* Animated Dynamic Connector Flow Lines */}
                    <path className="v4-path-active v4-path-1" stroke="url(#v4Grad1)" d="M 160 75 C 210 75, 230 145, 270 160" filter="url(#v4FlowGlow)" />
                    <path className="v4-path-active v4-path-2" stroke="url(#v4Grad2)" d="M 160 275 C 210 275, 230 205, 270 190" filter="url(#v4FlowGlow)" />
                    <path className="v4-path-active v4-path-3" stroke="url(#v4Grad3)" d="M 380 75 C 330 75, 310 145, 270 160" filter="url(#v4FlowGlow)" />
                    <path className="v4-path-active v4-path-4" stroke="url(#v4Grad4)" d="M 380 275 C 330 275, 310 205, 270 190" filter="url(#v4FlowGlow)" />
                  </svg>

                  {/* Travelling Particle Dots (Driven by CSS offset-path) */}
                  <div className="v4-particle v4-particle-1" />
                  <div className="v4-particle v4-particle-2" />
                  <div className="v4-particle v4-particle-3" />
                  <div className="v4-particle v4-particle-4" />

                  {/* MODULE 1: ORIENTATION (Top-Left) */}
                  <Box
                    className="v4-flow-card v4-mod-1"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 6,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card1Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(124, 58, 237, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#EDE9FE',
                        color: '#7C3AED',
                      }}
                    >
                      🧭
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7C3AED', mb: 0.25 }}>
                        01 • ONBOARDING
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Orientation
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        <span className="v4-pulse-dot" />
                        <span>Active • Automated</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* MODULE 2: DEPARTMENT TOUR (Bottom-Left) */}
                  <Box
                    className="v4-flow-card v4-mod-2"
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      left: 12,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card2Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(59, 130, 246, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#EFF6FF',
                        color: '#3B82F6',
                      }}
                    >
                      🏢
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#3B82F6', mb: 0.25 }}>
                        02 • ALIGNMENT
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Department Tour
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        <span className="v4-status-label">Sales &amp; Marketing</span>
                      </Typography>
                    </Box>
                  </Box>

                  {/* CENTRAL MINI DASHBOARD (Core Hub) */}
                  <Box
                    id="v4MiniDashboard"
                    className="v4-mini-dashboard"
                    sx={{
                      position: 'absolute',
                      zIndex: 5,
                      width: 220,
                      bgcolor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid rgba(124, 58, 237, 0.25)',
                      boxShadow: '0 20px 45px -10px rgba(124, 58, 237, 0.32), 0 8px 20px -4px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.9)',
                      overflow: 'hidden',
                      transform: `rotateX(${v4Tilt.x}deg) rotateY(${v4Tilt.y}deg)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4DashMaster 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
                      willChange: 'transform, box-shadow',
                    }}
                  >
                    <Box sx={{ p: '6px 10px', bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                      </Box>
                      <Typography sx={{ fontSize: 8.5, color: '#64748B', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                        app.hirerkey.com
                      </Typography>
                    </Box>
                    <Box sx={{ position: 'relative', bgcolor: '#0B0818', overflow: 'hidden' }}>
                      <img
                        src="hirerkey_dashboard_v4.png"
                        onError={(e: any) => {
                          if (!e.target.dataset.retry) {
                            e.target.dataset.retry = '1';
                            e.target.src = '../hirerkey_dashboard_v4.png';
                          }
                        }}
                        alt="Hirerkey Core Workspace"
                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                      />
                      {/* Live Sync Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          px: '6px',
                          py: '2px',
                          borderRadius: '9999px',
                          bgcolor: 'rgba(15, 23, 42, 0.88)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#FFFFFF',
                          fontSize: 8,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          zIndex: 7,
                        }}
                      >
                        <span className="v4-pulse-dot" />
                        <span>Live Sync</span>
                      </Box>

                      {/* Mini AI Insight Toast (Scene 4 & Climax) */}
                      <div className="v4-mini-dash-toast" id="v4MiniDashToast">
                        <span className="v4-toast-icon">✨</span>
                        <span className="v4-toast-text">HyIQ: 4 matches ready</span>
                      </div>
                    </Box>
                  </Box>

                  {/* MODULE 3: ASK HyIQ AI (Top-Right) */}
                  <Box
                    className="v4-flow-card v4-mod-3"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 6,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card3Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(236, 72, 153, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box v4-sparkle-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#FDF2F8',
                        color: '#EC4899',
                      }}
                    >
                      ✨
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#EC4899', mb: 0.25 }}>
                        03 • INTELLIGENCE
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Ask HyIQ™ AI
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 10, color: '#64748B', mt: 0.25 }}>
                        <span className="v4-ai-pulse" />
                        <span>Real-time • 12ms</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* MODULE 4: 1-ON-1 CHECK-INS (Bottom-Right) */}
                  <Box
                    className="v4-flow-card v4-mod-4"
                    sx={{
                      position: 'absolute',
                      bottom: 18,
                      right: 14,
                      zIndex: 6,
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      p: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      width: 200,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animation: 'v4Card4Motion 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 16px 35px -8px rgba(16, 185, 129, 0.25)',
                      },
                    }}
                  >
                    <Box
                      className="v4-card-icon-box"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        bgcolor: '#ECFDF5',
                        color: '#10B981',
                      }}
                    >
                      📊
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#059669', mb: 0.25 }}>
                        04 • PERFORMANCE
                      </Typography>
                      <Typography sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        1-on-1 Check-ins
                      </Typography>
                      <div className="v4-card-status v4-progress-status">
                        <span className="v4-progress-label">Goal</span>
                        <div className="v4-progress-track">
                          <div className="v4-progress-fill" />
                        </div>
                        <span className="v4-progress-val">85%</span>
                      </div>
                    </Box>
                  </Box>
                </Box>
                )}

                {/* VIEW 3: MINIMAL HERO ANIMATION (PAGE 3) */}
                {activePage === 3 && (
                  <V3MinimalStage active={activePage === 3} />
                )}

                {/* VIEW 4: THE CONNECTED HR ECOSYSTEM HERO ANIMATION (PAGE 4) */}
                {activePage === 4 && (
                  <V4EcosystemStage active={activePage === 4} />
                )}

                {/* VIEW 6: THE LIVING HIRERKEY FORM BRAND ANIMATION (PAGE 6) */}
                {activePage === 6 && (
                  <V6BrandStage active={activePage === 6} />
                )}
                
              </Box>

              {/* RIGHT COLUMN: CLEAN WHITE AUTHENTICATION CARD */}
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: '28px',
                  border: '1px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 30px 70px -15px rgba(124, 58, 237, 0.12), 0 12px 30px -5px rgba(15, 23, 42, 0.04), inset 0 1px 1px #FFFFFF',
                  p: { xs: 3, sm: '38px 38px 32px 38px' },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Form Titles */}
                <Typography
                  level="h2"
                  sx={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 30,
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.03em',
                    mb: 0.75,
                  }}
                >
                  Welcome back
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#64748B', mb: 3 }}>
                  Sign in to continue to Hirerkey
                </Typography>

                {/* Dual Tab Segmented Track (OTP vs Password) */}
                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    p: '4px',
                    gap: '4px',
                    mb: 3,
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setV4AuthMode('otp')}
                    sx={{
                      flex: 1,
                      py: 1.25,
                      px: 1.75,
                      borderRadius: '9px',
                      border: '1px solid',
                      borderColor: v4AuthMode === 'otp' ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
                      bgcolor: v4AuthMode === 'otp' ? '#FFFFFF' : 'transparent',
                      color: v4AuthMode === 'otp' ? '#7C3AED' : '#64748B',
                      fontWeight: v4AuthMode === 'otp' ? 700 : 600,
                      boxShadow: v4AuthMode === 'otp' ? '0 2px 8px rgba(124, 58, 237, 0.12)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: 13.5,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <HiEnvelope size={16} />
                    <span>Login with OTP</span>
                  </Box>

                  <Box
                    component="button"
                    type="button"
                    onClick={() => setV4AuthMode('password')}
                    sx={{
                      flex: 1,
                      py: 1.25,
                      px: 1.75,
                      borderRadius: '9px',
                      border: '1px solid',
                      borderColor: v4AuthMode === 'password' ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
                      bgcolor: v4AuthMode === 'password' ? '#FFFFFF' : 'transparent',
                      color: v4AuthMode === 'password' ? '#7C3AED' : '#64748B',
                      fontWeight: v4AuthMode === 'password' ? 700 : 600,
                      boxShadow: v4AuthMode === 'password' ? '0 2px 8px rgba(124, 58, 237, 0.12)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: 13.5,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <HiLockClosed size={16} />
                    <span>Login with password</span>
                  </Box>
                </Box>

                {/* MODE A: OTP FLOW */}
                {v4AuthMode === 'otp' && v4OtpStep === 'input' && (
                  <Box component="form" onSubmit={handleV4SendOTP}>
                    <Box sx={{ mb: 2.25 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 1 }}>
                        Work email
                      </Typography>
                      <Input
                        type="email"
                        required
                        value={v4Email}
                        onChange={(e) => setV4Email(e.target.value)}
                        placeholder="you@company.com"
                        startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                        sx={{
                          height: 48,
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          bgcolor: '#FFFFFF',
                          fontSize: 14,
                          '&:focus-within': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                          },
                        }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          bgcolor: '#6D28D9',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 14px 28px -5px rgba(124, 58, 237, 0.55)',
                        },
                      }}
                      endDecorator={<HiArrowRight size={16} />}
                    >
                      Send OTP
                    </Button>
                  </Box>
                )}

                {/* MODE A2: OTP VERIFICATION */}
                {v4AuthMode === 'otp' && v4OtpStep === 'verify' && (
                  <Box component="form" onSubmit={handleV4VerifyOTP}>
                    <Typography level="h3" sx={{ fontSize: 19, fontWeight: 700, color: '#0F172A', mb: 0.75 }}>
                      Enter verification code
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B', mb: 2.5 }}>
                      We sent a 6-digit code to <strong style={{ color: '#7C3AED' }}>{v4Email}</strong>
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1.25, mb: 2.5 }}>
                      {v4OtpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`v4-otp-digit-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleV4OtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleV4OtpKeyDown(idx, e)}
                          style={{
                            height: 52,
                            width: '100%',
                            textAlign: 'center',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: 22,
                            fontWeight: 800,
                            color: '#0F172A',
                            borderRadius: '12px',
                            border: '1.5px solid #CBD5E1',
                            background: '#FFFFFF',
                            outline: 'none',
                            transition: 'all 0.15s ease',
                          }}
                        />
                      ))}
                    </Box>

                    {/* Resend Timer Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, fontSize: 13, color: '#64748B', mb: 2.5 }}>
                      <span>Didn't receive code?</span>
                      {v4OtpSecondsLeft > 0 ? (
                        <span>
                          Resend in <strong style={{ color: '#7C3AED' }}>0:{v4OtpSecondsLeft.toString().padStart(2, '0')}</strong>
                        </span>
                      ) : (
                        <Box
                          component="button"
                          type="button"
                          onClick={resendV4Code}
                          sx={{
                            background: 'none',
                            border: 'none',
                            p: 0,
                            color: '#7C3AED',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: 13,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          Resend OTP
                        </Box>
                      )}
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          bgcolor: '#6D28D9',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 14px 28px -5px rgba(124, 58, 237, 0.55)',
                        },
                      }}
                      endDecorator={<HiArrowRight size={16} />}
                    >
                      Verify &amp; Sign in
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 1.75 }}>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => setV4OtpStep('input')}
                        sx={{
                          background: 'none',
                          border: 'none',
                          p: 0,
                          color: '#7C3AED',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        ← Back to Email entry
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* MODE B: PASSWORD LOGIN */}
                {v4AuthMode === 'password' && (
                  <Box component="form" onSubmit={handleV4PasswordLogin}>
                    <Box sx={{ mb: 2.25 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 1 }}>
                        Work email
                      </Typography>
                      <Input
                        type="email"
                        required
                        value={v4Email}
                        onChange={(e) => setV4Email(e.target.value)}
                        placeholder="you@company.com"
                        startDecorator={<HiEnvelope color="#94A3B8" size={18} />}
                        sx={{
                          height: 48,
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          bgcolor: '#FFFFFF',
                          fontSize: 14,
                          '&:focus-within': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2.25 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', mb: 1 }}>
                        Password
                      </Typography>
                      <Input
                        type={v4ShowPassword ? 'text' : 'password'}
                        required
                        value={v4Password}
                        onChange={(e) => setV4Password(e.target.value)}
                        placeholder="••••••••"
                        startDecorator={<HiLockClosed color="#94A3B8" size={18} />}
                        endDecorator={
                          <Box
                            component="button"
                            type="button"
                            onClick={() => setV4ShowPassword(!v4ShowPassword)}
                            sx={{ background: 'none', border: 'none', p: 0.5, color: '#94A3B8', cursor: 'pointer', display: 'flex' }}
                          >
                            {v4ShowPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                          </Box>
                        }
                        sx={{
                          height: 48,
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          bgcolor: '#FFFFFF',
                          fontSize: 14,
                          '&:focus-within': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, fontSize: 13 }}>
                      <Box
                        component="label"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.85, color: '#475569', cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={v4RememberMe}
                          onChange={(e) => setV4RememberMe(e.target.checked)}
                          style={{ accentColor: '#7C3AED', width: 16, height: 16 }}
                        />
                        <span>Remember me</span>
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => setHelpModalOpen(true)}
                        sx={{
                          background: 'none',
                          border: 'none',
                          p: 0,
                          color: '#7C3AED',
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Forgot password?
                      </Box>
                    </Box>

                    <Button
                      type="submit"
                      loading={loading}
                      sx={{
                        width: '100%',
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: '#7C3AED',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: '0 10px 24px -5px rgba(124, 58, 237, 0.45)',
                        '&:hover': {
                          bgcolor: '#6D28D9',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 14px 28px -5px rgba(124, 58, 237, 0.55)',
                        },
                      }}
                      endDecorator={<HiArrowRight size={16} />}
                    >
                      Sign in
                    </Button>
                  </Box>
                )}

                {/* Can't access your login email recovery link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setHelpModalOpen(true)}
                    sx={{
                      background: 'none',
                      border: 'none',
                      p: 0,
                      color: '#7C3AED',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { color: '#6D28D9', textDecoration: 'underline' },
                    }}
                  >
                    Can't access your login email?
                  </Box>
                </Box>

                {/* Legal Footer */}
                <Typography sx={{ mt: 3.5, fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>
                  By continuing, you agree to our{' '}
                  <span style={{ color: '#7C3AED', fontWeight: 600, cursor: 'pointer' }}>Terms of Use</span> and{' '}
                  <span style={{ color: '#7C3AED', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>.
                </Typography>
              </Box>
            </Box>
          </motion.div>

      {/* Sleek Bottom Pagination Dock */}
      <Box
        component="nav"
        aria-label="Page navigation"
        sx={{
          position: 'fixed',
          bottom: { xs: '14px', sm: '22px' },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'inline-flex',
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          borderRadius: '9999px',
          p: '5px 6px',
          gap: '6px',
          boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.12), 0 6px 14px -3px rgba(124, 58, 237, 0.08), inset 0 1px 1px #FFFFFF',
          userSelect: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: '0 20px 42px -6px rgba(15, 23, 42, 0.16), 0 8px 20px -3px rgba(124, 58, 237, 0.14), inset 0 1px 1px #FFFFFF',
          },
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(1)}
          aria-label="Page 1: The Connected HR Ecosystem"
          title="The Connected HR Ecosystem (Key 1)"
          sx={{
            appearance: 'none',
            border: activePage === 1 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 1 ? '#FFFFFF' : 'transparent',
            color: activePage === 1 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 1 ? 700 : 600,
            boxShadow: activePage === 1 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 1 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>①</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Ecosystem</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 1 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 1 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 1 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            1
          </Box>
        </Box>

        <Box sx={{ width: '1px', height: '18px', bgcolor: '#E2E8F0' }} />

        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(2)}
          aria-label="Page 2: How Hirerkey Works (Feature Flows)"
          title="How Hirerkey Works (Key 2)"
          sx={{
            appearance: 'none',
            border: activePage === 2 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 2 ? '#FFFFFF' : 'transparent',
            color: activePage === 2 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 2 ? 700 : 600,
            boxShadow: activePage === 2 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 2 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>②</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>How It Works</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              fontSize: '9px',
              fontWeight: 800,
              px: '6px',
              py: '1.5px',
              borderRadius: '9999px',
              bgcolor: 'rgba(219, 39, 119, 0.12)',
              color: '#DB2777',
              border: '1px solid rgba(219, 39, 119, 0.28)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            New
          </Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 2 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 2 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 2 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            2
          </Box>
        </Box>

        <Box sx={{ width: '1px', height: '18px', bgcolor: '#E2E8F0' }} />

        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(3)}
          aria-label="Page 3: How Hirerkey Works (Feature Flows)"
          title="How Hirerkey Works (Key 3)"
          sx={{
            appearance: 'none',
            border: activePage === 3 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 3 ? '#FFFFFF' : 'transparent',
            color: activePage === 3 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 3 ? 700 : 600,
            boxShadow: activePage === 3 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 3 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>③</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>How It Works</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              fontSize: '9px',
              fontWeight: 800,
              px: '6px',
              py: '1.5px',
              borderRadius: '9999px',
              bgcolor: 'rgba(219, 39, 119, 0.12)',
              color: '#DB2777',
              border: '1px solid rgba(219, 39, 119, 0.28)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            New
          </Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 3 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 3 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 3 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            3
          </Box>
        </Box>

        <Box sx={{ width: '1px', height: '18px', bgcolor: '#E2E8F0' }} />

        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(4)}
          aria-label="Page 4: The Connected HR Ecosystem"
          title="The Connected HR Ecosystem (Key 4)"
          sx={{
            appearance: 'none',
            border: activePage === 4 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 4 ? '#FFFFFF' : 'transparent',
            color: activePage === 4 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 4 ? 700 : 600,
            boxShadow: activePage === 4 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 4 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>④</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Ecosystem</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              fontSize: '9px',
              fontWeight: 800,
              px: '6px',
              py: '1.5px',
              borderRadius: '9999px',
              bgcolor: 'rgba(124, 58, 237, 0.12)',
              color: '#7C3AED',
              border: '1px solid rgba(124, 58, 237, 0.28)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Live
          </Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 4 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 4 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 4 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            4
          </Box>
        </Box>

        <Box sx={{ width: '1px', height: '18px', bgcolor: '#E2E8F0' }} />

        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(5)}
          aria-label="Page 5: How Hirerkey Works (Feature Flows)"
          title="How Hirerkey Works (Key 5)"
          sx={{
            appearance: 'none',
            border: activePage === 5 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 5 ? '#FFFFFF' : 'transparent',
            color: activePage === 5 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 5 ? 700 : 600,
            boxShadow: activePage === 5 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 5 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>⑤</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>How It Works</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              fontSize: '9px',
              fontWeight: 800,
              px: '6px',
              py: '1.5px',
              borderRadius: '9999px',
              bgcolor: 'rgba(219, 39, 119, 0.12)',
              color: '#DB2777',
              border: '1px solid rgba(219, 39, 119, 0.28)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            New
          </Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 5 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 5 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 5 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            5
          </Box>
        </Box>

        <Box
          component="button"
          type="button"
          onClick={() => setActivePage(6)}
          aria-label="Page 6: The Living Hirerkey Form"
          title="The Living Hirerkey Form (Key 6)"
          sx={{
            appearance: 'none',
            border: activePage === 6 ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent',
            bgcolor: activePage === 6 ? '#FFFFFF' : 'transparent',
            color: activePage === 6 ? '#7C3AED' : '#64748B',
            fontWeight: activePage === 6 ? 700 : 600,
            boxShadow: activePage === 6 ? '0 4px 14px -2px rgba(124, 58, 237, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            px: { xs: 1.5, sm: 1.75 },
            py: 0.85,
            borderRadius: '9999px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: { xs: 11.5, sm: 12.5 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
            '&:hover': {
              color: '#0F172A',
              bgcolor: activePage === 6 ? '#FFFFFF' : 'rgba(241, 245, 249, 0.8)',
            },
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, fontWeight: 700 }}>⑥</span>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Brand</Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              fontSize: '9px',
              fontWeight: 800,
              px: '6px',
              py: '1.5px',
              borderRadius: '9999px',
              bgcolor: 'rgba(124, 58, 237, 0.12)',
              color: '#7C3AED',
              border: '1px solid rgba(124, 58, 237, 0.28)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Living
          </Box>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              bgcolor: activePage === 6 ? '#F5F3FF' : '#F1F5F9',
              color: activePage === 6 ? '#8B5CF6' : '#94A3B8',
              border: activePage === 6 ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            }}
          >
            6
          </Box>
        </Box>

        

        

        
      </Box>

      {/* IT / HR Help Modal */}
      <Modal open={helpModalOpen} onClose={() => setHelpModalOpen(false)}>
        <ModalDialog
          sx={{
            bgcolor: '#120D24',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            color: '#FFFFFF',
            textAlign: 'left',
            p: 4,
            maxWidth: 420,
          }}
        >
          <ModalClose />
          <Typography level="title-lg" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
            Can't access your corporate account?
          </Typography>
          <Typography level="body-sm" sx={{ color: '#CBD5E1', mb: 2 }}>
            Hirerkey enterprise accounts are managed by your organization's IT and HR administrators.
          </Typography>
          <Button
            onClick={() => setHelpModalOpen(false)}
            sx={{
              height: 48,
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
              fontWeight: 700,
              mt: 2,
            }}
          >
            Understood
          </Button>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default LoginView;
