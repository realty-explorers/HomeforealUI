import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { createTheme, StyledEngineProvider } from '@mui/material/styles';
import 'antd/dist/antd.css';
import './index.scss';
import App from './App';
import Navigation from './components/navigation/Navigation';
import ErrorPage from './components/pages/ErrorPage';
import reportWebVitals from './reportWebVitals';
import Test from './components/pages/Test';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import About from './components/pages/About';
import Dashboard from './components/pages/dashboard/Dashboard';
import SignUp from './components/pages/SignUp';
import { ThemeProvider } from '@emotion/react';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigation />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: 'home/',
				element: <Home />,
			},
			{
				path: 'dashboard/',
				element: <Dashboard />,
			},
			{
				path: 'profile/',
				element: <Profile />,
			},
			{
				path: 'about/',
				element: <About />,
			},
		],
	},
	{
		path: 'login/',
		element: <Login />,
		errorElement: <ErrorPage />,
	},

	{
		path: 'signup/',
		element: <SignUp />,
		errorElement: <ErrorPage />,
	},
]);

const theme = createTheme({
	typography: {
		allVariants: {
			fontFamily: 'Montserrat',
		},
	},
});

root.render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<RouterProvider router={router} />
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
