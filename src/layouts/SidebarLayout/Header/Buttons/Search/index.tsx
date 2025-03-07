import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  TextField,
  Tooltip,
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
import LocationSuggestion from '@/models/location_suggestions';
import {
  useGetLocationDataQuery,
  useGetLocationSuggestionQuery,
  useLazyGetLocationDataQuery,
  useLazyGetLocationSuggestionQuery
} from '@/store/services/locationApiService';
import { get } from 'http';
import { useLazyGetPropertiesQuery } from '@/store/services/propertiesApiService';
import { selectLocation, setSuggestion } from '@/store/slices/locationSlice';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
  () => `
    // .MuiDialog-container {
    //     height: auto;
    // }
    
    .MuiDialog-paperScrollPaper {
      position: absolute;
      top: 64px;
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

function HeaderSearch() {
  // const searchData = useSelector(selectSearchData);
  const dispatch = useDispatch();
  const { suggestion } = useSelector(selectLocation);
  const [getLocationData, locationDataState] = useLazyGetLocationDataQuery();
  const [getPropertiesData, propertiesDataState] = useLazyGetPropertiesQuery();
  // searchData.location

  // useEffect(() => {}, [searchAnalyzedProperty]);

  // const setLocation = (location: LocationSuggestion) => {
  //   dispatch(setSearchLocation(location));
  // };
  // const { searchProperties, searchDeals, searching } = useSearch();
  const [open, setOpen] = useState(false);
  const [meow, setMeow] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = async () => {
    const locationDataRequest = getLocationData(
      {
        type: suggestion.type,
        city: suggestion.city,
        state: suggestion.state,
        neighborhood: suggestion.neighborhood,
        zipcode: suggestion.zipcode
      },
      true
    );
    const propertiesDataRequest = getPropertiesData(suggestion);

    await Promise.all([locationDataRequest, propertiesDataRequest]);

    // const meow = await getDealsData(suggestion).unwrap();
    // const response = await getDealsData(suggestion).unwrap();
    // console.log(`deals resonse: ${isError}, ${error}, ${status}`, response);

    // const response = await getDealsData(suggestion).unwrap();
    // console.log('response from auto: ', response);
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
            setLocation={(location: LocationSuggestion) =>
              dispatch(setSuggestion(location))
            }
          />
        </DialogTitleWrapper>
        <Divider />
        {/* <DialogContent><SearchForm /></DialogContent> */}
        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant="contained"
              // sx={buttonSx}
              disabled={
                locationDataState.isFetching || propertiesDataState.isFetching
              }
              onClick={handleSearch}
            >
              Search
            </Button>
            {(locationDataState.isFetching ||
              propertiesDataState.isFetching) && (
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
      </DialogWrapper>
    </>
  );
}

export default HeaderSearch;
