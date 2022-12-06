import { Grid, Input, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
export type NumericInputProps = {
	title: string;
	name: string;
	min: number;
	max: number;
	step: number;
	format?: (value: number) => string;
};
const NumericInput: React.FC<NumericInputProps> = (
	props: NumericInputProps
) => {
	const [value, setValue] = React.useState<
		number | string | Array<number | string>
	>(props.min);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		setValue(newValue);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value === '' ? '' : Number(event.target.value));
	};

	const handleBlur = () => {
		if (value < 0) {
			setValue(0);
		} else if (value > 100) {
			setValue(100);
		}
	};

	return (
		<Grid container spacing={2} className="search-numeric-input">
			<Grid item xs={3}>
				<Typography id="input-slider" gutterBottom>
					{props.title}:
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Slider
					{...props}
					className="slider"
					value={typeof value === 'number' ? value : 0}
					getAriaValueText={props.format}
					valueLabelFormat={props.format}
					valueLabelDisplay="auto"
					aria-labelledby="non-linear-slider"
					onChange={handleSliderChange}
				/>
			</Grid>
			<Grid item xs={3}>
				<Input
					name={props.name}
					size="small"
					value={value}
					onChange={handleInputChange}
					onBlur={handleBlur}
					inputProps={{
						...props,
						type: 'number',
						'aria-labelledby': 'input-slider',
					}}
				/>
			</Grid>
		</Grid>
	);
};

export default NumericInput;
