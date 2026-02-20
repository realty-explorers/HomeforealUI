# Multifamily UI Update - Full Progress & Detailed Forward Plan

**Last Updated:** 2026-02-20  
**Repository:** `HomeforealUI`  
**Working Branch:** `multyfamily-ui-update` (branched from `dev`)  
**Development URL:** `http://localhost:3000`

---

## 1) Objective

Implement a dedicated **Multifamily** flow in the BuyBox + Real-Estate experience, while preserving existing Fix-and-Flip behavior.

The delivery style is intentionally incremental:
- Very small steps
- Explicit approval before moving to next implementation step
- UI-first progression, then wiring/integration/tests

---

## 2) Execution Rules Followed During Implementation

1. **No big-bang rewrite** - all changes were split into small, reviewable chunks.
2. **Backward compatibility first** - existing strategy flows kept intact.
3. **Feature-gated by strategy type** - Multifamily behavior activates only when `strategy.strategyType === 'MULTIFAMILY'`.
4. **UI first, then data/API wiring** - tabs and forms were scaffolded and then progressively populated.
5. **Current state is still WIP** - advanced backend wiring and tests are intentionally pending per plan.

---

## 3) Full Change Log (What Was Implemented So Far)

## Step 1 - BuyBox schema support for strategy type

### Goal
Enable the domain schema to represent Multifamily strategy explicitly.

### Changes
- Added strategy enum with `MULTIFAMILY` value.
- Added `strategyType` field to strategy schema.
- Set default strategy type to `FIX_AND_FLIP`.
- Exported `buyboxSchemaType` alias for downstream typing compatibility.

### Files
- `src/schemas/BuyBoxSchemas.ts`

### Result
Backend-facing BuyBox schema can now legally represent a multifamily strategy selection.

---

## Step 2 - Form schema support for strategy type

### Goal
Ensure form model can carry `strategyType` and transform strategy object correctly.

### Changes
- Imported strategy enum into form schema.
- Added `strategyType` to `strategyFormSchema`.
- Updated strategy transform logic to preserve non-`minSchema` fields.
- Set default strategy type in form defaults.
- Fixed TypeScript narrowing issue by casting min-value object before reading `.enabled`/`.value`.

### Files
- `src/schemas/BuyBoxFormSchema.ts`

### Result
Form state now includes strategy type cleanly and doesn’t drop it during transform.

---

## Step 3 - Strategy selector UI activation for Multifamily

### Goal
Allow users to actually choose Multifamily from UI.

### Changes
- Added `Multifamily` option in the strategy cards.
- Wired click interaction to `setValue('strategy.strategyType', ...)`.
- Replaced local selection with `watch('strategy.strategyType')` from RHF.
- Updated selected-state styling based on watched strategy.
- Added contextual helper text when Multifamily is selected.

### Files
- `src/content/Dashboards/BuyBox/EditBuyBox/Sections/InvestmentStrategy.tsx`

### Result
Users can select Multifamily strategy inside BuyBox dialog.

---

## Step 4 - Strategy-aware step flow in Edit BuyBox dialog

### Goal
Display dedicated step flow for Multifamily, without breaking default flow.

### Changes
- Split steps into:
  - `defaultSteps`
  - `multifamilySteps`
- Added multifamily tabs labels arrays:
  - Criteria tabs (5)
  - Setup tabs (5)
- Added `useMemo` switch by `watch('strategy.strategyType')`.
- Ensured API->form mapping includes fallback default for `strategyType`.

### Files
- `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.tsx`

### Result
When strategy is Multifamily, dialog displays a different 5-step flow with dedicated step titles.

---

## Step 5 - Multifamily tabs skeleton component (10 tabs structure)

### Goal
Create dedicated tabbed shell for Multifamily Criteria + Setup sections.

### Changes
- Added new `MultifamilyTabsSkeleton` component with:
  - Title + description
  - Scrollable MUI tabs
  - Active tab content area
- Wired component into dialog for both multifamily steps.

### Files
- **New:** `src/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton.tsx`
- Updated: `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.tsx`

### Result
UI now has explicit 10-tab Multifamily framework (5 criteria + 5 setup).

---

## Step 6 - Implemented real fields for Tabs 1-3

### Goal
Replace placeholder with real inputs for first 3 multifamily criteria tabs.

