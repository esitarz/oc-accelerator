import { useToast } from "@chakra-ui/react";
import {
  IOrderCloudErrorContext,
  OrderCloudProvider,
} from "@ordercloud/react-sdk";
import { OrderCloudError } from "ordercloud-javascript-sdk";
import { FC, useCallback } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import GlobalLoadingIndicator from "./components/shared/LoadingIndicator";
import { BASE_API_URL } from "./constants/api.constants";
import { IS_AUTO_APPLY } from "./constants/app.constants";
import {
  ALLOW_ANONYMOUS,
  CLIENT_ID,
  CUSTOM_SCOPE,
  SCOPE,
} from "./constants/auth.constants";
import routes from "./routes";

const basename = import.meta.env.VITE_APP_CONFIG_BASE;

const router = createBrowserRouter(routes, { basename });

const AppProvider: FC = () => {
  const toast = useToast();

  const defaultErrorHandler = useCallback(
    (error: OrderCloudError, { logout }: IOrderCloudErrorContext) => {
      if (error.status === 401) {
        console.log("DEFAULT ERROR HANDLER", 401);
        return logout();
      }
      if (!toast.isActive(error.errorCode)) {
        toast({
          id: error.errorCode,
          title: error.status === 403 ? "Permission denied" : error.message,
          status: "error",
        });
      }
    },
    [toast]
  );

  return (
    <OrderCloudProvider
      baseApiUrl={BASE_API_URL}
      clientId={CLIENT_ID}
      scope={SCOPE}
      customScope={CUSTOM_SCOPE}
      allowAnonymous={ALLOW_ANONYMOUS}
      autoApplyPromotions={IS_AUTO_APPLY}
      defaultErrorHandler={defaultErrorHandler}
    >
      <RouterProvider router={router} />
      <GlobalLoadingIndicator />
    </OrderCloudProvider>
  );
};

export default AppProvider;
