import { Suspense, lazy } from 'react';
import {
  Navigate,
  Outlet,
  RouteObject,
  createBrowserRouter,
} from 'react-router-dom';
import WrapperRouteComponent from 'routes/WrapperRoute';
import Layout from 'common/components/Layout';
import MyRequests from 'features/requestDevices';
import Login from 'features/auth/pages/Login';
import LoginCallback from 'features/auth/pages/LoginCallback';
import RequestTemplates from 'features/RequestTemplates';
import UserManagement from 'features/userManagement';
import Tasks from 'features/Tasks';
import SettingsComponent from 'features/settings';

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
        path: 'administration',
        element: (
          <WrapperRouteComponent>
            <Outlet />
          </WrapperRouteComponent>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="user-management" />,
          },
          {
            path: 'user-management',
            element: (
              <WrapperRouteComponent>
                <UserManagement />
              </WrapperRouteComponent>
            ),
          },
          {
            index: true,
            element: <Navigate to="settings" />,
          },
          {
            path: 'settings',
            element: (
              <WrapperRouteComponent>
                <SettingsComponent />
              </WrapperRouteComponent>
            ),
          },
        ],
      },
      {
        path: 'tasks',
        element: (
          <WrapperRouteComponent>
            <Tasks />
          </WrapperRouteComponent>
        ),
      },
      // {
      //   path: 'report-wfh',
      //   element: (
      //     <WrapperRouteComponent>
      //       <PostAndWFH />
      //     </WrapperRouteComponent>
      //   ),
      // },
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
