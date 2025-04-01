import { RouteObject } from "react-router-dom";
import CategoryList from "../components/category/CategoryList";

export const categoryRoutes: RouteObject[] = [
  {
    path: "/shop/:catalogId/categories",
    element: <CategoryList />,
  },
  {
    path: "/shop/:catalogId/categories/:categoryId",
    element: <CategoryList />,
  },
];
