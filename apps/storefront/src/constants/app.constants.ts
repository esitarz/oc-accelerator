const APP_NAME = import.meta.env.VITE_APP_NAME || "Application Name";
const IS_MULTI_LOCATION_INVENTORY = Boolean(
  import.meta.env.VITE_APP_ORDERCLOUD_MULTILOCATION_INVENTORY === "true"
);
const IS_AUTO_APPLY = Boolean(
  import.meta.env.VITE_APP_ORDERCLOUD_AUTO_APPLY_PROMOS === "true"
);

export { APP_NAME, IS_MULTI_LOCATION_INVENTORY, IS_AUTO_APPLY };
