import { FormLayout, Select, Button, InlineStack } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function InventoryFilters() {
  const [selectTypeValue, setSelectTypeValue] = useState("Product type");
  const [selectConditionValue, setSelectConditionValue] =
    useState("is equal to");

  const handleSelectTypeChange = useCallback(
    (value: string) => setSelectTypeValue(value),
    [],
  );

  const handleSelectConditionChange = useCallback(
    (value: string) => setSelectConditionValue(value),
    [],
  );

  return (
    <FormLayout>
      <FormLayout>
        <FormLayout.Group condensed>
          <Select
            labelHidden
            label="Collection rule type"
            options={["Pending for publish", "Not published", "Rejected"]}
            value={selectTypeValue}
            onChange={handleSelectTypeChange}
          />
          <Select
            labelHidden
            label="Collection rule condition"
            options={["0-10", "10-50", "50-100", "100-1000"]}
            value={selectConditionValue}
            onChange={handleSelectConditionChange}
          />
          <Select
            labelHidden
            label="Collection rule condition"
            options={["Bigger first", "Smaller first"]}
            value={selectConditionValue}
            onChange={handleSelectConditionChange}
          />
        </FormLayout.Group>
        <InlineStack gap="400">
          <Button size="large" variant="primary">
            Apply filters
          </Button>
          <Button size="large">Clear all</Button>
        </InlineStack>
      </FormLayout>
    </FormLayout>
  );
}