### Changes
#### Tab 1 - Unit Mix & Bed/Bath
- Implemented dynamic rows with `useFieldArray`.
- Row fields:
  - Unit Type
  - Units
  - Avg Rent
  - Avg Sqft
- Add/Remove row controls.
- Auto-initialize first row when empty.

#### Tab 2 - Rent Roll
- Inputs added for occupancy/concessions/other-income assumptions.

#### Tab 3 - Income (TTM)
- Inputs added for GSR, vacancy, bad debt, other income.

### Files
- `src/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton.tsx`
- `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.tsx` (mode prop wiring)

### Result
First 3 tabs now collect real user input.

---

## Step 7 - Implemented Tabs 4-6

### Goal
Continue multifamily form coverage for expenses/utilities/capital stack.

### Changes
#### Tab 4 - Expenses (TTM)
- Taxes, insurance, repairs, payroll, management fee.

#### Tab 5 - Utilities & Reimbursements
- Water/sewer, trash, electric, gas, reimbursement.

#### Tab 6 (Setup Tab 1) - Capital Stack
- Purchase price, closing costs %, equity %, preferred return %.

### Files
- `src/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton.tsx`

### Result
Criteria side is now fully implemented (tabs 1-5), setup has first tab implemented.

---

## Step 8 - Implemented Tabs 7-10

### Goal
Complete all remaining setup tabs.

### Changes
#### Tab 7 - Loan Assumptions
- Interest rate, LTV, amortization, loan term, IO period, DSCR.

#### Tab 8 - Renovation / CapEx
- Interior/exterior/common budgets, contingency, reserve/unit, timeline.

#### Tab 9 - Exit Scenario
- Hold period, exit cap, rent growth, expense growth, selling costs.

#### Tab 10 - Risk & Notes
- Stress vacancy, stress exit cap, stress interest, downside NOI change, notes.

### Files
- `src/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton.tsx`

### Result
All 10 Multifamily tabs now have concrete UI fields (not placeholder text).

---

## Step 9 - Persist Multifamily fields in schema + form transforms

### Goal
Ensure Multifamily tabs data is part of official BuyBox schema contract and not just transient UI state.

### Changes
- Added `multifamilyCriteria` + `multifamilySetup` trees to:
  - `BuyBoxSchemas.ts` (domain/API schema)
  - `BuyBoxFormSchema.ts` (form schema + defaults)
- Added defaults so edit/create flows have stable shape.
- Added mapping in `EditBuyBoxDialog.mapBuyBoxData` so existing Multifamily values are loaded into form on edit.

### Files
- `src/schemas/BuyBoxSchemas.ts`
- `src/schemas/BuyBoxFormSchema.ts`
- `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.tsx`

### Result
Multifamily tab values now flow through the form schema and are included in save payload shape.

---

## Step 10 - Search filter integration for Multifamily buyboxes

### Goal
Make Multifamily buyboxes work correctly in Real Estate map filtering UX.

### Changes
- Added Multifamily strategy labeling in BuyBox select options.
- Detect selected BuyBox strategy type in map filter controls.
- Disabled ARV/Comps margin strategy filtering when selected BuyBox is Multifamily.
- Added contextual helper text explaining strategy filter behavior for Multifamily.

### Files
- `src/content/Dashboards/RealEstate/MapControls/MainControls.tsx`

### Result
Multifamily buyboxes are now explicitly represented in filter UI and avoid ARV/Comps-specific filtering logic.

---

## Step 11 - Map marker adaptation for Multifamily

### Goal
Render Multifamily markers with strategy-relevant values and avoid ARV/Comps-only assumptions.

### Changes
- Extended map marker geojson generation to receive selected BuyBox strategy type.
- For `MULTIFAMILY`, markers now use a 2-line label:
  - Line 1: `Cap X%` (or `Cap N/A`)
  - Line 2: `Price per unit` when units are available, otherwise price fallback.
- Added robust guards for invalid ARV/Comps values to prevent `NaN%` marker output.
- Updated map effect dependencies so marker labels refresh when strategy context changes.

### Files
- `src/content/Dashboards/RealEstate/MapUtils/CoordinatesUtils.tsx`
- `src/content/Dashboards/RealEstate/Map.tsx`

