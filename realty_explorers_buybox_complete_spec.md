
# Realty Explorers Multifamily BuyBox Complete System Specification

Version 1.0

This document consolidates:

1 BuyBox Governance Specification
2 Full JSON Schemas
3 API Contracts
4 Scoring Engine Definitions
5 Explainability Panel Specification
6 Data Source Priority Rules
7 UX Governance Rules

All identifiers use snake_case.
All percentages are stored as numeric percent values.
All currency values are USD.

SECTION 1 BUYBOX GOVERNANCE SPECIFICATION

Core Principle

The BuyBox is a Strategy Configuration Engine.

Users define
1 Hard constraints
2 Strategy objective
3 Quality requirements
4 Underwriting assumptions
5 Stress conditions

The system determines ranking internally.

Raw scoring weights must never be exposed by default.

SECTION 2 INFORMATION ARCHITECTURE

Tabs must be

1 Discovery
2 Strategy
3 Quality Gates
4 Defaults
5 Stress Test

Remove any tab named Ranking Weights.

SECTION 3 DISCOVERY SPECIFICATION

Discovery defines hard filters.

Asset Filters fields

asset_types array
unit_count_range object
price_range object
price_per_unit_range object
year_built_range object
renovation_appetite enum
occupancy_range object

Remove small mid large chips
Remove stabilized value_add distressed chips inside occupancy

Unit Mix Targeting

unit_mix_targets.enabled boolean

If enabled true
sum of target_pct must equal 100

SECTION 4 STRATEGY PRESETS

Allowed presets

balanced
cash_flow
value_add
low_risk
deep_discount

Preset to internal weights mapping

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

low_risk
yield 20
upside 10
discount 15
risk 40
docs 15

deep_discount
yield 15
upside 20
discount 40
risk 15
docs 10

Weights must sum to 100.

SECTION 5 QUALITY GATES

Each document field must support

optional
preferred
required

If required and missing then exclude deal.
If preferred and present then boost document_score.

Documents

offering_memorandum
rent_roll
t12

SECTION 6 DEFAULTS SPECIFICATION

Defaults apply only when listing and documents lack values.

Income Defaults

vacancy_pct
concessions_pct
other_income_per_unit_month

Formulas

GSR equals sum of unit rents
vacancy_loss equals GSR multiplied by vacancy_pct divided by 100
concessions_loss equals GSR multiplied by concessions_pct divided by 100
other_income equals units multiplied by other_income_per_unit_month multiplied by 12
EGR equals GSR minus vacancy_loss minus concessions_loss plus other_income

Expense Defaults

User editable
management_fee_pct
payroll_maintenance_per_unit_year
reserves_per_unit_year
expense_ratio_baseline_pct

Market locked readonly
property_taxes_per_unit_year
insurance_per_unit_year

Expense fallback rule

If itemized expenses exist then
total_expenses equals sum of itemized

Else
total_expenses equals EGR multiplied by expense_ratio_baseline_pct divided by 100

Utilities Defaults

water_sewer_per_unit_month
electric_per_unit_month
gas_per_unit_month
trash_per_unit_month

Financing Defaults

interest_rate_pct
ltv_pct
amort_years
io_months
min_dscr
closing_costs_pct

SECTION 7 STRESS TEST

Presets

conservative
base
aggressive
custom

Conservative adjustments
vacancy_add_pct 5
exit_cap_add_pct 0.75
interest_add_pct 1
noi_down_pct 10

Base adjustments
vacancy_add_pct 2
exit_cap_add_pct 0.25
interest_add_pct 0.5
noi_down_pct 5

Aggressive adjustments
vacancy_add_pct 1
exit_cap_add_pct 0
interest_add_pct 0
noi_down_pct 2

SECTION 8 SCORING ENGINE

Subscores normalized between 0 and 100

yield_score
upside_score
discount_score
risk_score
document_score

Core formula

deal_score equals
yield_score multiplied by wyield divided by 100 plus
upside_score multiplied by wupside divided by 100 plus
discount_score multiplied by wdiscount divided by 100 plus
100 minus risk_score multiplied by wrisk divided by 100 plus
document_score multiplied by wdocs divided by 100

Yield score based on cap_rate and cash_on_cash percentile.

Upside score based on market_rent minus in_place_rent normalized.

Discount score based on market_price_per_unit minus deal_price_per_unit normalized.

Risk score composite of
vacancy risk
expense_ratio risk
leverage risk
age risk

Document score logic
100 if all documents present
70 if two documents
40 if one document
10 if none

SECTION 9 DATA SOURCE PRIORITY

Priority order

1 listing
2 documents
3 market dataset
4 user defaults

Fields must store source and confidence.

SECTION 10 JSON SCHEMA DEFINITIONS

BuyBox Schema

{
  "type": "object",
  "required": ["buybox_id","user_id","name","status","discovery","strategy","quality_gates","defaults","stress_test"],
  "properties": {
    "buybox_id": {"type":"string"},
    "user_id": {"type":"string"},
    "name": {"type":"string"},
    "status": {"type":"string"},
    "discovery": {"type":"object"},
    "strategy": {"type":"object"},
    "quality_gates": {"type":"object"},
    "defaults": {"type":"object"},
    "stress_test": {"type":"object"}
  }
}

Deal Schema

{
  "type":"object",
  "properties":{
    "deal_id":{"type":"string"},
    "units":{"type":"integer"},
    "asking_price":{"type":"number"},
    "price_per_unit":{"type":"number"},
    "physical_occupancy_pct":{"type":"number"},
    "avg_rent_unit_month":{"type":"number"}
  }
}

Scoring Output Schema

{
  "deal_id":"string",
  "buybox_id":"string",
  "deal_score":0,
  "subscores":{
    "yield_score":0,
    "upside_score":0,
    "discount_score":0,
    "risk_score":0,
    "document_score":0
  },
  "confidence_pct":0,
  "explainability":{
    "top_drivers":[],
    "warnings":[],
    "assumptions":[]
  }
}

SECTION 11 API CONTRACTS

Create BuyBox
POST /api/v1/mf/buyboxes

Update BuyBox
PUT /api/v1/mf/buyboxes/{buybox_id}

Search Deals
POST /api/v1/mf/deals/search

Score Deal
POST /api/v1/mf/deals/{deal_id}/score

Apply Documents
POST /api/v1/mf/deals/{deal_id}/apply_documents

Market Defaults
GET /api/v1/mf/markets/defaults

SECTION 12 EXPLAINABILITY PANEL SPECIFICATION

Placement
Left drawer on deal page.

Sections

1 Score Summary
2 Subscores
3 Top Drivers
4 Warnings and Assumptions
5 How to Improve
6 Show Math advanced toggle

Confidence formula

confidence_pct equals
0.5 multiplied by listing_confidence plus
0.4 multiplied by doc_confidence plus
0.1 multiplied by market_confidence

Required UI copy

DealScore tooltip text
DealScore summarizes return potential upside discount risk and document quality for your selected strategy.

Confidence tooltip text
Confidence reflects how much of the deal was verified by listing data and documents.

Defaults note text
Defaults are used only when listing and documents do not provide a value.

Market lock note text
Taxes and insurance are market based proxies and are locked unless verified by documents.

END OF DOCUMENT
