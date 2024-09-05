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
import { CardWithAction } from "../components/CardWithAction";
import { useRouter } from "next/navigation";

export default function Products() {
  const router = useRouter();

  const onPrivacyClick = () => router.push("/privacy");
  const onBrandClick = () => router.push("/brand/verify?edit=true");

  return (
    <Page
      fullWidth
      title="Settings"
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing eli."
    >
      <BlockStack gap="500">
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <CardWithAction
                title="Brand Onboarding Form"
                description="Lorem ipsum dolor sit amet, consectetur adipiscin"
                buttonTitle="Manage brand form"
                buttonAction={onBrandClick}
              />
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <CardWithAction
                title="Privacy Policy"
                description="Lorem ipsum dolor sit amet, consectetur adipiscin"
                buttonTitle="Go to Privacy Policy"
                buttonAction={onPrivacyClick}
              />
            </Card>
          </Grid.Cell>
        </Grid>
      </BlockStack>
    </Page>
  );
}
