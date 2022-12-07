import { Grid, Input, InputAdornment, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { InputProps } from './formTypes';

type NumericInputProps = {
	inputProps: InputProps;
	control: Control<any, any>;
};
const NumericInput: React.FC<NumericInputProps> = (
	props: NumericInputProps
) => {
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
							value={value}
							onChange={onChange}
						/>
					)}
				/>
			</Grid>
			<Grid item xs={3}>
				<Controller
					name={props.inputProps.name}
					control={props.control}
					render={({ field: { onChange, value } }) => (
						<Input
							// onChange={handleInputChange}
							onChange={onChange}
							value={value}
							name={props.inputProps.name}
							size="small"
							// onBlur={() => handleBlur(value)}
							inputProps={{
								...props,
								type: 'number',
								'aria-labelledby': 'input-slider',
							}}
							startAdornment={
								props.inputProps.abbreviation &&
								props.inputProps.abbreviation.position ===
									'start' && (
									<InputAdornment position={'start'}>
										{props.inputProps.abbreviation.text}
									</InputAdornment>
								)
							}
							endAdornment={
								props.inputProps.abbreviation &&
								props.inputProps.abbreviation.position ===
									'end' && (
									<InputAdornment position={'end'}>
										{props.inputProps.abbreviation.text}
									</InputAdornment>
								)
							}
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
};

export default NumericInput;
