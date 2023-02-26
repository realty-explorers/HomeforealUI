import { Grid, Input, InputAdornment, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { InputProps } from './formTypes';

export type RangeInputProps = {
	inputProps: InputProps;
	control: Control<any, any>;
};
const RangeInput: React.FC<RangeInputProps> = (props: RangeInputProps) => {
	return (
		<Grid container spacing={2} className="search-numeric-input">
			<Grid item xs={3}>
				<Typography id="input-slider" gutterBottom>
					{props.inputProps.title}:
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Controller
					name={props.inputProps.name}
					control={props.control}
					render={({ field: { onChange, value } }) => (
						<Slider
							{...props.inputProps}
							className="slider"
							getAriaValueText={props.inputProps.format}
							valueLabelFormat={props.inputProps.format}
							valueLabelDisplay="auto"
							aria-labelledby="non-linear-slider"
							onChange={onChange}
							value={
								value
									? [value[0], value[1]]
									: [
											props.inputProps.min,
											props.inputProps.max,
									  ]
							}
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
};

export default RangeInput;
