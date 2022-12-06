import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';
import { Home, Person } from '@mui/icons-material';

export const mainListItems = (
	<React.Fragment>
		<Link to="/home">
			<ListItemButton>
				<ListItemIcon>
					<Home />
				</ListItemIcon>
				<ListItemText primary="Home" />
			</ListItemButton>
		</Link>
		<Link to="/dashboard">
			<ListItemButton>
				<ListItemIcon>
					<DashboardIcon />
				</ListItemIcon>
				<ListItemText primary="Dashboard" />
			</ListItemButton>
		</Link>
		<Link to="/profile">
			<ListItemButton>
				<ListItemIcon>
					<PeopleIcon />
				</ListItemIcon>
				<ListItemText primary="Profile" />
			</ListItemButton>
		</Link>

		<Link to="/about">
			<ListItemButton>
				<ListItemIcon>
					<BarChartIcon />
				</ListItemIcon>
				<ListItemText primary="About" />
			</ListItemButton>
		</Link>
	</React.Fragment>
);

export const secondaryListItems = (
	<React.Fragment>
		<ListSubheader component="div" inset>
			Saved reports
		</ListSubheader>
	</React.Fragment>
);
