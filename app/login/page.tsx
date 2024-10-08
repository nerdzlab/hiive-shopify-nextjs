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
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@shopify/polaris-icons";
import withAuth from "../components/WithAuth/WithAuth";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email is incorrect. Please check it and try again.")
    .required("Email is required"),
});

function LoginPage() {
  const router = useRouter();
  const [textFieldValue, setTextFieldValue] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [loading, toggle] = useBoolean();

  const handleTextFieldChange = useCallback((value: string) => {
    setErrors({});
    setTextFieldValue(value);
  }, []);

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
        <BlockStack gap="500" align="start">
          <div>
            <Button onClick={router.back} icon={ChevronLeftIcon}>
              Back
            </Button>
          </div>
          <Card>
            <BlockStack gap="500">
              <div>
                <Text variant="heading2xl" as="h2">
                  Authorization
                </Text>
                <Text variant="bodyMd" as="p">
                  Enter your email, and we&apos;ll send you a verification code.
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
        </BlockStack>
      </Layout.Section>
    </Page>
  );
}

export default withAuth(LoginPage);
