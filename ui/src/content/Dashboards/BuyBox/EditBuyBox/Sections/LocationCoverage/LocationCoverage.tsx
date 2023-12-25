import { buyboxSchemaType } from "@/schemas/BuyBoxSchemas";
import { Autocomplete, TextField, Typography } from "@mui/material";
import clsx from "clsx";
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styles from "../../EditBuyBoxDialog.module.scss";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useGetLocationsQuery } from "@/store/services/dataApiService";
import { useEffect, useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete";
import LocationSuggestion from "@/models/location_suggestions";
import { error } from "console";

type LocationCoverageProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
  errors: FieldErrors<buyboxSchemaType>;
};
const LocationCoverage = (
  { register, control, watch, setValue, getValues, errors }:
    LocationCoverageProps,
) => {
  const [locations, setLocations] = useState<LocationSuggestion[]>(
    getValues("target_location.locations"),
  );
  const locationsQuery = useGetLocationsQuery("");
  const handleSetLocations = (value: any) => {
    setValue("target_location.locations", value, { shouldDirty: true });
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

  useEffect(() => {
    setLocations(getValues("target_location.locations"));
  }, []);
  return (
    <div className={clsx(["flex flex-col px-4 pt-8 h-full gap-x-4 w-full"])}>
      <Typography className={clsx([styles.header, "mb-12"])}>
        Please indicate your location coverage area
      </Typography>
      <LocationAutocomplete
        locations={locations}
        setLocations={handleSetLocations}
      />
      <span className="text-red-400">
      </span>

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
