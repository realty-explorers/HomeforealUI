# Multifamily UI Update - Full Progress & Detailed Forward Plan

**Last Updated:** 2026-02-23  
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

## Step 18 - Storybook coverage (D4)

### Goal
Add Storybook stories for new Multifamily UI components to support isolated visual verification.

### Changes
- Added Storybook stories for Multifamily analysis drawer:
  - default open with sample property data
  - empty selection state
  - closed state
- Added Storybook stories for Multifamily deal card:
  - default
  - selected
  - missing metrics fallback
- Added Storybook stories for Multifamily tabs skeleton:
  - criteria mode
  - setup mode
- Wrapped tabs story with `react-hook-form` `FormProvider` and default buybox form values.
- Fixed Storybook runtime crash (`"reducer" is a required argument`) by exporting and reusing `rootReducer` from store setup so the test harness mock store can initialize properly.

### Files
- `src/stories/multifamily/MultifamilyAnalysisDrawer.stories.tsx`
- `src/stories/multifamily/MultifamilyDealCard.stories.tsx`
- `src/stories/multifamily/MultifamilyTabsSkeleton.stories.tsx`
- `src/store/store.ts`

### Result
Multifamily drawer, deal card, and tabs components are now available in Storybook for focused UI review and regression checks.

---

## Step 19 - Jest + RTL smoke tests (D5)

### Goal
Add automated smoke coverage for multifamily strategy UI behavior, tab interactions, and save-schema sanity.

### Changes
- Added Jest setup and config for project-level RTL execution.
- Added strategy switch smoke tests for `InvestmentStrategy`:
  - default Fix & Flip rendering
  - switch to Multifamily state
  - disabled state for coming-soon strategy buttons
- Added multifamily tabs smoke tests for `MultifamilyTabsSkeleton`:
  - criteria tab navigation
  - Unit Mix add/remove behavior
  - value persistence across tab switches
- Added schema-level save sanity tests for `formBuyBoxSchema`:
  - valid multifamily payload parses successfully
  - invalid minimal payload fails on required fields
- Updated Jest `testMatch` to use `*.test.ts(x)` and avoid picking up non-test scratch files.

### Files
- `jest.config.js`
- `jest.setup.ts`
- `src/content/Dashboards/BuyBox/EditBuyBox/Sections/InvestmentStrategy.test.tsx`
- `src/content/Dashboards/BuyBox/EditBuyBox/Sections/MultifamilyTabsSkeleton.test.tsx`
- `src/schemas/BuyBoxFormSchema.test.ts`

### Result
Step D5 is complete with passing local smoke tests (`3 suites / 7 tests`).

---

## Step 20 - Post-D5 hardening (integration + TS cleanup)

### Goal
Add integration-style save/reopen confidence for multifamily payloads and resolve Map.tsx TypeScript issues introduced during multifamily wiring.

### Changes
- Extracted buybox-to-form mapping into a reusable utility:
  - `mapBuyBoxDataToForm`
  - `convertBuyboxWeights`
- Updated `EditBuyBoxDialog` to reuse shared mapping for:
  - initial edit-state hydration
  - view-only dialog reset path
- Added integration-style roundtrip test for multifamily save/reopen flow:
  - starts from API-shaped buybox payload
  - maps to form state
  - validates save payload via `formBuyBoxSchema`
  - remaps reopened payload and asserts multifamily persistence
- Fixed `Map.tsx` TypeScript issues by:
  - safely deriving session `verified` via typed guard variable
  - narrowing cluster geometry to `Point` before reading coordinates
  - using typed `maxBounds` tuple cast compatible with `react-map-gl`
- Fixed GeoJSON type inference in `CoordinatesUtils` by adding explicit `Feature<Point, ...>` return types.

### Files
- `src/content/Dashboards/BuyBox/EditBuyBox/buyboxFormMappers.ts`
- `src/content/Dashboards/BuyBox/EditBuyBox/buyboxFormMappers.test.ts`
- `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.tsx`
- `src/content/Dashboards/RealEstate/Map.tsx`
- `src/content/Dashboards/RealEstate/MapUtils/CoordinatesUtils.tsx`

### Result
Post-D5 hardening is complete:
- Multifamily save/reopen roundtrip is now covered at integration-style test level.
- Map multifamily wiring no longer reports the previously surfaced TypeScript errors in `Map.tsx`.

