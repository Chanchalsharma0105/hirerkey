# Hirerkey™ Offboarding Module — Complete Flow & Screen Visual Guide

> **Module**: Employees → Off-boarding  
> **Visual Prototype**: [`offboarding_flow_visual_guide.html`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/offboarding_flow_visual_guide.html)  
> **Interactive Sandbox**: [`offboarding_preview.html`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/offboarding_preview.html)  
> **Design Standard**: Hirerkey Enterprise Design System (100% Inter font, JetBrains Mono, `#7C3AED` Primary Purple, `#001741` Navy Shell, `#EEEBFF` Lavender Headers, `#EEE9FD` Tab Container)  
> **Regulatory Parity**: UAE Labor Law (Federal Decree-Law No. 33 of 2021) Articles 43, 51, 53 & 144

---

## Table of Contents

1. [Executive Summary & Core Business Lifecycle](#1-executive-summary--core-business-lifecycle)
2. [4-Scenario Parameter Comparison Matrix](#2-4-scenario-parameter-comparison-matrix)
3. [Screen 1: Departures List (Visual UI & Controls)](#3-screen-1-departures-list-visual-ui--controls)
4. [Start Offboarding Modal (Visual UI & Dynamic Alert States)](#4-start-offboarding-modal-visual-ui--dynamic-alert-states)
5. [Screen 2: Leaver Case Workspace (Profile Card & 5 Lifecycle Tabs)](#5-screen-2-leaver-case-workspace-profile-card--5-lifecycle-tabs)
6. [Detailed End-to-End Walkthrough: Scenario 1 — Voluntary Resignation](#6-detailed-end-to-end-walkthrough-scenario-1--voluntary-resignation)
7. [Detailed End-to-End Walkthrough: Scenario 2 — Involuntary Termination](#7-detailed-end-to-end-walkthrough-scenario-2--involuntary-termination)
8. [Detailed End-to-End Walkthrough: Scenario 3 — Retirement](#8-detailed-end-to-end-walkthrough-scenario-3--retirement)
9. [Detailed End-to-End Walkthrough: Scenario 4 — Death in Service](#9-detailed-end-to-end-walkthrough-scenario-4--death-in-service)
10. [UAE Labor Law Compliance & Legal Rules Engine](#10-uae-labor-law-compliance--legal-rules-engine)

---

## 1. Executive Summary & Core Business Lifecycle

The **Hirerkey Offboarding Module** manages the departure of personnel across all separation categories. It provides operational continuity, asset security, four-department clearance governance, and statutory financial reconciliation.

### The 6-Stage Master Operational Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             HIRERKEY OFFBOARDING ENGINE PIPELINE                                  │
├───────────────┬───────────────┬───────────────┬───────────────┬──────────────────┬───────────────┤
│    STAGE 1    │    STAGE 2    │    STAGE 3    │    STAGE 4    │     STAGE 5      │    STAGE 6    │
│  Real-World   │  Screen 1 &   │  Notice & Op  │ 4-Department  │  Exit Interview  │ Case Closed & │
│ Departure     │  Start Modal  │   Handover    │  Clearances   │  & Final Settle  │ Inactive Exit │
│    Event      │  Initiation   │   Tracking    │  (IT/Adm/Fin) │   (AED Gratuity) │    Archive    │
└───────┬───────┴───────┬───────┴───────┬───────┴───────┬───────┴─────────┬────────┴───────┬───────┘
        │               │               │               │                 │                │
        ▼               ▼               ▼               ▼                 ▼                ▼
   Email Notice   HR Clicks       Operational     IT Access cut,   Survey feedback  Stage 3: Closed
   or Company     "+ Start        handover,       Key/Card return, or waiver, Net   Profile moved to
   Action / Death Offboarding"    Successor cover Dues reconciled  Payable released Employees › Exit
```

1. **Real-World Event / Email**: Employee submits resignation via email, or company issues termination, retirement occurs, or demise is reported.
2. **HR Initiates in Screen 1 (+ Start Offboarding Modal)**: HR selects employee, chooses departure reason, inspects dynamic alert notice, confirms LWD, assigns successor, and creates departure case.
3. **Notice Period & Operational Handover**: Tracks handover checklist (team structure, approvals, active system overrides, and physical keys/assets).
4. **4-Way Departmental Clearance**: Enforces mandatory sign-offs across **IT**, **Admin & Facilities**, **Finance**, and **Line Manager**.
5. **Exit Interview & Statutory Settlement**: Dispatches hospitality exit survey (or records compliance waiver) and audits UAE labor law statutory settlement (leave encashment, end-of-service gratuity, dues/recoveries, and certificates).
6. **Case Closed & Inactive Profile Archival**: HR closes case, locking audit records and permanently archiving the leaver to `Employees › Exit`.

---

## 2. 4-Scenario Parameter Comparison Matrix

| Operational Parameter | Scenario 1: Voluntary Resignation | Scenario 2: Involuntary Termination | Scenario 3: Retirement (Superannuation) | Scenario 4: Death in Service (Bereavement) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Trigger** | Employee email with 30-day notice | Company termination order / misconduct | Employee reaches retirement age (60+) | Demise notification (police / hospital) |
| **Operational Notice** | Standard contractual notice (30 days) | **Zero Notice** (Immediate termination) | Planned transition notice (30 days) | **Zero Notice** (Immediate cessation) |
| **LWD Field in Modal** | **Editable** (Default +30 calendar days) | **Locked to Today & Disabled** | **Editable** (Planned retirement date) | **Locked to Date of Demise & Disabled** |
| **Modal Dynamic Alert** | <span style="color:#7C3AED; font-weight:bold;">Purple Primary</span>: Starts notice & handover | <span style="color:#DC2626; font-weight:bold;">Red Danger</span>: Immediate access revocation | <span style="color:#7C3AED; font-weight:bold;">Purple Primary</span>: Planned notice & Gratuity | <span style="color:#DC2626; font-weight:bold;">Red Danger</span>: Sensitive bereavement protocol |
| **Initial Case Stage** | `Stage 0: Notice initiated` | `Stage 2: Exited · clearing` | `Stage 0: Notice initiated` | `Stage 2: Exited · clearing` |
| **Initial Stage Tone** | Amber Warning (`#FEF3C7` / `#92400E`) | Red Danger (`#FEE2E2` / `#DC2626`) | Amber Warning (`#FEF3C7` / `#92400E`) | Red Danger (`#FEE2E2` / `#DC2626`) |
| **Acknowledge Notice Btn**| **Visible** on Screen 2 (moves to Stage 1)| **Hidden** (Notice period does not exist) | **Visible** on Screen 2 (moves to Stage 1) | **Hidden** (Notice period does not exist) |
| **Handover Focus** | Successor shadowing, safe keys, SOPs | Account lockout, immediate seat requisition | Mentorship to junior lead, floor keys | Line manager assumes direct seat control |
| **IT Access Cutoff** | Scheduled for Last Working Day at 18:00 | **Immediate Cutoff (Day 1)** | Scheduled for Last Working Day at 18:00 | **Immediate Cutoff & Mailbox Archived** |
| **Exit Interview** | Dispatched to personal email (12 questions)| **Skipped (Waived)** in system | **Completed** (5-star legacy tribute) | **Permanently Waived** (Bereavement) |
| **Final Settlement (AED)**| Leave encashment + deduction settlement | Leave encashment + notice pay in lieu | Full UAE End-of-Service Gratuity (EOSG) | Full Gratuity + Death Insurance to Heirs |
| **Settlement Recipient** | Departing employee bank account | Departing employee bank account | Retiring employee bank account | **Verified Legal Heirs / Court Estate** |
| **Relieving Certificates**| Standard Relieving & Experience letter | Termination notice & Relieving letter | Certificate of Service & Honor Plaque | Official Letter of Condolence & Dues |

---

## 3. Screen 1: Departures List (Visual UI & Controls)

When HR accesses `Employees › Off-boarding`, they are presented with the central Departures Workspace.

```
========================================================================================================================
TOPBAR:    [ ☰ ]   [ 🔍 Search employee, seat, department... (⌘K) ]   Home › Employees › Off-boarding      [ ✨ HyIQ ] [ Profile ]
========================================================================================================================

SUBHEADER BAR (Single Clean White Card):
+----------------------------------------------------------------------------------------------------------------------+
| [ ⧩ Filter (0) ▾ ]  [ ⇅ Sort: Last working day (Earliest) ▾ ]  [ ↻ Refresh ]           [ 📥 Export ]  [ + Start offboarding ] |
+----------------------------------------------------------------------------------------------------------------------+

TABLE META BAR:
5 records   [ Status: Serving notice ✕ ]  [ Dept: Front Office ✕ ]  [ Clear all ]

DEPARTURES TABLE (Sticky #EEEBFF Signature Header):
+----------------------------------------------------------------------------------------------------------------------+
| S.No | Employee           | Position & Seat           | Department   | Reason       | Last Working Day | Stage         | ⋯   |
+----------------------------------------------------------------------------------------------------------------------+
| 1    | [SK] Sara Khan     | Front Desk Manager        | Front Office | Resigned     | 14 Oct 2026      | ● Serving     | ••• |
|      |      FDM-01        | → Omar Haddad             |              | (voluntary)  | In 29 days (neu) |   notice      |     |
+----------------------------------------------------------------------------------------------------------------------+
| 2    | [RM] Rahul Mehta   | Sous Chef                 | Kitchen      | Resigned     | 02 Oct 2026      | ● Notice      | ••• |
|      |      SC-02         | ⚠ No successor            |              | (voluntary)  | In 17 days (neu) |   initiated   |     |
+----------------------------------------------------------------------------------------------------------------------+
| 3    | [AN] Aisha Noor    | Guest Relations Executive | Front Office | Terminated   | 12 Sep 2026      | ● Exited ·    | ••• |
|      |      GR-04         | ⚠ No successor (Vacant)   |              |              | Left 3 days (neu)|   clearing    |     |
+----------------------------------------------------------------------------------------------------------------------+
| 4    | [LJ] Leena Joseph  | Housekeeping Supervisor   | Housekeeping | Retirement   | 15 Sep 2026      | ● Serving     | ••• |
|      |      HKS-03        | → Meera Das               |              |              | Today (bad)      |   notice      |     |
+----------------------------------------------------------------------------------------------------------------------+
| 5    | [MD] Mark Dsouza   | Security Officer          | Security     | Retirement   | 31 Aug 2026      | ● Closed      | ••• |
|      |      SO-07         | → Ravi Kumar              |              |              | Left 15 days ago |   (archived)  |     |
+----------------------------------------------------------------------------------------------------------------------+
PAGINATION:  Rows per page: [10 ▾]  |  Showing 1–5 of 5  |  ‹ Previous  [1]  Next ›
```

### Visual Specifications of Screen 1 Elements

1. **SubHeader Card**: White container (`border: 1px solid #E5E7EF`, `border-radius: 8px`, `padding: 10px 16px`).
   - **Left Cluster**: `Filter` button with staged dropdown badge, `Sort` dropdown button, and `Refresh` button with 600ms spin.
   - **Right Cluster**: `Export` button (.xlsx) and `+ Start offboarding` button (`background: #7C3AED`, `#FFFFFF` text, `border-radius: 6px`).
2. **Table Meta Bar**: Rendered outside and directly above the table header. Shows `5 records` (`font-weight: 600`, color `#334155`), active filter pills (`#EDE9FE` background, `#7C3AED` text), and red `Clear all`.
3. **Departures Table**:
   - Sticky header background `#EEEBFF`, text `#7C3AED` (`font-size: 11.5px`, `font-weight: 600`).
   - Monospace seat codes (`FDM-01`, `SC-02`, `GR-04`) in `#F1F5F9` background chips with `#475569` text.
   - Urgency tone chips: `Today` (red bad chip `#FEE2E2` / `#DC2626`), `In 29 days` (neutral chip `#F1F5F9` / `#64748B`).
   - Stage status pills:
     * `Notice initiated` (Amber `#FEF3C7` / `#92400E`)
     * `Serving notice` (Purple `#EDE9FE` / `#7C3AED`)
     * `Exited · clearing` (Red `#FEE2E2` / `#DC2626`)
     * `Closed` (Green `#DCFCE7` / `#16A34A`)

---

## 4. Start Offboarding Modal (Visual UI & Dynamic Alert States)

Clicking the primary **`+ Start offboarding`** button opens the modal dialog.

```
+----------------------------------------------------------------------------------------------------+
| Start Offboarding                                                                              [✕] |
| Initiate employee exit flow, calculate notice periods, and assign vacancy handovers.                |
+----------------------------------------------------------------------------------------------------+
| Employee & Position *                                                                              |
| [ Sara Khan · Front Desk Manager (FDM-01)                                                       ▾] |
|                                                                                                    |
| Departure Reason *                                                                                 |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | (•) Resigned (voluntary)                         | | ( ) Retirement                            | |
| |     Notice received via email. Standard notice.  | |     Planned retirement & succession.      | |
| +--------------------------------------------------+ +-------------------------------------------+ |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | ( ) Terminated                                   | | ( ) Death in service                      | |
| |     Immediate company termination.               | |     Bereavement protocol.                 | |
| +--------------------------------------------------+ +-------------------------------------------+ |
|                                                                                                    |
| DYNAMIC ALERT BOX (Changes instantly based on selected radio card):                                |
| +------------------------------------------------------------------------------------------------+ |
| | [ ℹ️ / 🚨 ] Dynamic Notification Message (See Matrix Below)                                     | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| Notice Given Date                                    Last Working Day (LWD)                        |
| [ 2026-09-14                                    📅 ] [ 2026-10-14                             📅 ] |
|                                                      (Auto-locked & disabled for immediate exits)  |
|                                                                                                    |
| Successor / Interim Cover                                                                          |
| [ Omar Haddad · Assistant Front Desk Manager                                                    ▾] |
+----------------------------------------------------------------------------------------------------+
|                                                                     [ Cancel ]  [ Submit & Start ] |
+----------------------------------------------------------------------------------------------------+
```

### The 4 Dynamic Alert Box Visual States

#### 1. Resigned (voluntary) Selected
```
+----------------------------------------------------------------------------------------------------+
| ℹ️  Resignation notice received via email. HR initiation starts the notice period and handover       |
|     tracking. Last working day defaults to 30 calendar days from notice date.                      |
+----------------------------------------------------------------------------------------------------+
Alert Tone: Primary Purple (#EDE9FE background, #DDD6FE border, #7C3AED text)
LWD State: Editable (Defaults to Notice Date + 30 days)
```

#### 2. Terminated Selected
```
+----------------------------------------------------------------------------------------------------+
| 🚨  Terminations take effect immediately. System access will be suspended today and position       |
|     marked vacant. Operational notice period is bypassed and case transitions straight to exit.    |
+----------------------------------------------------------------------------------------------------+
Alert Tone: Danger Red (#FEE2E2 background, #FCA5A5 border, #DC2626 text)
LWD State: LOCKED & DISABLED to Today (2026-09-12). Subtitle: "🔒 Disabled: Immediate exit date cannot be altered"
```

#### 3. Retirement Selected
```
+----------------------------------------------------------------------------------------------------+
| 🎖️  Retirement initiated. Planned notice period and succession handover initialized. UAE Labor      |
|     Law Gratuity & Pension documentation activated for 7+ years tenure.                            |
+----------------------------------------------------------------------------------------------------+
Alert Tone: Primary Purple (#EDE9FE background, #DDD6FE border, #7C3AED text)
LWD State: Editable (Defaults to planned superannuation date)
```

#### 4. Death in Service Selected
```
+----------------------------------------------------------------------------------------------------+
| 🕊️  Death in service takes effect immediately. System access is suspended, seat opened for         |
|     succession, and statutory final settlement workflow initialized for verified Next-of-Kin.      |
+----------------------------------------------------------------------------------------------------+
Alert Tone: Danger Red / Slate (#F1F5F9 background, #CBD5E1 border, #1E293B text)
LWD State: LOCKED & DISABLED to Date of Demise (2026-09-17)
```

---

## 5. Screen 2: Leaver Case Workspace (Profile Card & 5 Lifecycle Tabs)

When a case is opened, HR enters **Screen 2: Leaver Case Workspace**.

```
========================================================================================================================
[ ← Back to departures ] / Employees / Off-boarding / Sara Khan (FDM-01)
Sara Khan · Case Workspace
Front Desk Manager • Front Office • Crowne Plaza Dubai
                                               [ ✓ Acknowledge notice ]  [ Simulate last day ]  [ Close case ]
========================================================================================================================

PROFILE CARD:
+----------------------------------------------------------------------------------------------------------------------+
| [SK]  Sara Khan   [FDM-01]   ● Serving notice (Stage 1)                                              In 29 days      |
|       Front Desk Manager • Front Office • Manager: James Cole • Tenure: 5 yrs 6 mos                  LWD: 14 Oct 2026|
|       Reason: Resigned (voluntary)   |   Successor: Omar Haddad (Assigned Cover)                                     |
+----------------------------------------------------------------------------------------------------------------------+

5 OPERATIONAL LIFECYCLE TABS CONTAINER (#EEE9FD Background):
[ Overview & Timeline ]  [ Handover (3 pending) ]  [ Clearance (2/4 done) ]  [ Exit Interview ]  [ Final Settlement ]
```

### Tab 1: Overview & Timeline
- **Left Column**: Chronological 6-step departure tracker:
  1. *Resignation Email Received* (Green checkmark `✓`)
  2. *HR Initiates Offboarding* (Green checkmark `✓`)
  3. *Notice Period & Handover* (Active glowing purple `3` indicator with countdown)
  4. *Exit Clearance & Settlement Audit* (Pending scheduled step `4`)
  5. *System Access Termination* (Scheduled for Last Working Day at 18:00 `5`)
  6. *Case Closed & Archived* (Pending final sign-off `6`)
- **Right Column**:
  * *At a Glance*: Active credentials list, designated successor badge, leave balance snapshot (`12.5 Days`).
  * *Clearance Readiness*: Horizontal progress bar (`50% completed - 2 of 4 sign-offs`) with shortcut to Clearance tab.

### Tab 2: Handover & Succession
- Grouped list of responsibilities:
  * `Team & Structure`: Direct reports reassignment (3 front desk agents to Omar Haddad).
  * `Operations`: Pending leave approvals reassigned to successor.
  * `System Access`: Opera Cloud PMS Supervisor privileges transfer.
  * `Physical Assets`: Safe master keys and shift cash drawer keys deposit.
- Checkboxes update completion counters in real time.

### Tab 3: Clearance Checklist
- 4-way departmental sign-off grid:
  * **IT**: Laptop return (Dell Latitude 5440) & PMS admin revocation (Approver: Zaid Al-Harbi).
  * **Admin & Facilities**: Locker 214 clearance & ID badge deposit (Approver: Tariq Mansoor).
  * **Finance**: Corporate petty cash AED 1,200 audit & zero dues verification (Approver: Amina El-Sayed).
  * **Line Manager**: Operational handover & knowledge transfer sign-off (Approver: James Cole).
- Toggling sign-off button flips state from purple `"Sign off"` to green `"✓ Signed off"`.

### Tab 4: Exit Interview
- Dynamic states based on departure category:
  * `not_sent`: Button to dispatch 12-question hospitality exit survey.
  * `sent`: Status pill `"Sent · Pending Employee Submission"`, with actions to `"✓ Mark submitted manually"` or resend link.
  * `completed`: Displays 5-star rating, satisfaction index, and confidential feedback quotes.
  * `skipped`: Status pill `"Skipped (Waived)"` for involuntary terminations or bereavement.

### Tab 5: Statutory Final Settlement
- 4 Financial metric cards:
  * `Leave Balance`: Monospace days count (`12.5 Days`).
  * `Leave Encashment`: Amount in AED (`AED 4,200`).
  * `Recoveries / Dues`: Unreturned assets or deductions (`- AED 350`).
  * `Net Payable`: Highlighted purple card (`AED 3,850`).
- Settlement status selector (`Pending`, `In Progress · Payroll Routing`, `Paid & Reconciled`, `Waived`).
- Certificate generator checkbox: Experience & Relieving Letters.
- Primary Action button: **`Close Case & Move to Employees › Exit`**.

---

## 6. Detailed End-to-End Walkthrough: Scenario 1 — Voluntary Resignation

### Person: Sara Khan (`FDM-01`) · Front Desk Manager

```
[Email: 30-Day Notice] ──► [Screen 1: + Start Offboarding] ──► [Modal: Resigned (voluntary)]
                                                                          │
[Employees › Exit] ◄── [Stage 3: Close Case] ◄── [AED 3,850 Settlement] ◄─┴──► [Screen 2 Workspace]
                                                                                ├── Tab 1: Notice Countdown
                                                                                ├── Tab 2: Omar Haddad Handover
                                                                                ├── Tab 3: 4-Way Clearance
                                                                                └── Tab 4: Survey Dispatched
```

1. **Email Resignation Received**: Sara Khan sends her 30-day resignation notice on 14 Sep 2026. Proposed LWD: 14 Oct 2026.
2. **HR Initiates Offboarding**: HR clicks `+ Start offboarding` on Screen 1. Selects Sara Khan.
3. **Modal Selection**: HR selects `"Resigned (voluntary)"`. The purple alert appears:
   > *"Resignation notice received via email. HR initiation starts the notice period and handover tracking."*
   Notice date is set to `2026-09-14`, LWD defaults to `2026-10-14` (+30 days). Successor set to `Omar Haddad`.
4. **Case Creation**: HR clicks `"Submit & Start Notice"`. Sara Khan appears at the top of Screen 1 with `Stage 0: Notice initiated`.
5. **Notice Acknowledgment**: Opening the case, HR clicks `"✓ Acknowledge Notice Period"`. The case advances to `Stage 1: Serving notice` with purple badge, and the 29-day countdown begins.
6. **Handover & Clearance Execution**: Over the next 2 weeks:
   - Omar Haddad shadows Sara on Opera Cloud PMS supervisor functions.
   - Master shift keys deposited (Handover checked `✓`).
   - Finance verifies zero open cash advances (`✓ Signed off`).
   - Line Manager James Cole confirms knowledge transfer (`✓ Signed off`).
7. **Exit Survey**: HR sends the hospitality exit survey to Sara's personal email on 15 Sep. Sara completes it on 10 Oct.
8. **Statutory Settlement**: On 14 Oct (LWD):
   - 12.5 days accrued leave encashed = AED 4,200.
   - Deduction of AED 350 for replacement parking fob.
   - Net Payable = AED 3,850 routed to WPS payroll.
   - Experience & Relieving Certificates generated and emailed.
9. **Archival**: HR clicks `"Close Case & Move to Employees › Exit"`. Case moves to `Stage 3: Closed` (green). Sara is removed from active rosters and archived.


### Visual UI Screen Flow: Scenario 1 (Voluntary Resignation)

#### Screen 1: Departures List (Sara Khan Row Active)
```
+----------------------------------------------------------------------------------------------------------------------+
| Hirerkey™ HRMS › Employees › Off-boarding                                                              [ + Start ]   |
+----------------------------------------------------------------------------------------------------------------------+
| [ ⧩ Filter ] [ ⇅ Sort: LWD (Earliest) ▾ ] [ ↻ Refresh ]                                 [ 📥 Export ] [ + Start offboarding ]|
+----------------------------------------------------------------------------------------------------------------------+
| 5 records   [ Status: Serving notice ✕ ]  [ Dept: Front Office ✕ ]                                                   |
+----------------------------------------------------------------------------------------------------------------------+
| S.No | Employee           | Position & Seat           | Department   | Reason       | Last Working Day | Stage         | ... |
+------+--------------------+---------------------------+--------------+--------------+------------------+---------------+-----+
| 1    | [SK] Sara Khan     | Front Desk Manager        | Front Office | Resigned     | 14 Oct 2026      | ● Serving     | ••• |
|      |      FDM-01        | → Omar Haddad             |              | (voluntary)  | In 29 days (neu) |   notice      |     |
| 2    | [RM] Rahul Mehta   | Sous Chef (SC-02)         | Kitchen      | Resigned     | 02 Oct 2026      | ● Notice init | ••• |
| 3    | [AN] Aisha Noor    | Guest Relations (GR-04)   | Front Office | Terminated   | 12 Sep 2026      | ● Exited      | ••• |
| 4    | [LJ] Leena Joseph  | Housekeeping (HKS-03)     | Housekeeping | Retirement   | 15 Sep 2026      | ● Serving     | ••• |
| 5    | [TA] Tariq Abbasi  | Security (SO-04)          | Security     | Death in srv | 17 Sep 2026      | ● Exited      | ••• |
+----------------------------------------------------------------------------------------------------------------------+
```

#### Start Offboarding Modal: Resignation State
```
+----------------------------------------------------------------------------------------------------+
| Start Offboarding                                                                              [✕] |
| Initiate employee exit flow, calculate notice periods, and assign vacancy handovers.                |
+----------------------------------------------------------------------------------------------------+
| Employee & Position *                                                                              |
| [ Sara Khan · Front Desk Manager (FDM-01)                                                       ▾] |
|                                                                                                    |
| Departure Reason *                                                                                 |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | (•) Resigned (voluntary)                         | | ( ) Retirement                            | |
| |     Notice received via email. Standard notice.  | |     Planned retirement & succession.      | |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | ( ) Terminated                                   | | ( ) Death in service                      | |
| |     Immediate company termination.               | |     Bereavement protocol.                 | |
| +--------------------------------------------------+ +-------------------------------------------+ |
|                                                                                                    |
| [ ℹ️  Resignation notice received via email. HR initiation starts the notice period and handover  ] |
| [     tracking. Last working day defaults to 30 calendar days from notice date.                  ] |
|                                                                                                    |
| Notice Given Date                                    Last Working Day (LWD)                        |
| [ 2026-09-14                                    📅 ] [ 2026-10-14                             📅 ] |
|                                                      (Editable: standard 30 calendar days notice)  |
| Successor / Interim Cover                                                                          |
| [ Omar Haddad · Assistant Front Office Manager                                                  ▾] |
+----------------------------------------------------------------------------------------------------+
|                                                                     [ Cancel ]  [ Submit & Start ] |
+----------------------------------------------------------------------------------------------------+
```

#### Screen 2: Leaver Case Workspace (Sara Khan · 5 Lifecycle Tabs)
```
+----------------------------------------------------------------------------------------------------------------------+
| [ ← Back to departures ] / Employees / Off-boarding / Sara Khan (FDM-01)                                             |
| Sara Khan · Case Workspace                                  [ ✓ Acknowledge notice ] [ Simulate last day ] [ Close ] |
| Front Desk Manager • Front Office • Crowne Plaza Dubai                                                               |
+----------------------------------------------------------------------------------------------------------------------+
| [SK] Sara Khan [FDM-01]  ● Serving notice (Stage 1)                                   In 29 days                     |
|      Front Desk Manager • Manager: James Cole • Tenure: 5 yrs 6 mos                   LWD: 14 Oct 2026               |
|      Reason: Resigned (voluntary) | Successor: Omar Haddad (Assigned Cover)                                          |
+----------------------------------------------------------------------------------------------------------------------+
| [ Overview & Timeline ]  [ Handover (3 tasks) ]  [ Clearance (2/4 done) ]  [ Exit Interview ]  [ Final Settlement ]  |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 1: OVERVIEW & TIMELINE                                                                                           |
| 📍 6-Step Chronological Tracker                       | 📊 At a Glance & Status                              |
|  [✓] 1. Resignation Email Received (14 Sep 2026)      |   SYSTEM ACCESS: Active (Revocation scheduled LWD)   |
|  [✓] 2. HR Initiates Offboarding (Stage 0)            |   DESIGNATED COVER: Omar Haddad                      |
|  [3] 3. Notice Period & Handover (Serving · 29d left) |   ACCRUED LEAVE: 12.5 Days                           |
|  [ ] 4. Exit Clearance & Settlement Audit             |   CLEARANCE PROGRESS: [██████████░░░░░░░░░░] 50%     |
|  [ ] 5. System Access Cutoff (14 Oct, 18:00 GST)      |   (2 of 4 departmental sign-offs completed)          |
|  [ ] 6. Case Closed & Profile Archived to Exit        |                                                      |
+-------------------------------------------------------+------------------------------------------------------+
| TAB 2: OPERATIONAL HANDOVER (Categorized Checklist)                                                                 |
|  [ ] Direct reports transfer: 3 front desk agents report to Omar Haddad from 15 Oct [Team & Structure]              |
|  [ ] Opera Cloud PMS Admin privileges transfer to Omar Haddad                       [System Access]                  |
|  [✓] Master shift keys & safe access deposited in front office master lock          [Physical Assets - Done]         |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 3: 4-WAY DEPARTMENTAL CLEARANCE CHECKLIST                                                                        |
|  IT Department:      Laptop Dell Latitude 5440 & Opera PMS        [ Approver: Zaid Al-Harbi   | Sign off ]           |
|  Admin & Facilities: ID Card, Locker 214 & Parking Access         [ Approver: Tariq Mansoor   | Sign off ]           |
|  Finance:            Corporate Petty Cash AED 1,200 Settled       [ Approver: Amina El-Sayed  | ✓ Signed ]           |
|  Line Manager:       Operational Briefing & Key Handover          [ Approver: James Cole      | ✓ Signed ]           |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 4: EXIT INTERVIEW & FEEDBACK                                                                                     |
|  Status: [ Sent · Pending Employee Submission ]                                                                      |
|  Notice: Hospitality Exit Questionnaire (12 questions) dispatched to personal inbox on 15 Sep 2026.                   |
|  Actions: [ ✓ Mark Submitted Manually ]  [ Resend Survey Link ]  [ Skip with Reason ]                                |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 5: STATUTORY FINAL SETTLEMENT (UAE Labor Law Parity)                                                             |
|  [ Leave Balance: 12.5 Days ]  [ Encashment: AED 4,200 ]  [ Deductions: - AED 350 ]  [ Net Payable: AED 3,850 ]      |
|  [✓] Generate Experience & Relieving Certificates                                                                    |
|  Action: [ Close Case & Move to Employees › Exit ]                                                                   |
+----------------------------------------------------------------------------------------------------------------------+
```

---


## 7. Detailed End-to-End Walkthrough: Scenario 2 — Involuntary Termination

### Person: Aisha Noor (`GR-04`) · Guest Relations Executive

```
[Termination Decision] ──► [Screen 1: + Start Offboarding] ──► [Modal: Terminated (DANGER)]
                                                                          │
[Employees › Exit] ◄── [Stage 3: Close Case] ◄── [AED 1,500 Severance] ◄──┴──► [Screen 2 Workspace]
                                                                                ├── Tab 1: Access Terminated
                                                                                ├── Tab 2: 0 Tasks (Vacant)
                                                                                ├── Tab 3: Day-1 IT Revocation
                                                                                └── Tab 4: Survey Waived
```

1. **Management Termination Notice**: Company issues termination with immediate effect on 12 Sep 2026.
2. **HR Initiates Offboarding**: HR opens `+ Start offboarding` and selects Aisha Noor.
3. **Modal Selection**: HR clicks `"Terminated"`. The modal interface alters dynamically:
   - Alert switches to **Danger Red**:
     > *"Terminations take effect immediately. System access will be suspended today and position marked vacant."*
   - LWD input is **locked to today (2026-09-12) and disabled**.
   - Successor defaults to `"Leave seat open (Requires Vacancy Posting)"`.
4. **Immediate Case Creation**: HR clicks `"Confirm & Terminate Access"`. The case enters directly as `Stage 2: Exited · clearing` with red badge and urgency `Today`.
5. **Screen 2 Immediate Protocols**:
   - Header button `"Acknowledge notice"` is **not rendered**.
   - `Tab 1 Overview`: Timeline shows notice period waived; access flagged as `"Revoked Immediately"`.
   - `Tab 2 Handover`: Shows 0 operational tasks. Position flagged for recruitment.
   - `Tab 3 Clearance`: IT Department (Zaid Al-Harbi) immediately cuts Opera PMS and POS logins. Admin (Tariq Mansoor) receives badge and security keycard on Day 1.
   - `Tab 4 Exit Interview`: Automatically marked `"Skipped (Waived)"`.
6. **Financial Settlement**:
   - Accrued leave (5.0 days) encashed = AED 1,500. Zero deductions.
   - Notice pay in lieu and statutory settlement processed. Status marked `"Paid & Reconciled"`.
7. **Archival**: HR clicks `"Close Case & Archive"`. Case moves to `Stage 3: Closed`. Aisha's profile is moved to `Employees › Exit`.


### Visual UI Screen Flow: Scenario 2 (Involuntary Termination)

#### Screen 1: Departures List (Aisha Noor Row Highlighted)
```
+----------------------------------------------------------------------------------------------------------------------+
| Hirerkey™ HRMS › Employees › Off-boarding (Involuntary Exit)                                           [ + Start ]   |
+----------------------------------------------------------------------------------------------------------------------+
| [ ⧩ Filter ] [ ⇅ Sort: LWD (Earliest) ▾ ] [ ↻ Refresh ]                                 [ 📥 Export ] [ + Start offboarding ]|
+----------------------------------------------------------------------------------------------------------------------+
| 5 records   [ Status: Exited · clearing ✕ ]  [ Dept: Front Office ✕ ]                                                |
+----------------------------------------------------------------------------------------------------------------------+
| S.No | Employee           | Position & Seat           | Department   | Reason       | Last Working Day | Stage         | ... |
+------+--------------------+---------------------------+--------------+--------------+------------------+---------------+-----+
| 3    | [AN] Aisha Noor    | Guest Relations Executive | Front Office | Terminated   | 12 Sep 2026      | ● Exited ·    | ••• |
|      |      GR-04         | ⚠ Vacant (Requisition)    |              | (immediate)  | Left 3 days (neu)|   clearing    |     |
+----------------------------------------------------------------------------------------------------------------------+
```

#### Start Offboarding Modal: Involuntary Termination State
```
+----------------------------------------------------------------------------------------------------+
| Start Offboarding — Involuntary Termination                                                    [✕] |
| Initiate immediate employee termination and access lockdown protocol.                              |
+----------------------------------------------------------------------------------------------------+
| Employee & Position *                                                                              |
| [ Aisha Noor · Guest Relations Executive (GR-04)                                                ▾] |
|                                                                                                    |
| Departure Reason *                                                                                 |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | ( ) Resigned (voluntary)                         | | ( ) Retirement                            | |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | (•) Terminated [DANGER RED SELECTED]             | | ( ) Death in service                      | |
| |     Immediate exit. System access suspended today| |     Bereavement protocol                  | |
| +--------------------------------------------------+ +-------------------------------------------+ |
|                                                                                                    |
| [ 🚨  Terminations take effect immediately. System access will be suspended today and position     ] |
| [     marked vacant. Operational notice period is bypassed and case transitions straight to exit.  ] |
|                                                                                                    |
| Notice Given Date                                    Last Working Day (LWD) — Auto-Locked          |
| [ 2026-09-12                                    📅 ] [ 2026-09-12                             📅 ] |
|                                                      (🔒 Disabled: Immediate exit cannot be altered)|
| Successor / Interim Cover                                                                          |
| [ Leave seat open (Requires Vacancy Posting)                                                    ▾] |
+----------------------------------------------------------------------------------------------------+
|                                                                 [ Cancel ]  [ Confirm & Terminate ]|
+----------------------------------------------------------------------------------------------------+
```

#### Screen 2: Leaver Case Workspace (Aisha Noor · 5 Lifecycle Tabs)
```
+----------------------------------------------------------------------------------------------------------------------+
| [ ← Back to departures ] / Employees / Off-boarding / Aisha Noor (GR-04)                                             |
| Aisha Noor · Case Workspace                                                      [ Simulate last day ] [ Close case ]|
| Guest Relations Executive • Front Office • Crowne Plaza Dubai                                                        |
+----------------------------------------------------------------------------------------------------------------------+
| [AN] Aisha Noor [GR-04]  ● Exited · clearing (Stage 2)                                 Left 3 days ago                |
|      Guest Relations Executive • Manager: Sara Khan • Tenure: 1 yr 4 mos             LWD: 12 Sep 2026 (Immediate)   |
|      Reason: Terminated | Successor: ⚠ Vacant (Requisition #REQ-089 created)                                         |
+----------------------------------------------------------------------------------------------------------------------+
| [ Overview & Timeline ]  [ Handover (Bypassed) ]  [ Clearance (4/4 complete) ]  [ Exit Interview ]  [ Final Settle ] |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 1: OVERVIEW & TIMELINE                                                                                           |
| 📍 Immediate Departure Lifecycle                      | 🚨 Access & Security Status                          |
|  [✓] 1. Termination Order Issued (12 Sep 2026)        |   SYSTEM ACCESS: 🔒 Terminated & Revoked             |
|  [✓] 2. Immediate IT Lockdown (Opera PMS & POS Cut)   |   SEAT STATUS: Vacant — Emergency Requisition Active |
|  [✓] 3. Operational Notice Waived (Immediate Exit)    |   LEAVE ENCASHMENT: 5.0 Days (AED 1,500)             |
|  [✓] 4. Departmental Clearance (4/4 Completed)        |   EXIT INTERVIEW: Skipped (Waived under HR policy)   |
|  [5] 5. Severance & Settlement Disbursed (Paid WPS)   |   STAGE: Stage 2 (Exited · clearing)                 |
|  [ ] 6. Case Closed & Profile Archived to Exit        |                                                      |
+-------------------------------------------------------+------------------------------------------------------+
| TAB 2: OPERATIONAL HANDOVER (Bypassed Protocol)                                                                      |
|  🛡️ Operational Handover Bypassed: Leaver access & peer handover omitted to mitigate risk.                           |
|  [✓] Immediate Guest Accounts Custody Reallocated to Front Desk Manager Sara Khan (FDM-01)   [Reallocated]           |
|  [✓] Emergency Seat Requisition #REQ-089 auto-posted to Hirerkey Recruitment                  [Requisition Active]   |
|  [✓] Direct 30-day successor knowledge transfer waived under immediate termination terms     [Waived]               |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 3: ACCELERATED DEPARTMENTAL CLEARANCE CHECKLIST (4/4 Complete)                                                   |
|  IT Department:      System Access Revocation (Opera PMS/POS)      [ Approver: Zaid Al-Harbi   | ✓ Revoked ]          |
|  Admin & Facilities: Keycard, ID Badge & Security Deposit Returned [ Approver: Tariq Mansoor   | ✓ Returned ]         |
|  Finance:            Zero Dues & Salary Advance Audit Completed    [ Approver: Amina El-Sayed  | ✓ Cleared ]          |
|  Line Manager:       Operational Handover Sign-off                 [ Approver: Sara Khan       | ✓ Signed ]           |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 4: EXIT INTERVIEW & COMPLIANCE DISPOSITION                                                                       |
|  Status: [ Skipped / Waived ]                                                                                        |
|  Notice: Under enterprise HR operating policy, exit surveys are waived for involuntary terminations.                 |
|  Authorization: Waived by HR Director Amina El-Sayed on 12 Sep 2026. Severance release executed.                     |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 5: STATUTORY TERMINATION FINAL SETTLEMENT                                                                        |
|  [ Leave Balance: 5.0 Days ]  [ Encashment: AED 1,500 ]  [ Deductions: AED 0 ]  [ Net Payable: AED 1,500 ]           |
|  Status: [ ✓ Paid & Reconciled via Direct Bank Transfer ]                                                            |
|  Action: [ Archive Case to Employees › Exit ]                                                                        |
+----------------------------------------------------------------------------------------------------------------------+
```

---


## 8. Detailed End-to-End Walkthrough: Scenario 3 — Retirement

### Person: Leena Joseph (`HKS-03`) · Housekeeping Supervisor (7 yrs 2 mos service)

```
[Retirement Notice] ──► [Screen 1: + Start Offboarding] ──► [Modal: Retirement (Planned)]
                                                                          │
[Employees › Exit] ◄── [Stage 3: Close Case] ◄── [EOSG + AED 5,500] ◄─────┴──► [Screen 2 Workspace]
                                                                                ├── Tab 1: Mentorship Milestones
                                                                                ├── Tab 2: Meera Das Mentoring
                                                                                ├── Tab 3: Staff Housing Handover
                                                                                └── Tab 4: 5-Star Legacy Debrief
```

1. **Retirement Planning**: Leena Joseph reaches superannuation age after 7 years of service. Formal retirement planned 30 days ahead on 15 Aug 2026, with LWD set to 15 Sep 2026.
2. **HR Initiates in Modal**: Selects `"Retirement"`. The alert box shows:
   > *"Retirement initiated. Planned notice period and succession handover initialized. UAE Labor Law Gratuity & Pension documentation activated for 7+ years tenure."*
   LWD set to `2026-09-15`. Successor selected as `Meera Das` (promoted junior supervisor).
3. **Screen 2 Mentorship Workflow**:
   - Case enters as `Stage 1: Serving notice`.
   - `Tab 2 Handover`: Focuses on succession mentorship. Leena trains Meera Das on VIP room inspection protocols and transfers housekeeping master floor keys (`✓ Completed`).
   - `Tab 3 Clearance`: Staff accommodation room inspected and returned in pristine condition to Admin. IT comms radio returned.
   - `Tab 4 Exit Interview`: Marked `"Completed"`. Leena awards 5.0/5.0 stars with legacy commendations.
4. **Statutory UAE Gratuity Audit**:
   - 7 yrs 2 mos continuous service:
     * First 5 years @ 21 days basic per year = 105 days basic pay.
     * Remaining 2 yrs 2 mos @ 30 days basic per year = 65 days basic pay.
     * Total EOSG verified by Finance Director Amina El-Sayed.
   - 15 days accrued leave encashed = AED 5,500.
   - Relieving Certificate, Certificate of Service, and Lifetime Service Plaque issued.
5. **Honorary Archival**: HR clicks `"Complete Retirement & Move to Employees › Exit"`. Case moves to `Stage 3: Closed`.


### Visual UI Screen Flow: Scenario 3 (Retirement)

#### Screen 1: Departures List (Leena Joseph Row Highlighted)
```
+----------------------------------------------------------------------------------------------------------------------+
| Hirerkey™ HRMS › Employees › Off-boarding (Planned Retirement)                                         [ + Start ]   |
+----------------------------------------------------------------------------------------------------------------------+
| [ ⧩ Filter ] [ ⇅ Sort: LWD (Earliest) ▾ ] [ ↻ Refresh ]                                 [ 📥 Export ] [ + Start offboarding ]|
+----------------------------------------------------------------------------------------------------------------------+
| 5 records   [ Status: Serving notice ✕ ]  [ Dept: Housekeeping ✕ ]                                                   |
+----------------------------------------------------------------------------------------------------------------------+
| S.No | Employee           | Position & Seat           | Department   | Reason       | Last Working Day | Stage         | ... |
+------+--------------------+---------------------------+--------------+--------------+------------------+---------------+-----+
| 4    | [LJ] Leena Joseph  | Housekeeping Supervisor   | Housekeeping | Retirement   | 15 Sep 2026      | ● Serving     | ••• |
|      |      HKS-03        | → Meera Das (Successor)   |              | (superann.)  | Today (bad)      |   notice      |     |
+----------------------------------------------------------------------------------------------------------------------+
```

#### Start Offboarding Modal: Retirement State
```
+----------------------------------------------------------------------------------------------------+
| Start Offboarding — Retirement                                                                 [✕] |
| Initiate planned retirement, succession handover, and statutory gratuity calculation.              |
+----------------------------------------------------------------------------------------------------+
| Employee & Position *                                                                              |
| [ Leena Joseph · Housekeeping Supervisor (HKS-03)                                               ▾] |
|                                                                                                    |
| Departure Reason *                                                                                 |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | ( ) Resigned (voluntary)                         | | (•) Retirement [SELECTED]                 | |
| |                                                  | |     Planned retirement & succession flow  | |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | ( ) Terminated                                   | | ( ) Death in service                      | |
| +--------------------------------------------------+ +-------------------------------------------+ |
|                                                                                                    |
| [ 🎖️  Retirement initiated. Planned notice period and succession handover initialized. UAE Labor   ] |
| [     Law Gratuity & Pension documentation activated for 7+ years tenure.                         ] |
|                                                                                                    |
| Notice Given Date                                    Last Working Day (LWD)                        |
| [ 2026-08-15                                    📅 ] [ 2026-09-15                             📅 ] |
|                                                      (Planned superannuation milestone date)      |
| Successor / Interim Cover                                                                          |
| [ Meera Das · Lead Floor Supervisor (Promoted Successor)                                        ▾] |
+----------------------------------------------------------------------------------------------------+
|                                                                     [ Cancel ]  [ Submit & Start ] |
+----------------------------------------------------------------------------------------------------+
```

#### Screen 2: Leaver Case Workspace (Leena Joseph · 5 Lifecycle Tabs)
```
+----------------------------------------------------------------------------------------------------------------------+
| [ ← Back to departures ] / Employees / Off-boarding / Leena Joseph (HKS-03)                                          |
| Leena Joseph · Case Workspace                                             [ Close Case & Honor Retirement ]          |
| Housekeeping Supervisor • Housekeeping • Crowne Plaza Dubai                                                          |
+----------------------------------------------------------------------------------------------------------------------+
| [LJ] Leena Joseph [HKS-03]  ● Serving notice (Final Day)                                Today                        |
|      Housekeeping Supervisor • Manager: Maria Santos • Tenure: 7 yrs 2 mos              Retirement: 15 Sep 2026      |
|      Reason: Retirement | Successor: Meera Das (Fully Certified Successor)                                           |
+----------------------------------------------------------------------------------------------------------------------+
| [ Overview & Succession ]  [ Mentorship Handover ]  [ Clearance & Housing ]  [ Legacy Interview ]  [ Gratuity Settle ]|
+----------------------------------------------------------------------------------------------------------------------+
| TAB 1: OVERVIEW & SUCCESSION                                                                                         |
| 📍 Retirement Milestones & Mentorship                  | 🏆 Retirement Highlights                             |
|  [✓] 1. Retirement Notice Submitted & Approved        |   HONORABLE TENURE: 7 Years 2 Months (2019–2026)     |
|  [✓] 2. Succession Mentorship of Meera Das (Completed) |   SUCCESSOR STATUS: ✓ Meera Das Fully Certified      |
|  [✓] 3. Departmental & Staff Housing Clearance Done   |   LEAVE BALANCE: 15.0 Days (AED 5,500)               |
|  [✓] 4. Statutory UAE Gratuity Audit (7 Yrs Reconciled)|  EXIT INTERVIEW: ⭐⭐⭐⭐⭐ 5.0 / 5.0 Rating           |
|  [5] 5. Final Disbursement & Retirement Tribute (Today)|  HONOR: Lifetime Service Plaque Presented           |
+-------------------------------------------------------+------------------------------------------------------+
| TAB 2: MENTORSHIP HANDOVER & LEADERSHIP SUCCESSION (3/3 Done)                                                        |
|  [✓] Floor Master Keys & Access Cards deposited with Executive Housekeeper Maria Santos       [✓ Completed]          |
|  [✓] VIP Suites Standards & Chemical Safety Dossier handed to Meera Das                       [✓ Completed]          |
|  [✓] Direct Reports Reassignment: 8 room attendants report to Meera Das (effective 16 Sep)    [✓ Reassigned]         |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 3: DEPARTMENTAL & STAFF HOUSING CLEARANCE (4/4 Approved)                                                         |
|  IT Department:      Motorola CP200 Two-Way Radio Comms Handset Returned   [ Approver: Zaid Al-Harbi   | ✓ Approved ] |
|  Admin & Housing:    Staff Accommodation Room 402 Inspected & Vacated      [ Approver: Tariq Mansoor   | ✓ Approved ] |
|  Finance:            UAE EOS Gratuity Audit (170 Days Basic Pay Reconciled)[ Approver: Amina El-Sayed  | ✓ Approved ] |
|  Line Manager:       Final Leadership Succession Sign-off                  [ Approver: Maria Santos    | ✓ Approved ] |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 4: RETIREMENT LEGACY DEBRIEF & MILESTONE TRIBUTE                                                                 |
|  Rating: ⭐⭐⭐⭐⭐ 5.0 / 5.0 Exceptional Rating  |  Status: [ ✓ Completed ]                                            |
|  Debrief: "Proud to have mentored the housekeeping team. Meera is ready to lead. Thank you for 7 memorable years."   |
|  Metrics: Promoter (10/10) | Management Support: 5.0/5.0 | Succession Preparedness: 100% Ready                      |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 5: STATUTORY UAE GRATUITY & FINAL SETTLEMENT                                                                     |
|  [ Leave Balance: 15.0 Days ]  [ Leave Encashment: AED 5,500 ]  [ EOS Gratuity (7 Yrs): Audited ]  [ Net: AED 5,500 ]|
|  [✓] Relieving, Experience & Retirement Certificates Issued                                                          |
|  Action: [ Complete Retirement & Move to Employees › Exit ]                                                          |
+----------------------------------------------------------------------------------------------------------------------+
```

---


## 9. Detailed End-to-End Walkthrough: Scenario 4 — Death in Service

### Person: Tariq Abbasi (`SO-04`) · Security Supervisor (6 yrs 8 mos service)

```
[Demise Reported] ──► [Screen 1: + Start Offboarding] ──► [Modal: Death in Service (SENSITIVE)]
                                                                          │
[Employees › Exit] ◄── [Stage 3: Close Case] ◄── [AED 51,300 to Heirs] ◄──┴──► [Screen 2 Workspace]
                                                                                ├── Tab 1: Bereavement Protocol
                                                                                ├── Tab 2: Safe Code Handoff
                                                                                ├── Tab 3: Locker with Witness
                                                                                └── Tab 4: Permanently Waived
```

1. **Demise Reported**: HR receives official notification of employee demise on 17 Sep 2026.
2. **HR Initiates Sensitive Flow**: Opens `+ Start offboarding`. Selects Tariq Abbasi.
3. **Modal Selection**: HR selects `"Death in service"`. The modal switches to the bereavement theme:
   - Dynamic alert:
     > *"Death in service takes effect immediately. System access is suspended, seat opened for succession, and statutory final settlement workflow initialized for verified Next-of-Kin."*
   - LWD input is **locked to date of demise (2026-09-17) and disabled**.
   - Successor assigned to `Ravi Kumar` for emergency shift coverage.
4. **Screen 2 Sensitive Protocol**:
   - Top banner: *"🕊️ Bereavement Protocol Active: Direct employee contact suspended. Communications routed through HR Family Liaison Amina El-Sayed."*
   - `Tab 1 Overview`: Timeline details police/hospital record verification, account archiving, and legal heir documentation.
   - `Tab 2 Handover`: Security safe combination transferred directly to Security Head Capt. Tariq Al-Hashimi.
   - `Tab 3 Clearance`: Admin security locker cleared in presence of HR witness and family representative. IT security credentials cut off; email archived.
   - `Tab 4 Exit Interview`: Permanently waived under bereavement compliance rules.
5. **Statutory Death Compensation to Legal Heirs**:
   - Accrued leave (18 days) encashed = AED 6,300.
   - Full current month salary = AED 8,500.
   - Statutory UAE End-of-Service Gratuity (6.6 years) + Group Life Insurance = AED 36,500.
   - **Total Legal Heir Dues = AED 51,300**.
   - UAE Labor Law Article 53 mandate: Dues must be disbursed to verified Next-of-Kin / Court Succession account within 10 days.
   - Official Letter of Condolence and detailed Statement of Statutory Dues provided to family.
6. **Archival**: HR clicks `"Disburse to Court-Certified Estate & Close Case"`. Profile archived to `Employees › Exit`.


### Visual UI Screen Flow: Scenario 4 (Death in Service — Bereavement Protocol)

#### Screen 1: Departures List (Tariq Abbasi Row Highlighted)
```
+----------------------------------------------------------------------------------------------------------------------+
| Hirerkey™ HRMS › Employees › Off-boarding (Bereavement Protocol)                                       [ + Start ]   |
+----------------------------------------------------------------------------------------------------------------------+
| [ ⧩ Filter ] [ ⇅ Sort: LWD (Earliest) ▾ ] [ ↻ Refresh ]                                 [ 📥 Export ] [ + Start offboarding ]|
+----------------------------------------------------------------------------------------------------------------------+
| 5 records   [ Status: Exited · clearing ✕ ]  [ Dept: Security ✕ ]                                                    |
+----------------------------------------------------------------------------------------------------------------------+
| S.No | Employee           | Position & Seat           | Department   | Reason       | Last Working Day | Stage         | ... |
+------+--------------------+---------------------------+--------------+--------------+------------------+---------------+-----+
| 5    | [TA] Tariq Abbasi  | Security Supervisor       | Security     | Death in srv | 17 Sep 2026      | ● Exited ·    | ••• |
|      |      SO-04         | → Ravi Kumar (Emerg Cover)|              | (bereavement)| Demised (neu)    |   clearing    |     |
+----------------------------------------------------------------------------------------------------------------------+
```

#### Start Offboarding Modal: Death in Service State
```
+----------------------------------------------------------------------------------------------------+
| Start Offboarding — Death in Service                                                           [✕] |
| Compassionate exit protocol, emergency succession, and statutory death benefits.                   |
+----------------------------------------------------------------------------------------------------+
| Employee & Position *                                                                              |
| [ Tariq Abbasi · Security Supervisor (SO-04)                                                    ▾] |
|                                                                                                    |
| Departure Reason *                                                                                 |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | ( ) Resigned (voluntary)                         | | ( ) Retirement                            | |
| +--------------------------------------------------+ +-------------------------------------------+ |
| | ( ) Terminated                                   | | (•) Death in service [SELECTED]           | |
| |                                                  | |     Bereavement protocol & legal heirs    | |
| +--------------------------------------------------+ +-------------------------------------------+ |
|                                                                                                    |
| [ 🕊️  Death in service takes effect immediately. System access is suspended, seat opened for        ] |
| [     succession, and statutory final settlement workflow initialized for verified Next-of-Kin.   ] |
|                                                                                                    |
| Date of Demise                                       Last Working Day (LWD) — Auto-Locked          |
| [ 2026-09-17                                    📅 ] [ 2026-09-17                             📅 ] |
|                                                      (🔒 Disabled: Date of demise fixed)           |
| Emergency Shift Cover / Successor                                                                  |
| [ Ravi Kumar · Security Lead (Emergency Shift Cover)                                            ▾] |
+----------------------------------------------------------------------------------------------------+
|                                                       [ Cancel ]  [ Initialize Bereavement Protocol ]|
+----------------------------------------------------------------------------------------------------+
```

#### Screen 2: Leaver Case Workspace (Tariq Abbasi · Bereavement Protocol)
```
+----------------------------------------------------------------------------------------------------------------------+
| [ ← Back to departures ] / Employees / Off-boarding / Tariq Abbasi (SO-04)                                           |
| Tariq Abbasi · Case Workspace                             [ Disburse to Legal Heirs & Close Case ]                   |
| Security Supervisor • Security • Crowne Plaza Dubai                                                                  |
+----------------------------------------------------------------------------------------------------------------------+
| 🕊️ Bereavement Protocol Active: Direct contact suspended. All communications routed strictly through HR Family Liaison|
|    Amina El-Sayed to the designated Next-of-Kin.                                                                     |
+----------------------------------------------------------------------------------------------------------------------+
| [TA] Tariq Abbasi [SO-04]  ● Exited · clearing                                         Demised                        |
|      Security Supervisor • Manager: Capt. Tariq Al-Hashimi • Tenure: 6 yrs 8 mos       17 Sep 2026                   |
|      Reason: Death in service | Emergency Cover: Ravi Kumar (Shift Lead)                                             |
+----------------------------------------------------------------------------------------------------------------------+
| [ Overview & Liaison ]  [ Operational Assumption ]  [ Compassionate Clearance ]  [ Exit Interview ]  [ Legal Heirs ] |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 1: OVERVIEW & LIAISON                                                                                            |
| 📍 Compassionate Bereavement Lifecycle                | 🕊️ Compassionate Metrics                             |
|  [✓] 1. Official Demise Notification (Hospital filed) |   FAMILY LIAISON OFFICER: Amina El-Sayed (HR Director)|
|  [✓] 2. Immediate IT Security Lockdown (Day 1 Cut)    |   EXIT INTERVIEW: Permanently Waived                  |
|  [3] 3. Next-of-Kin Family Liaison Outreach (Active)  |   STATUTORY LEGAL HEIR DUES: AED 51,300               |
|  [ ] 4. Statutory Death Compensation & Gratuity Audit |   LEGAL MANDATE: Disburse within 10 days (Art. 53)    |
|  [ ] 5. Disbursement to Verified Legal Heirs          |   STATUS: Estate succession verification in progress  |
+-------------------------------------------------------+------------------------------------------------------+
| TAB 2: EMERGENCY OPERATIONAL ASSUMPTION                                                                              |
|  🛡️ Operational Post Assumption: Emergency command assumption to maintain security post coverage.                    |
|  [✓] Emergency Shift Schedule Reassignment: Shift roster assumed by Ravi Kumar (zero post vacancy)    [✓ Covered]    |
|  [✓] Armory Safe & Master Patrol Key surrendered directly to Security Head Capt. Tariq Al-Hashimi    [✓ Secured]    |
|  [✓] Control room biometric credentials rotated immediately on 17 Sep 2026                            [✓ Rotated]    |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 3: COMPASSIONATE DEPARTMENTAL CLEARANCE (4/4 Complete)                                                           |
|  IT Department:      System Lockdown & Mailbox Archival for Family Liaison [ Approver: Zaid Al-Harbi   | ✓ Archived ] |
|  Admin & Facilities: Personal Locker Cleared in Presence of HR Witness     [ Approver: Tariq Mansoor   | ✓ Done ]     |
|  Finance:            Statutory Death Compensation & Group Life Insurance   [ Approver: Amina El-Sayed  | ✓ Audited ]  |
|  Line Manager:       Security Post Operational Clearance Sign-off          [ Approver: Capt. Tariq     | ✓ Signed ]   |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 4: EXIT INTERVIEW WAIVER & CONDOLENCE                                                                            |
|  Status: [ Permanently Waived ]                                                                                      |
|  Bereavement Protocol: Exit interviews strictly not applicable. Official Letter of Condolence signed by CEO and HR   |
|  Director delivered to Next-of-Kin. Sharia/Civil court succession documentation being coordinated.                   |
+----------------------------------------------------------------------------------------------------------------------+
| TAB 5: STATUTORY DEATH BENEFITS PAYABLE TO LEGAL HEIRS (UAE Labor Law Art. 53 & 144)                                 |
|  [ Leave Balance (18d): AED 6,300 ]  [ Full Month Salary: AED 8,500 ]  [ EOS Gratuity + Insurance: AED 36,500 ]      |
|  HIGHLIGHT: [ Total Legal Heir Entitlement: AED 51,300 ]                                                             |
|  Statutory Note: Dues payable within 10 days to verified legal heirs as per UAE Federal Decree-Law No. 33 of 2021.      |
|  Action: [ Disburse to Court-Certified Estate & Close Case ]                                                         |
+----------------------------------------------------------------------------------------------------------------------+
```

---


## 10. UAE Labor Law Compliance & Legal Rules Engine

The offboarding module embeds rules from **UAE Federal Decree-Law No. 33 of 2021** (Regulation of Labor Relations):

### 1. Notice Periods (Article 43)
- Statutory notice period must be between 30 and 90 calendar days.
- In voluntary resignations, the employee must serve the agreed notice period unless waived by mutual written consent.
- In terminations without notice, the employer must disburse **Compensation in Lieu of Notice** equal to the employee's wage for the entire notice period.

### 2. End-of-Service Gratuity (Articles 51 & 52)
- For full-time employees completing at least one year of continuous service:
  * **21 days of basic wage** for each year of service during the first five years.
  * **30 days of basic wage** for each additional year beyond the first five years.
  * Prorated calculation applies to fractions of a year.
  * Total gratuity payout cannot exceed two years' total basic salary.

### 3. Payment of Final Entitlements (Article 53)
- The employer is legally obligated to settle all employee wages, accrued leave encashments, and statutory gratuity within **14 calendar days** from the contract termination date.

### 4. Death in Service Statutory Settlement (Articles 53 & 144)
- In the event of an employee's death while employed:
  * The employer must disburse all accrued wages, leave encashment, and full end-of-service gratuity to the employee's verified family / legal heirs within **10 calendar days** from the date of demise or upon presentation of the Sharia / Civil Court Certificate of Succession.
  * Repatriation expenses for the deceased employee's body are covered by the employer under standard UAE statutory sponsorship rules.

---

## Verification & Interactive Artifacts

To interact with the live screens and inspect the four offboarding flows visually:

1. **Open the Live Screen Visual Guide**:
   ```bash
   open "/Users/chanchalsharma/Working REPO/Hirerkey/offboarding_flow_visual_guide.html"
   ```
2. **Open the Functional Offboarding Prototype**:
   ```bash
   open "/Users/chanchalsharma/Working REPO/Hirerkey/offboarding_preview.html"
   ```
3. **React Source Code Components**:
   - List & SubHeader Toolbar: [`OffboardingList.tsx`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/src/components/offboarding/OffboardingList.tsx), [`OffboardingListToolbar.tsx`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/src/components/offboarding/OffboardingListToolbar.tsx)
   - Table Component: [`OffboardingTable.tsx`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/src/components/offboarding/OffboardingTable.tsx)
   - Workspace & 5 Tabs: [`OffboardingCaseDetail.tsx`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/src/components/offboarding/OffboardingCaseDetail.tsx)
   - Types & Data: [`types.ts`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/src/components/offboarding/types.ts), [`mockData.ts`](file:///Users/chanchalsharma/Working%20REPO/Hirerkey/src/components/offboarding/mockData.ts)
