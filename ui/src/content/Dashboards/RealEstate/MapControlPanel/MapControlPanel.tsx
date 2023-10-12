import AutocompleteInput from "@/layouts/SidebarLayout/Header/Buttons/Search/AutocompleteInput";
import LocationSuggestion from "@/models/location_suggestions";
import { selectLocation, setSuggestion } from "@/store/slices/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import MainControls from "../MapControls/MainControls";
import { useLazyGetLocationDataQuery } from "@/store/services/locationApiService";
import {
  useLazyGetPropertiesQuery,
} from "@/store/services/propertiesApiService";
import { Button, Collapse } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import clsx from "clsx";
import { useEffect, useState } from "react";

type MapControlPanelProps = {};
const MapControlPanel = (props: MapControlPanelProps) => {
  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const [getLocationData, locationDataState] = useLazyGetLocationDataQuery();
  const [getPropertiesData, propertiesDataState] = useLazyGetPropertiesQuery();
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setFiltersOpen(true);
  }, []);

  const handleSearch = async () => {
    const locationDataRequest = getLocationData(suggestion, true);
    const propertiesDataRequest = getPropertiesData(suggestion);

    await Promise.all([locationDataRequest, propertiesDataRequest]);

    // const meow = await getDealsData(suggestion).unwrap();
    // const response = await getDealsData(suggestion).unwrap();
    // console.log(`deals resonse: ${isError}, ${error}, ${status}`, response);

    // const response = await getDealsData(suggestion).unwrap();
    // console.log('response from auto: ', response);
  };
  return (
    <div className="absolute left-0 top-0 flex p-4 pointer-events-none">
      <div className="flex flex-col">
        <div className="flex pointer-events-auto">
          <div className="w-80">
            <AutocompleteInput
              location={suggestion}
              setLocation={(location: LocationSuggestion) =>
                dispatch(setSuggestion(location))}
              search={handleSearch}
            />
          </div>
          <div className="w-40 flex justify-center items-center">
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

export default MapControlPanel;
