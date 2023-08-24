import { Suspense, lazy } from 'react';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';
import WrapperRouteComponent from 'routes/WrapperRoute';
import Layout from 'common/components/Layout';
import RequestTemplates from 'features/requestDevices/pages/RequestTemplates';
import MyRequests from 'features/requestDevices/pages/MyRequests';
import Login from 'features/auth/pages/Login';
import LoginCallback from 'features/auth/pages/LoginCallback';

const NotFound = lazy(() => import('common/components/NotFound'));
const routeList: RouteObject[] = [
	{
		path: '/',
		element: (
			<WrapperRouteComponent auth={true}>
				<Layout />
			</WrapperRouteComponent>
		),
		children: [
			{
				index: true,
				element: <Navigate to="request-templates" />,
			},
			{
				path: 'request-templates',
				element: (
					<WrapperRouteComponent>
						<RequestTemplates />
					</WrapperRouteComponent>
				),
			},
			{
				path: 'my-requests',
				element: (
					<WrapperRouteComponent>
						<MyRequests />
					</WrapperRouteComponent>
				),
			},
			{
				path: '*',
				element: (
					<Suspense>
						<WrapperRouteComponent>
							<NotFound />
						</WrapperRouteComponent>
					</Suspense>
				),
			},
		],
	},
	{
		path: 'callback',
		element: <LoginCallback />,
	},
	{
		path: 'login',
		element: <Login />,
	},
	{
		path: 'signin-google',
		element: <Login />,
	},
];

const Router = createBrowserRouter(routeList);
export default Router;
