import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
  AppProvider,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  InlineStack,
  Text,
} from "@shopify/polaris";

export const ConfirmBrandChangeModal = ({
  onConfirm,
}: {
  onConfirm: () => void;
}) => {
  const onSubmit = async () => {
    await onConfirm();
    (
      document.getElementById("confirm-brand-change-modal") as HTMLElement & {
        hide: () => void;
      }
    )?.hide();
  };

  return (
    <Modal id="confirm-brand-change-modal">
      <AppProvider i18n={{}}>
        <TitleBar title="Change brand form"></TitleBar>
        <Box padding="600">
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Are you sure you want to change brand form?
            </Text>
            <Text as="p" variant="bodyMd">
              Hiive will be notified about the changes you made.
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
                Save changes
              </Button>
              <Button onClick={() => {}} accessibilityLabel="Cancel">
                Cancel
              </Button>
            </ButtonGroup>
          </InlineStack>
        </Box>
      </AppProvider>
    </Modal>
  );
};
