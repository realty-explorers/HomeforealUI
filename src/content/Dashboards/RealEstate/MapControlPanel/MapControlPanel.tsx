import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal } from 'lucide-react';
import AutocompleteInput from '@/layouts/SidebarLayout/Header/Buttons/Search/AutocompleteInput';
import LocationSuggestion from '@/models/location_suggestions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMobile';
import { selectLocation, setSuggestion } from '@/store/slices/locationSlice';
import { selectSelectedPropertyPreview, setSelectedPropertyPreview } from '@/store/slices/propertiesSlice';
import MainControls from '../MapControls/MainControls';
import FiltersDialog from './FiltersDialog';

const MapControlPanel = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { suggestion } = useSelector(selectLocation);
  const selectedPropertyPreview = useSelector(selectSelectedPropertyPreview);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notSelected, setNotSelected] = useState(true);

  // Auto-close the filters surface when a property is selected so the
  // detail view isn't competing with the filter panel for attention.
  useEffect(() => {
    if (selectedPropertyPreview) {
      if (notSelected) setFiltersOpen(false);
      setNotSelected(false);
    } else {
      setNotSelected(true);
    }
  }, [selectedPropertyPreview]);

  const handleSetLocation = (location: LocationSuggestion) => {
    dispatch(setSelectedPropertyPreview(null));
    dispatch(setSuggestion(location));
  };

  // Desktop = inline collapsible card; mobile = bottom sheet.
  const desktopPanelVisible = filtersOpen && Boolean(suggestion);

  return (
    <div className="absolute left-0 top-0 flex p-4 pointer-events-none w-full">
      <div className="flex flex-col w-full">
        <div className="flex pointer-events-auto">
          <div className="w-full md:w-80 transition-all duration-500">
            <AutocompleteInput
              location={suggestion}
              setLocation={handleSetLocation}
            />
          </div>
          {suggestion && (
            <div className="ml-6 flex items-center">
              <Button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-pressed={filtersOpen}
                // No border — matches the LayersControl pill (mapbox
                // controls use a soft shadow ring instead). Poppins for
                // consistency with the rest of the overlay.
                className={cn(
                  'font-poppins font-medium rounded-full h-9 px-4 gap-2 border-0 shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_2px_6px_-2px_rgba(15,23,42,0.15)] transition-colors',
                  filtersOpen
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-white text-slate-900 hover:bg-primary hover:text-white'
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          )}
        </div>

        {/* Desktop inline panel. Two-layer overflow strategy:
            - outer wrapper: overflow-hidden, used only for the open/close
              max-height transition.
            - inner panel: overflow-y-auto with a max-height that leaves
              room for the search input + CardsPanel (h-52 ≈ 208px) so
              the filters never overlap the cards or run off-screen. */}
        <div
          className={cn(
            'hidden md:block overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out font-poppins',
            desktopPanelVisible
              ? 'max-h-[calc(100vh-280px)] opacity-100 mt-4'
              : 'max-h-0 opacity-0 mt-0'
          )}
        >
          <div className="pointer-events-auto w-80 rounded-md bg-white/80 backdrop-blur-sm shadow-md px-4 pt-10 pb-4 relative max-h-[calc(100vh-280px)] overflow-y-auto">
            <MainControls />
          </div>
        </div>

        {/* Mobile sheet. Gated by isMobile so its overlay doesn't
            steal the desktop UI when filtersOpen is true. */}
        {isMobile && (
          <FiltersDialog open={filtersOpen} setOpen={setFiltersOpen} />
        )}
      </div>
    </div>
  );
};

export default memo(MapControlPanel);
