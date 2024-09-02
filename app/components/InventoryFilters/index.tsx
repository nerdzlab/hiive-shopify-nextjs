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
          <div className="max-w-[50%] flex [&>div]:mr-4 [&>div]:w-[45%]">
            <Select
              label="Status"
              options={["Pending for publish", "Not published", "Rejected"]}
              value={selectTypeValue}
              onChange={handleSelectTypeChange}
            />
            <Select
              label="Amount"
              options={["0-10", "10-50", "50-100", "100-1000"]}
              value={selectConditionValue}
              onChange={handleSelectConditionChange}
            />
          </div>
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
