# hirerkey™ HyIQ™ Form AI Design System & Placement Blueprint

## 1. Executive Summary & Diagnostic Audit

An in-depth code-level and architectural audit was conducted across the entire **hirerkey™** desktop and employee application bundle (`https://dashboard.hirerkey.com/menu/dashboard`). 

Across **42 identified forms and modals**, there are currently **26 disparate AI invocations** using fragmented styling, conflicting layout wrappers, and unpredictable placement.

### 1.1 Root Causes of Why Current AI Buttons "Look Forced"

| Flaw | Architectural Manifestation in Current Code | Why It Looks Forced / Broken |
| :--- | :--- | :--- |
| **Injected Full-Width Wrapper** | Both `tr` (Prompt Modal) and `on` (Doc Modal) inject `<Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>`. | When embedded in a horizontal header or inline container, this wrapper forces line breaks, expands containers, and pushes adjacent elements off-screen. |
| **Crammed inside Typography Decorators** | In **KJR** (`kjr`) and **KPO** (`kpo`), `<tr />` is placed inside `Typography.endDecorator`: `<Typography endDecorator={<tr .../>} level="title-lg" sx={{ width: "95%" }}>`. | A full-width block flex container is crammed into an inline text decorator, causing distorted text headers and misaligned margins. |
| **Arbitrary Mid-Form Insertion** | In **Assessments**, **Exit Interviews**, and **Checklists**, `<tr />` is inserted as a standalone element *between* the Department dropdown and the Title input. | The user perceives an accidental UI glitch or a floating banner dissecting two related input fields. |
| **Inconsistent Form-Top "Bar" vs. "Button"** | **Tickets** and **Ticket Categories** use `variant="bar"` (a 64px tall search bar with separator line and arrow), whereas other forms use a 32px purple gradient button or raw text links. | Zero predictability: users never know whether AI is an overarching wizard or an inline prompt button. |
| **Ad-Hoc Inline Margin Overrides** | In **Appraisal Justifications** and **Broadcast Announcements**, developers wrote manual inline styles: `style={{ marginBottom: 1, marginRight: .5 }}`. | Breaks responsive scaling, shifts baseline text alignment, and creates visual friction. |
| **Fragmented Naming & Copy** | 10+ different labels: *"Fill With AI"*, *"Fill with AI"*, *"Fill With DOC"*, *"Fill from passport"*, *"Fill from visa"*, *"AI Assist"*, *"AI Auto-Fill"*, *"Draft with AI"*, *"Regenerate PDP"*, *"Describe it and let AI fill this in"*. | Weakens the **HyIQ** product brand and confuses users on whether the action will generate, extract, or refine data. |

---

## 2. The 4 Hirerkey Form Archetypes & Placement Rules

To ensure AI feels natural and intentional on **every** form, all 42 forms in hirerkey™ are mapped to **4 distinct UI Archetypes**, each with its own non-negotiable placement rule:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           hirerkey™ Form Archetypes                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
     ┌──────────────────┬────────────────┴─────────────────┬──────────────────┐
     ▼                  ▼                                  ▼                  ▼
