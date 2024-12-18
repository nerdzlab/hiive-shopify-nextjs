import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@shopify/polaris";

import { useAuth } from "@/context/AuthContext";
import {
  ACCOUNT,
  AUTH_ROUTES,
  BRAND_VERIFY,
  LOGIN,
  OVERVIEW,
} from "@/utils/routes";

const withAuth = <T extends {}>(WrappedComponent: React.ComponentType<T>) => {
  return (props: any) => {
    const router = useRouter();
    const auth = useAuth();
    const {
      loading,
      token,
      isNoBrand,
      isBrandPending,
      isBrandDeclined,
      allowUser,
    } = auth || {};
    useEffect(() => {
      const isAuthRoute = AUTH_ROUTES.includes(window.location.pathname);

      if (!loading && token && isNoBrand) {
        router.replace(BRAND_VERIFY);
      } else if (!loading && (isBrandPending || isBrandDeclined)) {
        router.replace(ACCOUNT);
      } else if (!loading && isAuthRoute && allowUser) {
        router.replace(ACCOUNT);
      } else if (!loading && !isAuthRoute && (!token || !allowUser)) {
        router.replace(LOGIN);
      }
    }, [loading, token]);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>
      );
    }

    return <WrappedComponent {...(props as T)} />;
  };
};

export default withAuth;
