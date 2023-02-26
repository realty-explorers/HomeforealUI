import { TextField } from '@mui/material';
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
		<Controller
			name={props.inputProps.name}
			control={props.control}
			render={({ field: { onChange, value } }) => (
				<TextField
					required
					fullWidth
					id="email"
					label={props.inputProps.title}
					name={props.inputProps.name}
					value={value}
					onChange={onChange}
				/>
			)}
		/>
	);
};

export default NumericInput;
