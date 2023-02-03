import { Grid, Input, InputAdornment, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { InputProps } from './formTypes';

const priceFormatter = (value: number) =>
	`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const valueLabelFormat = (value: number) => {
	if (value) return priceFormatter(value);
	return 'Any Price';
};

const calculateValue = (value: number) => {
	let price: number = 0;
	if (value < 10) {
		price = 100000 * value;
	} else if (value < 19) {
		price = ((value - 10) * 0.25 + 1) * 1000000;
	} else {
		price = 0;
	}
	return price;
};

export type ArvInputProps = {
	inputProps: InputProps;
	setValue: UseFormSetValue<any>;
};
const ArvInput: React.FC<ArvInputProps> = (props: ArvInputProps) => {
	const [value, setValue] = React.useState<[number, number]>([0, 19]);

	const handleChange = (event: Event, newValue: number | number[]) => {
		const valueRange = newValue as [number, number];
		const scaledValue = [
			calculateValue(valueRange[0]),
			calculateValue(valueRange[1]),
		];
		setValue(valueRange);
		props.setValue(props.inputProps.name, scaledValue);
	};

	return (
		<Grid container spacing={2} className="search-numeric-input">
			<Grid item xs={3}>
				<Typography id="input-slider" gutterBottom>
					{props.inputProps.title}:
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Slider
					{...props.inputProps}
					min={0}
					max={19}
					value={value}
					scale={calculateValue}
					getAriaValueText={valueLabelFormat}
					valueLabelFormat={valueLabelFormat}
					onChange={handleChange}
					valueLabelDisplay="auto"
					aria-labelledby="non-linear-slider"
				/>
			</Grid>
		</Grid>
	);
};

export default ArvInput;
