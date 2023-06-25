import React, { useContext, useEffect, useState } from 'react';
import {
  alpha,
  Autocomplete,
  Grid,
  styled,
  TextField,
  Typography,
  Collapse,
  Button,
  IconButton
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Property from '@/models/property';

type SearchFormProps = {
  searching: boolean;
  property?: Property;
  searchDeals: (estimatedPrice: number, estimatedArea: number) => Promise<void>;
};
const AddressForm = (props: SearchFormProps) => {
  const [price, setPrice] = useState(props.property?.price);
  const [area, setArea] = useState(props.property?.area);

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(+event.target.value);
  };

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArea(+event.target.value);
  };

  const handleReset = () => {
    setPrice(props.property?.price);
    setArea(props.property?.area);
  };

  const handleSearch = async () => {
    await props.searchDeals(price, area);
  };

  useEffect(() => {
    setPrice(props.property?.price);
    setArea(props.property?.area);
  }, [props.property]);

  return (
    <Collapse in={props.property !== null}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign={'center'}
        rowSpacing={2}
      >
        <Grid xs={12} item>
          <Typography variant="h5">
            The property you are looking for is{' '}
            {props.property?.forSale ? 'for sale' : 'off market'}.
          </Typography>
        </Grid>
        <Grid xs={12} item>
          <TextField
            id="outlined-search"
            label="Estimated value"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            value={price}
            onChange={handleChangePrice}
          />
        </Grid>

        <Grid xs={12} item>
          <TextField
            id="outlined-search"
            label="Estimated Sqft"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            value={area}
            onChange={handleChangeArea}
          />
        </Grid>
        <Grid xs={12} item container justifyContent="center" spacing={0}>
          <Grid xs={1} item container justifyContent="end">
            <IconButton color="primary" onClick={handleReset}>
              <RestartAltIcon />
            </IconButton>
          </Grid>

          <Grid xs={2} item>
            <Button
              variant="contained"
              // sx={buttonSx}
              disabled={props.searching}
              onClick={handleSearch}
            >
              Search Property
            </Button>
          </Grid>
          <Grid xs={1} item></Grid>
        </Grid>
      </Grid>
    </Collapse>
  );
};

export default AddressForm;