┌──────────────┐ ┌──────────────┐                 ┌────────────────┐ ┌────────────────┐
│ Archetype A  │ │ Archetype B  │                 │  Archetype C   │ │  Archetype D   │
│ Generative   │ │ Document-    │                 │  Field-Level   │ │  Multi-Step    │
│ Blank Canvas │ │ Driven Data  │                 │  Refinement    │ │  Configurator  │
│ (Modal Head) │ │ (Card Head)  │                 │  (Input Adorn) │ │  (Hero Canvas) │
└──────────────┘ └──────────────┘                 └────────────────┘ └────────────────┘
```

### Archetype A: Generative Blank-Canvas Forms (Modal / Drawer Header)
* **Context**: Forms where the user creates a new record from scratch (e.g., KJR, KPO, Pulse Survey, Orientation, Department Tour, Checklist, Assessment, Ticket Category).
* **Placement Rule**: **Right-aligned inside the Modal / Drawer Header row**, horizontally aligned with the Title and Close button.
* **Standard Button Text**: `Draft with HyIQ`
* **Visual Hierarchy**: Secondary pill button (subtle sparkle icon + semi-transparent lavender tint), ensuring it does not compete with the primary form submission button (*Save / Create*).
* **Code Placement Standard**:
  ```tsx
  <ModalDialog>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography level="title-lg" fontWeight={600} color="primary.500">
        Create KJR
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HyIqHeaderAction 
          label="Draft with HyIQ" 
          onClick={handleOpenAiDraft} 
        />
        <ModalClose sx={{ position: 'static' }} />
      </Box>
    </Box>
    ...
  </ModalDialog>
  ```

---

### Archetype B: Document-Driven Extraction Forms & Sections
* **Context**: Employee onboarding, profile tabs, and compliance cards (e.g., Contact Info, Passport, Visa, Identity & Compliance, Work History, Assets, Compensation, Exit Details).
* **Placement Rule**: **Inside the Section Card Header**, on the right side next to the section title, separated from standard manual actions (*Edit / Save*).
* **Standard Button Text**: `Extract from Document` (or `Extract from Passport` / `Extract from Visa` for single-doc fields).
* **Visual Hierarchy**: Outlined/Soft badge with an upload document icon + sparkle, visually signaling that document ingestion will follow.
* **Confidence & Review**: Upon extraction, highlight populated fields with a temporary subtle glow (`#F0FDFA`) and a "Review fields before saving" alert.

---

### Archetype C: Field-Level Polish & Refinement (Textareas & Inputs)
* **Context**: Long-form feedback, rating justifications, appraisal reviews, broadcast messages, and ticket descriptions.
* **Placement Rule**: **Directly inside the Field Label Row** (top-right above the `<Textarea />`), inline with the character count or helper text.
* **Standard Button Text**: `Refine with HyIQ` (or icon-only sparkle button with tooltip `Refine with HyIQ`).
* **Visual Hierarchy**: Compact inline trigger (12px font, 24px height), maintaining exact baseline alignment with the form label.
* **Code Placement Standard**:
  ```tsx
  <FormControl required>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
      <FormLabel sx={{ fontWeight: 600, fontSize: '13px', m: 0 }}>
        Rationale for Rating <span style={{ color: 'red' }}>*</span>
      </FormLabel>
      <HyIqFieldAction 
        label="Refine with HyIQ" 
        onClick={handleRefineFeedback} 
        disabled={!content.trim()} 
      />
    </Box>
    <Textarea minRows={3} maxRows={6} value={content} onChange={e => setContent(e.target.value)} />
  </FormControl>
  ```

---

### Archetype D: Multi-Step & Complex Configurator Forms
* **Context**: Annual Appraisal Template Configurator, Helpdesk Ticket Submission, Pre-boarding Flow Builder.
* **Placement Rule**: **Top-of-Canvas Collapsible Intent Bar**. When the form is opened, a sleek, premium banner invites the user to auto-generate the structure. Once generated or manually edited, it collapses into a persistent header pill button.
* **Standard Button Text**: `Describe your goal and let HyIQ configure this`
* **Visual Hierarchy**: Full-width bordered card with soft radial gradient (`rgba(124, 58, 237, 0.04)` to `#FFFFFF`), clear suggestion chips, and an expandable prompt bar.

---

## 3. Comprehensive Form-by-Form Placement & Design Matrix

Below is the complete architectural mapping for all forms across the Hirerkey platform:

