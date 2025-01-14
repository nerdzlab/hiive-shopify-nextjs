"use client";

import { useRouter } from "next/navigation";
import { BlockStack, Box, Card, Grid } from "@shopify/polaris";

import { CardWithAction } from "../components/CardWithAction";

const SettingsSection = () => {
  const router = useRouter();

  const onPrivacyClick = () => {
    window.open(
      "https://www.joinhiive.com/privacy-policy",
      "_blank",
      "noopener,noreferrer",
    );
  };
  const onBrandClick = () => router.push("/brand/verify?edit=true");

  const onTermsClick = () => {
    window.open(
      "https://www.joinhiive.com/terms-conditions",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Box padding="400">
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
          <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
            <Card>
              <CardWithAction
                title="Terms and Conditions"
                description="Take a moment to review our Terms and Conditions to understand our benefits. We want to ensure you have the best possible experience!"
                buttonTitle="Open Terms and Conditions"
                buttonAction={onTermsClick}
              />
            </Card>
          </Grid.Cell>
        </Grid>
      </BlockStack>
    </Box>
  );
};

export default SettingsSection;