### Result
Multifamily markers now present Multifamily-friendly metrics and no longer rely on ARV/Comps for label rendering.

---

## Step 12 - Multifamily deal card component

### Goal
Render Multifamily-specific KPIs in the cards panel for Multifamily buyboxes.

### Changes
- Added new `MultifamilyDealCard` component for strategy-specific card rendering.
- Added Multifamily card metrics:
  - Price
  - Units (when available)
  - Price per Unit (fallback to N/A)
  - Cap Rate (fallback to N/A)
- Updated `CardsPanel` to switch card component by selected BuyBox strategy type.
- Updated `CardsPanel` sorting behavior:
  - Multifamily: sorted by cap rate descending.
  - Non-multifamily: keeps strategy percentage sorting (ARV/Comps).

### Files
- `src/content/Dashboards/RealEstate/MapComponents/CardsPanel/MultifamilyDealCard.tsx`
- `src/content/Dashboards/RealEstate/MapComponents/CardsPanel/CardsPanel.tsx`

### Result
Cards panel now shows strategy-appropriate card UI for Multifamily without changing non-multifamily card behavior.

---

## Step 13 - Multifamily analysis drawer shell + tabs skeleton (C1)

### Goal
Create the dedicated Multifamily analysis drawer shell with the planned tab structure.

### Changes
- Added new `MultifamilyAnalysisDrawer` overlay component.
- Implemented left-side persistent drawer shell with close action.
- Added tab skeleton for:
  - Quick Screen
  - Scenarios
  - Income
  - Expenses
  - Debt & Returns
  - Documents
  - Notes
- Wired drawer opening in `Map.tsx` only when:
  - selected BuyBox strategy is `MULTIFAMILY`
  - a property is selected

### Files
- `src/content/Dashboards/RealEstate/MapComponents/Overlays/MultifamilyAnalysisDrawer.tsx`
- `src/content/Dashboards/RealEstate/Map.tsx`

### Result
Multifamily flow now has a dedicated left analysis drawer shell with tab navigation, ready for tab content population in the next step.

---

## Step 14 - Populate Multifamily drawer tab UI content (C2)

### Goal
Populate all drawer tabs with clear section-level UI content using selected property data.

### Changes
- Enhanced `MultifamilyAnalysisDrawer` with reusable UI primitives:
  - `MetricRow`
  - `SectionCard`
- Added robust value formatters/fallback helpers for mixed API values:
  - currency
  - percentage
  - text
- Added tab-specific content for all tabs:
  - Quick Screen: core snapshot + asset context
  - Scenarios: baseline scenario metrics
  - Income: NOI, cap rate, rental comps, price/sqft
  - Expenses: transaction + operational expense blocks
  - Debt & Returns: loan profile + return summary
  - Documents: checklist chips shell
  - Notes: analyst notes + next actions shell
- Added drawer behavior improvement: reset active tab to first tab when drawer closes.

### Files
- `src/content/Dashboards/RealEstate/MapComponents/Overlays/MultifamilyAnalysisDrawer.tsx`

### Result
All Multifamily drawer tabs now render meaningful section-level UI (non-placeholder), while keeping business logic intentionally lightweight.

---

## Step 15 - ProvenanceBadge component (D1)

### Goal
Add a reusable provenance indicator component and apply it to key multifamily analytics metrics.

### Changes
- Added new reusable `ProvenanceBadge` component with a variant system:
  - `listing`
  - `comps`
  - `calculated`
  - `assumption`
  - `pending`
- Integrated `ProvenanceBadge` into `MultifamilyAnalysisDrawer` metric rows.
- Annotated central KPI rows across drawer tabs with explicit source-type indicators.
- Added pending provenance indicator in Documents tab.

### Files
- `src/content/Dashboards/RealEstate/MapComponents/Overlays/ProvenanceBadge.tsx`
- `src/content/Dashboards/RealEstate/MapComponents/Overlays/MultifamilyAnalysisDrawer.tsx`

### Result
Key Multifamily drawer metrics now expose source confidence/context visually, and the badge component is reusable for other dashboards/tables.

---

## Step 16 - API hook wiring (D2)

### Goal
Wire Multifamily drawer data flow to API hook state so drawer content can stay aligned with RTK Query property cache.

### Changes
- Extended `MultifamilyAnalysisDrawer` props to accept API identity args:
  - `buyboxId`
  - `propertyId`
  - `masked`
