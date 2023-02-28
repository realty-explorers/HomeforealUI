import {
  forwardRef,
  Ref,
  useState,
  ReactElement,
  ChangeEvent,
  useContext
} from 'react';
import {
  Avatar,
  Link,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  lighten,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Theme,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Hidden,
  DialogActions
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

  const setLocation = (location: LocationSuggestion) => {
    dispatch(setSearchLocation(location));
  };
  const { search } = useSearch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    search(searchData);
    handleClose();
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
            setLocation={setLocation}
            location={searchData.location}
          />
        </DialogTitleWrapper>
        <Divider />
        <DialogContent>
          <SearchForm />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleSearch} variant="outlined">
            Search
          </Button>
        </DialogActions>
      </DialogWrapper>
    </>
  );
}

export default HeaderSearch;
