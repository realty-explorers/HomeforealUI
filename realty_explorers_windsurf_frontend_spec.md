
# Realty Explorers Multifamily BuyBox Frontend Specification for Windsurf AI Agent

Version 1.0

Purpose

This document is the authoritative frontend implementation specification for the Multifamily BuyBox experience inside Realty Explorers.

Audience

Windsurf frontend AI agent
Frontend engineers
Design system implementers
QA automation agents

Primary goal

Transform the current BuyBox into a low friction investor workflow that separates

1. discovery filters
2. strategy selection
3. quality gates
4. underwriting defaults
5. stress test presets

This document defines exact structure, visibility rules, labels, helper text, component types, states, interactions, validation, and frontend data binding.

SECTION 1 PRODUCT PRINCIPLES

1. The BuyBox is not a spreadsheet.
2. The BuyBox is not a deal underwriting form.
3. The BuyBox is a strategy and filtering engine.
4. The user should provide only what they actually know before opening a deal.
5. Anything that requires a rent roll, T12, OM, or property specific operating statement does not belong in standard discovery.
6. Strategy presets must be visible before advanced controls.
7. Raw scoring weights must be hidden by default.
8. Advanced mode is optional.
9. System suggested assumptions must be clearly labeled as suggested.
10. Deal page analysis is where document driven values override BuyBox defaults.

SECTION 2 PAGE STRUCTURE

Page id

buybox_create_or_edit

Page layout

Left side vertical step navigation
Main content column
Sticky summary panel on the right for desktop
Sticky footer actions on all breakpoints

Step order

1 buybox_filters
2 strategy
3 quality_gates
4 underwriting_assumptions
5 stress_testing
6 review_and_save

Remove the following legacy sections

general if redundant
multifamily_defaults as a top level name
ranking_weights as a top level tab
unit_mix_targeting as a default visible section
manual_gsr_input
manual_expense_ratio_input

Rename sections

multifamily_discovery becomes BuyBox Filters
multifamily_defaults becomes Underwriting Assumptions

SECTION 3 GLOBAL DESIGN AND UX RULES

3.1 Layout

Desktop
Use a three column structure when screen width allows it

Column 1 navigation width 220 px
Column 2 form content flexible
Column 3 summary panel width 320 px

Tablet
Collapse navigation into top step pills
Summary panel moves below content

Mobile
Single column
Step pills horizontally scrollable
Summary panel collapses into accordion

3.2 Sticky elements

Sticky footer must always show

Back
Next or Save BuyBox
Save Draft if supported

Sticky summary panel must show

BuyBox name
Selected market or location if available
Strategy preset
Current key filters
Units
Price per unit
Occupancy
Document gates
Estimated matching deals if endpoint available

3.3 Copy style

All labels must be plain English.
All helper text must explain what the field does, not how to think about finance.
Do not use unexplained abbreviations in standard mode.

3.4 Required helper badges

Each field that is not a hard filter must show one of these badges

Suggested
Advanced
Document override later
Computed later

3.5 Visibility modes

standard mode
advanced mode

standard mode shows only the essential fields

advanced mode reveals
extra defaults
raw ranking sliders
specialized assumptions
deal sensitive defaults

3.6 Default state

Standard mode on by default
Advanced mode off by default

3.7 Progress logic

The user can move between steps without filling all fields
The system must persist partial progress
Validation blocks only on logically broken values such as min greater than max

SECTION 4 STEP 1 BUYBOX FILTERS

Step id

buybox_filters

Step title

BuyBox Filters

Step helper text

Set the deal profile you want us to search for.

4.1 SECTION ASSET FILTERS

Field id
asset_types

Label
Asset type

Helper text
Select one or more property types.

Component
multi chip selector

Options with display text and stored values

Garden style -> multifamily_garden
Mid rise -> multifamily_midrise
High rise -> multifamily_highrise
Small multifamily -> multifamily_small
Mixed use residential -> mixed_use_residential
Student housing -> student_housing
Senior housing -> senior_housing

Default
multifamily_garden selected

Validation
Minimum one selection

Interaction
Chips toggle on click
Selected state uses filled style
Deselected state uses outlined style

Binding
buybox.discovery.asset_types

Field id
unit_count_range

Label
Units

Helper text
Filter by total number of units.

Component
dual range slider with min and max numeric inputs

Range
min 2
max 2000

Default
min 10
max 200

Step size
1

Preset buttons shown above slider
10 plus
25 plus
50 plus
100 plus
200 plus

Preset behavior
Clicking a preset sets min_units to threshold and keeps current max unless max is below threshold, in which case set max to 2000

