import { RouteObject } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../layout/Dashboard";

export const mainLayoutRoute: RouteObject = {
  path: "/",
  element: <Layout />,
  children: [
    {
      index: true, // Makes Dashboard the default element for "/"
      element: <Dashboard />,
    },
  ],
};