- Wired drawer to `propertiesApiEndpoints.getProperty.useQueryState(...)` with `skipToken` guard.
- Added fallback behavior:
  - use API cache data when available
  - fallback to passed `property` prop otherwise
- Updated `Map.tsx` to pass selected buybox/property identifiers into drawer.

### Files
- `src/content/Dashboards/RealEstate/MapComponents/Overlays/MultifamilyAnalysisDrawer.tsx`
- `src/content/Dashboards/RealEstate/Map.tsx`

### Result
Multifamily drawer now consumes API-hook-backed property state (cache-aware) instead of relying only on prop snapshots.

---

## Step 17 - Loading & error states (D3)

### Goal
Add baseline loading/error UX for multifamily drawer API-backed data.

### Changes
- Added drawer-level loading progress indicator when latest property data is being fetched.
- Added stale-data warning when API refresh fails but fallback property data exists.
- Added content-area fallbacks:
  - loading message when no property is available yet
  - error message when query fails and no fallback data exists
  - empty-state prompt when no property is selected
- Added safe error-message extraction from RTK query error payload.

### Files
- `src/content/Dashboards/RealEstate/MapComponents/Overlays/MultifamilyAnalysisDrawer.tsx`

### Result
Multifamily drawer now handles loading, error, stale-cache fallback, and empty-state cases without silent failures.

---

## 4) Files Changed Summary

### Modified
1. `src/schemas/BuyBoxSchemas.ts`
2. `src/schemas/BuyBoxFormSchema.ts`
3. `src/content/Dashboards/BuyBox/EditBuyBox/Sections/InvestmentStrategy.tsx`
4. `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.tsx`
5. `src/content/Dashboards/RealEstate/MapControls/MainControls.tsx`
6. `src/content/Dashboards/RealEstate/MapUtils/CoordinatesUtils.tsx`
7. `src/content/Dashboards/RealEstate/Map.tsx`
8. `src/content/Dashboards/RealEstate/MapComponents/CardsPanel/CardsPanel.tsx`

### Added
5. `src/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton.tsx`
6. `src/content/Dashboards/RealEstate/MapComponents/CardsPanel/MultifamilyDealCard.tsx`

---

## 5) What Works Now (Current Functional UX)

1. User opens BuyBox create/edit dialog.
2. User can choose `Multifamily` strategy.
3. Stepper flow changes to multifamily-specific steps.
4. In steps 4-5, user gets dedicated tabbed Multifamily UX.
5. All 10 tabs have editable input fields.
6. Unit Mix supports dynamic multi-row add/remove behavior.

---

## 6) Known Gaps / Risks (Important)

### 6.1 Schema/data persistence gap for new multifamily fields
Current multifamily tab fields are registered via RHF paths like:
- `multifamilyCriteria.*`
- `multifamilySetup.*`

These trees are now formalized in `formBuyBoxSchema` and `buyboxSchema`, but backend contract verification is still recommended.

**Practical implication:**
- UI captures values in form state and includes them in schema-driven payload shape.
- Still validate backend persistence/roundtrip behavior in integration testing.

### 6.2 Type safety gap in multifamily tabs component
`useFormContext<any>()` is currently used for speed/iteration. This avoids TS blocking, but sacrifices strict typing.

### 6.3 Validation gap
No dedicated Zod validation rules yet for multifamily tab values (ranges, requiredness, units, etc.).

### 6.4 Testing gap
No Storybook/Jest/RTL coverage yet for new multifamily components and interactions.

---

## 7) Detailed Forward Plan (Next Steps)

## Phase A - Data Contract Stabilization (recommended before map/search integrations)

## Step A1: Extend schemas for multifamily payload

### Scope
- Add `multifamilyCriteria` + `multifamilySetup` structures to:
  - `BuyBoxSchemas.ts` (API/domain schema)
  - `BuyBoxFormSchema.ts` (form schema + transform + defaults)

### Why now
Ensures fields entered in tabs are not lost and can flow through create/update API.

### Acceptance Criteria
- Save and reopen a multifamily buybox without losing entered tab values.
- No TS errors/lint for new schema types.

---

## Phase B - Real Estate discovery integration

## Step B1: Search filter integration for Multifamily buyboxes

