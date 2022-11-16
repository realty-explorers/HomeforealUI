import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import './index.scss';
import App from './App';
import Navigation from './components/pages/Navigation';
import ErrorPage from './components/pages/ErrorPage';
import reportWebVitals from './reportWebVitals';
import Results from './components/pages/Results';
import Test from './components/pages/Test';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import About from './components/pages/About';

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
				path: 'results/',
				element: <Results />,
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
]);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
