"use client";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineGrid,
  Layout,
  Text,
} from "@shopify/polaris";
import { Brand } from "@/types/Brand";

import ConnectAccount from "./ConnectAccount";
import { ProductError } from "./components/ProductStatus";

const STORE_REVIEW_BANNER = {
  pending: (
    <Banner title="Marketplace is reviewing your store" tone="warning" hideIcon>
      <p>It usually takes about 24 hours to hear back.</p>
    </Banner>
  ),
  approved: (
    <Banner title="Account is connected" tone="success" hideIcon>
      <p>You can sync with Marketplace now</p>
    </Banner>
  ),
  declined: (
    <Banner title="Account is connected" tone="success" hideIcon>
      <p>You can sync with Marketplace now</p>
    </Banner>
  ),
};

const AccountSection = ({
  approveStatus,
}: {
  approveStatus: Brand["approvalStatus"];
}) => {
  return (
    <Box padding="400">
      <BlockStack gap="500">
        <Box>
          <Text variant="headingXl" as="h4">
            Welcome to Hiive
          </Text>
          <Text variant="bodyLg" as="p" tone="subdued">
            Update your personal and brand information or review important
            documents
          </Text>
        </Box>

        {STORE_REVIEW_BANNER[approveStatus]}

        <Layout>
          <Layout.AnnotatedSection
            id="accountDetails"
            title="Marketplace account"
            description="Connect your Marketplace Account so you can manage and sync with Marketplace"
          >
            <ConnectAccount />
          </Layout.AnnotatedSection>
        </Layout>

        <Layout>
          <Layout.AnnotatedSection
            id="publishingDetails"
            title="Publishing"
            description="Products that are being synced to your catalog, or have errors preventing their sync, are shown here."
          >
            <Card>
              <BlockStack gap="300">
                <InlineGrid columns="1fr auto">
                  <Text as="h2" variant="headingSm">
                    Product status
                  </Text>
                  <Button
                    variant="plain"
                    onClick={() => {}}
                    accessibilityLabel="manageAvailability"
                  >
                    Manage availability
                  </Button>
                </InlineGrid>

                <ProductError />
                <Divider />
                <Text as="p">
                  Marketplace takes up to 3 business days to review published
                  products.
                </Text>
              </BlockStack>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </BlockStack>
    </Box>
  );
};

export default AccountSection;
