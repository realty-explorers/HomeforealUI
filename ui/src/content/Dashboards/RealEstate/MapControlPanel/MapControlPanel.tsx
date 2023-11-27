import AutocompleteInput from "@/layouts/SidebarLayout/Header/Buttons/Search/AutocompleteInput";
import LocationSuggestion from "@/models/location_suggestions";
import { selectLocation, setSuggestion } from "@/store/slices/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import MainControls from "../MapControls/MainControls";
import { useLazyGetLocationDataQuery } from "@/store/services/locationApiService";
import {
  useLazyGetPropertiesPreviewsQuery,
} from "@/store/services/propertiesApiService";
import { Autocomplete, Button, Collapse, TextField } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import {
  selectFilter,
  setFilteredProperties,
} from "@/store/slices/filterSlice";
import {
  selectProperties,
  setSelectedProperty,
  setSelectedPropertyPreview,
} from "@/store/slices/propertiesSlice";
import { useLazyGetBuyBoxesQuery } from "@/store/services/buyboxApiService";
import { useSnackbar } from "notistack";
import BuyBox from "@/models/buybox";

type MapControlPanelProps = {};
const MapControlPanel = (props: MapControlPanelProps) => {
  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const { selectedPropertyPreview } = useSelector(selectProperties);
  // const [getPropertiesData, propertiesDataState] = useLazyGetPropertiesQuery();
  const [filtersOpen, setFiltersOpen] = useState(true);
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

  return (
    <div className="absolute left-0 top-0 flex p-4 pointer-events-none">
      <div className="flex flex-col">
        <div className="flex pointer-events-auto">
          <div className="w-80">
            <AutocompleteInput
              location={suggestion}
              setLocation={handleSetLocation}
            />
          </div>
          <div className="ml-6 flex justify-center items-center">
            <Button
              onClick={() => setFiltersOpen(!filtersOpen)}
              startIcon={<TuneIcon />}
              className="text-black bg-white hover:bg-[#5569ff] hover:text-white rounded-2xl px-4"
            >
              Filters
            </Button>
          </div>
        </div>

        <Collapse in={filtersOpen}>
          <div
            className={clsx([
              "p-10 bg-white/[.8] rounded-md mt-4 w-80 relative pointer-events-auto",
            ])}
          >
            <MainControls />
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default memo(MapControlPanel);
