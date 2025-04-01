import { ApiRole } from "ordercloud-javascript-sdk";

// Basic auth configuration
const CLIENT_ID = import.meta.env.VITE_APP_ORDERCLOUD_CLIENT_ID;
const SCOPE_STRING = import.meta.env.VITE_APP_ORDERCLOUD_SCOPE;
const CUSTOM_SCOPE_STRING = import.meta.env.VITE_APP_ORDERCLOUD_CUSTOM_SCOPE;

const SCOPE: ApiRole[] = SCOPE_STRING?.length
  ? (SCOPE_STRING.split(",") as ApiRole[])
  : [];
const CUSTOM_SCOPE: string[] = CUSTOM_SCOPE_STRING?.length
  ? CUSTOM_SCOPE_STRING.split(",")
  : [];

// Anonymous auth configuration
const ALLOW_ANONYMOUS_STRING = import.meta.env
  .VITE_APP_ORDERCLOUD_ALLOW_ANONYMOUS;
const ALLOW_ANONYMOUS: boolean = Boolean(ALLOW_ANONYMOUS_STRING === "true");

export { CLIENT_ID, SCOPE, CUSTOM_SCOPE, ALLOW_ANONYMOUS };
