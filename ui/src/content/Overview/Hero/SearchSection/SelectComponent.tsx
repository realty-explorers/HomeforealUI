import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { StyledSlider } from "@/content/Dashboards/RealEstate/FormFields/StyledSlider";

const StyledInputLabel = styled(InputLabel)({
  fontSize: "1rem",
  fontWeight: "bolder",
  color: "#000",
  "&.Mui-focused": {
    color: "#590d82",
    fontSize: "1.2rem",
  },
});

const StyledSelect = styled(Select)({
  color: "#000",
  "&:before": {
    borderColor: "#000",
  },
  "&:after": {
    borderColor: "#590d82",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "2rem",
    color: "#590d82",
  },
  "&:hover:not(.Mui-disabled):before": {
    borderColor: "#590d82",
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const statesArr = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
const investmentTypeArr = [
  "Buy-and-Hold",
  "Fix-and-Flip",
  "Single-Family Homes",
  "Multifamily Units",
];

const maxPriceArr = [
  "$100,000",
  "$200,000",
  "$300,000",
  "$400,000",
  "$500,000",
  "$600,000",
  "$700,000",
  "$800,000",
];

interface SelectComponentProps {
  value: string;
  selectLabel: string;
  setLocation?: React.Dispatch<React.SetStateAction<string>>;
  setInvestmentType?: React.Dispatch<React.SetStateAction<string>>;
  setMaxPrice?: React.Dispatch<React.SetStateAction<string>>;
}

export default function SelectComponent(
  { value, selectLabel, setLocation, setInvestmentType, setMaxPrice }:
    SelectComponentProps,
) {
  const [isClient, setIsClient] = useState(false); // nextJs solution to avoid className mismatch between client & server

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (value: string) => {
    selectLabel === "Location"
      ? setLocation(value)
      : selectLabel === "Investment Type"
      ? setInvestmentType(value)
      : selectLabel === "Max Price"
      ? setMaxPrice(value)
      : null;
  };

  const menuItem = () => {
    if (selectLabel === "Location") {
      return statesArr.map((state) => (
        <MenuItem key={state} value={state.toLowerCase()}>{state}</MenuItem>
      ));
    }
    if (selectLabel === "Investment Type") {
      return investmentTypeArr.map((type) => (
        <MenuItem key={type} value={type}>{type}</MenuItem>
      ));
    }
    if (selectLabel === "Max Price") {
      return maxPriceArr.map((price) => (
        <MenuItem key={price} value={price}>{price}</MenuItem>
      ));
    }
  };

  return (
    <>
      {isClient &&
        (
          <FormControl variant="standard" sx={{ m: 1, minWidth: 160 }}>
            <StyledInputLabel>
              {selectLabel}
            </StyledInputLabel>
            <StyledSelect
              IconComponent={KeyboardArrowDownIcon}
              autoWidth
              value={value}
              onChange={(e) => handleChange(e.target.value as string)}
              MenuProps={MenuProps}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {menuItem()}
            </StyledSelect>
          </FormControl>
        )}
    </>
  );
}
