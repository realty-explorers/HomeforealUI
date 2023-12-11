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
import styles from "../EditBuyBoxDialog.module.scss";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useGetLocationsQuery } from "@/store/services/dataApiService";
import { useEffect, useState } from "react";

interface Location {
  "type": string;
  "name": string;
  "identifier": string;
}

type LocationCoverageProps = {
  register: UseFormRegister<buyboxSchemaType>;
  control: Control<buyboxSchemaType>;
  watch: UseFormWatch<buyboxSchemaType>;
  setValue: UseFormSetValue<buyboxSchemaType>;
  getValues: UseFormGetValues<buyboxSchemaType>;
};
const LocationCoverage = (
  { register, control, watch, setValue, getValues }: LocationCoverageProps,
) => {
  const [locations, setLocations] = useState<Location[]>(
    getValues("target_location.locations"),
  );
  const locationsQuery = useGetLocationsQuery("");
  const handleLocationsChanged = (event: any, value: any) => {
    setValue("target_location.locations", value);
    setLocations(value);
    console.log(getValues("target_location.locations"));
  };

  const getUniqueLocations = (locations: Location[]) => {
    const locationNames = new Set();
    const uniqueLocations = [];
    for (const location of locations) {
      if (!locationNames.has(location.name)) {
        locationNames.add(location.name);
        uniqueLocations.push(location);
      }
    }
    return uniqueLocations;
  };

  useEffect(() => {
    setLocations(getValues("target_location.locations"));
  }, []);
  return (
    <div className={clsx(["flex flex-col px-4 pt-12 h-full gap-x-4"])}>
      <Typography className={clsx([styles.header, "mb-12"])}>
        Please indicate your location coverage area
      </Typography>

      <Autocomplete
        multiple
        id="tags-outlined"
        options={getUniqueLocations(locationsQuery.data || [])}
        loading={locationsQuery.isFetching}
        getOptionLabel={(option: Location) => String(option.name)}
        filterSelectedOptions
        defaultValue={locations}
        // filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Locations"
            placeholder="Locations"
          />
        )}
        onChange={handleLocationsChanged}
      />
    </div>
  );
};

export default LocationCoverage;