### Scope
- Ensure multifamily buyboxes appear/select correctly in map control filtering.
- Strategy-aware filtering behavior aligned with selected buybox strategy.

### Files likely involved
- `src/content/Dashboards/RealEstate/MapControlPanel/MapControlPanel.tsx`
- Related buybox selection/filter logic.

### Acceptance Criteria
- Multifamily buybox is selectable in filter UI.
- Selecting it updates search behavior consistently.

## Step B2: Map marker adaptation (2-row marker for multifamily)

### Scope
- Marker display to support multifamily-specific metrics.
- Planned visual: Row1 discount-like metric, Row2 price-per-unit.

### Acceptance Criteria
- Marker remains legible on desktop/mobile.
- No regression for existing strategy marker rendering.

## Step B3: Multifamily deal card component

### Scope
- Create dedicated `MultifamilyDealCard`.
- Integrate into cards panel/mobile panel based on strategy.

### Files likely involved
- `CardsPanel.tsx`
- `MobilePanel.tsx`
- New card component file near existing `PropertyCard.tsx`

### Acceptance Criteria
- Multifamily cards render meaningful multifamily KPIs.
- Existing property card flow unaffected for non-multifamily.

---

## Phase C - Multifamily analysis drawer

## Step C1: Drawer shell + tabs skeleton

### Scope
- Create dedicated left drawer with tabs:
  - Quick Screen
  - Scenarios
  - Income
  - Expenses
  - Debt & Returns
  - Documents
  - Notes

### Acceptance Criteria
- Drawer opens with proper tabs and responsive layout.

## Step C2: Populate drawer tab UI content

### Scope
- Implement section-level UI (read/edit shells) for all drawer tabs.
- Keep business logic minimal initially.

### Acceptance Criteria
- Each tab has clear, non-placeholder content.
- Consistent typography/spacing/accessibility.

---

## Phase D - Cross-cutting quality

## Step D1: ProvenanceBadge

### Scope
- Create reusable provenance indicator badge.
- Integrate into central metrics/tables where source confidence is needed.

### Acceptance Criteria
- Badge variant system exists and is reused consistently.

## Step D2: API hook wiring

### Scope
- Wire new multifamily fields/components to relevant API hooks.
- Keep logic thin (wiring only, no heavy business rules yet).

### Acceptance Criteria
- No orphan UI state; data paths are connected.

## Step D3: Loading & error states

### Scope
- Add baseline loading/error states for multifamily flows.

### Acceptance Criteria
- No silent failures on slow/failed requests.

## Step D4: Storybook coverage

### Scope
- Add stories for:
  - Multifamily tabs component
  - Multifamily deal card
  - Drawer shell/content

### Acceptance Criteria
- Stories compile and allow visual regression checks.

## Step D5: Jest + RTL smoke tests

### Scope
- Add smoke tests for:
  - Strategy switch behavior
  - Tab rendering
  - Unit mix add/remove
  - Save flow sanity

### Acceptance Criteria
- CI/local tests pass for newly added coverage.

---

## 8) Verification Matrix for Upcoming Work

| Area | What to verify manually | What to automate |
|---|---|---|
| BuyBox dialog strategy switch | Step labels + rendered sections change by strategy | RTL: select strategy and assert step text |
| Multifamily tabs | Fields render and retain values while navigating tabs | RTL: input values and tab switch persistence |
| Unit mix | Add/remove row behavior + min one row protection | RTL: append/remove row assertions |
| Save/reopen | Multifamily data survives submit + re-open | Integration smoke or API contract test |
| Real estate map integration | Filter/marker/card switch by strategy | Storybook + selective integration tests |

---

## 9) Suggested Next Action (after approval)

Proceed with **Step D4 (Storybook coverage)**.

---

## 10) Quick Status Snapshot

- [x] Multifamily strategy enum + form selection
- [x] Strategy-aware step flow
- [x] 10-tab multifamily UI scaffold
- [x] Tabs 1-10 with concrete form inputs
- [x] Multifamily schema + transform persistence
- [x] Search filter integration
- [x] Marker adaptation
- [x] Multifamily deal card
- [x] Multifamily drawer
- [x] Provenance badge
- [x] API wiring
- [x] Loading/error states
- [ ] Storybook
- [ ] Jest/RTL
