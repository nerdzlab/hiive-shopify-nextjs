"use client";
import { BlockStack, Card, Grid, Page } from "@shopify/polaris";
import { ProductIcon, SettingsIcon } from "@shopify/polaris-icons";
import { CardWithAction } from "../components/CardWithAction";
import { useRouter } from "next/navigation";

export default function Products() {
  const router = useRouter();

  const onPrivacyClick = () => {
    window.open(
      "https://www.joinhiive.com/privacy-policy",
      "_blank",
      "noopener,noreferrer",
    );
  };
  const onBrandClick = () => router.push("/brand/verify?edit=true");

  return (
    <Page
      fullWidth
      title="Settings"
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing eli."
    >
      <BlockStack gap="500">
        <Grid columns={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
          <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
            <Card>
              <CardWithAction
                title="Brand Onboarding Form"
                description="Edit and manage your brand details for Hiive"
                buttonTitle="Manage brand form"
                buttonAction={onBrandClick}
              />
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
            <Card>
              <CardWithAction
                title="Privacy Policy"
                description="Review how we protect your data and privacy"
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
