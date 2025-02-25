import AutocompleteInput from '@/layouts/SidebarLayout/Header/Buttons/Search/AutocompleteInput';
import LocationSuggestion from '@/models/location_suggestions';
import { selectLocation, setSuggestion } from '@/store/slices/locationSlice';
import { useDispatch, useSelector } from 'react-redux';
import MainControls from '../MapControls/MainControls';
import { useLazyGetLocationDataQuery } from '@/store/services/locationApiService';
import { Autocomplete, Button, Collapse, TextField } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import {
  selectFilter,
  setFilteredProperties
} from '@/store/slices/filterSlice';
import {
  selectProperties,
  setSelectedProperty,
  setSelectedPropertyPreview
} from '@/store/slices/propertiesSlice';
import { useLazyGetBuyBoxesQuery } from '@/store/services/buyboxApiService';
import { useSnackbar } from 'notistack';
import BuyBox from '@/models/buybox';
import FiltersDialog from './FiltersDialog';

type MapControlPanelProps = {};
const MapControlPanel = (props: MapControlPanelProps) => {
  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const { selectedPropertyPreview } = useSelector(selectProperties);
  // const [getPropertiesData, propertiesDataState] = useLazyGetPropertiesQuery();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filteredProperties } = useSelector(selectFilter);
  const [notSelected, setNotSelected] = useState(true);

  useEffect(() => {
    if (selectedPropertyPreview) {
      if (notSelected) {
        setFiltersOpen(false);
      }
      setNotSelected(false);
    } else {
      setNotSelected(true);
    }
  }, [selectedPropertyPreview]);

  const handleSelectBuyBox = (event: any, value: any) => {
    alert(value);
  };

  const handleSetLocation = (location: LocationSuggestion) => {
    dispatch(setSelectedPropertyPreview(null));
    dispatch(setSuggestion(location));
  };

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

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
            <div className="ml-6 flex justify-center items-center">
              <Button
                onClick={() => setFiltersOpen(!filtersOpen)}
                startIcon={<TuneIcon />}
                className="text-black bg-white hover:bg-[#5569ff] hover:text-white rounded-2xl px-4"
              >
                Filters
              </Button>
            </div>
          )}
        </div>

        {windowWidth > 768 ? (
          <Collapse in={filtersOpen && suggestion}>
            <div
              className={clsx([
                'hidden md:flex px-4 pt-10 bg-white/[.8] rounded-md mt-4 w-80 relative pointer-events-auto'
              ])}
            >
              <MainControls />
            </div>
          </Collapse>
        ) : (
          <FiltersDialog open={filtersOpen} setOpen={setFiltersOpen} />
        )}
      </div>
    </div>
  );
};

export default memo(MapControlPanel);
