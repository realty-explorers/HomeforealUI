import { forwardRef, Ref, useState, ReactElement } from 'react';
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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';

import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import SearchForm from './SearchForm';
import AutocompleteInput from './AutocompleteInput';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchData, setSearchLocation } from '@/store/searchSlice';
import LocationSuggestion from '@/models/location_suggestions';
import useSearch from '@/hooks/useSearch';

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

function HeaderSearch() {
  const searchData = useSelector(selectSearchData);
  const dispatch = useDispatch();
  const [suggestion, setSuggestion] = useState<LocationSuggestion>(
    searchData.location
  );

  const setLocation = (location: LocationSuggestion) => {
    dispatch(setSearchLocation(location));
  };
  const { searchProperties, searching } = useSearch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    setLocation(suggestion);
    searchProperties({ ...searchData, location: suggestion });
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
        <DialogContent>{/* <SearchForm /> */}</DialogContent>
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
      </DialogWrapper>
    </>
  );
}

export default HeaderSearch;
