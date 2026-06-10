# Property Heatmap Overlay — Design

**Date:** 2026-05-20
**Branch context:** `perf/map-renders`
**Status:** Approved (brainstorm) — implementation plan to follow

## Goal

Add a heatmap overlay to the main properties map that lets an investor see *where deals cluster across a market*, not just where individual properties sit. The heatmap is an opt-in analytical view layered onto the existing Mapbox map. Two user-selectable metrics: **Deal quality** (margin % for FIX_AND_FLIP/ARV, cap rate for MULTIFAMILY) and **Price** (raw list price, or price-per-unit for multifamily).

Comps view is intentionally out of scope — comp sets are small (6–20 points), a heatmap over them is aesthetic rather than analytical. If a comps-area heatmap is wanted later, it should be backed by a market-activity dataset, not the filtered comp set, and is a separate feature.

## Decisions (from brainstorm)

| Decision | Choice |
|---|---|
| Weight metric | User-selectable per session: `Deal quality` / `Price` |
| Interaction with markers | Zoom-based fade: heat dominates at low zoom, pills take over at high zoom |
| Scope | Properties view only (no property selected) |
| Filter scope | Unfiltered buybox set (`propertiesState.data`), **not** post-slider `filteredProperties` |
| Metric selector | Two options only; density omitted (cluster layer already covers it) |
| UI surface | Expand existing top-right "Layers" button into a popover with two toggle groups |
| Default state | Heatmap `off`; boundary `on` (unchanged from today) |
| Persistence | Session state via Redux `mapSlice`; no localStorage |

## Architecture

### New files

- `src/content/Dashboards/RealEstate/MapComponents/Controls/LayersControl.tsx`
  - Owns the top-right button + popover.
  - Reads `showBounds` and `heatmapMode` from `mapSlice`; dispatches setters.
  - Popover anchors to the button. Two labeled sections:
    - **Boundary** — single on/off toggle.
    - **Heatmap** — segmented control: `Off` / `Deal quality` / `Price`. Heatmap row is disabled with a small caption when heatmap can't apply: either a property is selected (heatmap is properties-view-only) or `propertiesState.data?.length === 0`.
  - Button render gate mirrors today's (`Map.tsx:625-651`): only renders when `suggestion || (selectedPropertyPreview && !selectedPropertyPreview.masked)`. The boundary toggle stays useful in both states; the heatmap row carries the additional disabled rule above.