| # | Module & Form Name | Archetype | Current Placement & Flaw | Recommended Placement | Standard HyIQ Copy | Icon & Tone |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **1** | **KJR Creation Modal** | A | Crammed in `Typography.endDecorator` with 95% width | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **2** | **KPO Creation Modal** | A | Crammed in `Typography.endDecorator` with 95% width | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **3** | **Assessment Form** | A | Standalone div between Dept dropdown & Name input | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **4** | **Pulse Survey Form** | A | Floats inside scroll body above first input | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **5** | **Exit Interview Form** | A | Dissecting Dept dropdown & Survey Name | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **6** | **Task Checklist Form** | A | Dissecting Dept dropdown & Designation dropdown | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **7** | **Orientation Template** | A | Inside flex header without standardized gap | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **8** | **Department Tour** | A | Inside flex header without standardized gap | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **9** | **Employee Profile (Main)** | B | Hardcoded `width="200px"`, label "Fill With DOC" | Modal Header right action bar | `Extract from Document` | Doc Upload (`#2563EB`) |
| **10** | **Contact Information Card** | B | Placed in card header beside Edit button | Card Header (Secondary action) | `Extract from Document` | Doc Upload (`#2563EB`) |
| **11** | **Passport Details Card** | B | Custom label "Fill from passport" | Card Header (Secondary action) | `Extract from Passport` | Doc Upload (`#2563EB`) |
| **12** | **Visa Details Card** | B | Custom label "Fill from visa" | Card Header (Secondary action) | `Extract from Visa` | Doc Upload (`#2563EB`) |
| **13** | **Identity & Compliance Card**| B | Custom label "Fill With AI" | Card Header (Secondary action) | `Extract from ID/Proof` | Doc Upload (`#2563EB`) |
| **14** | **Work History Card** | B | Inconsistent spacing next to Save/Edit | Card Header (Secondary action) | `Extract from Resume/CV`| Doc Upload (`#2563EB`) |
| **15** | **Assets & Handover Card** | B | Inconsistent spacing next to Save/Edit | Card Header (Secondary action) | `Extract from Handover` | Doc Upload (`#2563EB`) |
| **16** | **Compensation Card** | B | Inconsistent spacing next to Save/Edit | Card Header (Secondary action) | `Extract from Offer/Slip`| Doc Upload (`#2563EB`) |
| **17** | **Exit Details Card** | B | Inconsistent spacing next to Save/Edit | Card Header (Secondary action) | `Extract from Clearance`| Doc Upload (`#2563EB`) |
| **18** | **Appraisal Rating Justification** | C | Ad-hoc inline margin `{ marginBottom: 1, marginRight: .5 }` | Form Label Row (Top-Right) | `Refine with HyIQ` | Wand/Sparkle (`#7C3AED`) |
| **19** | **Appraisal Comment Field** | C | Ad-hoc inline margin `{ marginBottom: 1, marginRight: .5 }` | Form Label Row (Top-Right) | `Refine with HyIQ` | Wand/Sparkle (`#7C3AED`) |
| **20** | **Broadcast Announcement** | C | Inserted between Title and Message input | Form Label Row of Message input | `Refine with HyIQ` | Wand/Sparkle (`#7C3AED`) |
| **21** | **Helpdesk Ticket Description**| C | Was giant bar above form; displaced category | Form Label Row of Description input | `Refine with HyIQ` | Wand/Sparkle (`#7C3AED`) |
| **22** | **Helpdesk Ticket Category** | A | Used full-width bar displaced above Name input | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **23** | **PDP (Development Plan)** | A | Label "Regenerate PDP" in card row | Card Header right action bar | `Draft with HyIQ` | Refresh Sparkle (`#7C3AED`) |
| **24** | **Appraisal Configurator** | D | Full width input bar at top of configurator | Sticky Top Intent Bar (Collapsible) | `Configure with HyIQ` | Sparkle (`#7C3AED`) |
| **25** | **Subordinate Extension Form**| A | No AI option currently exists | Modal Header right action bar | `Draft with HyIQ` | Sparkle (`#7C3AED`) |
| **26** | **Pre-boarding Configurator** | D | Currently static banners | Form Top Intent Bar | `Generate Onboarding Flow`| Sparkle (`#7C3AED`) |

---

