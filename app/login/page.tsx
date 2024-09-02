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
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import * as yup from "yup";
import { postSendEmail } from "../api/services/Auth.service";
import { useBoolean } from "@/hooks";
import { redirect, useRouter } from "next/navigation";

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
    <Page narrowWidth>
      <Layout.Section>
        <Card>
          <BlockStack gap="500">
            <div>
              <Text variant="heading2xl" as="h2">
                Authorization
              </Text>
              <Text variant="bodyMd" as="p">
                Please fill out this form, and we&apos;`ll contact you soon.
              </Text>
            </div>
            <Form onSubmit={onSubmit}>
              <FormLayout>
                <TextField
                  autoComplete="off"
                  label="Email"
                  name="email"
                  error={errors?.email}
                  value={textFieldValue}
                  onChange={handleTextFieldChange}
                />
                <Button
                  submit
                  fullWidth
                  loading={loading}
                  disabled={!textFieldValue}
                  variant="primary"
                >
                  Continue
                </Button>
              </FormLayout>
            </Form>
          </BlockStack>
        </Card>
      </Layout.Section>
    </Page>
  );
}
