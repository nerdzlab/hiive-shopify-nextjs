import React from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  IconSource,
  InlineStack,
  List,
  Text,
} from "@shopify/polaris";

type CardWithActionProps = {
  title: string;
  description: string;
  buttonTitle?: string;
  icon?: IconSource;
  buttonAction?: () => void;
};

export function CardWithAction({
  title,
  description,
  buttonTitle,
  icon,
  buttonAction,
}: CardWithActionProps) {
  return (
    <>
      <BlockStack gap="200">
        <BlockStack inlineAlign="start">
          <InlineStack gap="400">
            {icon && (
              <div className="bg-[#E7E3FF] rounded-md h-fit p-2">
                <Icon source={icon} tone="info" />
              </div>
            )}
            <Box>
              <Text variant="headingXl" as="h4">
                {title}
              </Text>
              <Text variant="bodyLg" as="p" tone="subdued">
                {description}
              </Text>
            </Box>
          </InlineStack>
        </BlockStack>
        {buttonTitle && (
          <Box>
            <Button onClick={buttonAction}>{buttonTitle}</Button>
          </Box>
        )}
      </BlockStack>
    </>
  );
}
