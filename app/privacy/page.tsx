"use client";
import {
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
  Layout,
  BlockStack,
  Form,
  Box,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import * as yup from "yup";
import { postSendEmail } from "../api/services/Auth.service";
import { useBoolean } from "@/hooks";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@shopify/polaris-icons";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function NewPage() {
  const router = useRouter();
  const [textFieldValue, setTextFieldValue] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [loading, toggle] = useBoolean();

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );

  const onSubmit = async () => {
    toggle.on();

    const data = { email: textFieldValue };

    try {
      await validationSchema.validate(data, { abortEarly: false });

      const response = await postSendEmail(data);

      router.push(`/login/verify-email?requestId=${response.data?.requestId}`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce<{ [key: string]: string }>(
          (acc, err) => {
            if (err.path) {
              acc[err.path] = err.message;
            }
            return acc;
          },
          {},
        );
        setErrors(errors);
      }
    }

    toggle.off();
  };

  return (
    <Page>
      <Layout.Section>
        <BlockStack gap="500" align="start">
          <div>
            <Button onClick={router.back} icon={ChevronLeftIcon}>
              Back
            </Button>
          </div>
          <div>
            <Text variant="heading2xl" as="h2">
              Privacy Policy
            </Text>
            <Text variant="bodyMd" as="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing eli.
            </Text>
          </div>
          <Card>
            <BlockStack gap="500">
              <Box>
                <Text variant="headingXl" as="h4">
                  Lorem ipsum
                </Text>
                <Text variant="bodyLg" as="p" tone="subdued">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                  ea commodo consequat. Duis aute irure dolor in reprehenderit
                  in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </Text>
              </Box>
            </BlockStack>
          </Card>
        </BlockStack>
      </Layout.Section>
    </Page>
  );
}