## 4. UI/UX Design System Specification

### 4.1 Color Tokens & Gradients

```css
:root {
  /* HyIQ Signature Brand Palette */
  --hyiq-brand: #7C3AED;               /* Primary purple */
  --hyiq-brand-hover: #6D28D9;
  --hyiq-brand-light: #F5F3FF;         /* Soft purple background */
  --hyiq-brand-border: #DDD6FE;        /* Border color */
  --hyiq-brand-glow: rgba(124, 58, 237, 0.12);

  /* Document Intelligence Accent */
  --hyiq-doc-brand: #2563EB;           /* Doc Blue */
  --hyiq-doc-light: #EFF6FF;
  --hyiq-doc-border: #BFDBFE;

  /* Button Dimensions */
  --hyiq-btn-height-sm: 28px;
  --hyiq-btn-height-md: 32px;
  --hyiq-btn-radius: 8px;
  --hyiq-btn-font-size: 12px;
  --hyiq-btn-font-weight: 500;
}
```

### 4.2 Anatomy of the Standardized HyIQ Button

1. **Sparkle / Action Icon**: 14px size, positioned on the left (`margin-right: 6px`), with a subtle 15-degree rotate on hover.
2. **Action Label**: High-clarity microcopy (`Draft with HyIQ`, `Extract from Document`, `Refine with HyIQ`).
3. **Pill Surface**:
   - Multi-layered gradient, sub-pixel top light reflection, and ambient colored drop-shadow.
   - Distinctive from the standard solid primary "Save" buttons so it stands out immediately as an intelligent assistive accelerator.

### 4.3 The 4 Signature Premium Gradient Button Options (Hirerkey Primary Colors)

All 4 options strictly use Hirerkey's primary brand palette:
- Primary Purple / Violet: `#7C3AED` / `#6F42C1`
- Primary Indigo: `#6366F1` / `#4F46E5`
- Primary Cyan / Electric Accent: `#35B8FF` / `--brand`
- Primary Teal Accent: `#00BFB2` / `--btn-color`

---

#### Option 1: "The Royal Aura" (Vibrant Solid Deep Gradient) — *RECOMMENDED*
* **Visual Identity**: Bold, confident, high-contrast, glowing primary pill.
* **Surface**:
  ```css
  background: linear-gradient(135deg, #7C3AED 0%, #6366F1 55%, #4F46E5 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 4px 14px -2px rgba(124, 58, 237, 0.42), 
              0 1px 3px rgba(0, 0, 0, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.4);
  ```
* **Hover Interaction**:
  ```css
  transform: translateY(-1.5px);
  box-shadow: 0 6px 20px -2px rgba(124, 58, 237, 0.6), 
              0 2px 6px rgba(0, 0, 0, 0.15),
              inset 0 1px 1.5px rgba(255, 255, 255, 0.55);
  background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 55%, #4338CA 100%);
  ```
* **Why it stands out**: Instantly catches the user's eye against white and gray modal backgrounds without looking gaudy. Projects executive-tier polish.

---

#### Option 2: "The Electric Nebula" (Violet-to-Cyan Fusion + Outer Ambient Glow)
* **Visual Identity**: Modern, futuristic, high-tech AI vibe.
* **Surface**:
  ```css
  position: relative;
  background: linear-gradient(135deg, #6F42C1 0%, #7C3AED 50%, #2563EB 100%);
  color: #ffffff;
  border: 1px solid transparent;
  box-shadow: 0 0 18px -2px rgba(53, 184, 255, 0.4), 
              0 4px 14px rgba(111, 66, 193, 0.35),
              inset 0 1px 1px rgba(255, 255, 255, 0.35);
  ```
* **Perimeter Gradient**: Dual-ring gradient `#35B8FF` + `#7C3AED` + `#00BFB2` creating an iridescent border effect.
* **Why it stands out**: Blends Hirerkey's signature cyan brand accent (`#35B8FF`) with rich purple, giving the button an unmistakable luminescent aura.

