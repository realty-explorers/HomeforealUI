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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Property from '@/models/property';

type PropertyFormProps = {
  searching: boolean;
  property?: Property;
  searchDeals: (estimatedPrice: number, estimatedArea: number) => Promise<void>;
};

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand
    ? // ? 'translate(-50%, -50%) rotate(90deg)'
      // : 'translate(-50%, -50%) rotate(270deg)',
      'translate(-50%, 50%) rotate(0deg)'
    : 'translate(-50%, 50%) rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  }),
  position: 'absolute',
  bottom: '0',
  left: '50%',
  margin: '0.5em',
  zIndex: 1000,
  color: 'rgb(85 105 255)'
}));

const PropertyForm = (props: PropertyFormProps) => {
  const [price, setPrice] = useState(props.property?.price);
  const [area, setArea] = useState(props.property?.area);
  const [expanded, setExpanded] = React.useState(true);

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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Collapse in={props.property !== null}>
      <Collapse in={expanded} sx={{ paddingBottom: '1.5rem' }}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          textAlign={'center'}
          rowSpacing={2}
          sx={{ padding: '1rem 1em' }}
        >
          <Grid xs={12} item>
            <Typography variant="h5">
              {/* The property you are looking for is{' '} */}
              {props.property?.address} is{' '}
              {props.property?.forSale ? 'for sale' : 'off market'}.
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <TextField
              label="Adjust price"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              value={price}
              onChange={handleChangePrice}
              variant="standard"
              size="small"
            />
          </Grid>

          <Grid xs={12} item>
            <TextField
              label="Adjust Final SQFT"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              value={area}
              onChange={handleChangeArea}
              variant="standard"
              size="small"
            />
          </Grid>
          <Grid xs={12} item container justifyContent="center" spacing={0}>
            {/* <Grid xs={1} item container justifyContent="end">
            <IconButton color="primary" onClick={handleReset}>
              <RestartAltIcon />
            </IconButton>
          </Grid> */}

            {/* <Grid xs={2} item> */}
            <Button
              size="small"
              variant="contained"
              // sx={buttonSx}
              disabled={props.searching}
              onClick={handleSearch}
            >
              Apply Changes
            </Button>
            {/* </Grid> */}
            {/* <Grid xs={1} item></Grid> */}
          </Grid>
        </Grid>
      </Collapse>
      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMoreIcon />
        {/* <ReadMoreIcon /> */}
      </ExpandMore>
    </Collapse>
  );
};

export default PropertyForm;
