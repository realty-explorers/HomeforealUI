
# Realty Explorers Multifamily BuyBox Backend Specification

Version 1.0

Purpose

This document is the authoritative backend implementation specification for the Multifamily BuyBox, deal search, first pass ranking, enriched analysis, document ingestion, defaults service, and explainability system.

Audience

Backend AI agents
Backend engineers
Data pipeline engineers
MLOps and search engineers
QA agents

Primary goal

Implement a two stage multifamily analysis system

Stage one
Fast discovery filtering and ranking from listing data plus market defaults

Stage two
Enriched analysis using OM, rent roll, T12, and other document extraction

SECTION 1 BACKEND PRINCIPLES

1. The backend data contract is larger than the frontend visible form.
2. The BuyBox contract is the strategy configuration input.
3. Listing ingestion produces raw deal facts.
4. Market defaults fill missing assumptions.
5. Documents override defaults at deal level.
6. First pass scoring must be fast and resilient to missing data.
7. Enriched analysis must be more accurate and explainable.
8. Every field used in scoring must carry source and confidence metadata.

SECTION 2 SERVICE ARCHITECTURE

The backend must be implemented as the following logical services. They can run as separate microservices or as modular domains inside one service boundary.

1. BuyBox Service
2. Market Defaults Service
3. Deal Ingestion Service
4. Document Ingestion Service
5. Document Extraction Service
6. First Pass Scoring Service
7. Enriched Analysis Service
8. Ranking Service
9. Explainability Service
10. Search API Gateway
11. Override and Recompute Service

SECTION 3 MICROSERVICE DEFINITIONS

3.1 BuyBox Service

Responsibilities
Create, update, validate, store, and version BuyBoxes

Primary entities
buybox
buybox_version

Core functions
validate_buybox
save_buybox
load_buybox
archive_buybox
resolve_strategy_preset_weights

Inputs
frontend buybox payload

Outputs
canonical buybox object

Storage
relational database table buyboxes
relational database table buybox_versions

3.2 Market Defaults Service

Responsibilities
Return suggested defaults for a market and asset profile

Inputs
city
state
asset_type
unit_bucket
year_built_bucket
strategy_preset

Outputs
vacancy_pct
concessions_pct
other_income_per_unit_month
management_fee_pct
payroll_maintenance_per_unit_year
reserves_per_unit_year
expense_ratio_baseline_pct
water_sewer_per_unit_month
electric_per_unit_month
gas_per_unit_month
trash_per_unit_month
property_taxes_per_unit_year
insurance_per_unit_year
interest_rate_pct
source metadata for each field

Sources
county assessor proxies
internal market tables
external data vendors if available

Caching
cache by market plus asset plus unit bucket plus vintage bucket

3.3 Deal Ingestion Service

Responsibilities
Ingest listing feeds and normalize listing level data

Inputs
listing provider feeds and scrapers

Outputs
canonical deal records

Required normalized fields
deal_id
source
address
lat
lng
asset_type
units
asking_price
price_per_unit
year_built
occupancy if present
avg_rent if present
document links
listing confidence

Storage
deals table
deal_provider_payloads raw JSON storage

3.4 Document Ingestion Service

Responsibilities
Download, classify, store, and track listing documents

Inputs
document urls
uploaded files

Outputs
stored documents with metadata

Document classes
offering_memorandum
rent_roll
t12
pnl
floorplans
unit_mix
capex_history
survey
phase1_environmental
other

Storage
documents table
object storage bucket

3.5 Document Extraction Service

Responsibilities
Parse docs into structured values and extracted tables

Inputs
stored documents

Outputs
document extractions

Examples
rent roll extracted rows
t12 extracted income lines
om extracted market rent statements
capex history items

Every extraction must include
field_name
value
source_document_id
source_document_type
source_page
extraction_confidence

Storage
document_extractions table

3.6 First Pass Scoring Service

Responsibilities
Compute initial search ranking from listing data plus BuyBox and market defaults

Inputs
buybox
deal listing record
market defaults

Outputs
first pass scoring object

This service must be optimized for speed and tolerate missing fields.

3.7 Enriched Analysis Service

Responsibilities
Compute document enriched deal analysis

Inputs
buybox
deal record
market defaults
document extractions
optional user overrides

Outputs
full underwriting object with source metadata and confidence

3.8 Ranking Service

Responsibilities
Sort candidate deals according to strategy weights and score objects

