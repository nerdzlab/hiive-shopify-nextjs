"use client";
import {
  Badge,
  Banner,
  BlockStack,
  Button,
  InlineStack,
  Text,
} from "@shopify/polaris";

export const ProductSuccess = () => {
  return (
    <Text as="p">
      <BlockStack gap="500">
        <Banner onDismiss={() => {}}>
          <p>
            Products publishing to Marketplace can take 30 minutes to
            update.Once your products are successfully published, your products
            will be visible on Marketplace.
          </p>
        </Banner>
        <p>
          <Text as="span" fontWeight="semibold">
            199
          </Text>{" "}
          products are{" "}
          <Text as="span" fontWeight="semibold">
            available
          </Text>{" "}
          to Marketplace.
        </p>
      </BlockStack>
    </Text>
  );
};

export const ProductError = () => {
  return (
    <>
      <Text as="p">
        <BlockStack gap="500">
          <Banner onDismiss={() => {}}>
            <p>
              Products publishing to Marketplace can take 30 minutes to
              update.Once your products are successfully published, your
              products will be visible on Marketplace.
            </p>
          </Banner>
          <p>
            <Text as="span" fontWeight="semibold">
              199
            </Text>{" "}
            products are{" "}
            <Text as="span" fontWeight="semibold">
              available
            </Text>{" "}
            to Marketplace.
          </p>
        </BlockStack>
      </Text>
      <InlineStack gap="200">
        <Badge
          tone="success"
          progress="complete"
          toneAndProgressLabelOverride="Status: Published. Your online store is visible."
        >
          Published
        </Badge>
        <Button
          variant="plain"
          onClick={() => {}}
          accessibilityLabel="manageAvailability"
        >
          189 products
        </Button>
      </InlineStack>
      <InlineStack gap="200">
        <Badge
          tone="critical"
          progress="complete"
          toneAndProgressLabelOverride="Status: Published. Your online store is visible."
        >
          Not published
        </Badge>
        <Button
          variant="plain"
          onClick={() => {}}
          accessibilityLabel="manageAvailability"
        >
          10 products
        </Button>
      </InlineStack>
    </>
  );
};
