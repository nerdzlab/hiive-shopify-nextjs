"use client";

import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ApolloProvider from "./ApolloProvider";
import { RecoilRoot } from "recoil";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { INVENTORY, OVERVIEW } from "@/utils/routes";

const SideBar = () => {
  const auth = useAuth();
  const { allowUser } = auth || {};

  return allowUser ? (
    <ui-nav-menu>
      <Link href={OVERVIEW}>Overview</Link>
      <Link href={INVENTORY}>Inventory</Link>
    </ui-nav-menu>
  ) : null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={translations}>
      <ApolloProvider>
        <RecoilRoot>
          <AuthProvider>
            <SideBar />
            {/* <SessionProvider> */}
            {children}
            {/* </SessionProvider> */}
          </AuthProvider>
        </RecoilRoot>
      </ApolloProvider>
    </AppProvider>
  );
}

export function ExitProvider({ children }: { children: React.ReactNode }) {
  return <AppProvider i18n={translations}>{children}</AppProvider>;
}
