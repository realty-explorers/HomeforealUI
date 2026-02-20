import AnalyzedProperty from '@/models/analyzedProperty';
import { skipToken } from '@reduxjs/toolkit/query';
import { propertiesApiEndpoints } from '@/store/services/propertiesApiService';
import { formatCurrency, numberFormatter } from '@/utils/converters';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import ProvenanceBadge, { ProvenanceVariant } from './ProvenanceBadge';

type MultifamilyAnalysisDrawerProps = {
  open: boolean;
  property?: AnalyzedProperty;
  buyboxId?: string;
  propertyId?: string;
  masked?: boolean;
  onClose: () => void;
};

const multifamilyTabs = [
  'Quick Screen',
  'Scenarios',
  'Income',
  'Expenses',
  'Debt & Returns',
  'Documents',
  'Notes'
];

type MetricRowProps = {
  label: string;
  value: string;
  provenance?: ProvenanceVariant;
};

const MetricRow = ({ label, value, provenance }: MetricRowProps) => (
  <Box className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-b-0 gap-4">
    <Box className="flex items-center gap-2 min-w-0">
      <Typography className="font-poppins text-sm text-gray-700">{label}</Typography>
      {provenance && <ProvenanceBadge variant={provenance} />}
    </Box>
    <Typography className="font-poppins text-sm font-semibold text-right text-gray-900">
      {value}
    </Typography>
  </Box>
);

const SectionCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box className="border border-gray-200 rounded-lg p-3 bg-white">
    <Typography className="font-poppins font-semibold text-sm mb-2 text-gray-900">
      {title}
    </Typography>
    {children}
  </Box>
);

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const toTextLabel = (value: unknown): string => {
  if (value === undefined || value === null || value === '' || value === 'N/A') {
    return 'N/A';
  }

  return `${value}`;
};

const toCurrencyLabel = (value: unknown): string => {
  const numericValue = toNumber(value);
  if (numericValue === undefined) {
    return toTextLabel(value);
  }

  return formatCurrency(numericValue);
};

const toPercentLabel = (value: unknown, digits = 2): string => {
  const numericValue = toNumber(value);
  if (numericValue === undefined) {
    return toTextLabel(value);
  }

  return `${numericValue.toFixed(digits)}%`;
};

