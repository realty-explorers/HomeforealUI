"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  debounce,
  Grid,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import LocationSuggestion from "@/models/location_suggestions";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetLocationSuggestionQuery,
  useLazyGetLocationSuggestionQuery,
} from "@/store/services/locationApiService";

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
      label.Mui-focused: {
    color: rgb(0,0,0)
  },
   .MuiInput-underline:after: {
    borderBottomColor: rgb(0,0,0)
  },
   .MuiFilledInput-underline:after: {
    borderBottomColor: rgb(0,0,0)
  },
   .MuiOutlinedInput-root: {
    &.Mui-focused fieldset: {
      borderColor: rgb(0,0,0)
    }
  }

    .MuiInputBase-root{
        background: ${theme.colors.alpha.white[100]};
        border-radius: 2rem;
box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }
    .MuiFocused{
      border: none;
    }

    .MuiInputBase-input {
        // font-size: ${theme.typography.pxToRem(17)};
    }
`,
);

type AutocompleteInputProps = {
  // setValue: UseFormSetValue<any>;
  setLocation: (location: LocationSuggestion) => void;
  location: LocationSuggestion;
  search?: () => Promise<void>;
};
const AutocompleteInput: React.FC<AutocompleteInputProps> = (
  props: AutocompleteInputProps,
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);
  // const { data } = useGetLocationSuggestionQuery(debouncedSearchTerm);
  const [getLocationSuggestions, state] = useLazyGetLocationSuggestionQuery();
  const [options, setOptions] = React.useState<LocationSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    await props.search();
    setSearching(false);
  };

  const fetch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        try {
          const response = await getLocationSuggestions(
            searchTerm,
            true,
          ).unwrap();
          setOptions([]);
          setOptions(response);
        } catch (error) {
          if (
            error.response &&
            error.response.status &&
            (error.response.status === 400 || error.response.status === 401)
          ) {
            alert("Unauthorized");
            signOut();
          } else alert(error);
        }
      }, 400),
    [],
  );

  const handleInputChange = (event, newInput) => {
    if (newInput) {
      fetch(newInput);
    }
  };

  return (
    <Autocomplete
      freeSolo
      value={props.location || null}
      filterOptions={(x) => x}
      onChange={(event: any, newValue: LocationSuggestion | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        props.setLocation(newValue);
      }}
      options={options ?? []}
      getOptionLabel={(option?: LocationSuggestion) => option.display ?? ""}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <SearchInputWrapper
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSearch} disabled={searching}>
                  {state.isFetching
                    ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )
                    : <SearchTwoToneIcon htmlColor="#70757a" />}
                </IconButton>
              </InputAdornment>
            ),
            style: {
              paddingRight: "0.5rem",
            },
          }}
          InputLabelProps={{
            ...params.InputLabelProps,
            variant: "outlined",
            // shrink: false
          }}
          label="Search Properties"
          hiddenLabel
          // autoFocus
          // fullWidth
          value={props.location?.display}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                <Typography variant="body2" color="text.secondary">
                  {option?.display}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default AutocompleteInput;
