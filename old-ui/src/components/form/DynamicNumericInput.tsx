import {
	Box,
	Grid,
	Input,
	InputAdornment,
	Slider,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
	Control,
	Controller,
	UseFormRegister,
	UseFormSetValue,
} from 'react-hook-form';
import { InputProps } from './formTypes';

const valueLabelFormat = (value: number) => {
	const units = [
		'1 day',
		'7 days',
		'14 days',
		'30 days',
		'90 days',
		'6 months',
		'12 months',
		'24 months',
		'36 months',
	];
	return `${units[value]}`;
};

const calculateValue = (value: number) => {
	return value;
};

type DynamicNumericInputProps = {
	inputProps: InputProps;
	control: Control<any, any>;
	setValue: UseFormSetValue<any>;
};
const DynamicNumericInput: React.FC<DynamicNumericInputProps> = (
	props: DynamicNumericInputProps
) => {
	const [value, setValue] = React.useState<number>(10);

	const handleChange = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setValue(newValue);
			props.setValue(props.inputProps.name, newValue);
		}
	};

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
						// <Slider
						// 	{...props.inputProps}
						// 	className="slider"
						// 	getAriaValueText={props.inputProps.format}
						// 	valueLabelFormat={props.inputProps.format}
						// 	valueLabelDisplay="auto"
						// 	aria-labelledby="non-linear-slider"
						// 	value={value}
						// 	onChange={onChange}
						// />
						<Slider
							{...props.inputProps}
							value={value}
							scale={calculateValue}
							getAriaValueText={valueLabelFormat}
							valueLabelFormat={valueLabelFormat}
							onChange={handleChange}
							valueLabelDisplay="auto"
							aria-labelledby="non-linear-slider"
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
};

export default DynamicNumericInput;