Inputs
first pass or enriched scores

Outputs
ordered result list

3.9 Explainability Service

Responsibilities
Generate top drivers, assumptions, warnings, and score breakdowns

Inputs
score object
source metadata
buybox preset

Outputs
explainability object for UI

3.10 Search API Gateway

Responsibilities
Single entry point for frontend

Endpoints
create buybox
update buybox
get buybox
search deals
get deal
score deal
apply documents
get explainability
get market defaults

3.11 Override and Recompute Service

Responsibilities
Apply user overrides and document overrides to deal assumptions, then trigger recompute

Inputs
deal_id
buybox_id
override payload
apply documents command

Outputs
updated enriched analysis and explainability

SECTION 4 DATA MODEL

Core entities

buybox
buybox_version
deal
deal_listing_metrics
document
document_extraction
market_defaults_snapshot
first_pass_score
enriched_analysis
deal_override
explainability_snapshot

Every numeric field stored in enriched_analysis must include companion metadata

source_type
source_id
confidence
filled_by_default boolean

SECTION 5 FIRST PASS ANALYSIS

Purpose

Fast search ranking before a user opens a deal.

Source priority for first pass

1 listing data
2 market defaults
3 buybox defaults

Do not use document extraction unless already available in cache.

5.1 First Pass Required Inputs

From deal listing
asking_price
units
price_per_unit or computable
year_built if present
occupancy if present
avg_rent if present
document flags

From buybox
discovery filters
strategy preset or advanced weights
quality gates

From market defaults
vacancy_pct
concessions_pct
other_income_per_unit_month
expense_ratio_baseline_pct
management_fee_pct
taxes proxy
insurance proxy

5.2 First Pass Filter Flow

Step 1 apply hard filters
asset type
units
purchase price
price per unit
year category
occupancy
optional cap rate range
optional NOI per unit range
optional rent upside minimum
optional expense ratio range

Step 2 apply quality gates
If required document missing then exclude
If preferred document present then mark for document score bonus

Step 3 compute first pass assumptions
Fill missing assumptions from market defaults and buybox defaults

5.3 First Pass Calculations

Computed helper variables

price_per_unit = asking_price / units if units > 0

gross_potential_rent_proxy =
avg_rent_unit_month * units * 12
if avg_rent_unit_month exists
else null

vacancy_loss_proxy =
gross_potential_rent_proxy * vacancy_pct / 100

concessions_loss_proxy =
gross_potential_rent_proxy * concessions_pct / 100

other_income_proxy =
other_income_per_unit_month * units * 12

effective_gross_income_proxy =
gross_potential_rent_proxy
minus vacancy_loss_proxy
minus concessions_loss_proxy
plus other_income_proxy

total_expenses_proxy =
effective_gross_income_proxy * expense_ratio_baseline_pct / 100

noi_proxy =
effective_gross_income_proxy minus total_expenses_proxy

noi_per_unit_proxy =
noi_proxy / units if units > 0

5.4 First Pass Subscores

All subscores normalized to 0 to 100

Yield Score
If noi_proxy and asking_price exist
cap_rate_proxy = noi_proxy / asking_price * 100
yield_score = normalize cap_rate_proxy within result set
Else
yield_score = 40

Upside Score
If market rent proxy exists and in place rent proxy exists
upside_raw = market_rent_proxy minus in_place_rent_proxy divided by market_rent_proxy
upside_score = clamp upside_raw * 100 / 0.30 between 0 and 100
Else
upside_score = 35

Discount Score
discount_raw = market_ppu_reference minus deal price_per_unit divided by market_ppu_reference
discount_score = normalize discount_raw to 0 through 100
If no market reference then relative normalization within result set

Risk Score
vacancy_risk from occupancy or vacancy proxy
age_risk from year built bucket
document_risk from missing docs
strategy_mismatch_risk from renovation appetite mismatch

risk_score =
0.40 vacancy_risk +
0.25 age_risk +
0.20 document_risk +
0.15 strategy_mismatch_risk

Scale to 0 through 100

Document Score
all three key docs present = 100
two key docs present = 70
one key doc present = 40
none = 10

5.5 First Pass Deal Score

Resolve weights from preset or advanced weights.

deal_score =
yield_score * wyield / 100 +
upside_score * wupside / 100 +
discount_score * wdiscount / 100 +
(100 minus risk_score) * wrisk / 100 +
document_score * wdocs / 100

