import AnalyzedProperty, { CompData } from '@/models/analyzedProperty';

export type FindingImpact = 'positive' | 'neutral' | 'negative';

export type Finding = {
  /** Short category label rendered as a pill on the UI. */
  label: string;
  impact: FindingImpact;
  /** One-line human-readable explanation. */
  note: string;
};

export type Analysis = {
  /** One-line headline summary of the comparison. */
  summary: string;
  findings: Finding[];
};

/**
 * Build a buyer-perspective comparison between the subject property and a comp.
 *
 * Framing: "positive" findings mean the subject is more attractive than the comp
 * (e.g. subject has more bedrooms, larger area, newer build) — i.e. if priced
 * similarly to the comp, the buyer is getting *more* property for the money.
 *
 * "Negative" findings mean the comp out-performs the subject on that dimension,
 * which makes it harder for the subject to justify a comparable price.
 *
 * Distance and ARV-tier are framed independent of subject:
 *   - proximity is always good (better locational match)
 *   - 25th-ARV tier is always a positive signal for valuation
 */
export const analyzeComp = (
  subject: AnalyzedProperty,
  comp: CompData
): Analysis => {
  const findings: Finding[] = [];

  // ── Bedrooms ──────────────────────────────────────────────────────────
  if (typeof subject?.beds === 'number' && typeof comp?.beds === 'number') {
    const delta = subject.beds - comp.beds;
    if (delta > 0) {
      findings.push({
        label: 'Bedrooms',
        impact: 'positive',
        note: `Subject has ${delta} more bedroom${delta > 1 ? 's' : ''} (${subject.beds} vs ${comp.beds}) — better value at a similar price.`
      });
    } else if (delta < 0) {
      findings.push({
        label: 'Bedrooms',
        impact: 'negative',
        note: `Subject has ${Math.abs(delta)} fewer bedroom${Math.abs(delta) > 1 ? 's' : ''} (${subject.beds} vs ${comp.beds}) — comp may justify a higher price point.`
      });
    } else {
      findings.push({
        label: 'Bedrooms',
        impact: 'neutral',
        note: `Same bedroom count (${comp.beds}) — direct layout match.`
      });
    }
  }

  // ── Bathrooms ─────────────────────────────────────────────────────────
  if (typeof subject?.baths === 'number' && typeof comp?.baths === 'number') {
    const delta = subject.baths - comp.baths;
    if (delta > 0) {
      const pretty = Number.isInteger(delta) ? delta : delta.toFixed(1);
      findings.push({
        label: 'Bathrooms',
        impact: 'positive',
        note: `Subject has ${pretty} more bath${delta > 1 ? 's' : ''} (${subject.baths} vs ${comp.baths}) — meaningful value premium over this comp.`
      });
    } else if (delta < 0) {
      const pretty = Number.isInteger(Math.abs(delta))
        ? Math.abs(delta)
        : Math.abs(delta).toFixed(1);
      findings.push({
        label: 'Bathrooms',
        impact: 'negative',
        note: `Subject has ${pretty} fewer bath${Math.abs(delta) > 1 ? 's' : ''} (${subject.baths} vs ${comp.baths}) — comp benefits on this front.`
      });
    } else {
      findings.push({
        label: 'Bathrooms',
        impact: 'neutral',
        note: `Same bath count (${comp.baths}) — direct match.`
      });
    }
  }

  // ── Living area ────────────────────────────────────────────────────────
  if (
    typeof subject?.area === 'number' &&
    typeof comp?.area === 'number' &&
    comp.area > 0
  ) {
    const pctDelta = ((subject.area - comp.area) / comp.area) * 100;
    if (pctDelta >= 5) {
      findings.push({
        label: 'Living area',
        impact: 'positive',
        note: `Subject is ${pctDelta.toFixed(0)}% larger (${subject.area.toLocaleString()} vs ${comp.area.toLocaleString()} sqft) — more space at a comparable price.`
      });
    } else if (pctDelta <= -5) {
      findings.push({
        label: 'Living area',
        impact: 'negative',
        note: `Subject is ${Math.abs(pctDelta).toFixed(0)}% smaller (${subject.area.toLocaleString()} vs ${comp.area.toLocaleString()} sqft) — comp delivered more space.`
      });
    } else {
      findings.push({
        label: 'Living area',
        impact: 'neutral',
        note: `Very similar size (${comp.area.toLocaleString()} sqft) — strong $/sqft anchor.`
      });
    }
  }

  // ── Vintage / year built ───────────────────────────────────────────────
  const subjYear = parseYear(subject?.yearBuilt);
  const compYear = parseYear(comp?.yearBuilt);
  if (subjYear && compYear) {
    const delta = subjYear - compYear;
    if (delta >= 10) {
      findings.push({
        label: 'Vintage',
        impact: 'positive',
        note: `Subject is ~${delta} years newer (${subjYear} vs ${compYear}) — typically commands a premium.`
      });
    } else if (delta <= -10) {
      findings.push({
        label: 'Vintage',
        impact: 'negative',
        note: `Subject is ~${Math.abs(delta)} years older (${subjYear} vs ${compYear}) — may warrant a value adjustment.`
      });
    } else {
      findings.push({
        label: 'Vintage',
        impact: 'neutral',
        note: `Built within ~${Math.abs(delta)} years (${subjYear} vs ${compYear}) — comparable era.`
      });
    }
  }

  // ── Price ──────────────────────────────────────────────────────────────
  // Subject is listed (asking price); comp is sold (closed price). Comparing
  // them tells the buyer whether the subject is asking under, in line with,
  // or above what the market has actually paid for similar homes.
  if (
    typeof subject?.price === 'number' &&
    typeof comp?.price === 'number' &&
    comp.price > 0
  ) {
    const pctDelta = ((subject.price - comp.price) / comp.price) * 100;
    if (pctDelta <= -5) {
      findings.push({
        label: 'Price',
        impact: 'positive',
        note: `Subject asks ${Math.abs(pctDelta).toFixed(0)}% below this comp's sale price — favorable entry point.`
      });
    } else if (pctDelta >= 5) {
      findings.push({
        label: 'Price',
        impact: 'negative',
        note: `Subject asks ${pctDelta.toFixed(0)}% above this comp's sale price — may be overpriced.`
      });
    } else {
      findings.push({
        label: 'Price',
        impact: 'neutral',
        note: `Subject is priced within ${Math.abs(pctDelta).toFixed(0)}% of this comp's sale — in line with the market.`
      });
    }
  }

  // ── Days on market (subject) ───────────────────────────────────────────
  // Long DOM on the subject = potential negotiation leverage for the buyer.
  const subjDom = daysSince(subject?.listDate);
  if (subjDom != null) {
    if (subjDom >= 60) {
      findings.push({
        label: 'DOM',
        impact: 'positive',
        note: `Subject has been listed ${subjDom} days — seller is likely motivated, room to negotiate.`
      });
    } else if (subjDom >= 30) {
      findings.push({
        label: 'DOM',
        impact: 'neutral',
        note: `Subject has been listed ${subjDom} days — within typical market range.`
      });
    } else {
      findings.push({
        label: 'DOM',
        impact: 'neutral',
        note: `Subject only listed ${subjDom} days — limited negotiation leverage yet.`
      });
    }
  }

  // ── Proximity ──────────────────────────────────────────────────────────
  if (typeof comp?.distance === 'number') {
    if (comp.distance < 0.5) {
      findings.push({
        label: 'Proximity',
        impact: 'positive',
        note: `Only ${comp.distance.toFixed(2)} mi away — strong locational match.`
      });
    } else if (comp.distance < 1) {
      findings.push({
        label: 'Proximity',
        impact: 'neutral',
        note: `${comp.distance.toFixed(2)} mi away — within typical comp radius.`
      });
    } else {
      findings.push({
        label: 'Proximity',
        impact: 'negative',
        note: `${comp.distance.toFixed(2)} mi from subject — may reflect a different micro-market.`
      });
    }
  }

  // ── ARV tier ──────────────────────────────────────────────────────────
  if (comp?.isArv25) {
    findings.push({
      label: 'ARV tier',
      impact: 'positive',
      note: 'Comp falls in the top 25th percentile by sale price — strong anchor for ARV.'
    });
  }

  // ── Summary ────────────────────────────────────────────────────────────
  const positives = findings.filter((f) => f.impact === 'positive').length;
  const negatives = findings.filter((f) => f.impact === 'negative').length;
  const score = Math.round((comp?.similarityScore ?? 0) * 100);

  let leaning: string;
  if (positives - negatives >= 2) {
    leaning = 'subject looks favorable against this comp';
  } else if (negatives - positives >= 2) {
    leaning = 'subject lags this comp on key dimensions';
  } else {
    leaning = 'subject and comp are evenly matched';
  }

  return {
    summary: `Similarity ${score}% — ${leaning}. ${positives} positive · ${negatives} negative · ${
      findings.length - positives - negatives
    } neutral.`,
    findings
  };
};

const parseYear = (raw: unknown): number | null => {
  if (raw == null) return null;
  const yr = parseInt(String(raw).slice(0, 4), 10);
  return Number.isFinite(yr) && yr > 1700 && yr < 2200 ? yr : null;
};

const daysSince = (date: unknown): number | null => {
  if (!date) return null;
  const t =
    typeof date === 'string' || date instanceof Date
      ? new Date(date as any).getTime()
      : typeof date === 'number'
      ? date
      : NaN;
  if (!Number.isFinite(t)) return null;
  const diff = Date.now() - t;
  if (diff < 0) return null;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
