import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
type CopyrightProps = {
	sx: any;
};

const Copyright: React.FC<CopyrightProps> = (props: CopyrightProps) => {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}>
			{'Copyright © '}
			<Link color="inherit" to="/home">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
};

export default Copyright;
