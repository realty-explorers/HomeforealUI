import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, styled, Tooltip } from '@mui/material';
import MainControls from '../MainControls';
import AdvancedControls from '../AdvancedControls';

const MapCard = styled(Card)(({}) => ({
  margin: '0',
  backgroundColor: 'rgba(255,255,255,0.5)',
  position: 'absolute',
  top: 0,
  right: 0,
  height: '50%'
}));

type MapControlsProps = {
  update: (name: string, value: any) => void;
  searchData: any;
};
const MapControls: React.FC<MapControlsProps> = (props: MapControlsProps) => {
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
          <MainControls update={props.update} searchData={props.searchData} />
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
