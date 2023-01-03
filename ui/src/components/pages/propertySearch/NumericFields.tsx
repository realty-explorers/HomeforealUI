import { Grid, Input, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import DynamicNumericInput from '../../form/DynamicNumericInput';
import { InputProps } from '../../form/formTypes';
import NumericInput from '../../form/NumericInput';
import RangeInput from '../../form/RangeInput';

const priceFormatter = (value: number) =>
	`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const percentFormatter = (value: number) => `%${value}`;
const distanceFormatter = (value: number) => `${value} Miles`;
const ageFormatter = (value: number) => `${value} days`;

const searchRangeNumericValues = [
	{
		title: 'Price',
		name: 'price',
		min: 0,
		max: 10000000,
		step: 100000,
		format: priceFormatter,
	},
];
const searchNumericValues: InputProps[] = [
	{
		title: 'Arv',
		name: 'arv',
		min: 0,
		max: 10000000,
		step: 100000,
		format: priceFormatter,
		abbreviation: {
			text: '$',
			position: 'start',
		},
	},
	{
		title: 'UnderComps',
		name: 'underComps',
		min: 0,
		max: 100,
		step: 1,
		format: percentFormatter,
		abbreviation: {
			text: '%',
			position: 'start',
		},
	},
	{
		title: 'Radius',
		name: 'radius',
		min: 0,
		max: 10,
		step: 0.5,
		format: distanceFormatter,
		abbreviation: {
			text: 'Miles',
			position: 'end',
		},
	},
	// {
	// 	title: 'Age',
	// 	name: 'age',
	// 	min: 0,
	// 	max: 120,
	// 	step: 1,
	// 	format: ageFormatter,
	// },
];

const ageInputProps = {
	title: 'Sold in last',
	name: 'age',
	min: 0,
	max: 8,
	step: 1,
	format: ageFormatter,
};

export type NumericFieldsProps = {
	control: Control<any, any>;
	setValue: UseFormSetValue<any>;
};

const NumericFields: React.FC<NumericFieldsProps> = (
	props: NumericFieldsProps
) => {
	return (
		<React.Fragment>
			{searchNumericValues.map(
				(valueProps: InputProps, index: number) => (
					<NumericInput
						inputProps={valueProps}
						control={props.control}
					/>
				)
			)}

			{searchRangeNumericValues.map(
				(valueProps: InputProps, index: number) => (
					<RangeInput
						inputProps={valueProps}
						control={props.control}
					/>
				)
			)}
			<DynamicNumericInput
				inputProps={ageInputProps}
				control={props.control}
				setValue={props.setValue}
			/>
		</React.Fragment>
	);
};

export default NumericFields;
