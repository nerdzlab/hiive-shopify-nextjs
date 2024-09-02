import {
  BlockStack,
  Button,
  Card,
  Collapsible,
  InlineGrid,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import InventoryFilters from "../components/InventoryFilters";

export function CardWithHeaderActions() {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="200">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Filters
          </Text>
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
            <TextField
              label=""
              placeholder="Searching in all"
              type="number"
              // value={textFieldValue}
              // onChange={handleTextFieldChange}
              prefix="$"
              autoComplete="off"
            />
            <InventoryFilters />
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}
