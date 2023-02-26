import { debounce, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useMemo } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import LocationSuggestion from '../../models/location_suggestions';
import { getLocationSuggestions } from '../../api/location_api';
import { InputProps } from './formTypes';

type AutocompleteInputProps = {
	inputProps: InputProps;
	control: Control<any, any>;
	setValue: UseFormSetValue<any>;
};
const AutocompleteInput: React.FC<AutocompleteInputProps> = (
	props: AutocompleteInputProps
) => {
	const [suggestionValue, setSuggestionValue] =
		React.useState<LocationSuggestion | null>(null);
	const [options, setOptions] = React.useState<LocationSuggestion[]>([]);

	const fetch = useMemo(
		() =>
			debounce(async (searchTerm: string) => {
				const results = await getLocationSuggestions(searchTerm);
				setOptions(results.data);
			}, 400),
		[]
	);

	return (
		<Controller
			name={props.inputProps.name}
			control={props.control}
			render={({ field: { onChange, value } }) => (
				<Autocomplete
					freeSolo
					value={value}
					filterOptions={(x) => x}
					onChange={(
						event: any,
						newValue: LocationSuggestion | null
					) => {
						setOptions(newValue ? [newValue, ...options] : options);
						setSuggestionValue(newValue);
						props.setValue('location', newValue);
					}}
					options={options}
					getOptionLabel={(option) =>
						typeof option === 'string' ? option : option.display
					}
					onInputChange={(event, newInputValue) => {
						fetch(newInputValue);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							label={props.inputProps.title}
							fullWidth
							value={suggestionValue?.display}
						/>
					)}
				/>
			)}
		/>
	);
};

export default AutocompleteInput;
