# Realty Explorers Multifamily BuyBox Frontend Specification

Version 1.0

Purpose

This document defines the full and detailed frontend specification for the Multifamily BuyBox only.

The BuyBox exists to let a user define:

1. what Multifamily deals should be searched
2. what type of opportunity they want
3. what projected outcome matters
4. what document quality is required for ranking

The BuyBox is not a full underwriting form.

It should ask only for information the user can answer immediately in Basic mode.
Deeper assumptions and deal specific overrides belong later in the Deal Drawer.

============================================================
SECTION 1 PRODUCT ROLE OF THE BUYBOX
============================================================

The BuyBox is the entry point to the Multifamily workflow.

The BuyBox feeds the Search tab.

The Search tab uses the BuyBox to:
1. filter listings
2. compute first pass projected outcomes
3. rank deals according to strategy
4. show only relevant Multifamily opportunities

The BuyBox must not ask the user to fully underwrite a deal.

The BuyBox must not ask for:
vacancy assumptions
concessions assumptions
management fee assumptions
utility assumptions
taxes assumptions
insurance assumptions
financing assumptions
stress test assumptions

Those belong in the Deal Drawer.

============================================================
SECTION 2 BUYBOX USER EXPERIENCE PRINCIPLES
============================================================

1. Ask for immediate investor intent, not spreadsheet assumptions.
2. Keep Basic mode short and intuitive.
3. Strategy comes before heavy filtering logic.
4. The user should understand what success means before setting thresholds.
5. The BuyBox should feel predictive, not administrative.
6. Every field must either:
   a. define search scope
   b. define opportunity profile
   c. define the outcome target
   d. define document strictness
7. Avoid fields that are only useful after selecting a specific deal.
8. Reuse the existing Configure BuyBox flow style already present in Realty Explorers.
9. Use the same design language, spacing, buttons, and stepper behavior already used in the product.
10. The BuyBox must be completable quickly in Basic mode.

============================================================
SECTION 3 BUYBOX PAGE STRUCTURE
============================================================

Top level flow

Keep the current Configure BuyBox modal or page pattern already used in the product.

Top stepper

1. General
2. Strategy
3. Location
4. Deal Filters
5. Quality Gates

Left side navigation

General
Strategy
Location
Deal Filters
Quality Gates

Do not include a standard step called Underwriting Assumptions.

If advanced mode exists later, it must appear as an optional advanced panel inside Strategy or Deal Filters, not as a required top level step.

Footer actions

Back
Reset current step
Save Draft
Save and Finish
Next

Rules

Reset resets only the current step
Save Draft must persist partial progress
Save and Finish must validate required sections
Next must not advance if the current step has invalid required data

============================================================
SECTION 4 GLOBAL FRONTEND STATE
============================================================

Frontend root state namespace

buybox_form

Recommended state shape

buybox_form.general
buybox_form.strategy
buybox_form.location
buybox_form.filters
buybox_form.quality_gates
buybox_form.ui

UI state

buybox_form.ui.visibility_mode
buybox_form.ui.is_dirty
buybox_form.ui.is_saving
buybox_form.ui.preview_state
buybox_form.ui.validation_errors

Visibility mode

Allowed values

standard
advanced

Default

standard

Advanced mode is optional and hidden by default.

============================================================
SECTION 5 STEP 1 GENERAL
============================================================

Purpose

Capture only the identifying information for the BuyBox.

Section title

General

Required fields

### 5.1 BuyBox Name

Label
BuyBox Name

Type
single line text input

Placeholder
Example: Cleveland Value Add 25 to 75 Units

Validation
required
min length 3
max length 120

Helper text
Use a name that makes the strategy and market easy to recognize later.

Binding
buybox_form.general.name

### 5.2 Internal Note

Label
Internal Note

Type
multiline textarea

Placeholder
Optional note for your team

Validation
optional
max length 500

Helper text
This note is only for internal reference.

Binding
buybox_form.general.note

Autosave rules

Debounced autosave after 800 ms on text changes
Show Draft saved status on success
If save fails, show inline warning and keep the local draft

============================================================
SECTION 6 STEP 2 STRATEGY
============================================================

Purpose

Define what outcome the system should optimize for.

This is the most important BuyBox step.

Section title

Strategy

Helper text

Choose what kind of deals should rise to the top.

------------------------------------------------------------
6.1 Strategy Preset Cards
------------------------------------------------------------

Primary control

Strategy card grid

Cards

Core
Cash Flow
Value Add
Opportunistic
Deep Discount

Each card must show

Title
One line description
Four bar visualization
Yield
Risk
Upside
Stability

Card descriptions

Core
Prioritizes stability and durable yield.

Cash Flow
Prioritizes immediate income and operating reliability.

