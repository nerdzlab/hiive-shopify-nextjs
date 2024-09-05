"use client";

import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ApolloProvider from "./ApolloProvider";
import { RecoilRoot } from "recoil";
import Link from "next/link";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={translations}>
      <ApolloProvider>
        <RecoilRoot>
          <ui-nav-menu>
            <Link href="/overview">Overview</Link>
            <Link href="/inventory">Inventory</Link>
          </ui-nav-menu>
          {/* <SessionProvider> */}
          {children}
          {/* </SessionProvider> */}
        </RecoilRoot>
      </ApolloProvider>
    </AppProvider>
  );
}

export function ExitProvider({ children }: { children: React.ReactNode }) {
  return <AppProvider i18n={translations}>{children}</AppProvider>;
}