Validation:
- `npm test -- --runInBand` → **4 suites / 8 tests passing**
- `npm run lint` → **no ESLint warnings/errors**

---

## Step 21 - Post-D5 hardening extension (dialog + mutation integration test)

### Goal
Extend multifamily save/reopen confidence beyond mapper-level by covering `EditBuyBoxDialog` submit + reopen behavior with mocked RTK Query mutation hooks.

### Changes
- Added `EditBuyBoxDialog.test.tsx` integration-style test that:
  - renders dialog in edit mode with `MULTIFAMILY` strategy defaults
  - edits a multifamily-specific setup field (`multifamilySetup.riskAndNotes.notes`)
  - submits via `useUpdateBuyBoxMutation`
  - reopens dialog with submitted payload and verifies value rehydration
- Added focused test mocks for:
  - mutation hooks from buybox API service
  - heavy child modules and icon/motion dependencies that are not under test
  - browser `matchMedia` for stable jsdom behavior

### Files
- `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.test.tsx`

### Result
Dialog-level multifamily save/reopen behavior is now covered in automated integration-style testing, complementing mapper-level roundtrip coverage.

Validation:
- `npm test -- --runInBand` → **5 suites / 9 tests passing**
- `npm run lint` → **no ESLint warnings/errors**

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
7. `src/content/Dashboards/BuyBox/EditBuyBox/buyboxFormMappers.ts`
8. `src/content/Dashboards/BuyBox/EditBuyBox/buyboxFormMappers.test.ts`
9. `src/content/Dashboards/BuyBox/EditBuyBox/EditBuyBoxDialog.test.tsx`

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
Storybook and Jest/RTL smoke coverage are in place, with both mapper-level and dialog-level multifamily save/reopen integration-style tests now implemented. Remaining gap is full end-to-end API/transport verification against real backend environments.

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

Proceed with **post-D5 validation**:
- run manual QA for multifamily save/edit/reopen against a real backend response
- optionally add backend contract assertions (request/response payload snapshots) once real API fixtures are confirmed
- optionally prioritize broader repository TypeScript debt cleanup (outside multifamily scope)

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
- [x] Storybook
- [x] Jest/RTL
- [x] Post-D5 hardening (roundtrip integration-style test + Map.tsx TS cleanup)
- [x] Dialog-level save/reopen integration test (`EditBuyBoxDialog` + mocked RTK Query mutation)

---

## 11) Frontend Rebaseline Plan (Spec Sync - 2026-02-23)

> This section supersedes the prior forward plan for BuyBox Multifamily UX shape.  
> Focus is **frontend-only** (no backend implementation changes in this phase).

## 11.1 Why this rebaseline is needed

Current BuyBox multifamily UI was implemented as a 10-tab model (`Criteria + Setup`) and includes labels/fields that are now considered Deal-stage concerns.

The updated product direction requires:
- strict BuyBox information architecture (`discovery`, `defaults`, `ranking`)
- explicit separation from Deal-stage underwriting (`deal.mf.*`)
- no TTM terminology in BuyBox UI
- defaults clearly labeled as "used only when missing"

## 11.2 Frontend scope boundaries (explicit)

### In scope
- BuyBox wizard step labels, tab labels, tab order, helper text, and validations
- BuyBox form field paths and UI grouping per the new Multifamily spec
- UX-only guardrails to prevent Deal-stage inputs from appearing in BuyBox
- Storybook/Jest updates for the new tab model

### Out of scope
- Backend persistence logic changes
- Deal drawer underwriting form expansion
- Document parsing logic and extraction pipelines

## 11.3 Target IA to enforce in UI

### BuyBox namespaces (editable in BuyBox)
- `buybox.discovery`
- `buybox.defaults`
- `buybox.ranking`

### Deal namespaces (not editable in BuyBox)
- `deal.mf.listing`
- `deal.mf.documents`
- `deal.mf.extractions`
- `deal.mf.scenarios`
- `deal.mf.overrides`
- `deal.mf.results`

## 11.4 Wizard layout target (new)

### Step 4: Multifamily Discovery
Tabs:
1. Asset Filters
2. Unit Mix Preferences
3. Deal Quality Gates
4. Ranking Weights

