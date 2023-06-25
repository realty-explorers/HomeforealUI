import { forwardRef, Ref, useState, ReactElement, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  CircularProgress,
  Collapse,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';

import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import SearchForm from './SearchForm';
import AutocompleteInput from './AutocompleteInput';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchAnalyzedProperty,
  selectSearchData,
  selectSearchResults,
  setSearchLocation
} from '@/store/searchSlice';
import LocationSuggestion from '@/models/location_suggestions';
import useSearch from '@/hooks/useSearch';
import { add } from 'date-fns';
import AddressForm from './AddressForm';
import Property from '@/models/property';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
  () => `
    .MuiDialog-container {
        height: auto;
    }
    
    .MuiDialog-paperScrollPaper {
        max-height: calc(100vh - 64px)
    }
`
);

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};

    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
`
);

const DialogTitleWrapper = styled(DialogTitle)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)}
`
);

const AddressSearchForm = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
`
);

function HeaderSearch() {
  const searchData = useSelector(selectSearchData);
  const searchResults = useSelector(selectSearchResults);
  const searchAnalyzedProperty = useSelector(selectSearchAnalyzedProperty);
  const dispatch = useDispatch();
  const [suggestion, setSuggestion] = useState<LocationSuggestion>(
    searchData.location
  );

  // useEffect(() => {}, [searchAnalyzedProperty]);

  const setLocation = (location: LocationSuggestion) => {
    dispatch(setSearchLocation(location));
  };
  const { searchProperties, searchDeals, searching } = useSearch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = async () => {
    setLocation(suggestion);
    await searchProperties({
      ...searchData,
      location: suggestion
    });
    let addressPrice = undefined;
    if (suggestion.resultType === 'Address') {
      // alert(JSON.stringify(searchAnalyzedProperty));
      // setSearchedProperty(searchAnalyzedProperty);
      // addressPrice = +prompt('Enter the price of the property');
    }
    // await searchDeals({ ...searchData, location: suggestion }, addressPrice);
    // setAddressSearched(false);
    // setOpen(false);
  };

  const searchNewDeals = async (
    estimatedPrice: number,
    estimatedArea: number
  ) => {
    const updatedProperty: Property = {
      ...searchAnalyzedProperty,
      price: estimatedPrice,
      area: estimatedArea
    };
    await searchDeals({ ...searchData, location: suggestion }, updatedProperty);
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title="Search">
        <IconButton color="primary" onClick={handleClickOpen}>
          <SearchTwoToneIcon />
        </IconButton>
      </Tooltip>

      <DialogWrapper
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        scroll="paper"
        onClose={handleClose}
      >
        <DialogTitleWrapper>
          <AutocompleteInput
            // setLocation={setLocation}
            // location={searchData.location}
            location={suggestion}
            setLocation={setSuggestion}
          />
        </DialogTitleWrapper>
        <Divider />
        {/* <DialogContent><SearchForm /></DialogContent> */}
        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant="contained"
              // sx={buttonSx}
              disabled={searching}
              onClick={handleSearch}
            >
              Search
            </Button>
            {searching && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px'
                }}
              />
            )}
          </Box>
          {/* <Button onClick={handleSearch} variant="outlined">
            Search
          </Button> */}
        </DialogActions>
        <DialogContent>
          <AddressForm
            searching={searching}
            property={searchAnalyzedProperty}
            searchDeals={searchNewDeals}
          />
        </DialogContent>
      </DialogWrapper>
    </>
  );
}

export default HeaderSearch;
