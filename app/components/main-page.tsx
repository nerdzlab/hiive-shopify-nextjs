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
      router.push("/inventory");
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

  // return (
  //   <Page title="Home">
  //     <div className="flex items-center justify-center gap-1 p-2 bg-orange-400 text-white rounded-lg mb-2">
  //       <p className="font-medium text-[1rem]">
  //         We can also use tailwindcss in this project!
  //       </p>
  //     </div>
  //     <Card
  //       sectioned
  //       title="NextJs API Routes"
  //       primaryFooterAction={{
  //         content: "Call API",
  //         onAction: handleGetAPIRequest,
  //       }}
  //     >
  //       <Text as="p" variant="bodyMd">
  //         Call a NextJS api route from within your app. The request is verified
  //         using session tokens.
  //       </Text>
  //       {data && (
  //         <Text as="h1" variant="headingSm">
  //           {data.name} is {data.height} tall.
  //         </Text>
  //       )}
  //     </Card>

  //     <Card
  //       sectioned
  //       title="React server actions"
  //       primaryFooterAction={{
  //         content: "Server action",
  //         onAction: async () => {
  //           const token = await app.idToken();
  //           console.log("token", token);
  //           const response = await doServerAction(token);
  //           setServerActionResult(response);
  //         },
  //       }}
  //     >
  //       <Text as="p" variant="bodyMd">
  //         Call a server action from within your app. The request is verified
  //         using session tokens.
  //       </Text>
  //       {serverActionResult && serverActionResult.status === "success" && (
  //         <Text as="h1" variant="headingSm">
  //           Server action was successful.
  //         </Text>
  //       )}
  //       {serverActionResult && serverActionResult.status === "error" && (
  //         <Text as="h1" variant="headingSm">
  //           Server action failed.
  //         </Text>
  //       )}
  //     </Card>

  //     <Card
  //       sectioned
  //       title="Use Apollo Client to query Shopify GraphQL"
  //       primaryFooterAction={{
  //         content: "GraphQL Query",
  //         onAction: async () => {
  //           try {
  //             const { data, error } = await getShop();
  //             if (data) {
  //               setGraphglData(data);
  //             }
  //             if (error) {
  //               console.error(error);
  //             }
  //           } catch (err) {
  //             console.error(err);
  //           }
  //         },
  //       }}
  //     >
  //       <Text as="p" variant="bodyMd">
  //         Use Apollo Client to query Shopify&apos;s GraphQL API. The request
  //         uses online session tokens.
  //       </Text>
  //       <Text as="p" variant="bodyMd">
  //         Response:
  //       </Text>
  //       {graphqlData && (
  //         <Text as="h1" variant="headingSm">
  //           {graphqlData.shop.name}
  //         </Text>
  //       )}
  //     </Card>

  //     <Card sectioned title="Shopify App Bridge">
  //       <Text as="p" variant="bodyMd">
  //         Use the direct graphql api provided by Shopify App Bridge. This
  //         automatically uses an authenticated graphql route, no need to add
  //         tokens.
  //       </Text>
  //       <Button
  //         onClick={async () => {
  //           const res = await fetch("shopify:admin/api/graphql.json", {
  //             method: "POST",
  //             body: JSON.stringify({
  //               query: `
  //               query {
  //                 shop {
  //                   name
  //                 }
  //               }
  //             `,
  //             }),
  //           });
  //           const { data } = await res.json();
  //           console.log(data);
  //         }}
  //       >
  //         GraphQL Query
  //       </Button>
  //     </Card>

  //     <Card sectioned title="Shopify App Bridge">
  //       <Text as="p" variant="bodyMd">
  //         Use Shopify App Bridge to interact with the Shopify admin. The request
  //         uses online session tokens. This uses Shopify App Bridge v4.
  //       </Text>
  //       <Link href="/login">New page using next/link</Link>
  //     </Card>
  //   </Page>
  // );
}
