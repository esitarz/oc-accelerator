import { RouteObject } from "react-router-dom";
import CategoryList from "./components/category/CategoryList";
import { Checkout } from "./components/checkout/Checkout";
import OrderConfirmation from "./components/checkout/OrderConfirmation";
import ProductList from "./components/product/ProductList";
import ProductDetailWrapper from "./components/product/product-detail/ProductDetailWrapper";
import Dashboard from './layout/Dashboard';
import Layout from "./layout/Layout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/cart",
        element: <Checkout />,
      },

      {
        path: "/products",
        element: <ProductList />,
      },
      {
        path: "/shop/:catalogId/categories",
        element: <CategoryList />,
      },
      {
        path: "/shop/:catalogId/categories/:categoryId",
        element: <CategoryList />,
      },
      {
        path: "/shop/:catalogId/categories/:categoryId/products",
        element: <ProductList />,
      },
      {
        path: "/shop/:catalogId/products",
        element: <ProductList />,
      },
      {
        path: "/products/:productId",
        element: <ProductDetailWrapper />,
      },
    ],
  },
  {
    path: "/order-confirmation",
    element: <OrderConfirmation />,
  },
];

export default routes;
