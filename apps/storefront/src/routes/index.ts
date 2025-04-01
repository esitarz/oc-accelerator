import { RouteObject } from "react-router-dom";
import { mainLayoutRoute } from "./common.routes";
import { productRoutes } from "./product.routes";
import { categoryRoutes } from "./category.routes";
import {
  checkoutLayoutRoutes,
  checkoutStandaloneRoutes,
} from "./checkout.routes";

// Create a mutable copy of the main layout's children array to merge others into
const layoutChildren = [...(mainLayoutRoute.children || [])];

// Add routes that belong inside the main Layout
layoutChildren.push(...checkoutLayoutRoutes);
layoutChildren.push(...productRoutes);
layoutChildren.push(...categoryRoutes);

// Assign the combined children back to the main layout route object
mainLayoutRoute.children = layoutChildren;

// Combine all top-level routes
const routes: RouteObject[] = [mainLayoutRoute, ...checkoutStandaloneRoutes];

export default routes;
