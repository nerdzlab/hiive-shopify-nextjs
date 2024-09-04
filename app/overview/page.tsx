"use client";
import {
  BlockStack,
  Box,
  Card,
  Grid,
  InlineGrid,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { ProductIcon, SettingsIcon } from "@shopify/polaris-icons";
import { useRouter } from "next/navigation";
import { CardWithAction } from "../components/CardWithAction";

export default function Products() {
  const router = useRouter();

  const onSettingsClick = () => router.push("/settings");

  return (
    <Page fullWidth title="Hiive Channel Overview">
      <BlockStack gap="500">
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <CardWithAction
                icon={ProductIcon}
                title="Products on Hiive"
                description="4 products are available on Hiive"
                buttonTitle="Manage products"
              />
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <CardWithAction
                icon={SettingsIcon}
                title="Settings"
                description="Manage your personal information"
                buttonTitle="Go to settings"
                buttonAction={onSettingsClick}
              />
            </Card>
          </Grid.Cell>
        </Grid>
        <Box>
          <BlockStack gap="500">
            <Text variant="headingLg" as="h5">
              Hiive performance
            </Text>
            <Card padding="0">
              <InlineGrid columns={2}>
                <div className="p-6">
                  <CardWithAction
                    title="48.4%"
                    description="of your customers are using Hiive "
                  />
                </div>
                <div className="p-6 border-[#E3E3E3] border-l-[1px] border-t-0 border-b-0 border-r-0	 border-solid	">
                  <CardWithAction title="88" description="active orders" />
                </div>
              </InlineGrid>
            </Card>
          </BlockStack>
        </Box>
      </BlockStack>
    </Page>
  );
}