Validation
min_units less than or equal to max_units

Binding
buybox.discovery.unit_count_range.min_units
buybox.discovery.unit_count_range.max_units

Field id
purchase_price_range

Label
Total purchase price

Helper text
Use this if you want to limit total deal size.

Component
dual range slider with currency inputs

Range
0 to 200000000

Default
0 to 20000000

Step size
50000

Formatting
USD currency no decimals in slider labels

Binding
buybox.discovery.price_range.min_price
buybox.discovery.price_range.max_price

Field id
price_per_unit_range

Label
Price per unit

Helper text
This is one of the most important multifamily filters.

Component
dual range slider with currency inputs

Range
0 to 2000000

Default
50000 to 350000

Step size
5000

Preset chips
Under 75000
75000 to 125000
125000 to 200000
200000 to 350000
350000 plus

Binding
buybox.discovery.price_per_unit_range.min_ppu
buybox.discovery.price_per_unit_range.max_ppu

Field id
year_built_category

Label
Year built

Helper text
Use categories that match common multifamily age buckets.

Component
multi chip selector

Options
Vintage 1960 to 1979 -> vintage_1960_1979
Classic 1980 to 1999 -> classic_1980_1999
Modern 2000 to 2014 -> modern_2000_2014
New construction 2015 plus -> new_2015_plus

Default
All selected

Binding
buybox.discovery.year_built_categories

Field id
renovation_appetite

Label
Value add level

Helper text
Choose how much operational or renovation work you are willing to take on.

Component
segmented control single select

Options
Turnkey -> turnkey
Light value add -> light_value_add
Heavy value add -> heavy_value_add
Reposition -> reposition

Default
light_value_add

Binding
buybox.discovery.renovation_appetite

Field id
occupancy_range

Label
Current occupancy range

Helper text
This reflects current occupancy, not target occupancy.

Component
dual range slider with preset chips

Range
0 to 100

Default
70 to 95

Step size
1

Preset chips
Stabilized 85 to 95
Value add 70 to 90
Distressed 40 to 75

Binding
buybox.discovery.occupancy_range.min_pct
buybox.discovery.occupancy_range.max_pct

4.2 SECTION ADDITIONAL FILTERS

Field id
cap_rate_range

Label
Cap rate range

Helper text
Optional filter. Use if you want to screen by yield.

Component
dual range slider with numeric inputs

Range
0 to 20

Default
4 to 10

Step size
0.1

Binding
buybox.discovery.cap_rate_range.min_pct
buybox.discovery.cap_rate_range.max_pct

Field id
rent_upside_min

Label
Minimum rent upside

Helper text
Filters for deals where current rents appear below market rents.

Component
slider with numeric input

Range
0 to 50

Default
5

Step size
0.5

Binding
buybox.discovery.rent_upside_min_pct

Field id
noi_per_unit_min

Label
Minimum NOI per unit

Helper text
Optional filter for normalized operating performance.

Component
currency input

Range
0 to 50000

Default
0

Step size
50

Binding
buybox.discovery.noi_per_unit_min

Field id
expense_ratio_range

Label
Expense ratio range

Helper text
Optional filter for operational efficiency.

Component
dual range slider with numeric inputs

Range
0 to 90

Default
30 to 65

Step size
0.5

Binding
buybox.discovery.expense_ratio_range.min_pct
buybox.discovery.expense_ratio_range.max_pct

4.3 LIVE FILTER IMPACT PANEL

Component id
live_results_preview

Placement
below asset filters on mobile
right summary panel on desktop

Content
matching deals count
average cap rate
average price per unit
average rent upside

Data source
search preview endpoint

Behavior
Debounced refresh 400 ms after any filter change

Empty state
Enter location and core filters to preview matching deals.

SECTION 5 STEP 2 STRATEGY

Step id
strategy

Step title
Strategy

Step helper text
Choose what kind of deals should rise to the top.

5.1 STRATEGY PRESET SELECTOR

Field id
strategy_preset

Label
Prioritize deals by

Helper text
Choose a preset. Advanced mode lets you customize the scoring weights.

Component
preset card selector

Cards in this order

Core
Balanced
Cash flow
Value add
Opportunistic
Deep discount

Stored values

core
balanced
cash_flow
value_add
opportunistic
deep_discount

Each card must visually show four bars

Yield
Risk
Upside
Stability

Card content definitions

Core
Yield medium
Risk low
Upside low
Stability high

Balanced
Yield medium
Risk medium
Upside medium
Stability medium

