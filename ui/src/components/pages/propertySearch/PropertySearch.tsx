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
import NumericInputs, { NumericInputProps } from './NumericInput';
import { SearchOutlined } from '@mui/icons-material';
import './PropertySearch.scss';
import NumericFields from './NumericFields';
import { findDeals } from '../../../api/deals_api';
import Deal from '../../../models/deal';
import FormInputText from '../../formComponents/FormInputText';
import { useForm } from 'react-hook-form';

const theme = createTheme();

type PropertySearchProps = {
	setProperties: (properties: Deal[]) => Promise<void>;
};

const PropertySearch: React.FC<PropertySearchProps> = (
	props: PropertySearchProps
) => {
	const { handleSubmit, reset, control } = useForm();
	const [loading, setLoading] = useState(false);

	const handleSubmitButton = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		try {
			event.preventDefault();
			setLoading(true);
			const data = new FormData(event.currentTarget);
			const searchData = {
				arv: data.get('arv') as string,
				zillowUrl: data.get('zillowUrl') as string,
				radius: +(data.get('radius') as string),
				underComps: +(data.get('underComps') as string),
				minPrice: +(data.get('minPrice') as string),
				age: data.get('age') as string,
			};

			const response = await findDeals(
				searchData.zillowUrl,
				searchData.radius,
				searchData.underComps,
				searchData.minPrice,
				undefined,
				'6m'
			);
			if (response.status === 200) {
				props.setProperties(response.data);
				alert('done');
			} else throw Error(response.data);
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
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
						component="form"
						noValidate
						onSubmit={handleSubmitButton}
						sx={{ mt: 3 }}>
						<Grid
							container
							spacing={2}
							className="search-text-fields">
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Zillow URL"
									name="zillowUrl"
									type="url"
									autoComplete="https://"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="address"
									label="Address"
									type="text"
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
						</Grid>
						<NumericFields />
						<LoadingButton
							loading={loading}
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
