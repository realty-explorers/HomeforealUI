// Buybox shape helpers. The backend serializes buyboxes inconsistently
// (sometimes `parameters.buybox`, sometimes `parameters.buybox_form`;
// strategy fields under various keys) so these helpers normalize the
// lookups so the UI doesn't have to branch on shape.

type BuyBoxLike = {
  id?: string;
  parameters?: Record<string, unknown>;
};

export const normalizeStrategyType = (value: unknown) =>
  `${value ?? ''}`
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

export const isMultifamilyStrategyValue = (value: unknown) => {
  const normalized = normalizeStrategyType(value);
  if (!normalized) return false;
  return (
    normalized === 'MULTIFAMILY' ||
    normalized === 'MULTI_FAMILY' ||
    normalized === 'MULTY_FAMILY' ||
    (normalized.includes('MULTI') && normalized.includes('FAMILY')) ||
    (normalized.includes('MULTY') && normalized.includes('FAMILY'))
  );
};

const getBuyboxParameters = (buyBoxItem?: BuyBoxLike) =>
  (buyBoxItem?.parameters || {}) as Record<string, unknown>;

const getCanonicalBuybox = (parameters: Record<string, unknown>) =>
  (parameters.buybox_form as Record<string, unknown>) ||
  (parameters.buybox as Record<string, unknown>) ||
  {};

const toFiniteNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

export const getBuyboxPriceRange = (
  buyBoxItem?: BuyBoxLike
): [number, number] | null => {
  if (!buyBoxItem) return null;

  const parameters = getBuyboxParameters(buyBoxItem);
  const canonical = getCanonicalBuybox(parameters);
  const discovery = (canonical.discovery || {}) as Record<string, unknown>;
  const discoveryPriceRange =
    (discovery.price_range as Record<string, unknown>) || {};
  const propertyCriteria =
    (parameters.propertyCriteria as Record<string, unknown>) || {};

  const minCandidates = [
    discoveryPriceRange.min_price,
    discoveryPriceRange.min,
    propertyCriteria.minPrice,
    0
  ];
  const maxCandidates = [
    discoveryPriceRange.max_price,
    discoveryPriceRange.max,
    propertyCriteria.maxPrice,
    1000000
  ];

  const min = minCandidates
    .map((candidate) => toFiniteNumber(candidate))
    .find((candidate) => typeof candidate === 'number');
  const max = maxCandidates
    .map((candidate) => toFiniteNumber(candidate))
    .find((candidate) => typeof candidate === 'number');

  if (typeof min !== 'number' || typeof max !== 'number' || max < min) {
    return null;
  }

  return [min, max];
};

export const getBuyBoxStrategyType = (buyBoxItem?: BuyBoxLike) => {
  const parameters = getBuyboxParameters(buyBoxItem);
  const canonical = getCanonicalBuybox(parameters);
  const canonicalStrategy =
    (canonical.strategy || {}) as Record<string, unknown>;
  const strategy = (parameters.strategy || {}) as Record<string, unknown>;

  const sources = [
    canonicalStrategy.strategyType,
    canonicalStrategy.strategy_type,
    canonicalStrategy.mode,
    canonicalStrategy.preset,
    canonicalStrategy.strategy,
    strategy.strategyType,
    strategy.strategy_type,
    parameters.strategyType,
    strategy.mode,
    strategy.preset,
    parameters.strategy
  ];

  return (
    sources.find((source) => `${source ?? ''}`.trim().length > 0) ||
    'FIX_AND_FLIP'
  );
};

export const isMultifamilyBuyBoxValue = (buyBoxItem?: BuyBoxLike) => {
  const parameters = getBuyboxParameters(buyBoxItem);
  const sources = [
    getBuyBoxStrategyType(buyBoxItem),
    (parameters.strategy as Record<string, unknown> | undefined)?.strategy,
    parameters.strategy
  ];
  return (
    sources.some(isMultifamilyStrategyValue) ||
    isMultifamilyStrategyValue(parameters.name)
  );
};

export const getBuyboxDisplayName = (buyBoxItem?: BuyBoxLike) => {
  const parameters = getBuyboxParameters(buyBoxItem);
  return `${parameters.name || buyBoxItem?.id || 'Untitled BuyBox'}`;
};
