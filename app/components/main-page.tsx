"use client";

import { graphql } from "@/lib/gql";
import { useLazyQuery } from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Spinner } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { doTokenExchange } from "../actions";

import { useRouter } from "next/navigation";
import { useBoolean } from "@/hooks";
import { ACCOUNT, PRODUCTS } from "@/utils/routes";

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
      router.push(ACCOUNT);
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
        console.log("data", data);
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

  return (
    <div className="flex items-center justify-center h-full">
      <Spinner accessibilityLabel="Spinner example" size="large" />
    </div>
  );
}