Cash flow
Yield high
Risk medium
Upside low
Stability medium

Value add
Yield medium
Risk medium
Upside high
Stability medium

Opportunistic
Yield low
Risk high
Upside high
Stability low

Deep discount
Yield medium
Risk medium
Upside medium
Stability low

Default
balanced

Binding
buybox.strategy.preset

5.2 ADVANCED SCORING PANEL

Visibility
Hidden unless advanced mode is enabled

Panel title
Advanced scoring

Helper text
Editing weights switches your strategy to Custom.

Field ids
yield_weight
upside_weight
discount_weight
risk_weight
docs_weight

Component
sliders 0 to 100

Default values depend on preset

core
yield 25
upside 10
discount 15
risk 35
docs 15

balanced
yield 25
upside 25
discount 25
risk 15
docs 10

cash_flow
yield 35
upside 15
discount 20
risk 20
docs 10

value_add
yield 20
upside 35
discount 25
risk 10
docs 10

opportunistic
yield 15
upside 40
discount 20
risk 15
docs 10

deep_discount
yield 15
upside 20
discount 40
risk 15
docs 10

Behavior
Weights must always sum to 100
When one slider changes, redistribute remaining sliders proportionally
If redistribution is impossible because all other sliders are zero, distribute evenly among the other unlocked sliders

Buttons
Reset to preset
Save custom

Bindings
buybox.strategy.advanced_enabled
buybox.strategy.advanced_weights.yield_weight
buybox.strategy.advanced_weights.upside_weight
buybox.strategy.advanced_weights.discount_weight
buybox.strategy.advanced_weights.risk_weight
buybox.strategy.advanced_weights.docs_weight

SECTION 6 STEP 3 QUALITY GATES

Step id
quality_gates

Step title
Quality Gates

Step helper text
Choose how strict the system should be about listing documents.

Each gate uses a three state segmented control.

States
Optional
Preferred
Required

Descriptions
Optional means do not filter or boost
Preferred means boost deals that include the document
Required means hide deals missing the document

Fields

offering_memorandum
rent_roll
t12
floorplans
unit_mix
capex_history
survey
phase1_environmental

Display labels

Offering memorandum
Rent roll
T12 operating statement
Floorplans
Unit mix summary
CapEx history
Survey
Phase 1 environmental

Bindings
buybox.quality_gates.offering_memorandum
buybox.quality_gates.rent_roll
buybox.quality_gates.t12
buybox.quality_gates.floorplans
buybox.quality_gates.unit_mix
buybox.quality_gates.capex_history
buybox.quality_gates.survey
buybox.quality_gates.phase1_environmental

SECTION 7 STEP 4 UNDERWRITING ASSUMPTIONS

Step id
underwriting_assumptions

Step title
Underwriting Assumptions

Step helper text
These values are used only when listings and documents do not provide them.

Top level layout
Accordion sections
Income assumptions
Expense assumptions
Utilities
Taxes and insurance
Financing

Fields labeled Suggested should display a badge and a source label when available.

7.1 INCOME ASSUMPTIONS

Field id
vacancy_pct

Label
Vacancy percent

Component
slider with numeric input

Range
0 to 30

Step size
0.5

Default
Market default from backend

Binding
buybox.defaults.income_defaults.vacancy_pct

Field id
concessions_pct

Label
Concessions percent

Component
slider with numeric input

Range
0 to 20

Step size
0.25

Default
Market default

Binding
buybox.defaults.income_defaults.concessions_pct

Field id
bad_debt_pct

Label
Bad debt percent

Visibility
Advanced mode only

Component
slider with numeric input

Range
0 to 15

Step size
0.25

Default
Market default

Binding
buybox.defaults.income_defaults.bad_debt_pct

Field id
loss_to_lease_pct

Label
Loss to lease percent

Visibility
Advanced mode only

Component
slider with numeric input

Range
0 to 25

Step size
0.25

Default
Market default

Binding
buybox.defaults.income_defaults.loss_to_lease_pct

Field id
other_income_per_unit_month

Label
Other income per unit per month

Component
currency input

Range
0 to 500

Step size
1

Default
Market default

Binding
buybox.defaults.income_defaults.other_income_per_unit_month

Remove any field named gross scheduled rent input or GSR input from the UI. It is computed later.

7.2 EXPENSE ASSUMPTIONS

Field id
management_fee_pct

Label
Management fee percent

Component
slider with numeric input

Range
0 to 12

Step size
0.25

Default
Market default

Binding
buybox.defaults.expense_defaults.management_fee_pct

