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
import { useCallback, useEffect, useRef } from "react";

import { BrandApprovalStatus } from "@/types/Brand";

import ConnectAccount from "./ConnectAccount";
import { ProductsContainer } from "./components/ProductStatus";
import { swrFetcher } from "../api/swrFetcher";
import { ProductsBanner } from "./components/ProductsBanners";

const StoreReviewBanner = ({
  declineReason,
  approveStatus,
}: {
  declineReason?: string | null;
  approveStatus: BrandApprovalStatus;
}) => {
  const onResubmitClick = () => open("/brand/verify", "_self");

  if (approveStatus === "pending") {
    return (
      <Banner
        title="Marketplace is reviewing your store"
        tone="warning"
        hideIcon
      >
        <p>It usually takes about 24 hours to hear back.</p>
      </Banner>
    );
  }

  if (approveStatus === "approved") {
    return (
      <Banner title="Account is connected" tone="success" hideIcon>
        <p>You can sync with Marketplace now</p>
      </Banner>
    );
  }

  return (
    <Banner title="Application rejected" tone="critical">
      <BlockStack gap="200" inlineAlign="start">
        <p>{declineReason}</p>
        <Button onClick={onResubmitClick}>Resubmit the Form</Button>
      </BlockStack>
    </Banner>
  );
};

const AccountSection = ({
  approveStatus,
  brandLogoUrl,
  brandEmail,
  declineReason,
}: {
  declineReason?: string | null;
  brandEmail?: string;
  brandLogoUrl?: string;
  approveStatus: BrandApprovalStatus;
}) => {
  const shopName = useRef(null);

  const onManageAvailability = async () => {
    if (shopName) {
      open(
        `https://admin.shopify.com/store/${shopName.current}/products?selectedView=all`,
        "_blank",
      );
    }
  };

  const getShop = useCallback(async () => {
    const response = await fetch("/api/hello");
    const result = await response.json();
    const shop = result.data.shop.replace(".myshopify.com", "");

    shopName.current = shop;
  }, []);

  useEffect(() => {
    getShop();
  }, [getShop]);

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

        <StoreReviewBanner
          approveStatus={approveStatus!}
          declineReason={declineReason}
        />

        <ProductsBanner onManageAvailability={onManageAvailability} />

        <Layout>
          <Layout.AnnotatedSection
            id="accountDetails"
            title="Marketplace account"
            description="Connect your Marketplace Account so you can manage and sync with Marketplace"
          >
            <ConnectAccount
              brandEmail={brandEmail}
              approveStatus={approveStatus}
              brandLogoUrl={brandLogoUrl}
            />
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
                    onClick={onManageAvailability}
                    accessibilityLabel="manageAvailability"
                  >
                    Manage availability
                  </Button>
                </InlineGrid>

                <ProductsContainer />

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
