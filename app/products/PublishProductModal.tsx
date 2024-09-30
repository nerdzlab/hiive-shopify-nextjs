import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  AppProvider,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Icon,
  InlineStack,
  RangeSlider,
  Text,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { postPublishProduct } from "../api/services/Product.service";
import { useRecoilValue } from "recoil";
import { activeProductModal } from "@/atoms/activeProductModal";
import { DatePickerSingle } from "../components/DatePicker/DatePickerSingle";
import { InfoIcon } from "@shopify/polaris-icons";

const InfoTooltip = ({
  title,
  message,
  anchor,
}: {
  title?: string;
  message: string;
  anchor: string;
}) => (
  <div>
    <InlineStack wrap={false} gap="200">
      <Text as="p">{anchor}</Text>
      <Tooltip
        width="wide"
        padding="400"
        active
        content={
          <div>
            {title && (
              <Text as="h3" variant="headingSm" fontWeight="bold">
                {title}
              </Text>
            )}
            <Text as="p">{message}</Text>
          </div>
        }
      >
        <Text fontWeight="bold" as="span">
          <Icon source={InfoIcon} />
        </Text>
      </Tooltip>
    </InlineStack>
  </div>
);

export const PublishProductModal = ({
  revalidatePage,
}: {
  revalidatePage: () => void;
}) => {
  const modalData = useRecoilValue(activeProductModal);
  const [rangeValue, setRangeValue] = useState(60);
  const [cogs, setCogs] = useState();
  const [retailPrice, setRetailPrice] = useState();
  const [allowedInventory, setAllowedInventory] = useState();
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const appBridge = useAppBridge();

  const onDateChange = useCallback((value: Date) => setDateValue(value), []);
  const handleTextFieldChange = useCallback(
    (value: string) => setCogs(value),
    [],
  );
  const handleRetailFieldChange = useCallback(
    (value: string) => setRetailPrice(value),
    [],
  );
  const handleInventoryFieldChange = useCallback(
    (value: string) => setAllowedInventory(value),
    [],
  );

  const handleRangeSliderChange = useCallback(
    (value: number) => setRangeValue(value),
    [],
  );

  const clearState = () => {
    setAllowedInventory(undefined);
    setRetailPrice(undefined);
    setCogs(undefined);
  };

  const onSubmit = async () => {
    await postPublishProduct({
      retailPrice: Number(retailPrice),
      allowedInventory: Number(allowedInventory),
      productId: String(modalData.id),
      COGS: Number(cogs),
      discount: rangeValue,
      publishStartAt: new Date(dateValue).toISOString(),
    });
    appBridge.toast.show("The product has been sent for publishing.", {
      duration: 5000,
    });
    revalidatePage();

    hideModal();
  };

  const hideModal = () => {
    (
      document.getElementById("my-modal") as HTMLElement & {
        hide: () => void;
      }
    )?.hide();
  };

  return (
    <Modal id="my-modal" onHide={clearState}>
      <AppProvider i18n={{}}>
        <Box padding="600">
          <BlockStack gap="600">
            <Text as="p" variant="bodyMd">
              Set the date range, COGS, and discount for your product to be
              displayed on the Hiive app.
            </Text>
            <InlineStack wrap={false}>
              <DatePickerSingle onChange={onDateChange} />
            </InlineStack>
            <InlineStack wrap={false} gap="400">
              <div
                style={{
                  maxWidth: 120,
                }}
              >
                <TextField
                  label="Retail Price"
                  type="number"
                  value={retailPrice}
                  onChange={handleRetailFieldChange}
                  prefix="$"
                  autoComplete="off"
                />
              </div>
              <div
                style={{
                  maxWidth: 120,
                }}
              >
                <TextField
                  label={
                    <InfoTooltip
                      title="COGS"
                      message="Cost of goods sold"
                      anchor="Specify COGS"
                    />
                  }
                  type="number"
                  value={cogs}
                  onChange={handleTextFieldChange}
                  prefix="$"
                  autoComplete="off"
                />
              </div>

              <TextField
                label={
                  <InfoTooltip
                    message="Quantity of goods for this offer"
                    anchor="Allowed Inventory"
                  />
                }
                type="number"
                value={allowedInventory}
                onChange={handleInventoryFieldChange}
                autoSize
                autoComplete="off"
              />
            </InlineStack>
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
                <InlineStack align="space-between">
                  <Box
                    borderRadius="200"
                    padding="400"
                    background="bg-surface-emphasis"
                  >
                    <Text as="p">
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#6851E2",
                        }}
                      >
                        $12.00{" "}
                      </span>
                      in Hiive Cash will be used here!
                    </Text>
                  </Box>
                  <BlockStack align="end">
                    <Text as="p" alignment="end" fontWeight="bold">
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
              Note
            </Text>
            <Text as="p">
              Product approval time could take up to 7 working days. When the
              product approved the status changes to “Published” and the product
              appears on the Hiive app and is available for the user to order.
            </Text>
          </BlockStack>
        </Box>
        <Box paddingBlock="600" paddingInline="600">
          <InlineStack align="space-between">
            <Button onClick={hideModal} accessibilityLabel="Cancel">
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              variant="primary"
              disabled={!retailPrice || !cogs || !allowedInventory}
              accessibilityLabel="Publish"
            >
              Publish
            </Button>
          </InlineStack>
        </Box>
      </AppProvider>
      <TitleBar title="Publish Your Product Details" />
    </Modal>
  );
};