Persist
first_pass_score table

SECTION 6 ENRICHED ANALYSIS

Purpose

Produce a more accurate analysis after document ingestion.

Source priority for enriched analysis

1 document extracted values
2 listing values
3 market defaults
4 buybox defaults

6.1 Enriched Inputs

Deal record
buybox
market defaults
document extractions
user overrides if any

Required extraction targets

From rent roll
current rent per unit
occupied status
unit type mix

From T12 or P and L
income lines
concessions
other income
expenses
taxes
insurance
payroll
maintenance
utilities

From OM
market rents
narrative flags
document quality
capex notes

6.2 Enriched Calculations

gross_potential_rent =
sum current unit rent * 12 from rent roll when available
Else fallback to proxy

vacancy_loss =
document vacancy if explicit
Else inferred from occupied units
Else default

concessions_loss =
document concessions if available
Else default

other_income =
document other income if available
Else defaults per unit * units * 12

effective_gross_income =
gross_potential_rent
minus vacancy_loss
minus concessions_loss
plus other_income

If itemized expenses available
total_expenses = sum itemized validated expense lines
Else total_expenses = effective_gross_income * expense_ratio_baseline_pct / 100

noi =
effective_gross_income minus total_expenses

cap_rate =
noi / asking_price * 100 if asking_price exists

noi_per_unit =
noi / units

market_rent_gap_pct =
market_rent_from_om_or_external minus current_in_place_rent divided by market_rent_from_om_or_external

dscr_proxy =
noi / annual_debt_service if financing defaults available

6.3 Enriched Rescoring

Recompute all subscores using document values wherever present.

Examples

document_score now reflects extraction confidence and completeness
risk_score now incorporates expense volatility and leverage risk with better data
yield_score now uses actual NOI
upside_score now uses actual market gap
discount_score can use better market references

Persist
enriched_analysis table
enriched_score table
explainability_snapshot table

SECTION 7 DOCUMENT APPLY FLOW

Endpoint
POST /api/v1/mf/deals/{deal_id}/apply_documents

Behavior

1. Load buybox defaults and current deal assumptions
2. Load extracted fields with confidence
3. For each override eligible field:
   if document confidence above threshold and field exists then propose replacement
4. If allow_overwrite_user_defaults false then skip fields already manually overridden
5. Persist applied overrides
6. Trigger enriched recompute

Return
applied_fields
skipped_fields
conflicts
new enriched score

SECTION 8 JSON CONTRACTS

8.1 BuyBox Contract

{
  "buybox_id": "string",
  "user_id": "string",
  "name": "string",
  "status": "draft|active|archived",
  "discovery": {
    "asset_types": [],
    "unit_count_range": { "min_units": 0, "max_units": 0 },
    "price_range": { "min_price": 0, "max_price": 0 },
    "price_per_unit_range": { "min_ppu": 0, "max_ppu": 0 },
    "year_built_categories": [],
    "renovation_appetite": "light|light_value_add|heavy_value_add|reposition|turnkey",
    "occupancy_range": { "min_pct": 0, "max_pct": 0 },
    "cap_rate_range": { "min_pct": 0, "max_pct": 0 },
    "rent_upside_min_pct": 0,
    "noi_per_unit_min": 0,
    "expense_ratio_range": { "min_pct": 0, "max_pct": 0 }
  },
  "strategy": {
    "preset": "core|balanced|cash_flow|value_add|opportunistic|deep_discount",
    "advanced_enabled": false,
    "advanced_weights": {
      "yield_weight": 0,
      "upside_weight": 0,
      "discount_weight": 0,
      "risk_weight": 0,
      "docs_weight": 0
    }
  },
  "quality_gates": {
    "offering_memorandum": "optional|preferred|required",
    "rent_roll": "optional|preferred|required",
    "t12": "optional|preferred|required",
    "floorplans": "optional|preferred|required",
    "unit_mix": "optional|preferred|required",
    "capex_history": "optional|preferred|required",
    "survey": "optional|preferred|required",
    "phase1_environmental": "optional|preferred|required"
  },
  "defaults": {
    "income_defaults": {
      "vacancy_pct": 0,
      "concessions_pct": 0,
      "bad_debt_pct": 0,
      "loss_to_lease_pct": 0,
      "other_income_per_unit_month": 0
    },
    "expense_defaults": {
      "management_fee_pct": 0,
      "payroll_maintenance_per_unit_year": 0,
      "reserves_per_unit_year": 0,
      "expense_ratio_baseline_pct": 0
    },
    "utilities_defaults": {
      "utility_billing_type": "owner_paid|tenant_paid|rubs",
      "water_sewer_per_unit_month": 0,
      "electric_per_unit_month": 0,
      "gas_per_unit_month": 0,
      "trash_per_unit_month": 0
    },
    "tax_insurance_defaults": {
      "property_taxes_per_unit_year": 0,
      "insurance_per_unit_year": 0
    },
    "financing_defaults": {
      "interest_rate_pct": 0,
      "ltv_pct": 0,
      "amort_years": 0,
      "io_months": 0,
      "min_dscr": 0,
      "closing_costs_pct": 0,
      "exit_cap_rate": 0
    }
  },
  "stress_test": {
    "preset": "conservative|base|aggressive|custom",
    "vacancy_add_pct": 0,
    "exit_cap_add_pct": 0,
    "interest_add_pct": 0,
    "noi_down_pct": 0
  }
}

