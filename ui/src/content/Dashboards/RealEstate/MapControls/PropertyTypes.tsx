import { Grid, Button, Typography } from '@mui/material';
import { useState } from 'react';
import singleHome from '@/public/static/images/icons/singleHome.svg';
import multiFamily from '@/public/static/images/icons/multiFamily.svg';
import condo from '@/public/static/images/icons/condo.svg';
import townHome from '@/public/static/images/icons/townHome.svg';

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

const ButtonContainer = ({ src, title }) => {
  return (
    <div className="flex flex-col w-[32%] border-2 border-black p-2 h-30 rounded-md hover:bg-[#507bca38]">
      <img src={src} alt="house" />
      <Typography className="text-center">{title}</Typography>
    </div>
  );
};

const PropertyTypes = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  return (
    <div className="flex flex-wrap justify-between w-full mt-2">
      <ButtonContainer src={townHome} title="Any" />
      <ButtonContainer src={singleHome} title="House" />
      <ButtonContainer src={multiFamily} title="Multi Family" />
      <ButtonContainer src={condo} title="Condo" />
      <ButtonContainer src={townHome} title="Townhome" />
      <ButtonContainer src={townHome} title="Mobile" />
    </div>
  );
};

export default PropertyTypes;