### Step 5: Multifamily Defaults
Tabs:
1. Income Defaults
2. Expense Defaults
3. Utilities Defaults
4. Taxes and Insurance Defaults
5. Financing Defaults
6. Stress Test Presets

### Critical UX rule
- No tab/section in BuyBox may contain "TTM" labeling.

## 11.5 Field delivery plan by screen (frontend form + validation)

## Step 4 / Tab 1 - Asset Filters

### Section A: Property type and size
- `buybox.discovery.asset.asset_type`
- `buybox.discovery.asset.unit_count_min`
- `buybox.discovery.asset.unit_count_max`
- `buybox.discovery.asset.year_built_min`
- `buybox.discovery.asset.year_built_max`
- `buybox.discovery.asset.total_rentable_sf_min`
- `buybox.discovery.asset.total_rentable_sf_max`

Validation UX:
- min/max pair validation (max >= min)
- year range 1800..current year
- non-negative numeric guards

### Section B: Price filters
- `buybox.discovery.pricing.asking_price_min`
- `buybox.discovery.pricing.asking_price_max`
- `buybox.discovery.pricing.price_per_unit_min`
- `buybox.discovery.pricing.price_per_unit_max`

Validation UX:
- non-negative values
- max >= min per pair

### Section C: Occupancy and exclusions
- `buybox.discovery.occupancy.occupancy_percent_min`
- `buybox.discovery.occupancy.occupancy_percent_max`
- `buybox.discovery.asset.exclusions`

Validation UX:
- percent range 0..100
- max >= min

## Step 4 / Tab 2 - Unit Mix Preferences

### Section A: Allowed unit types (preferences only)
- `buybox.discovery.unit_mix.allowed_unit_types[]`
  - `unit_type_label`
  - `beds`
  - `baths`

UX rules:
- row-based add/remove UI
- do not collect required property-level counts per type in BuyBox

### Section B: Mix constraints
- `buybox.discovery.unit_mix.max_studios_percent`
- `buybox.discovery.unit_mix.min_two_bed_plus_percent`

### Section C: Rent band preferences
- `buybox.discovery.rent_band.avg_in_place_rent_monthly_range.{min,max}`
- `buybox.discovery.rent_band.avg_market_rent_monthly_range.{min,max}`

### Section D: Renovation appetite
- `buybox.discovery.capex.renovation_appetite`

## Step 4 / Tab 3 - Deal Quality Gates

### Section A: Document requirements
- `buybox.ranking.gates.require_documents.offering_memorandum`
- `buybox.ranking.gates.require_documents.rent_roll`
- `buybox.ranking.gates.require_documents.operating_statement_t12`

### Section B: Minimum data requirements
- `buybox.ranking.gates.require_core_fields`
- `buybox.ranking.gates.minimum_confidence_level`

## Step 4 / Tab 4 - Ranking Weights

All fields under:
- `buybox.ranking.weights.discount_to_value`
- `buybox.ranking.weights.rent_upside`
- `buybox.ranking.weights.expense_efficiency`
- `buybox.ranking.weights.document_completeness`
- `buybox.ranking.weights.risk_penalties`

UX behavior:
- range guard 0..1
- show total weight sum
- include "Auto normalize" button if sum != 1

## Step 5 / Tab 1 - Income Defaults

Fields under `buybox.defaults.income`:
- `vacancy_percent`
- `concessions_percent`
- `bad_debt_percent`
- `collection_loss_percent`
- `loss_to_lease_percent`
- `model_units_count`
- `other_income_per_unit_monthly`

## Step 5 / Tab 2 - Expense Defaults

Fields under `buybox.defaults.expenses`:
- `expense_mode`
- `expense_ratio_percent`
- `operating_expense_per_unit_annual`
- `management_fee_percent`
- `reserve_per_unit_annual`

## Step 5 / Tab 3 - Utilities Defaults

Fields under `buybox.defaults.utilities`:
- `water_sewer_per_unit_monthly`
- `electric_per_unit_monthly`
- `gas_per_unit_monthly`
- `trash_per_unit_monthly`
- `reimbursement_percent`

## Step 5 / Tab 4 - Taxes and Insurance Defaults

Fields:
- `buybox.defaults.taxes.taxes_per_unit_annual`
- `buybox.defaults.insurance.insurance_per_unit_annual`
- `buybox.defaults.taxes.post_sale_tax_multiplier`
- `buybox.defaults.taxes.assume_abatement_flag`