- `src/content/Dashboards/RealEstate/MapComponents/Sources/PropertyHeatmapSource.tsx`
  - Second `<Source>` over `propertiesState.data` with `cluster={false}` (Mapbox can't share one source between clustered + heatmap consumers).
  - Props: `{ show: boolean; data: FeatureCollection | null; mode: 'deal' | 'price' }`.
  - Returns `null` when `show` is false or data is empty.
  - Renders `<Layer {...propertyHeatmapLayer(mode)} />`.

### Modified files

- `src/content/Dashboards/RealEstate/Map.tsx`
  - Remove inline `showBounds` `useState` (line 109) and the inline Layers button JSX (lines 625-651).
  - Render `<LayersControl />` in their place.
  - Add a memoized GeoJSON for the heatmap source built from `propertiesState.data` (separate from the existing `data` memo on line 458, which uses `filteredProperties`).
  - Render `<PropertyHeatmapSource />` **below** `<PropertiesSource>` in the JSX tree so markers paint on top.
  - Read `heatmapMode` from the slice; pass `show={heatmapMode !== 'off' && !selectedPropertyPreview}` and the appropriate `mode` to the source.

- `src/content/Dashboards/RealEstate/MapComponents/Layers/layers.ts`
  - Add a factory `propertyHeatmapLayer(mode: 'deal' | 'price'): LayerProps` returning a `type: 'heatmap'` layer config (details in "Visual styling" below).

- `src/content/Dashboards/RealEstate/MapUtils/CoordinatesUtils.tsx`
  - Extend `generatePropertyGeoJson` output `properties` to include:
    - `priceValue: number` — raw list price; for `MULTIFAMILY` use price-per-unit (`getPropertyPrice / getUnitsCount`), falling back to total price if unit count is missing.
    - `dealValue: number` — `marginPercentage(...)` for non-multifamily, `getCapRate(...) ?? 0` for multifamily.
  - Existing fields (`id`, `price`, `sortKey`, `tier`) are untouched — markers keep working unchanged.

- `src/store/slices/mapSlice.ts`
  - Add state: `showBounds: boolean` (default `true`), `heatmapMode: 'off' | 'deal' | 'price'` (default `'off'`).
  - Add actions: `setShowBounds`, `setHeatmapMode`.
  - Add selectors: `selectShowBounds`, `selectHeatmapMode`.
  - Moving `showBounds` from local state into the slice centralizes all layer flags.

### Unchanged

- Backend / API service — no new endpoints, no new fetch. All data already in `propertiesState.data`.
- `filteredProperties` pipeline — markers continue to use the filtered set; only the heatmap reads the unfiltered set.

## Data flow

```
propertiesState.data  (RTK query: getPropertiesPreviews, unfiltered buybox set)
        │
        ├─ generatePropertyGeoJson(p, strategyMode, strategyType)
        │     features have: { id, price, sortKey, tier, priceValue, dealValue }
        │
        ├─→ PropertiesSource         (cluster=true, fed by filteredProperties)
        │        unclustered-point / clusters / cluster-count layers
        │
        └─→ PropertyHeatmapSource    (cluster=false, fed by propertiesState.data, NEW)
                 propertyHeatmapLayer
                   weight = ['get', mode === 'deal' ? 'dealValue' : 'priceValue']
```

The marker memo (`Map.tsx:458`) and the new heatmap memo are independent. The intentional mismatch — markers reflect filters, heatmap reflects the whole buybox — surfaces submarkets the filter is hiding.

## Visual styling

**Zoom-based fade**

- Heatmap `heatmap-opacity` interpolated by zoom: `10 → 1`, `13 → 0.6`, `15 → 0`.
- Marker pill `icon-opacity` and `text-opacity` interpolated by zoom: `11 → 0`, `13 → 1`.
- Effect: heat owns city/regional zoom (≤ 10), they coexist briefly (11–13), pills own neighborhood/parcel (≥ 13).

**Color ramps (on `heatmap-density` stops 0 → 0.2 → 0.5 → 0.8 → 1)**

- **Deal quality**: `transparent → cool teal → warm gold → orange-red`. Distinct from the red/green marker-tier palette so the two layers don't fight semantically.
- **Price**: classic sequential `transparent → blue → green → yellow → red`. Familiar market-pricing convention.

**Weight normalization (so single outliers don't flatten the map)**

- **Deal**: `interpolate linear dealValue 0→0, 30→0.3, 60→0.7, 80→1`. Mirrors the existing margin-tier breakpoints in `CoordinatesUtils.tsx:72-77`.
- **Price**: `interpolate linear priceValue 50_000→0, 2_000_000→1`. For multifamily, `priceValue` is already price-per-unit so the same ramp works.

**Radius and intensity**

- `heatmap-radius`: `8 → 12px`, `14 → 30px`. Smaller at low zoom so markets don't smear into one blob.
- `heatmap-intensity`: `8 → 1`, `14 → 0.6`. Damp as we zoom in so individual hot points don't max out the ramp.

## Edge cases

- **No data in area**: `PropertyHeatmapSource` returns `null` for empty/undefined data. Popover row greys out with caption when `propertiesState.data?.length === 0 || !suggestion`.
- **Multifamily without cap rate**: `dealValue` falls back to `0` — property still contributes density but not heat. Same treatment for missing price.
- **Strategy change mid-session**: heatmap mode persists; underlying `dealValue` recomputes via the same memo invalidation path as today (depends on `selectedBuyBoxStrategyType` / `strategyMode`).
- **Property selected**: heatmap auto-hides via the same `!selectedPropertyPreview` gating that hides `PropertiesSource`. Layers popover stays available (existing button already does).
- **Masked properties**: included in the heatmap source; weight uses `priceGroup.min` via the existing `getPropertyPrice` fallback. No additional information is revealed beyond what the markers already show.

## Testing

- **Unit**: extend (or create) tests for `generatePropertyGeoJson` to assert `priceValue` and `dealValue` are correctly computed across the strategy branches, including missing cap rate and missing price fallbacks.
- **Manual smoke** (the load-bearing test for a Mapbox styling change):
  1. Load map at zoom ≈ 9; toggle heatmap on with both metrics; verify ramps render and look sane.
  2. Zoom past 13; verify heat fades out and pills fade in.
  3. Switch strategy (FIX_AND_FLIP → MULTIFAMILY); verify deal-quality ramp updates from margin % to cap rate without reload.
  4. Select a property; verify heatmap hides cleanly with the rest of the marker layer.
  5. Deselect; verify heatmap restores to its prior on/off state.
- **Performance**: `propertiesState.data` can be a few thousand items in dense markets. Heatmap GeoJSON should be memoized on data + strategy. Confirm no per-hover or per-pan re-render of the heatmap source. This branch (`perf/map-renders`) has been actively tuned for render stability — don't regress that.

## Out of scope

- Comps-view heatmap. Revisit only if backed by a real market-activity dataset.
- Persisting heatmap preference across sessions (localStorage). Easy to add later if requested.
- Additional metrics (rent yield, days on market, etc.). YAGNI until asked.
- Generic layer registry / abstraction for arbitrary future layers. Add only when a third layer arrives.
