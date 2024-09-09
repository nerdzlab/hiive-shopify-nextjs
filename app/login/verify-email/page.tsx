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
import { ChevronLeftIcon } from "@shopify/polaris-icons";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import * as yup from "yup";
import { postResendCode } from "../../api/services/Auth.service";
import { useBoolean } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/app/components/WithAuth/WithAuth";

const validationSchema = yup.object().shape({
  code: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, "Must be exactly 5 digits")
    .max(5, "Must be exactly 5 digits"),
});

const ResendButton = ({
  setRequestId,
  requestId,
}: {
  setRequestId: (requestId: string) => void;
  requestId: string;
}) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  const onCodeResend = async () => {
    await postResendCode({ requestId })
      .then((result) => {
        setRequestId(result.data.requestId);
        setSecondsLeft(30);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  return (
    <div>
      {secondsLeft ? (
        <Text as="p">
          Resend code in{" "}
          <span style={{ fontWeight: "bold" }}>
            00:{secondsLeft < 10 ? "0" : ""}
            {secondsLeft}
          </span>
        </Text>
      ) : (
        <Button variant="plain" onClick={onCodeResend}>
          Resend code
        </Button>
      )}
    </div>
  );
};

function NewPage() {
  const auth = useAuth();
  const { login } = auth || {};
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestId, setRequestId] = useState(
    searchParams.get("requestId") || "",
  );
  const [textFieldValue, setTextFieldValue] = useState("");
  const [errors, setErrors] = useState<{ code?: string }>({});
  const [loading, toggle] = useBoolean();

  const onSubmit = async () => {
    toggle.on();

    const data = { code: textFieldValue, requestId };

    try {
      await validationSchema.validate(data, { abortEarly: false });

      login && (await login(textFieldValue, requestId));
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

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );

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
                  Check your email for the verification code.
                </Text>
              </div>
              <Form onSubmit={onSubmit}>
                <FormLayout>
                  <TextField
                    autoComplete="off"
                    label="Code"
                    name="code"
                    type="number"
                    error={errors?.code}
                    value={textFieldValue}
                    onChange={handleTextFieldChange}
                  />
                  <ResendButton
                    setRequestId={setRequestId}
                    requestId={requestId}
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

const LoginVerifyEmailPage = () => (
  <Suspense>
    <NewPage />
  </Suspense>
);

export default withAuth(LoginVerifyEmailPage);
