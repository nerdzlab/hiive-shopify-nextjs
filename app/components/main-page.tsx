"use client";

import { graphql } from "@/lib/gql";
import { useLazyQuery } from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  AccountConnection,
  Card,
  Checkbox,
  EmptyState,
  Layout,
  Link,
  Page,
  Spinner,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { doTokenExchange } from "../actions";

import { useRouter } from "next/navigation";
import { useBoolean } from "@/hooks";
import { PRODUCTS } from "@/utils/routes";

const GET_SHOP = graphql(`
  #graphql
  query getShop {
    shop {
      name
    }
  }
`);

export default function Home({ shop }: { shop: string }) {
  const router = useRouter();
  const [loading, toggle] = useBoolean(true);
  const [getShop] = useLazyQuery(GET_SHOP, {
    fetchPolicy: "network-only",
  });

  const app = useAppBridge();

  const checkForToken = useCallback(() => {
    const apiToken = localStorage.getItem("user-token");
    if (apiToken) {
      router.push(PRODUCTS);
    } else {
      router.push("/login");
    }
  }, [router]);

  const markAppConnected = async () => {
    try {
      await fetch("/api/user/update");
      checkForToken();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    app.idToken().then((token) => {
      doTokenExchange(shop, token, false).then((data) => {
        if (data.hasConnected) {
          checkForToken();
        }
        setTimeout(() => {
          toggle.off();
        }, 1000);
      });
    });
  }, [app, shop, router, toggle, checkForToken]);

  const [checked, setChecked] = useState(false);
  const handleChange = useCallback(
    (newChecked: boolean) => setChecked(newChecked),
    [],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <AccountConnection
            connected={false}
            title="Hiive: Online Shopping & Deals"
            action={{
              content: "Connect",
              onAction: markAppConnected,
            }}
            details="Not connected"
            termsOfService={
              <div className="flex items-center">
                <Checkbox label="" checked={checked} onChange={handleChange} />
                <p>
                  I accept the <Link url="Example App">Terms of Service</Link>{" "}
                  and <Link url="Example App">Privacy Policy</Link>
                </p>
              </div>
            }
          />
        </Layout.Section>
        <Layout.Section>
          <Card>
            <EmptyState
              heading="Hiive"
              secondaryAction={{
                content: "Learn morer",
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia.
              </p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
