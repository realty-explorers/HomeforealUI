import { Grid, Button, Typography } from '@mui/material';
import { useState } from 'react';

const PropertyTypeButton = ({ icon, label, active, onClick }) => {
  return (
    <Button
      variant={active ? 'contained' : 'outlined'}
      color="primary"
      fullWidth
      onClick={onClick}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img src={icon} alt={label} style={{ width: 48, height: 48 }} />
        <Typography variant="subtitle1" align="center">
          {label}
        </Typography>
      </div>
    </Button>
  );
};

const PropertyTypes = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <PropertyTypeButton
          icon="/static/images/icons/Home.png"
          label="Single"
          active={activeButton === 0}
          onClick={() => handleButtonClick(0)}
        />
      </Grid>
      <Grid item xs={6}>
        <PropertyTypeButton
          icon="path/to/icon1.png"
          label="Multi"
          active={activeButton === 0}
          onClick={() => handleButtonClick(0)}
        />
      </Grid>
      <Grid item xs={6}>
        <PropertyTypeButton
          icon="path/to/icon1.png"
          label="Condos"
          active={activeButton === 0}
          onClick={() => handleButtonClick(0)}
        />
      </Grid>
      <Grid item xs={6}>
        <PropertyTypeButton
          icon="path/to/icon1.png"
          label="Town"
          active={activeButton === 0}
          onClick={() => handleButtonClick(0)}
        />
      </Grid>
    </Grid>
  );
};

export default PropertyTypes;
