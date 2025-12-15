import { Suspense, lazy } from 'react';
import {
  Navigate,
  Outlet,
  RouteObject,
  createBrowserRouter,
  redirect,
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
import Roles from 'features/Roles';
import PostAndWFH from 'features/report';
import Permissions from 'features/Permissions';
import ReleaseContent from 'features/releaseContent';
import { AuthProvider } from 'providers';
import Error from 'features/Error';
import LoginMezonByHash from 'features/auth/pages/LoginMezonByHash';
import Webhooks from 'features/Webhooks';

const NotFound = lazy(() => import('common/components/NotFound'));
const rootLoader = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const data = url.searchParams.get('data');

  if (data) {
    return redirect(`/login-mezon?data=${encodeURIComponent(data)}`);
  }

  return null;
};

const routeList: RouteObject[] = [
  {
    path: '/',
    loader: rootLoader,
    element: (
      <WrapperRouteComponent auth={true}>
        <AuthProvider>
          <Layout />
        </AuthProvider>
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
        path: 'release-content',
        element: (
          <WrapperRouteComponent>
            <ReleaseContent />
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
          {
            path: 'roles',
            element: (
              <WrapperRouteComponent>
                <Roles />
              </WrapperRouteComponent>
            ),
          },
          {
            path: 'permissions',
            element: (
              <WrapperRouteComponent>
                <Permissions />
              </WrapperRouteComponent>
            ),
          },
          {
            path: 'webhooks',
            element: (
              <WrapperRouteComponent>
                <Webhooks />
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
      {
        path: 'roles',
        element: (
          <WrapperRouteComponent>
            <Roles />
          </WrapperRouteComponent>
        ),
      },

      {
        path: 'report',
        element: (
          <WrapperRouteComponent>
            <Outlet />
          </WrapperRouteComponent>
        ),
        children: [
          {
            path: 'report-wfh',
            element: (
              <WrapperRouteComponent>
                <PostAndWFH />
              </WrapperRouteComponent>
            ),
          },
        ],
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
    path: 'Error',
    element: <Error />,
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
  {
    path: 'login-mezon',
    element: <LoginMezonByHash />,
  },
];

const Router = createBrowserRouter(routeList);
export default Router;