Field id
payroll_maintenance_per_unit_year

Label
Payroll and maintenance per unit per year

Component
currency input

Range
0 to 20000

Step size
10

Default
Market default

Binding
buybox.defaults.expense_defaults.payroll_maintenance_per_unit_year

Field id
reserves_per_unit_year

Label
Reserves per unit per year

Component
currency input

Range
0 to 5000

Step size
10

Default
300

Binding
buybox.defaults.expense_defaults.reserves_per_unit_year

Field id
expense_ratio_baseline_pct

Label
Expense ratio baseline percent

Component
slider with numeric input

Range
0 to 80

Step size
0.5

Default
Market default

Binding
buybox.defaults.expense_defaults.expense_ratio_baseline_pct

Do not expose a manual field called expense ratio input in discovery. It belongs only here as a fallback assumption.

7.3 UTILITIES

Field id
utility_billing_type

Label
Utility billing type

Component
segmented control

Options
Owner paid -> owner_paid
Tenant paid -> tenant_paid
RUBS -> rubs

Default
owner_paid

Binding
buybox.defaults.utilities_defaults.utility_billing_type

Field ids
water_sewer_per_unit_month
electric_per_unit_month
gas_per_unit_month
trash_per_unit_month

Labels
Water and sewer per unit per month
Electric per unit per month
Gas per unit per month
Trash per unit per month

Component
currency inputs

Range
0 to 1000

Step size
1

Bindings
buybox.defaults.utilities_defaults.water_sewer_per_unit_month
buybox.defaults.utilities_defaults.electric_per_unit_month
buybox.defaults.utilities_defaults.gas_per_unit_month
buybox.defaults.utilities_defaults.trash_per_unit_month

7.4 TAXES AND INSURANCE

Field id
property_taxes_per_unit_year

Label
Property taxes per unit per year

Component
readonly field in standard mode
currency input in advanced mode only if policy allows edit

Badge
Market proxy

Source text example
Jefferson County assessor 2025 proxy

Binding
buybox.defaults.tax_insurance_defaults.property_taxes_per_unit_year

Field id
insurance_per_unit_year

Label
Insurance per unit per year

Component
readonly field in standard mode
currency input in advanced mode only if policy allows edit

Badge
Market proxy

Source text example
Regional insurance proxy 2025

Binding
buybox.defaults.tax_insurance_defaults.insurance_per_unit_year

7.5 FINANCING

Field id
interest_rate_pct

Label
Interest rate percent

Component
slider with numeric input

Range
0 to 20

Step size
0.125

Binding
buybox.defaults.financing_defaults.interest_rate_pct

Field id
ltv_pct

Label
Loan to value percent

Component
slider with numeric input

Range
0 to 90

Step size
1

Binding
buybox.defaults.financing_defaults.ltv_pct

Field id
amort_years

Label
Amortization years

Component
numeric input

Range
1 to 50

Step size
1

Binding
buybox.defaults.financing_defaults.amort_years

Field id
io_months

Label
Interest only months

Component
numeric input

Range
0 to 120

Step size
1

Binding
buybox.defaults.financing_defaults.io_months

Field id
min_dscr

Label
Minimum DSCR

Component
slider with numeric input

Range
0.5 to 3.0

Step size
0.05

Binding
buybox.defaults.financing_defaults.min_dscr

Field id
closing_costs_pct

Label
Closing costs percent

Component
slider with numeric input

Range
0 to 10

Step size
0.25

Binding
buybox.defaults.financing_defaults.closing_costs_pct

Field id
exit_cap_rate

Label
Exit cap rate

Component
slider with numeric input

Range
0 to 20

Step size
0.1

Binding
buybox.defaults.financing_defaults.exit_cap_rate

SECTION 8 STEP 5 STRESS TESTING

Step id
stress_testing

Step title
Stress Testing

Step helper text
Choose a preset for downside analysis. Advanced mode allows custom values.

Field id
stress_preset

Label
Stress test preset

Component
preset selector chips

Options
Conservative
Base
Aggressive
Custom

Default
Base

Binding
buybox.stress_test.preset

Preset values

Conservative
vacancy_add_pct 5
exit_cap_add_pct 0.75
interest_add_pct 1
noi_down_pct 10

Base
vacancy_add_pct 2
exit_cap_add_pct 0.25
interest_add_pct 0.5
noi_down_pct 5

Aggressive
vacancy_add_pct 1
exit_cap_add_pct 0
interest_add_pct 0
noi_down_pct 2

Advanced mode fields

vacancy_add_pct
Label Vacancy shock percent
Component numeric input
Range 0 to 30
Step size 0.25

