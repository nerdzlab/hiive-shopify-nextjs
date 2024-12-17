import React from "react";
import { FooterHelp, InlineStack, Link } from "@shopify/polaris";

export default function Footer() {
  return (
    <FooterHelp align="center">
      <InlineStack wrap={false} gap="400">
        <Link target="_blank" url="https://help.shopify.com/en">
          Documentation
        </Link>
        <Link target="_blank" url="mailto:hello@joinhiive.com">
          Support
        </Link>
      </InlineStack>
    </FooterHelp>
  );
}
