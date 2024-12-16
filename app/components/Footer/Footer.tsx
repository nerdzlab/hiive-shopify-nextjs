import React from "react";
import { FooterHelp, InlineStack, Link } from "@shopify/polaris";

export default function Footer() {
  return (
    <FooterHelp align="center">
      <InlineStack wrap={false} gap="400">
        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
          Documentation
        </Link>
        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
          Support
        </Link>
      </InlineStack>
    </FooterHelp>
  );
}