Value Add
Prioritizes rent upside and recoverable inefficiency.

Opportunistic
Prioritizes larger upside with higher acceptable risk.

Deep Discount
Prioritizes price dislocation versus projected value.

Selected card state

2 px border
filled background
check icon
shadow increase
accessible contrast ratio

Deselected state

outline only
neutral background

Keyboard behavior

Arrow keys navigate cards
Enter selects card
Focus ring visible at all times

Stored values

core
cash_flow
value_add
opportunistic
deep_discount

Binding
buybox_form.strategy.preset

------------------------------------------------------------
6.2 Strategy Explainability Panel
------------------------------------------------------------

Placement

Directly under the strategy cards

Title
How deals will be prioritized

Sections
Top drivers
Top penalties
Document importance

This panel must update live based on the selected strategy.

Example config

Core
Top drivers
Projected yield
Stability
Low risk
Top penalties
Weak occupancy
Low confidence
Document importance
Documents matter but do not dominate ranking

Cash Flow
Top drivers
Projected yield
NOI quality
Lower risk
Top penalties
High expense profile
Missing documents
Document importance
Documents moderately increase confidence

Value Add
Top drivers
Projected rent upside
Projected value gap
Occupancy upside
Top penalties
High risk
Weak market support
Document importance
Docs improve confidence and upside accuracy

Opportunistic
Top drivers
Projected IRR
Projected rent upside
Projected value gap
Top penalties
High uncertainty
Thin comp support
Document importance
Documents help validate aggressive upside

Deep Discount
Top drivers
Projected value gap
Price per unit discount
Yield
Top penalties
Weak recovery case
Missing support data
Document importance
Documents help confirm discount is real

This panel is informational in Basic mode.

Binding

buybox_form.strategy.explainability_preview

------------------------------------------------------------
6.3 Minimum Projected Outcome
------------------------------------------------------------

Purpose

This is the Multifamily equivalent of the single family target metric such as percent under ARV.

It defines the minimum projected outcome a deal must meet to be considered relevant.

Dynamic field label by strategy

Core
Minimum Yield

Cash Flow
Minimum Cash Yield

Value Add
Minimum Rent Upside

Opportunistic
Minimum IRR

Deep Discount
Minimum Value Gap

Control type

Slider plus numeric input

Display rules

The label must update when strategy changes
The unit must update correctly
Percent sign shown where applicable

Suggested ranges by strategy

Core
range 0 to 15
default 6.0
step 0.1

Cash Flow
range 0 to 15
default 7.0
step 0.1

Value Add
range 0 to 50
default 10.0
step 0.5

Opportunistic
range 0 to 40
default 14.0
step 0.25

Deep Discount
range 0 to 40
default 12.0
step 0.25

Two bindings required

buybox_form.strategy.minimum_projected_outcome_type
buybox_form.strategy.minimum_projected_outcome_value

Value mapping

core -> yield
cash_flow -> cash_yield
value_add -> rent_upside
opportunistic -> irr
deep_discount -> value_gap

Helper text

Only show deals that meet at least this projected outcome.

------------------------------------------------------------
6.4 Optional Advanced Strategy Panel
------------------------------------------------------------

Visibility

Only visible when visibility_mode = advanced

Title
Advanced Strategy Weights

Helper text
Use only if you want to manually tune the ranking model.

Fields

rent_upside_weight
price_discount_weight
occupancy_upside_weight
market_growth_weight
risk_penalty_weight

Type
sliders 0 to 100

Rules

All weights must sum to 100
Changing one slider redistributes the remainder proportionally unless the user is editing in manual lock mode if added later
Provide Reset to Strategy Preset button
Do not show this panel in Basic mode

Bindings

buybox_form.strategy.custom_weights.rent_upside_weight
buybox_form.strategy.custom_weights.price_discount_weight
buybox_form.strategy.custom_weights.occupancy_upside_weight
buybox_form.strategy.custom_weights.market_growth_weight
buybox_form.strategy.custom_weights.risk_penalty_weight

============================================================
SECTION 7 STEP 3 LOCATION
============================================================

Purpose

Define the geographic search universe.

Section title

Location

Fields

### 7.1 Country

Label
Country

Type
searchable dropdown

Default
United States

Validation
required

Binding
buybox_form.location.country

### 7.2 State

Label
State

Type
searchable dropdown

Validation
required

Binding
buybox_form.location.state

### 7.3 City

Label
City

Type
searchable autocomplete

Validation
required

Binding
buybox_form.location.city

### 7.4 Polygon Search Area

Label
Search Area

Type
interactive map polygon selector

Required map actions

Draw polygon
Edit polygon
Delete polygon
Clear polygon
Fit to polygon

Validation

At least one of:
city selected
or polygon provided

