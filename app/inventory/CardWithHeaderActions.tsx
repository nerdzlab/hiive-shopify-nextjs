import {
  Badge,
  BlockStack,
  Button,
  Card,
  Collapsible,
  InlineGrid,
  InlineStack,
  Text,
  TextField,
} from "@shopify/polaris";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import InventoryFilters from "../components/InventoryFilters";
import { ProductsFilters } from "./page";

export function CardWithHeaderActions({
  setFilters,
  filters,
}: {
  setFilters: Dispatch<SetStateAction<ProductsFilters>>;
  filters: ProductsFilters;
}) {
  const [open, setOpen] = useState(true);
  const appliedFiltersAmount = [
    filters?.search,
    filters?.status,
    filters?.inventory?.min,
  ].filter(Boolean)?.length;
  const badgeText = `${appliedFiltersAmount} filter applied`;

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="200">
        <InlineGrid columns="1fr auto">
          <InlineStack blockAlign="center" gap="400">
            <Text as="h2" variant="headingSm">
              Filters
            </Text>
            {!!appliedFiltersAmount && !open && (
              <Badge tone="success" progress="complete">
                {badgeText}
              </Badge>
            )}
          </InlineStack>
          <Button
            fullWidth
            textAlign="left"
            disclosure={open ? "up" : "down"}
            onClick={handleToggle}
          >
            {open ? "Hide filters" : "Show filters"}
          </Button>
        </InlineGrid>
        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{ duration: "250ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <BlockStack gap="500">
            <InventoryFilters setFilters={setFilters} />
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}