---

#### Option 3: "Glass Luminescence" (Frosted Iridescent Glass)
* **Visual Identity**: Ultra-clean, modern luxury, Apple / Linear-inspired.
* **Surface**:
  ```css
  background: linear-gradient(135deg, rgba(245, 243, 255, 0.92) 0%, rgba(238, 242, 255, 0.85) 50%, rgba(240, 253, 250, 0.9) 100%);
  backdrop-filter: blur(10px);
  color: #5B21B6;
  border: 1.5px solid #DDD6FE;
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.14), 
              inset 0 1px 0 rgba(255, 255, 255, 0.95);
  ```
* **Why it stands out**: Highly sophisticated light surface that reflects underlying colors with crisp, readable typography in deep purple (`#5B21B6`).

---

#### Option 4: "The Prism Shimmer" (Deep Royal Velvet with Light Sweep Beam)
* **Visual Identity**: High-impact, enterprise-grade, Raycast-style shimmering pill.
* **Surface**:
  ```css
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #4C1D95 0%, #312E81 100%);
  color: #ffffff;
  border: 1px solid rgba(167, 139, 250, 0.4);
  box-shadow: 0 4px 16px -2px rgba(76, 29, 149, 0.5), 
              inset 0 1px 1px rgba(255, 255, 255, 0.3);
  ```
* **Micro-Interaction**: A subtle 45-degree angled white light beam sweeps across the button face on a 3.6-second loop, creating an irresistible cue for AI acceleration.


---

## 5. Architectural Component Code (Ready for Implementation)

Below are the 3 clean, drop-in components designed to replace `tr`, `on`, and `Dm` across the Hirerkey frontend:

### 5.1 `HyIqButton.tsx` (Atomic Component)
```tsx
import React from 'react';
import { Button, CircularProgress } from '@mui/joy';
import { Sparkles, FileText, Wand2 } from 'lucide-react';

export type HyIqVariant = 'header' | 'field' | 'card' | 'hero';

interface HyIqButtonProps {
  label: string;
  onClick: () => void;
  variant?: HyIqVariant;
  iconType?: 'sparkle' | 'document' | 'wand';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const HyIqButton: React.FC<HyIqButtonProps> = ({
  label,
  onClick,
  variant = 'header',
  iconType = 'sparkle',
  loading = false,
  disabled = false,
  className,
}) => {
  const renderIcon = () => {
    if (loading) {
      return <CircularProgress size="sm" thickness={3} sx={{ '--CircularProgress-size': '14px' }} />;
    }
    switch (iconType) {
      case 'document':
        return <FileText size={13} style={{ color: 'var(--hyiq-doc-brand, #2563EB)' }} />;
      case 'wand':
        return <Wand2 size={13} style={{ color: 'var(--hyiq-brand, #7C3AED)' }} />;
      default:
        return <Sparkles size={13} style={{ color: 'var(--hyiq-brand, #7C3AED)' }} />;
    }
  };

  if (variant === 'field') {
    return (
      <Button
        size="sm"
        variant="plain"
        disabled={disabled || loading}
        onClick={onClick}
        startDecorator={renderIcon()}
        className={className}
        sx={{
          py: '2px',
          px: '8px',
          minHeight: '24px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--hyiq-brand, #7C3AED)',
          borderRadius: '6px',
          backgroundColor: 'transparent',
          transition: 'all 150ms ease',
          '&:hover': {
            backgroundColor: 'var(--hyiq-brand-light, #F5F3FF)',
          },
        }}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outlined"
      disabled={disabled || loading}
      onClick={onClick}
      startDecorator={renderIcon()}
      className={className}
      sx={{
        height: '32px',
        px: '12px',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '8px',
        borderColor: iconType === 'document' ? 'var(--hyiq-doc-border, #BFDBFE)' : 'var(--hyiq-brand-border, #DDD6FE)',
        backgroundColor: iconType === 'document' ? 'var(--hyiq-doc-light, #EFF6FF)' : 'linear-gradient(135deg, #FAF5FF 0%, #F0FDFA 100%)',
        color: iconType === 'document' ? 'var(--hyiq-doc-brand, #2563EB)' : 'var(--hyiq-brand, #7C3AED)',
        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
        transition: 'all 160ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover:not(:disabled)': {
          transform: 'translateY(-1px)',
          borderColor: iconType === 'document' ? '#93C5FD' : '#C4B5FD',
          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.12)',
          backgroundColor: iconType === 'document' ? '#DBEAFE' : '#EDE9FE',
        },
        '&:active:not(:disabled)': {
          transform: 'scale(0.98)',
        },
      }}
    >
      {loading ? 'Processing...' : label}
    </Button>
  );
};
```

