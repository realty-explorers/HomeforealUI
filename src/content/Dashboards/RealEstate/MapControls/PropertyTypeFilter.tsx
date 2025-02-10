import * as React from "react";
import { styled, Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import DoneIcon from "@mui/icons-material/Done";
import {
  Button,
  Checkbox,
  Grid,
  ListItemText,
  Typography,
} from "@mui/material";
import Property, { PropertyType } from "@/models/property";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import styles from "./Controls.module.scss";
import clsx from "clsx";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const propertyTypeToLabel = {
  [PropertyType.SINGLE_FAMILY]: "House",
  [PropertyType.MULTI_FAMILY]: "Multi Family",
  [PropertyType.CONDO]: "Condos",
  [PropertyType.TOWN_HOUSE]: "Townhomes",
};

const labelToProperty: { [label: string]: PropertyType } = {
  House: PropertyType.SINGLE_FAMILY,
  "Multi Family": PropertyType.MULTI_FAMILY,
  Condos: PropertyType.CONDO,
  Townhomes: PropertyType.TOWN_HOUSE,
};

const names = [
  PropertyType.SINGLE_FAMILY,
  PropertyType.MULTI_FAMILY,
  PropertyType.CONDO,
  PropertyType.TOWN_HOUSE,
];

const fields = [
  {
    fieldName: PropertyType.SINGLE_FAMILY,
    label: "House",
    icon: <HomeRoundedIcon />,
  },
  {
    fieldName: PropertyType.MULTI_FAMILY,
    label: "Multi Family",
    icon: <HomeWorkIcon />,
  },
  {
    fieldName: PropertyType.CONDO,
    label: "Condos",
    icon: <LocationCityIcon />,
  },
  {
    fieldName: PropertyType.TOWN_HOUSE,
    label: "Townhomes",
    icon: <HolidayVillageIcon />,
  },
];

type PropertyTypeFilterProps = {
  propertyTypes: PropertyType[];
  updateTypes: (value: any) => void;
};

export default function PropertyTypeFilter(props: PropertyTypeFilterProps) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  function getStyles(name: PropertyType, theme: Theme) {
    return {
      fontWeight: props.propertyTypes.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    };
  }
  // const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<PropertyType>) => {
    const {
      target: { value },
    } = event;
    const properties =
      // On autofill we get a stringified value.
      typeof value === "string"
        ? value.split(",").map((label) => labelToProperty[label])
        : value;
    props.updateTypes(properties);
  };

  const handleChangePropertyType = (propertyType: any) => {
    if (props.propertyTypes.includes(propertyType)) {
      props.updateTypes(
        props.propertyTypes.filter((type) => type !== propertyType),
      );
    } else {
      props.updateTypes([...props.propertyTypes, propertyType]);
    }
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      {fields.map((field, index) => {
        const selected = props.propertyTypes.includes(field.fieldName);
        return (
          <Button
            key={index}
            className={clsx([
              "flex flex-col justify-center items-center  p-2 rounded-lg  hover:bg-[rgba(151,71,255,0.42)] cursor-pointer text-[#223354] ",
              selected && "bg-[rgba(151,71,255,0.42)]",
            ])}
            sx={{ border: "2px solid black" }}
            onClick={() => handleChangePropertyType(field.fieldName)}
          >
            {field.icon}
            <Typography variant="h5" className="text-center">
              {field.label}
            </Typography>
          </Button>
        );
      })}
    </div>
    // <FormControl sx={{ m: 1, width: '100%' }}>
    //   <InputLabel id="demo-multiple-chip-label">Property Types</InputLabel>
    //   <Select
    //     labelId="demo-multiple-chip-label"
    //     id="demo-multiple-chip"
    //     multiple
    //     value={props.propertyTypes}
    //     defaultValue={props.propertyTypes}
    //     onChange={handleChange}
    //     input={
    //       <OutlinedInput id="select-multiple-chip" label="Property Types" />
    //     }
    //     renderValue={(selected: any) => (
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           gap: 0.5,
    //           overflowX: 'scroll',
    //           '::-webkit-scrollbar': { display: 'none' }
    //         }}
    //       >
    //         {selected.map((value) => (
    //           <Chip key={value} label={propertyTypeToLabel[value]} />
    //         ))}
    //       </Box>
    //     )}
    //     MenuProps={MenuProps}
    //   >
    //     {names.map((name) => (
    //       <MenuItem key={name} value={name} style={getStyles(name, theme)}>
    //         {/* {name} */}
    //         <Checkbox checked={props.propertyTypes.indexOf(name) > -1} />
    //         <ListItemText primary={propertyTypeToLabel[name]} />
    //       </MenuItem>
    //     ))}
    //   </Select>
    // </FormControl>
  );
}
