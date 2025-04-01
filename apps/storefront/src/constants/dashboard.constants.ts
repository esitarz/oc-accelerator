import { APP_NAME } from "./app.constants";

const DASHBOARD_HERO_TAGLINE =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_HERO_TAGLINE ||
  `Welcome to ${APP_NAME} storefront app`;
const DASHBOARD_HERO_IMAGE = import.meta.env
  .VITE_APP_ORDERCLOUD_DASHBOARD_HERO_IMAGE;
const DASHBOARD_HERO_CTA_TEXT =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_HERO_CTA_TEXT ||
  "Call to action";
const DASHBOARD_HERO_CTA_LINK = import.meta.env
  .VITE_APP_ORDERCLOUD_DASHBOARD_HERO_CTA_LINK;

const DASHBOARD_SECONDARY_IMAGE = import.meta.env
  .VITE_APP_ORDERCLOUD_DASHBOARD_SECONDARY_IMAGE;
const DASHBOARD_SECONDARY_HEADING =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_SECONDARY_HEADING ||
  "Secondary heading text";
const DASHBOARD_SECONDARY_DESCRIPTION =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_SECONDARY_DESCRIPTION ||
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const DASHBOARD_SECONDARY_CTA_TEXT =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_SECONDARY_CTA_TEXT ||
  "Call to action";
const DASHBOARD_SECONDARY_CTA_LINK = import.meta.env
  .VITE_APP_ORDERCLOUD_DASHBOARD_SECONDARY_CTA_LINK;

const DASHBOARD_TERTIARY_IMAGE = import.meta.env
  .VITE_APP_ORDERCLOUD_DASHBOARD_TERTIARY_IMAGE;
const DASHBOARD_TERTIARY_HEADING =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_TERTIARY_HEADING ||
  "Tertiary heading text";
const DASHBOARD_TERTIARY_DESCRIPTION =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_TERTIARY_DESCRIPTION ||
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const DASHBOARD_TERTIARY_CTA_TEXT =
  import.meta.env.VITE_APP_ORDERCLOUD_DASHBOARD_TERTIARY_CTA_TEXT ||
  "Call to action";
const DASHBOARD_TERTIARY_CTA_LINK = import.meta.env
  .VITE_APP_ORDERCLOUD_DASHBOARD_TERTIARY_CTA_LINK;

export {
  DASHBOARD_HERO_TAGLINE,
  DASHBOARD_HERO_IMAGE,
  DASHBOARD_HERO_CTA_LINK,
  DASHBOARD_HERO_CTA_TEXT,
  DASHBOARD_SECONDARY_IMAGE,
  DASHBOARD_SECONDARY_HEADING,
  DASHBOARD_SECONDARY_DESCRIPTION,
  DASHBOARD_SECONDARY_CTA_TEXT,
  DASHBOARD_SECONDARY_CTA_LINK,
  DASHBOARD_TERTIARY_IMAGE,
  DASHBOARD_TERTIARY_HEADING,
  DASHBOARD_TERTIARY_DESCRIPTION,
  DASHBOARD_TERTIARY_CTA_TEXT,
  DASHBOARD_TERTIARY_CTA_LINK,
};