8.2 Deal Contract

{
  "deal_id": "string",
  "source": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postal_code": "string",
    "lat": 0,
    "lng": 0
  },
  "asset_type": "string",
  "units": 0,
  "asking_price": 0,
  "price_per_unit": 0,
  "year_built": 0,
  "physical_occupancy_pct": 0,
  "avg_rent_unit_month": 0,
  "doc_flags": {
    "has_offering_memorandum": false,
    "has_rent_roll": false,
    "has_t12": false
  },
  "listing_confidence": 0,
  "doc_confidence": 0,
  "market_confidence": 0
}

8.3 Scoring Contract

{
  "deal_id": "string",
  "buybox_id": "string",
  "analysis_stage": "first_pass|enriched",
  "deal_score": 0,
  "subscores": {
    "yield_score": 0,
    "upside_score": 0,
    "discount_score": 0,
    "risk_score": 0,
    "document_score": 0
  },
  "inputs_used": {
    "missing_fields": [],
    "filled_by_defaults": [],
    "source_priority": []
  },
  "explainability": {
    "top_drivers": [],
    "warnings": [],
    "assumptions": []
  }
}

SECTION 9 API CONTRACTS

Create BuyBox
POST /api/v1/mf/buyboxes

Update BuyBox
PUT /api/v1/mf/buyboxes/{buybox_id}

Get BuyBox
GET /api/v1/mf/buyboxes/{buybox_id}

Search Deals
POST /api/v1/mf/deals/search

Get Deal
GET /api/v1/mf/deals/{deal_id}

Score Deal
POST /api/v1/mf/deals/{deal_id}/score

Get Explainability
GET /api/v1/mf/deals/{deal_id}/explainability?buybox_id={buybox_id}

Ingest Documents
POST /api/v1/mf/deals/{deal_id}/documents/ingest

Apply Documents
POST /api/v1/mf/deals/{deal_id}/apply_documents

Get Market Defaults
GET /api/v1/mf/markets/defaults?city={city}&state={state}&asset_type={asset_type}&unit_bucket={unit_bucket}&year_bucket={year_bucket}&strategy={preset}

SECTION 10 EXPLAINABILITY REQUIREMENTS

The backend must produce a deterministic explainability object for every score.

Required sections

score_summary
subscores
top_drivers
warnings
assumptions
suggestions

Confidence formula

confidence_pct =
0.5 * listing_confidence +
0.4 * doc_confidence +
0.1 * market_confidence

Top driver object shape

label
impact_points
direction positive or negative
evidence array with field value source confidence

Warnings examples

Missing required documents
Expense ratio baseline used
Taxes proxy used
Insurance proxy used
Occupancy missing and defaulted

Suggestions examples

Upload T12 to replace baseline expenses
Upload rent roll to verify occupancy and in place rent
Verify taxes after assessor update
Review market rents to confirm upside

SECTION 11 BACKEND ACCEPTANCE CHECKLIST

Implementation is complete only if

1. BuyBox service versions every save
2. Market defaults service returns source metadata
3. First pass scoring works when docs are missing
4. Enriched analysis overrides defaults using extracted docs
5. Document application returns conflicts and applied fields
6. Every scored field has source and confidence
7. Explainability service returns deterministic top drivers
8. Search ranking can use first pass scores for speed
9. Deal page can request enriched score independently
10. All APIs align with the documented contracts

End of backend specification
