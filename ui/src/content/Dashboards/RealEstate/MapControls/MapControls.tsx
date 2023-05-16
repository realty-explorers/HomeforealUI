import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  IconButtonProps,
  styled,
  Tooltip
} from '@mui/material';
import MainControls from './MainControls';
import AdvancedControls from './AdvancedControls';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

const MapCard = styled(Card)(({}) => ({
  margin: '0',
  backgroundColor: 'rgba(255,255,255,0.8)',
  width: '30rem',
  position: 'absolute',
  top: 0,
  right: 0
  // height: '35%'
}));

const ExpandButton = styled(Button)(({}) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  margin: '0.5em',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000
}));

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

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

const ControlsCollapse = styled(Collapse)(({}) => ({
  width: '100%',
  '.MuiCollapse-wrapperInner': {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  }
}));

type MapControlsProps = {
  update: (name: string, value: any) => void;
  searchData: any;
};
const MapControls: React.FC<MapControlsProps> = (props: MapControlsProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <MapCard>
      <CardContent sx={{ height: '100%' }}>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={3}
          justifyContent="center"
          sx={{ width: 'auto', height: '100%', margin: 0, padding: '0 1em' }}
        >
          <h3 style={{ margin: '0.5rem 0', padding: 0 }}>Search Parameters</h3>
          <MainControls update={props.update} searchData={props.searchData} />

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
            {/* <ReadMoreIcon /> */}
          </ExpandMore>

          <ControlsCollapse
            in={expanded}
            timeout="auto"
            unmountOnExit
            orientation="vertical"
            component={Grid}
          >
            <AdvancedControls
              searchData={props.searchData}
              update={props.update}
            />
          </ControlsCollapse>
        </Grid>

        {/* <Grid
          container
          rowSpacing={2}
          columnSpacing={3}
          justifyContent="center"
          sx={{
            width: 'auto',
            height: 200,
            margin: '2em 0 0 0',
            padding: '0 1em'
          }}
        >
          <AdvancedControls
            update={props.update}
            searchData={props.searchData}
          />
        </Grid> */}
      </CardContent>
    </MapCard>
  );
};

export default MapControls;
