import { Grid, Input, Slider, Typography } from '@mui/material';
import React, { useState } from 'react';
import NumericInput, { NumericInputProps } from './NumericInput';

const priceFormatter = (value: number) =>
	`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const percentFormatter = (value: number) => `%${value}`;
const distanceFormatter = (value: number) => `${value} Miles`;
const ageFormatter = (value: number) => `${value} days`;

const searchRangeNumericValues = {
	price: {
		title: 'Price',
		min: 0,
		max: 10000000,
		step: 1000,
		formatter: priceFormatter,
	},
};
const searchNumericValues: NumericInputProps[] = [
	{
		title: 'Arv',
		name: 'arv',
		min: 0,
		max: 10000000,
		step: 100000,
		format: priceFormatter,
	},
	{
		title: 'UnderComps',
		name: 'underComps',
		min: 0,
		max: 200,
		step: 1,
		format: percentFormatter,
	},
	{
		title: 'Radius',
		name: 'radius',
		min: 0,
		max: 100,
		step: 0.5,
		format: distanceFormatter,
	},
	{
		title: 'Age',
		name: 'age',
		min: 0,
		max: 120,
		step: 1,
		format: ageFormatter,
	},

	{
		title: 'Min Price',
		name: 'minPrice',
		min: 0,
		max: 10000000,
		step: 100000,
		format: priceFormatter,
	},

	{
		title: 'Max Price',
		name: 'maxPrice',
		min: 0,
		max: 10000000,
		step: 100000,
		format: priceFormatter,
	},
];

export type NumericFieldsProps = {};

const NumericFields: React.FC<NumericFieldsProps> = (
	props: NumericFieldsProps
) => {
	return (
		<React.Fragment>
			{searchNumericValues.map(
				(props: NumericInputProps, index: number) => (
					<NumericInput {...props} />
				)
			)}
		</React.Fragment>
	);
};

export default NumericFields;
