import { RouteObject } from "react-router-dom";
import ProductList from "../components/product/ProductList";
import ProductDetailWrapper from "../components/product/product-detail/ProductDetailWrapper";

export const productRoutes: RouteObject[] = [
  {
    path: "/products",
    element: <ProductList />,
  },
  {
    path: "/shop/:catalogId/categories/:categoryId/products",
    element: <ProductList />,
  },
  {
    path: "/shop/:catalogId/products",
    element: <ProductList />,
  },
  // Product Detail
  {
    path: "/products/:productId",
    element: <ProductDetailWrapper />,
  },
];
