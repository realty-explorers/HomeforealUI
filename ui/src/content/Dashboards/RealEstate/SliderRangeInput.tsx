import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  alpha,
  Autocomplete,
  debounce,
  Grid,
  Slider,
  SliderThumb,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { InputProps } from '@/components/Form/formTypes';

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.colors.primary.main,
  height: 3,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)'
    },
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1
    }
  },
  '& .MuiSlider-track': {
    height: 3
  },
  '& .MuiSlider-rail': {
    color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
    opacity: theme.palette.mode === 'dark' ? undefined : 1,
    height: 3
  }
  // '& .MuiSlider-valueLabel': {
  //   lineHeight: 1.2,
  //   fontSize: 12,
  //   background: 'unset',
  //   padding: 0,
  //   width: 32,
  //   height: 32,
  //   borderRadius: '50% 50% 50% 0',
  //   backgroundColor: '#52af77',
  //   transformOrigin: 'bottom left',
  //   transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
  //   '&:before': { display: 'none' },
  //   '&.MuiSlider-valueLabelOpen': {
  //     transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
  //   },
  //   '& > *': {
  //     transform: 'rotate(45deg)'
  //   }
  // }
}));

interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

type SliderRangeInputProps = {
  inputProps: InputProps;
  minValueName: string;
  maxValueName: string;
  minValue: number;
  maxValue: number;
  update: (name: string, value: any) => void;
  scale?: {
    scale: (number: number) => number;
    reverseScale: (number: number) => number;
  };
};
const SliderRangeInput: React.FC<SliderRangeInputProps> = (
  props: SliderRangeInputProps
) => {
  const handleChange = (event: Event, newValue: [number, number]) => {
    props.update(
      props.minValueName,
      props.scale ? props.scale.scale(newValue[0]) : newValue[0]
    );
    props.update(
      props.maxValueName,
      props.scale ? props.scale.scale(newValue[1]) : newValue[1]
    );
  };

  return (
    <StyledSlider
      {...props.inputProps}
      components={{ Thumb: AirbnbThumbComponent }}
      // slots={{ thumb: AirbnbThumbComponent }}
      value={[
        props.scale ? props.scale.reverseScale(props.minValue) : props.minValue,
        props.scale ? props.scale.reverseScale(props.maxValue) : props.maxValue
      ]}
      scale={props.scale?.scale}
      getAriaValueText={props.inputProps.format}
      valueLabelFormat={props.inputProps.format}
      onChange={handleChange}
      orientation="horizontal"
      valueLabelDisplay="auto"
      aria-labelledby="non-linear-slider"
    />
  );
};

export default SliderRangeInput;