If both exist, polygon narrows the city search.

Binding
buybox_form.location.polygon_geojson

Helper text

Draw a custom area if you want to narrow the market beyond city boundaries.

============================================================
SECTION 8 STEP 4 DEAL FILTERS
============================================================

Purpose

Define the search universe and the opportunity profile.

Section title

Deal Filters

Helper text

Set the deal profile you want us to search for.

------------------------------------------------------------
8.1 Asset Type
------------------------------------------------------------

Label
Asset Type

Type
searchable multi select with chips

Allowed values

Garden Style
Mid Rise
High Rise
Small Multifamily
Mixed Use Residential
Student Housing
Senior Housing

Stored values

multifamily_garden
multifamily_midrise
multifamily_highrise
multifamily_small
mixed_use_residential
student_housing
senior_housing

Default
multifamily_garden

Validation
at least one value required

Binding
buybox_form.filters.asset_types

------------------------------------------------------------
8.2 Unit Count Range
------------------------------------------------------------

Label
Units

Type
dual range slider plus numeric inputs plus preset chips

Min
2

Max
2000

Default
10 to 200

Step
1

Preset chips

10 plus
25 plus
50 plus
100 plus
200 plus

Preset behavior

Sets minimum value to preset threshold
Keeps current maximum if valid
If current maximum becomes invalid, set to max system limit

Bindings

buybox_form.filters.unit_count_range.min
buybox_form.filters.unit_count_range.max

------------------------------------------------------------
8.3 Total Purchase Price Range
------------------------------------------------------------

Label
Total Purchase Price

Type
dual currency slider plus numeric inputs

Min
0

Max
200000000

Default
0 to 30000000

Step
50000

Preset chips

1M to 5M
5M to 15M
15M to 30M

Bindings

buybox_form.filters.total_price_range.min
buybox_form.filters.total_price_range.max

------------------------------------------------------------
8.4 Price Per Unit Range
------------------------------------------------------------

Label
Price Per Unit

Type
dual currency slider plus numeric inputs plus preset chips

Min
0

Max
2000000

Default
50000 to 350000

Step
5000

Preset chips

Under 75k
75k to 125k
125k to 200k
200k to 350k
350k plus

Bindings

buybox_form.filters.price_per_unit_range.min
buybox_form.filters.price_per_unit_range.max

------------------------------------------------------------
8.5 Year Built Range
------------------------------------------------------------

Label
Year Built

Type
dual slider plus vintage preset chips

Min
1900

Max
current year plus 1

Default
1960 to current year plus 1

Preset chips

Vintage 1960 to 1979
Classic 1980 to 1999
Modern 2000 to 2014
New 2015 plus

Bindings

buybox_form.filters.year_built_range.min
buybox_form.filters.year_built_range.max

------------------------------------------------------------
8.6 Value Add Level
------------------------------------------------------------

Label
Value Add Level

Type
segmented control

Options

Turnkey
Light Value Add
Heavy Value Add
Reposition

Stored values

turnkey
light_value_add
heavy_value_add
reposition

Default
light_value_add

Binding
buybox_form.filters.value_add_level

Helper text

Choose how much operational or physical improvement you are willing to take on.

------------------------------------------------------------
8.7 Current Occupancy Range
------------------------------------------------------------

Label
Current Occupancy Range

Type
dual slider plus preset chips

Min
0

Max
100

Default
70 to 95

Step
1

Preset chips

Stabilized
Value Add
Distressed

Preset mappings

Stabilized -> 85 to 95
Value Add -> 70 to 90
Distressed -> 40 to 75

Binding

buybox_form.filters.occupancy_range.min
buybox_form.filters.occupancy_range.max

Helper text

This reflects current occupancy, not target occupancy.

------------------------------------------------------------
8.8 Minimum Rent Upside
------------------------------------------------------------

Label
Minimum Rent Upside

Type
single slider plus numeric input

Min
0

Max
50

Default
5

Step
0.5

Preset chips

0
5
10
15

Binding
buybox_form.filters.minimum_rent_upside_pct

Helper text

Use this to filter for deals where in place rents appear below market rents.

------------------------------------------------------------
8.9 Cap Rate Range
------------------------------------------------------------

Label
Cap Rate Range

Type
dual slider plus numeric inputs

Min
0

Max
20

Default
4 to 10

Step
0.1

Binding

buybox_form.filters.cap_rate_range.min
buybox_form.filters.cap_rate_range.max

------------------------------------------------------------
8.10 Minimum NOI Per Unit
------------------------------------------------------------

Label
Minimum NOI Per Unit

Type
currency input

Min
0

Max
50000

Default
0

Step
50

Binding
buybox_form.filters.minimum_noi_per_unit

Helper text