## Step 5 / Tab 5 - Financing Defaults

Fields under `buybox.defaults.financing`:
- `ltv_percent`
- `interest_rate_percent`
- `amortization_years`
- `interest_only_months`
- `closing_costs_percent`
- `minimum_dscr`

## Step 5 / Tab 6 - Stress Test Presets

Fields under `buybox.defaults.stress_test`:
- `preset`
- `vacancy_shock_percent`
- `exit_cap_expansion_percent`
- `interest_rate_shock_percent`
- `noi_haircut_percent`

UX behavior:
- read-only inputs for conservative/base/aggressive
- editable values only when preset = custom

## 11.6 BuyBox vs Deal-stage guardrails (frontend enforcement)

### Must remain editable in BuyBox
- `buybox.discovery.*`
- `buybox.defaults.*`
- `buybox.ranking.*`

### Must not appear as editable BuyBox fields
- purchase price for a specific property
- property-level rent roll rows
- property-level TTM line items
- property-level unit-count-by-type facts
- equity waterfall / preferred return structure for a specific deal
- scenario line-by-line underwriting assumptions

## 11.7 Frontend component refactor plan (implementation sequence + status)

## Phase F1 - IA and navigation refactor ✅ Complete
- [x] Update multifamily step titles in `EditBuyBoxDialog` for new Step 4/5 names.
- [x] Replace current Criteria/Setup tab arrays with new Discovery/Defaults tab arrays.
- [x] Remove TTM labels from BuyBox UI copy.

## Phase F2 - Multifamily tabs component restructuring ✅ Complete
- [x] Refactor `MultifamilyTabsSkeleton` render branches to match new tabs.
- [x] Keep progressive rendering per tab with section cards and helper text.
- [x] Add "Defaults used only when missing" helper where relevant.

## Phase F3 - Validation and interaction polish (frontend only) ✅ Complete
- [x] Add percent/range input guards and formatting hints.
- [x] Add ranking-weights sum indicator and normalize UX.
- [x] Add stress preset lock/unlock behavior.

## Phase F4 - Regression safety ✅ Complete
- [x] Update Storybook stories for new tab labels and representative fields.
- [x] Update RTL tests for new tab names and key interactions.
- [x] Ensure non-multifamily BuyBox behavior remains unchanged.

## 11.8 Acceptance criteria for this rebaseline

1. In BuyBox Multifamily flow, Step 4 and Step 5 match the new tab architecture exactly.
2. No TTM wording appears anywhere in BuyBox tabs/sections.
3. Discovery/defaults/ranking fields map to the new frontend field paths and validations.
4. Fields marked Deal-stage-only are not exposed in BuyBox editing UI.
5. Storybook and Jest smoke tests pass for updated Multifamily BuyBox tabs.
6. Generic/Fix-and-Flip BuyBox screens remain visually and functionally unchanged.

## 11.9 Frontend delivery checkpoints

- [x] Checkpoint 1: Wizard labels + tab arrays updated (no field migration yet)
- [x] Checkpoint 2: Step 4 tabs complete with validations and ranking UX polish
- [x] Checkpoint 3: Step 5 tabs complete with defaults helper text and preset behavior
- [x] Checkpoint 4: Storybook + RTL refreshed for Discovery/Defaults architecture

## 11.10 Verification log (2026-02-23)

### Automated tests
- `npm test -- MultifamilyTabsSkeleton.test.tsx EditBuyBoxDialog.test.tsx --runInBand` ✅ (2 suites, 6 tests)

### Storybook + Puppeteer visual checks
- Storybook started on `http://localhost:6006`
- Captured validation screenshots for updated multifamily tabs:
  - `mf-tabs-criteria-desktop`
  - `mf-tabs-criteria-mobile`
  - `mf-tabs-ranking-desktop`
  - `mf-tabs-setup-desktop`
  - `mf-tabs-setup-mobile`
  - `mf-tabs-stress-conservative-desktop`
  - `mf-tabs-stress-conservative-mobile`

### Interaction checks validated
- Ranking Weights tab shows total sum and normalize action when off target.
- Stress Test Presets apply preset values and lock fields in non-custom mode.
- Switching back to Custom unlocks stress inputs for manual edits.

