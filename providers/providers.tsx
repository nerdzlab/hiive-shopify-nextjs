"use client";
import { AppProvider } from "@shopify/polaris";
import { RecoilRoot } from "recoil";
import Link from "next/link";

import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PRODUCTS, OVERVIEW, SETTINGS, ACCOUNT } from "@/utils/routes";

import ApolloProvider from "./ApolloProvider";

const SideBar = () => {
  const auth = useAuth();
  const { allowUser } = auth || {};

  return allowUser ? (
    <ui-nav-menu>
      <Link href={OVERVIEW} rel="home">
        Overview
      </Link>
      <Link href={PRODUCTS}>Manage Products</Link>
      <Link href={SETTINGS}>Settings</Link>
      <Link href={ACCOUNT}>Account</Link>
    </ui-nav-menu>
  ) : (
    <ui-nav-menu>
      <Link href={SETTINGS}>Settings</Link>
      <Link href={ACCOUNT}>Account</Link>
    </ui-nav-menu>
  );
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
