import { lazy } from "react";
import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import Layout from "common/components/Layout";
import RequestTemplates from "features/requestDevices/pages/RequestTemplates";
import MyRequests from "features/requestDevices/pages/MyRequests";
import Login from "features/auth/pages/Login";
import Manage from "features/account/pages/Manage";
import WrapperRoute from "./WrapperRoute";

const NotFound = lazy(() => import("common/components/NotFound"));
const routeList: RouteObject[] = [
  {
    path: "/",
    element: (
      <WrapperRoute auth={true}>
        <Layout />
      </WrapperRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="request-templates" />,
      },
      {
        path: "request-templates",
        element: (
          <WrapperRoute>
            <RequestTemplates />
          </WrapperRoute>
        ),
      },
      {
        path: "my-requests",
        element: (
          <WrapperRoute>
            <MyRequests />
          </WrapperRoute>
        ),
      },
      {
        path: "Account",
        children: [
          {
            index: true,
            element: <Navigate to="Manage" />,
          },
          {
            path: "Manage",
            element: (
              <WrapperRoute>
                <Manage />
              </WrapperRoute>
            ),
          },
        ],
      },
      {
        path: "*",
        element: (
          <WrapperRoute>
            <NotFound />
          </WrapperRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: 'signin-google',
    element: <Login />,
  },
];

const Router = createBrowserRouter(routeList);
export default Router;
