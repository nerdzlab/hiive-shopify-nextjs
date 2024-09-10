import { ProductsFilters } from "@/app/products/page";
import { defaultProductsFilters } from "@/app/products/utils";
import {
  FormLayout,
  Select,
  Button,
  InlineStack,
  TextField,
} from "@shopify/polaris";
import { useState, useCallback, Dispatch, SetStateAction } from "react";

export default function InventoryFilters({
  setFilters,
}: {
  setFilters: Dispatch<SetStateAction<ProductsFilters>>;
}) {
  const [selectTypeValue, setSelectTypeValue] = useState("");
  const [textFieldValue, setTextFieldValue] = useState("");
  const [selectConditionValue, setSelectConditionValue] = useState("");

  const handleSelectTypeChange = useCallback(
    (value: string) => setSelectTypeValue(value),
    [],
  );

  const handleSelectConditionChange = useCallback(
    (value: string) => setSelectConditionValue(value),
    [],
  );

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );
  const onSave = () => {
    const [min, max] = (selectConditionValue || "").split("-");
    setFilters({
      status: selectTypeValue,
      search: textFieldValue,
      ...(min && max && { inventory: { min: +min, max: +max } }),
    });
  };

  const onClearFilters = () => {
    setTextFieldValue("");
    setSelectTypeValue("");
    setSelectConditionValue("");
    setFilters(defaultProductsFilters);
  };

  return (
    <FormLayout>
      <FormLayout>
        <TextField
          label=""
          placeholder="Searching in all"
          value={textFieldValue}
          onChange={handleTextFieldChange}
          autoComplete="off"
        />
        <FormLayout.Group condensed>
          <div className="max-w-[50%] flex [&>div]:mr-4 [&>div]:w-[45%]">
            <Select
              label="Status"
              options={[
                "Pending for publish",
                "Published",
                "Not published",
                "Rejected",
              ]}
              value={selectTypeValue}
              onChange={handleSelectTypeChange}
              placeholder="Filter by status"
            />
            <Select
              label="Amount"
              options={["0-10", "10-50", "50-100", "100-1000"]}
              value={selectConditionValue}
              onChange={handleSelectConditionChange}
              placeholder="Sort by amount"
            />
          </div>
        </FormLayout.Group>
        <InlineStack gap="400">
          <Button size="large" variant="primary" onClick={onSave}>
            Apply filters
          </Button>
          <Button size="large" onClick={onClearFilters}>
            Clear all
          </Button>
        </InlineStack>
      </FormLayout>
    </FormLayout>
  );
}
