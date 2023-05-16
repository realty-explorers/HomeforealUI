import { InputProps } from '@/components/Form/formTypes';
import styled from '@emotion/styled';
import { Grid, Typography } from '@mui/material';
import SliderRangeInput from '../SliderRangeInput';
import {
  ageFormatter,
  ageReverseScale,
  ageScale,
  priceFormatter,
  priceReverseScale,
  priceScale
} from '@/utils/converters';
import React, { Children } from 'react';

const GridDiv = styled('div')(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '2rem',
  '> svg': {
    marginBottom: '0.5em'
  },
  margin: '0 0.2em'
}));

const LabelContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

type SliderFieldProps = {
  fieldName: string;
  children: React.ReactNode;
};

const SliderField: React.FC<SliderFieldProps> = (props: SliderFieldProps) => {
  return (
    <GridDiv>
      <LabelContainer item xs={3}>
        <Typography align="right" noWrap variant="h5">
          {props.fieldName}
        </Typography>
      </LabelContainer>
      <Grid item xs={9}>
        {props.children}
      </Grid>
    </GridDiv>
  );
};

export default SliderField;
