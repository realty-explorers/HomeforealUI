import AutocompleteInput from '@/layouts/SidebarLayout/Header/Buttons/Search/AutocompleteInput';
import LocationSuggestion from '@/models/location_suggestions';
import { selectLocation, setSuggestion } from '@/store/slices/locationSlice';
import { useDispatch, useSelector } from 'react-redux';
import MainControls from '../MapControls/MainControls';
import { useLazyGetLocationDataQuery } from '@/store/services/locationApiService';
import {
  useLazyGetDealsQuery,
  useLazyGetPropertiesQuery
} from '@/store/services/propertiesApiService';

type MapControlPanelProps = {};
const MapControlPanel = (props: MapControlPanelProps) => {
  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const [getLocationData, locationDataState] = useLazyGetLocationDataQuery();
  const [getPropertiesData, propertiesDataState] = useLazyGetPropertiesQuery();
  const [getDealsData, dealsDataState] = useLazyGetDealsQuery();

  const handleSearch = async () => {
    const locationDataRequest = getLocationData(suggestion, true);
    const propertiesDataRequest = getPropertiesData(suggestion);

    await Promise.all([locationDataRequest, propertiesDataRequest]);

    // const meow = await getDealsData(suggestion).unwrap();
    // const response = await getDealsData(suggestion).unwrap();
    // console.log(`deals resonse: ${isError}, ${error}, ${status}`, response);

    const response = await getDealsData(suggestion).unwrap();
    console.log('response from auto: ', response);
  };
  return (
    <div className="absolute left-0 top-0 flex p-4">
      <div className="flex flex-col">
        <div className="w-80">
          <AutocompleteInput
            location={suggestion}
            setLocation={(location: LocationSuggestion) =>
              dispatch(setSuggestion(location))
            }
            search={handleSearch}
          />
        </div>
        <div className="p-10 bg-white/[.8] rounded-md mt-4">
          <MainControls />
        </div>
      </div>
    </div>
  );
};

export default MapControlPanel;