---

### 5.2 `HyIqModalHeader.tsx` (Standardized Modal Header)
```tsx
import React from 'react';
import { Box, Typography, ModalClose } from '@mui/joy';
import { HyIqButton } from './HyIqButton';

interface HyIqModalHeaderProps {
  title: string;
  aiLabel?: string;
  onAiAction?: () => void;
  aiLoading?: boolean;
  onClose?: () => void;
}

export const HyIqModalHeader: React.FC<HyIqModalHeaderProps> = ({
  title,
  aiLabel = 'Draft with HyIQ',
  onAiAction,
  aiLoading = false,
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
        mb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography level="title-lg" fontWeight={700} sx={{ color: 'primary.500', textTransform: 'capitalize' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        {onAiAction && (
          <HyIqButton
            label={aiLabel}
            onClick={onAiAction}
            loading={aiLoading}
            variant="header"
            iconType="sparkle"
          />
        )}
        {onClose && <ModalClose onClick={onClose} sx={{ position: 'static' }} />}
      </Box>
    </Box>
  );
};
```

---

### 5.3 `HyIqFieldHeader.tsx` (Field Label + Refine Trigger)
```tsx
import React from 'react';
import { Box, FormLabel } from '@mui/joy';
import { HyIqButton } from './HyIqButton';

interface HyIqFieldHeaderProps {
  label: string;
  required?: boolean;
  onRefine: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const HyIqFieldHeader: React.FC<HyIqFieldHeaderProps> = ({
  label,
  required = false,
  onRefine,
  disabled = false,
  loading = false,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
      <FormLabel sx={{ fontWeight: 600, fontSize: '13px', color: '#1E293B', m: 0 }}>
        {label}
        {required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
      </FormLabel>

      <HyIqButton
        label="Refine with HyIQ"
        onClick={onRefine}
        variant="field"
        iconType="wand"
        disabled={disabled}
        loading={loading}
      />
    </Box>
  );
};
```

---

## 6. Implementation Rollout Plan

1. **Step 1: Replace Outer Wrappers in `tr` and `on`**
   - Strip the hardcoded `<Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>` from `tr` and `on`.
   - Make the trigger button take natural width (`width: fit-content`), allowing parent flex layouts to govern alignment cleanly.

2. **Step 2: Refactor Modal Headers (Archetype A)**
   - Remove `<tr />` from `Typography.endDecorator` in `KjrForm` and `KpoForm`.
   - Move `<tr />` to the header row in `AssessmentForm`, `PulseSurveyForm`, `ExitInterviewForm`, and `ChecklistForm`.

3. **Step 3: Standardize Document Extraction Actions (Archetype B)**
   - Unify button copy in `EmployeeView`, `ContactInfo`, `LegalInfo`, `WorkHistory`, `Assets`, and `Compensation` to `Extract from Document` / `Extract from [Doc]`.
   - Place consistently on the right of each section card header.

4. **Step 4: Refactor Field-Level Polish (Archetype C)**
   - Replace ad-hoc inline styles `{ marginBottom: 1, marginRight: .5 }` in Appraisal Feedback and Broadcast with `<HyIqFieldHeader />`.
