import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Input, Slider } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import './PropertySearch.scss';
import NumericFields from './NumericFields';
import { findDeals } from '../../../api/deals_api';
import Deal from '../../../models/deal';
import {
	Control,
	Controller,
	useForm,
	UseFormRegister,
	UseFormSetValue,
} from 'react-hook-form';
import TextInput from '../../form/TextInput';
import AutocompleteInput from '../../form/AutocompleteInput';

const theme = createTheme();

type PropertySearchProps = {
	setProperties: (properties: Deal[]) => Promise<void>;
	handleSubmit: any;
	control: Control<any, any>;
	setValue: UseFormSetValue<any>;
	loading: boolean;
	setLoading: (loading: boolean) => void;
};

const PropertySearch: React.FC<PropertySearchProps> = (
	props: PropertySearchProps
) => {
	const handleSubmitButton = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		props.handleSubmit();
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 6,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<SearchOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Search Property
					</Typography>
					<Box
						className="search-form"
						component="form"
						noValidate
						onSubmit={handleSubmitButton}
						sx={{ mt: 3 }}>
						<Grid
							container
							spacing={2}
							className="search-text-fields">
							<Grid item xs={12}>
								<AutocompleteInput
									control={props.control}
									setValue={props.setValue}
									inputProps={{
										title: 'Location (state, city, neighborhood, zip)',
										name: 'location',
									}}
								/>
							</Grid>
						</Grid>
						<NumericFields
							control={props.control}
							setValue={props.setValue}
						/>
						<LoadingButton
							loading={props.loading}
							loadingPosition="end"
							className="search-button"
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							Search
						</LoadingButton>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default PropertySearch;
