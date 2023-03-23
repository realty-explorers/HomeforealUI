import React, { useState } from 'react';
import { Slider } from '@mui/material';
import { InputProps } from '@/components/Form/formTypes';

type SliderInputProps = {
  inputProps: InputProps;
  value: number;
  update: (name: string, value: any) => void;
  scale?: {
    scale: (number: number) => number;
    reverseScale: (number: number) => number;
  };
};

const SliderInput: React.FC<SliderInputProps> = (props: SliderInputProps) => {
  const handleChange = (event: Event, newValue: number) => {
    props.update(
      props.inputProps.name,
      props.scale ? props.scale.scale(newValue) : newValue
    );
  };

  return (
    <Slider
      {...props.inputProps}
      value={props.scale ? props.scale.reverseScale(props.value) : props.value}
      scale={props.scale?.scale}
      getAriaValueText={props.inputProps.format}
      valueLabelFormat={props.inputProps.format}
      onChange={handleChange}
      orientation="vertical"
      valueLabelDisplay="auto"
      aria-labelledby="non-linear-slider"
    />
  );
};

export default SliderInput;
