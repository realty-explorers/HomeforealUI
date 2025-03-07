import { Autocomplete, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import styles from '../../EditBuyBoxDialog.module.scss';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useEffect, useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete';
import LocationSuggestion from '@/models/location_suggestions';
import { error } from 'console';
import { BuyBoxFormData } from '@/schemas/BuyBoxFormSchema';

type LocationCoverageProps = {
  register: UseFormRegister<BuyBoxFormData>;
  control: Control<BuyBoxFormData>;
  watch: UseFormWatch<BuyBoxFormData>;
  setValue: UseFormSetValue<BuyBoxFormData>;
  getValues: UseFormGetValues<BuyBoxFormData>;
  errors: FieldErrors<BuyBoxFormData>;
};
const LocationCoverage = ({
  register,
  control,
  watch,
  setValue,
  getValues,
  errors
}: LocationCoverageProps) => {
  const [locations, setLocations] = useState<LocationSuggestion[]>(
    getValues('targetLocations') as LocationSuggestion[]
  );
  const handleSetLocations = (value: any) => {
    setValue('targetLocations', value, { shouldDirty: true });
    setLocations(value);
  };

  // const getUniqueLocations = (locations: Location[]) => {
  //   const locationNames = new Set();
  //   const uniqueLocations = [];
  //   for (const location of locations) {
  //     if (!locationNames.has(location.name)) {
  //       locationNames.add(location.name);
  //       uniqueLocations.push(location);
  //     }
  //   }
  //   return uniqueLocations;
  // };

  return (
    <div className={clsx(['flex flex-col px-4 pt-8 h-full gap-x-4 w-full'])}>
      <Typography className={clsx([styles.header, 'mb-12'])}>
        Please indicate your location coverage area
      </Typography>
      <LocationAutocomplete
        locations={locations}
        setLocations={handleSetLocations}
      />
      <span className="text-red-400">{errors?.targetLocations?.message}</span>

      {/* <Autocomplete */}
      {/*   multiple */}
      {/*   id="tags-outlined" */}
      {/*   options={getUniqueLocations(locationsQuery.data || [])} */}
      {/*   loading={locationsQuery.isFetching} */}
      {/*   getOptionLabel={(option: Location) => */}
      {/*     String(option.name)} */}
      {/*   filterSelectedOptions */}
      {/*   defaultValue={locations} */}
      {/*   // filterSelectedOptions */}
      {/*   renderInput={(params) => ( */}
      {/*     <TextField */}
      {/*       {...params} */}
      {/*       label="Locations" */}
      {/*       placeholder="Locations" */}
      {/*     /> */}
      {/*   )} */}
      {/*   onChange={handleLocationsChanged} */}
      {/* /> */}
    </div>
  );
};

export default LocationCoverage;
