import { Grid, Input, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import DynamicNumericInput from '../../form/DynamicNumericInput';
import DynamicRangeInput from '../../form/PriceRangeInput';
import { InputProps } from '../../form/formTypes';
import NumericInput from '../../form/NumericInput';
import RangeInput from '../../form/RangeInput';
import ArvInput from '../../form/ArvInput';

const priceFormatter = (value: number) =>
	`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const percentFormatter = (value: number) => `%${value}`;
const distanceFormatter = (value: number) => `${value} Miles`;
const ageFormatter = (value: number) => `${value} days`;

const searchNumericValues: InputProps[] = [
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

const arvInputProps = {
	title: 'Arv',
	name: 'arv',
	format: priceFormatter,
};

const priceInputProps = {
	title: 'Price',
	name: 'price',
	format: priceFormatter,
};

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
			<ArvInput inputProps={arvInputProps} setValue={props.setValue} />

			<DynamicRangeInput
				inputProps={priceInputProps}
				setValue={props.setValue}
			/>

			{searchNumericValues.map(
				(valueProps: InputProps, index: number) => (
					<NumericInput
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