const MultifamilyAnalysisDrawer = ({
  open,
  property: fallbackProperty,
  buyboxId,
  propertyId,
  masked = false,
  onClose
}: MultifamilyAnalysisDrawerProps) => {
  const propertyState = propertiesApiEndpoints.getProperty.useQueryState(
    open && buyboxId && propertyId
      ? {
          buybox_id: buyboxId,
          property_id: propertyId,
          masked
        }
      : skipToken
  );
  const property =
    (propertyState.data as AnalyzedProperty | undefined) || fallbackProperty;
  const shouldUsePropertyQuery = Boolean(open && buyboxId && propertyId);
  const isLoadingLatestProperty =
    shouldUsePropertyQuery && (propertyState.isLoading || propertyState.isFetching);
  const hasPropertyQueryError =
    shouldUsePropertyQuery && Boolean(propertyState.isError);
  const hasFallbackProperty = Boolean(fallbackProperty);

  const propertyErrorMessage = useMemo(() => {
    const error = propertyState.error as
      | { data?: unknown; error?: string }
      | string
      | undefined;

    if (!error) {
      return 'Unable to load the latest property analysis.';
    }

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error.data === 'string') {
      return error.data;
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    return 'Unable to load the latest property analysis.';
  }, [propertyState.error]);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!open) {
      setActiveTab(0);
    }
  }, [open]);

  const propertyAddress = useMemo(() => {
    return property?.location?.address || 'Selected Multifamily Property';
  }, [property]);

  const bedsBathsLabel = useMemo(() => {
    const beds = toNumber(property?.beds);
    const baths = toNumber(property?.baths);

    if (beds === undefined && baths === undefined) {
      return 'N/A';
    }

    return `${beds ?? 'N/A'} / ${baths ?? 'N/A'}`;
  }, [property?.baths, property?.beds]);

  const areaLabel = useMemo(() => {
    const area = toNumber(property?.area);

    if (area === undefined) {
      return 'N/A';
    }

    return `${numberFormatter(Math.round(area))} sqft`;
  }, [property?.area]);

  const pricePerSqftLabel = useMemo(() => {
    const price = toNumber(property?.price);
    const area = toNumber(property?.area);

    if (price === undefined || area === undefined || area <= 0) {
      return 'N/A';
    }

    return formatCurrency(price / area);
  }, [property?.area, property?.price]);

  const opportunities = useMemo(() => {
    if (!Array.isArray(property?.opportunities)) {
      return [] as string[];
    }

    return property.opportunities.filter(
      (note): note is string => typeof note === 'string' && note.trim().length > 0
    );
  }, [property?.opportunities]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box className="space-y-3">
            <SectionCard title="Property Snapshot">
              <MetricRow
                label="Price"
                value={toCurrencyLabel(property?.price)}
                provenance="listing"
              />
              <MetricRow
                label="Cap Rate"
                value={toPercentLabel(property?.capRate)}
                provenance="calculated"
              />
              <MetricRow
                label="NOI"
                value={toCurrencyLabel(property?.noi)}
                provenance="calculated"
              />
              <MetricRow label="Area" value={areaLabel} provenance="listing" />
              <MetricRow
                label="Beds / Baths"
                value={bedsBathsLabel}
                provenance="listing"
              />
            </SectionCard>

            <SectionCard title="Asset Context">
              <MetricRow
                label="Type"
                value={toTextLabel(property?.type)}
                provenance="listing"
              />
              <MetricRow
                label="Status"
                value={toTextLabel(property?.status)}
                provenance="listing"
              />
              <MetricRow
                label="Year Built"
                value={toTextLabel(property?.yearBuilt)}
                provenance="listing"
              />
              <MetricRow
                label="Neighborhood"
                value={toTextLabel(property?.location?.neighborhood)}
                provenance="listing"
              />
            </SectionCard>
          </Box>
        );
      case 1:
        return (
          <SectionCard title="Scenario Baseline">
            <MetricRow
              label="Purchase Price"
              value={toCurrencyLabel(property?.price)}
              provenance="listing"
            />
            <MetricRow
              label="ARV"
              value={toCurrencyLabel(property?.arvPrice)}
              provenance="comps"
            />
            <MetricRow
              label="ARV 25"
              value={toCurrencyLabel(property?.arv25Price)}
              provenance="comps"
            />
            <MetricRow
              label="Margin"
              value={toCurrencyLabel(property?.margin)}
              provenance="calculated"
            />
            <MetricRow
              label="Margin %"
              value={toPercentLabel(property?.marginPercentage)}
              provenance="calculated"
            />
          </SectionCard>
        );
      case 2:
        return (
          <SectionCard title="Income Overview">
            <MetricRow
              label="NOI"
              value={toCurrencyLabel(property?.noi)}
              provenance="calculated"
            />
            <MetricRow
              label="Rental Comps Price"
              value={toCurrencyLabel(property?.rentalCompsPrice)}
              provenance="comps"
            />
            <MetricRow
              label="Cap Rate"
              value={toPercentLabel(property?.capRate)}
              provenance="calculated"
            />
            <MetricRow
              label="Price / Sqft"
              value={pricePerSqftLabel}
              provenance="calculated"
            />
          </SectionCard>
        );
      case 3:
        return (
          <Box className="space-y-3">
            <SectionCard title="Transaction Expenses">
              <MetricRow
                label="Fixed Fee"
                value={toCurrencyLabel(property?.expenses?.fixedFee?.expenseAmount)}
                provenance="assumption"
              />
              <MetricRow
                label="Closing Fee"
                value={toCurrencyLabel(property?.expenses?.closingFee?.expenseAmount)}
                provenance="assumption"
              />
              <MetricRow
                label="Selling Fee"
                value={toCurrencyLabel(property?.expenses?.sellingFee?.expenseAmount)}
                provenance="assumption"
              />
              <MetricRow
                label="Rehab"
                value={toCurrencyLabel(property?.expenses?.rehab?.expenseAmount)}
                provenance="assumption"
              />
            </SectionCard>

            <SectionCard title="Operational Expenses">
              <MetricRow
                label="Property Tax"
                value={toCurrencyLabel(
                  property?.operationalExpenses?.propertyTax?.expenseAmount
                )}
                provenance="assumption"
              />
              <MetricRow
                label="Insurance"
                value={toCurrencyLabel(
                  property?.operationalExpenses?.insurance?.expenseAmount
                )}
                provenance="assumption"
              />
              <MetricRow
                label="Maintenance"
                value={toCurrencyLabel(
                  property?.operationalExpenses?.maintenance?.expenseAmount
                )}
                provenance="assumption"
              />
              <MetricRow
                label="Management"
                value={toCurrencyLabel(
                  property?.operationalExpenses?.management?.expenseAmount
                )}
                provenance="assumption"
              />
              <MetricRow
                label="Vacancy"
                value={toCurrencyLabel(
                  property?.operationalExpenses?.vacancy?.expenseAmount
                )}
                provenance="assumption"
              />
            </SectionCard>
          </Box>
        );
      case 4:
        return (
          <Box className="space-y-3">
            <SectionCard title="Debt Profile">
              <MetricRow
                label="Loan Amount"
                value={toCurrencyLabel(property?.loan?.amount?.expenseAmount)}
                provenance="assumption"
              />
              <MetricRow
                label="Down Payment"
                value={toCurrencyLabel(property?.loan?.downPayment?.expenseAmount)}
                provenance="assumption"
              />
              <MetricRow
                label="Closing Cost"
                value={toCurrencyLabel(property?.loan?.closingCost?.expenseAmount)}
                provenance="assumption"
              />
              <MetricRow
                label="Interest Rate"
                value={toPercentLabel(property?.loan?.interestRate)}
                provenance="assumption"
              />
              <MetricRow
                label="Loan Duration"
                value={
                  toNumber(property?.loan?.duration) !== undefined
                    ? `${property?.loan?.duration} months`
                    : 'N/A'
                }
                provenance="assumption"
              />
            </SectionCard>

            <SectionCard title="Returns Snapshot">
              <MetricRow
                label="Total Payment"
                value={toCurrencyLabel(property?.loan?.totalPayment)}
                provenance="calculated"
              />
              <MetricRow
                label="Margin"
                value={toCurrencyLabel(property?.margin)}
                provenance="calculated"
              />
              <MetricRow
                label="Margin %"
                value={toPercentLabel(property?.marginPercentage)}
                provenance="calculated"
              />
              <MetricRow
                label="Cap Rate"
                value={toPercentLabel(property?.capRate)}
                provenance="calculated"
              />
            </SectionCard>
          </Box>
        );
      case 5:
        return (
          <SectionCard title="Document Checklist">
            <Box className="flex flex-wrap gap-2">
              <Chip label="Rent Roll (pending)" size="small" />
              <Chip label="T12 (pending)" size="small" />
              <Chip label="Offering Memorandum (pending)" size="small" />
              <Chip label="Lease Audit (pending)" size="small" />
            </Box>
            <Box className="mt-2">
              <ProvenanceBadge variant="pending" />
            </Box>
          </SectionCard>
        );
      case 6:
        return (
          <Box className="space-y-3">
            <SectionCard title="Analyst Notes">
              {opportunities.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {opportunities.map((note) => (
                    <li key={note}>
                      <Typography className="font-poppins text-sm text-gray-700">
                        {note}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography className="font-poppins text-sm text-gray-600">
                  No notes were provided for this property yet.
                </Typography>
              )}
            </SectionCard>

            <SectionCard title="Next Actions">
              <Typography className="font-poppins text-sm text-gray-700">
                1. Validate current assumptions and unit-level rent roll.
              </Typography>
              <Typography className="font-poppins text-sm text-gray-700">
                2. Attach supporting docs in the Documents tab.
              </Typography>
              <Typography className="font-poppins text-sm text-gray-700">
                3. Capture underwriting comments for investment committee review.
              </Typography>
            </SectionCard>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={open}
      PaperProps={{
        sx: {
          width: 380,
          maxWidth: '100vw',
          pt: 1,
          zIndex: 1400
        }
      }}
    >
      <Box className="h-full flex flex-col bg-white">
        <Box className="px-3 py-2 flex items-center justify-between">
          <div>
            <Typography className="font-poppins font-semibold text-base">
              Multifamily Analysis
            </Typography>
            <Typography className="font-poppins text-xs text-gray-600 max-w-[18rem] truncate">
              {propertyAddress}
            </Typography>
          </div>

          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {isLoadingLatestProperty && <LinearProgress />}

        {hasPropertyQueryError && hasFallbackProperty && (
          <Box className="px-3 pt-2">
            <Alert severity="warning" className="font-poppins text-xs">
              Showing cached property data. Refresh failed.
            </Alert>
          </Box>
        )}

        <Divider />

        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          className="px-2"
        >
          {multifamilyTabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              className="font-poppins normal-case text-xs"
            />
          ))}
        </Tabs>

        <Divider />

        <Box className="p-4 flex-1 overflow-y-auto">
          <Typography className="font-poppins font-semibold text-sm mb-2">
            {multifamilyTabs[activeTab]}
          </Typography>

          {isLoadingLatestProperty && !property && (
            <Alert severity="info" className="font-poppins text-xs">
              Loading latest property analysis data...
            </Alert>
          )}

          {hasPropertyQueryError && !property && (
            <Alert severity="error" className="font-poppins text-xs">
              {propertyErrorMessage}
            </Alert>
          )}

          {!property && !isLoadingLatestProperty && !hasPropertyQueryError && (
            <Alert severity="info" className="font-poppins text-xs">
              Select a property to view multifamily analysis.
            </Alert>
          )}

          {property && renderTabContent()}
        </Box>
      </Box>
    </Drawer>
  );
};

export default MultifamilyAnalysisDrawer;
