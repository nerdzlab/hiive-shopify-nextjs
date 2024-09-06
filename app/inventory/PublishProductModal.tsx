import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  InlineStack,
  RangeSlider,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { postPublishProduct } from "../api/services/Product.service";
import { useRecoilValue } from "recoil";
import { activeProductModal } from "@/atoms/activeProductModal";
import { useSWRConfig } from "swr";

export const PublishProductModal = ({
  revalidatePage,
}: {
  revalidatePage: () => void;
}) => {
  const modalData = useRecoilValue(activeProductModal);
  const [rangeValue, setRangeValue] = useState(60);
  const [textFieldValue, setTextFieldValue] = useState("2.00");

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );

  const handleRangeSliderChange = useCallback(
    (value: number) => setRangeValue(value),
    [],
  );

  const onSubmit = async () => {
    await postPublishProduct({
      productId: String(modalData.id),
      COGS: +textFieldValue,
      discount: rangeValue,
      publishStartAt: "2024-11-01 10:00:00",
    });
    revalidatePage();

    (
      document.getElementById("my-modal") as HTMLElement & {
        hide: () => void;
      }
    )?.hide();
  };

  return (
    <Modal id="my-modal">
      <TitleBar title="Publish product"></TitleBar>
      <Box padding="600">
        <BlockStack gap="600">
          <Text as="p" variant="bodyMd">
            Please select the date range when the product will be displayed in
            the Hiive app.
          </Text>
          <TextField
            label="From"
            type="number"
            // value={textFieldValue}
            // onChange={handleTextFieldChange}
            autoComplete="off"
          />

          <TextField
            label="Specify COGS"
            type="number"
            value={textFieldValue}
            onChange={handleTextFieldChange}
            prefix="$"
            autoComplete="off"
          />
          <div className="border border-solid border-[#BEBDBE] rounded-md p-6">
            <BlockStack gap="600">
              <div>
                <Text as="h3" variant="headingSm" fontWeight="medium">
                  Product discount
                </Text>
                <Text as="p">Specify a product discount</Text>
              </div>
              <RangeSlider
                output
                label=""
                min={30}
                max={100}
                value={rangeValue}
                onChange={handleRangeSliderChange}
                prefix={<p>min 30%</p>}
                suffix={<p>max 100%</p>}
              />
              <InlineStack align="end">
                <BlockStack align="end">
                  <Text as="p" alignment="end">
                    Final price with discount
                  </Text>
                  <Text as="h3" variant="headingMd" alignment="end">
                    $
                    {(
                      Number(modalData.price) -
                      (Number(modalData.price) * rangeValue) / 100
                    ).toFixed(2)}
                  </Text>
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </div>
        </BlockStack>
      </Box>
      <Box
        background="bg-surface-secondary"
        paddingBlock="600"
        paddingInline="400"
      >
        <BlockStack gap="200">
          <Text as="h3" variant="headingSm" fontWeight="medium">
            Deactivated reports
          </Text>
          <Text as="p">
            Product approval time could take up to 7 working days. When the
            product approved the status changes to “Published” and the product
            appears on the Hiive app and is available for the user to order.
          </Text>
        </BlockStack>
      </Box>
      <Box paddingBlock="600" paddingInline="600">
        <InlineStack align="end">
          <ButtonGroup>
            <Button
              onClick={onSubmit}
              variant="primary"
              accessibilityLabel="Publish"
            >
              Publish
            </Button>
            <Button onClick={() => {}} accessibilityLabel="Cancel">
              Cancel
            </Button>
          </ButtonGroup>
        </InlineStack>
      </Box>
    </Modal>
  );
};
