import { Controller } from 'react-hook-form';
import React from 'react';
import { TextField } from '@mui/material';

type FormInputTextProps = {
	name: any;
	control: any;
	label: any;
};

const FormInputText: React.FC<FormInputTextProps> = (
	props: FormInputTextProps
) => {
	return (
		<>
			<TextField
				required
				fullWidth
				id="email"
				label="Zillow URL"
				name="zillowUrl"
				type="url"
				autoComplete="https://"
			/>
		</>
	);
};

export default FormInputText;