exit_cap_add_pct
Label Exit cap expansion percent
Component numeric input
Range 0 to 5
Step size 0.05

interest_add_pct
Label Interest rate shock percent
Component numeric input
Range 0 to 10
Step size 0.125

noi_down_pct
Label NOI reduction percent
Component numeric input
Range 0 to 50
Step size 0.5

Bindings
buybox.stress_test.vacancy_add_pct
buybox.stress_test.exit_cap_add_pct
buybox.stress_test.interest_add_pct
buybox.stress_test.noi_down_pct

SECTION 9 STEP 6 REVIEW AND SAVE

Step id
review_and_save

Step title
Review and Save

Content
Read only summary of all selected filters and assumptions grouped by step

Must include
BuyBox name editable inline
Strategy preset
Core filters
Document gates
Top assumptions
Stress test preset
Estimated matching deals

Buttons
Back
Save Draft
Save BuyBox

Validation summary
Show any invalid ranges or missing required selections

SECTION 10 REQUIRED VISIBILITY RULES

10.1 Standard mode visible
Discovery fields
Strategy preset
Quality gates
Core underwriting assumptions
Stress preset

10.2 Advanced mode visible
Advanced scoring sliders
Bad debt
Loss to lease
Editable taxes and insurance if policy allows
Custom stress values

10.3 Never visible in BuyBox
Any rent roll row fields
Any T12 line item grid
Any property specific unit mix targeting rows by default
Any computed GSR input
Any manual NOI input
Any document extracted table
Any deal specific overrides

SECTION 11 REQUIRED DATA BINDING RULES

Every field must bind to canonical frontend state

state shape root
buybox_form

Subtrees
buybox_form.discovery
buybox_form.strategy
buybox_form.quality_gates
buybox_form.defaults
buybox_form.stress_test

On save, transform directly into backend contract without ad hoc renaming.

SECTION 12 VALIDATION RULES

Rules
All min values must be less than or equal to max values
Unit mix target sum must equal 100 only if unit mix targeting is enabled in advanced mode
At least one asset type selected
At least one strategy preset selected
Document gate values must be one of optional preferred required

Show validation inline under field and in top summary.

SECTION 13 SCORING EXPLAINABILITY PREVIEW IN BUYBOX

Add a small informational panel in Strategy step

Title
How deals will be prioritized

Show for selected preset
Top 3 ranking drivers
Top 2 penalties
Document importance summary

Example for Value add
Top drivers
Rent upside
Discount to value
Price per unit

Penalties
High risk
Missing documents

This is informational only and not editable in standard mode.

SECTION 14 ACCESSIBILITY AND VISUAL RULES

All controls must have visible labels
Do not rely on placeholder text as label
All segmented controls keyboard accessible
All sliders must have numeric input alternative
Color alone must not indicate state
Selected chips must have icon plus color difference
Readonly market proxy fields must visually differ from editable inputs

SECTION 15 PERFORMANCE RULES

Debounce search preview requests
Cache market defaults by city state asset type unit bucket year bucket
Do not recompute whole form on every keystroke
Use optimistic UI for preset changes
Persist draft locally before network save

SECTION 16 REQUIRED REMOVALS

Remove these sections or fields completely from standard BuyBox UI

Unit Mix Targeting
Manual Expense Ratio Input in discovery
Manual GSR Input
Raw ranking weights as default visible UI
Any spreadsheet style deal level operating statement table

SECTION 17 REQUIRED NEW UI COPY

BuyBox Filters helper
Set the deal profile you want us to search for.

Strategy helper
Choose what kind of deals should rise to the top.

Quality Gates helper
Optional shows all deals. Preferred boosts deals that include the document. Required hides deals missing the document.

Underwriting Assumptions helper
These values are used only when listings and documents do not provide them.

Stress Testing helper
Use presets for downside analysis. Advanced mode lets you fine tune the shocks.

Readonly market proxy note
This value is a market proxy and will be replaced by document data when available.

SECTION 18 FRONTEND ACCEPTANCE CHECKLIST

A Windsurf implementation is complete only if

1. Standard mode shows fewer than 20 visible controls across all steps before advanced mode is enabled
2. Strategy preset is visible before any raw scoring sliders
3. Quality gates use three state controls
4. Taxes and insurance show source badges
5. Unit mix targeting is not visible in standard mode
6. GSR is not a user input
7. Live preview updates when filters change
8. Review step summarizes everything before save
9. All fields bind to canonical schema
10. Save payload matches backend contract

End of frontend specification