Optional filter for normalized operating performance.

------------------------------------------------------------
8.11 Expense Ratio Range
------------------------------------------------------------

Label
Expense Ratio Range

Type
dual slider plus numeric inputs

Min
0

Max
90

Default
30 to 65

Step
0.5

Binding

buybox_form.filters.expense_ratio_range.min
buybox_form.filters.expense_ratio_range.max

Helper text

Optional filter for operational efficiency.

------------------------------------------------------------
8.12 Live Preview Module
------------------------------------------------------------

Placement

Right summary rail on desktop
Bottom sticky preview panel on tablet and mobile

Title
Live Preview

Fields shown

Matching Deals
Average Projected IRR
Average Price Per Unit
Average Rent Upside
Updated At

States

loading
success
empty
error

Loading state
show skeleton metrics

Error state
Unable to preview matching deals right now.

Empty state
Adjust filters or location to see estimated matching deals.

Backend data fields expected

matching_deals_count
average_projected_irr
average_price_per_unit
average_rent_upside_pct
updated_at

============================================================
SECTION 9 STEP 5 QUALITY GATES
============================================================

Purpose

Define how strict the ranking engine should be about key missing documents.

Section title

Quality Gates

Helper text

Optional shows all deals.
Preferred boosts deals that include the document.
Required hides deals missing the document.

Fields

### 9.1 Offering Memorandum

Binding
buybox_form.quality_gates.offering_memorandum

### 9.2 Rent Roll

Binding
buybox_form.quality_gates.rent_roll

### 9.3 T12

Binding
buybox_form.quality_gates.t12

Control type for each

three state segmented control

Allowed states

optional
preferred
required

Suggested defaults

Offering Memorandum = preferred
Rent Roll = preferred
T12 = optional

Layout

Card grid desktop
Single column mobile

============================================================
SECTION 10 BUYBOX SUMMARY RAIL
============================================================

Persistent summary content

BuyBox Name
Strategy Preset
Minimum Projected Outcome
Location
Asset Types
Units Range
Price Per Unit Range
Occupancy Range
Quality Gates Summary
Estimated Matching Deals

Behavior

Updates live as the user edits inputs
On mobile, becomes collapsible summary panel

============================================================
SECTION 11 VALIDATION RULES
============================================================

Required validation

BuyBox Name required
Strategy preset required
Minimum projected outcome required
Location required
At least one asset type required

Range validation

All min values must be less than or equal to max values

Specific validation

unit_count_range.min <= unit_count_range.max
total_price_range.min <= total_price_range.max
price_per_unit_range.min <= price_per_unit_range.max
year_built_range.min <= year_built_range.max
occupancy_range.min <= occupancy_range.max
cap_rate_range.min <= cap_rate_range.max
expense_ratio_range.min <= expense_ratio_range.max

Error presentation

Inline under field
Summary list at top of current step if multiple errors exist
Save and Finish disabled if required validation fails

============================================================
SECTION 12 ACCESSIBILITY REQUIREMENTS
============================================================

1. Every control must have a visible label
2. Placeholder text must not act as the primary label
3. All cards and segmented controls must be keyboard accessible
4. All sliders must have numeric input mirrors
5. Selected state must not rely only on color
6. Focus states must be clearly visible
7. Error states must include text and icon
8. Summary rail must be screen reader accessible
9. Polygon drawing must have non pointer fallback instructions
10. Stepper must support keyboard navigation

============================================================
SECTION 13 RESPONSIVE RULES
============================================================

Desktop

Left step navigation
Main form panel
Right summary rail

Tablet

Top stepper
Main form panel
Bottom preview panel
Collapsible summary

Mobile

Single column flow
Step tabs or progress header
Bottom sticky actions
Collapsible preview and summary sections

============================================================
SECTION 14 FRONTEND DATA CONTRACT EXPECTATIONS
============================================================

The BuyBox frontend expects backend support for:

create draft
update draft
validate buybox
preview matches
save final buybox

Expected preview response

matching_deals_count
average_projected_irr
average_price_per_unit
average_rent_upside_pct
updated_at

Expected create or update response

buybox_id
status
saved_at
validation_summary if any

============================================================
SECTION 15 FRONTEND ACCEPTANCE CHECKLIST
============================================================

1. BuyBox can be completed without underwriting knowledge
2. Basic mode does not ask financing or expense assumptions
3. Strategy defines the projected outcome target
4. Deal Filters define search scope and opportunity profile
5. Quality Gates affect ranking strictness
6. Live Preview works without saving final buybox
7. Save Draft supports partial progress
8. Save and Finish validates required fields
9. UI remains consistent with existing Realty Explorers buybox style
10. The BuyBox clearly prepares the Search tab for strategy based ranking

End of frontend specification
