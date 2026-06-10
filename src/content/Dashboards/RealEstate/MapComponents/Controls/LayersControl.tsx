import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layers, Flame, DollarSign } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  type HeatmapMode,
  selectHeatmapMode,
  selectShowBounds,
  selectShowMarkers,
  selectShowRentComps,
  selectShowSalesComps,
  setHeatmapMode,
  setShowBounds,
  setShowMarkers,
  setShowRentComps,
  setShowSalesComps
} from '@/store/slices/mapSlice';

type LayersControlProps = {
  // Submarket boundary outlines the pricing-relevant zone (neighborhood
  // or zip-code fallback) the subject property sits in — only relevant
  // when a property is selected. Markers + Heatmap are search-view
  // affordances and don't apply inside the property detail view.
  propertySelected: boolean;
  // True when the buybox returned no properties — the heatmap section
  // is rendered but disabled with a caption so users understand why.
  heatmapDataEmpty?: boolean;
};

const MODE_OPTIONS: Array<{
  value: HeatmapMode;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}> = [
  { value: 'off', label: 'Off' },
  { value: 'deal', label: 'Deal', icon: Flame },
  { value: 'price', label: 'Price', icon: DollarSign }
];

const LayersControl = ({
  propertySelected,
  heatmapDataEmpty = false
}: LayersControlProps) => {
  const dispatch = useDispatch();
  const showBounds = useSelector(selectShowBounds);
  const showMarkers = useSelector(selectShowMarkers);
  const showSalesComps = useSelector(selectShowSalesComps);
  const showRentComps = useSelector(selectShowRentComps);
  const heatmapMode = useSelector(selectHeatmapMode);
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-2.5 right-[50px] z-10">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Map layers"
            className={cn(
              'mapboxgl-ctrl inline-flex items-center justify-center size-[29px] rounded transition-colors outline-none',
              'shadow-[0_0_0_2px_rgba(0,0,0,0.1)]',
              'bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            <Layers className="size-[18px]" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-60 p-3 space-y-4"
        >
          {propertySelected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="submarket-toggle"
                  className="text-sm font-medium cursor-pointer"
                >
                  Submarket boundary
                </Label>
                <Switch
                  id="submarket-toggle"
                  checked={showBounds}
                  onCheckedChange={(checked) =>
                    dispatch(setShowBounds(checked))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="sales-comps-toggle"
                  className="text-sm font-medium cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#590D82]" />
                    Sales comps
                  </span>
                </Label>
                <Switch
                  id="sales-comps-toggle"
                  checked={showSalesComps}
                  onCheckedChange={(checked) =>
                    dispatch(setShowSalesComps(checked))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="rent-comps-toggle"
                  className="text-sm font-medium cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#002278]" />
                    Rent comps
                  </span>
                </Label>
                <Switch
                  id="rent-comps-toggle"
                  checked={showRentComps}
                  onCheckedChange={(checked) =>
                    dispatch(setShowRentComps(checked))
                  }
                />
              </div>
            </div>
          )}

          {!propertySelected && (
            <>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="markers-toggle"
                  className="text-sm font-medium cursor-pointer"
                >
                  Markers
                </Label>
                <Switch
                  id="markers-toggle"
                  checked={showMarkers}
                  onCheckedChange={(checked) =>
                    dispatch(setShowMarkers(checked))
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <Label className="text-sm font-medium">Heatmap</Label>
                  {heatmapDataEmpty && (
                    <span className="text-[11px] text-slate-400">
                      No properties in area
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    'grid grid-cols-3 gap-1 rounded-md bg-slate-100 p-1',
                    heatmapDataEmpty && 'opacity-50 pointer-events-none'
                  )}
                  role="radiogroup"
                  aria-label="Heatmap metric"
                >
                  {MODE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = heatmapMode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={heatmapDataEmpty}
                        onClick={() => dispatch(setHeatmapMode(opt.value))}
                        className={cn(
                          'inline-flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                          selected
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        )}
                      >
                        {Icon && <Icon className="size-3" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LayersControl;
