"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

import {
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
  Layout,
  BlockStack,
  DropZone,
  Thumbnail,
  Form,
} from "@shopify/polaris";
import {
  ChevronLeftIcon,
  DeleteIcon,
  PageUpIcon,
} from "@shopify/polaris-icons";

import * as yup from "yup";
import { useBoolean } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { postBrandValidation } from "@/app/api/services/OfflineToken.service";
import { useRecoilValue } from "recoil";
import { userToken } from "@/atoms/token";
import { Brand, BrandFormValues } from "@/types/Brand";
import { postProductApprove } from "@/app/api/services/Product.service";
import { ConfirmBrandChangeModal } from "./ConfirmBrandChangeModal";
import useSWR from "swr";
import { swrFetcher } from "@/app/api/swrFetcher";

const styles = {
  deleteIconHover: {
    cursor: "pointer",
    position: "absolute" as "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 10,
    left: 10,
    background: "rgba(48, 48, 48, 0.8)",
  },
};

const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number is incorrect. Please check it and try again",
    )
    .required("Phone number is required"),
  websiteUrl: yup
    .string()
    .url("Website url is incorrect. Please check it and try again")
    .required("Website URL is required"),
  person: yup.string().required("Person is required"),
  brandName: yup.string().required("Person is required"),
});

function BrandVerify({ data }) {
  console.log(data);
  const router = useRouter();

  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const token = useRecoilValue(userToken);
  const [errors, setErrors] = useState<BrandFormValues>({});
  const [loading, toggleLoading] = useBoolean();
  const [isHovered, toggle] = useBoolean();
  const appBridge = useAppBridge();
  const [formValues, setFormValue] = useState<BrandFormValues>({
    person: data?.person,
    websiteUrl: data?.websiteUrl,
    phoneNumber: data?.phoneNumber,
    brandName: data?.brandName,
    logo: data?.brandLogoUrl,
  });

  const preventFormSave = (callback: () => void) => {
    if (isEdit) {
      return () =>
        (
          document.getElementById(
            "confirm-brand-change-modal",
          ) as HTMLElement & {
            show: () => void;
          }
        )?.show();
    } else {
      return callback;
    }
  };

  const onSubmit = async () => {
    toggleLoading.on();

    try {
      await validationSchema.validate(formValues, { abortEarly: false });

      const response = await fetch("/api/hello");
      const result = await response.json();

      await postBrandValidation({
        shop: result.data?.shop.split(".")[0],
        token,
        formValues,
        shopifyAccessToken: result.data.accessToken,
      })
        .then(() => {
          const toastTitle = isEdit
            ? "The Brand Form has been successfully changed."
            : "Brand Creation Form is successfully sent.";
          appBridge.toast.show(toastTitle, {
            duration: 5000,
          });
        })
        .then(() => {
          if (!isEdit) {
            router.push("/brand/status");
          }
        })
        .catch((error) => console.error(error));
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

    toggleLoading.off();
  };

  const handleFullNameChange = useCallback(
    (person: string) => setFormValue((state) => ({ ...state, person })),
    [],
  );
  const handleWebsiteChange = useCallback(
    (websiteUrl: string) => setFormValue((state) => ({ ...state, websiteUrl })),
    [],
  );
  const handlePhoneChange = useCallback(
    (phoneNumber: string) =>
      setFormValue((state) => ({ ...state, phoneNumber })),
    [],
  );
  const handleShopNameChange = useCallback(
    (brandName: string) => setFormValue((state) => ({ ...state, brandName })),
    [],
  );
  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
      setFormValue((state) => ({ ...state, logo: _dropFiles[0] }));
    },
    [setFormValue],
  );

  const onLogoDelete = useCallback(() => {
    setFormValue((state) => ({ ...state, logo: undefined }));
  }, []);

  return (
    <Page narrowWidth={!isEdit}>
      <Layout.Section>
        <ConfirmBrandChangeModal onConfirm={onSubmit} />
        <BlockStack gap="500" align="start">
          <div>
            <Button onClick={router.back} icon={ChevronLeftIcon}>
              Back
            </Button>
          </div>
          {isEdit && (
            <BlockStack>
              <Text variant="heading2xl" as="h2">
                Brand Onboarding Form
              </Text>
              <Text variant="bodyMd" as="p">
                Fill out this form, and we&apos;ll get back to you soon.
              </Text>
            </BlockStack>
          )}
          <Card>
            {!isEdit && (
              <>
                <Text variant="heading2xl" as="h2">
                  Brand Onboarding Form
                </Text>
                <Text variant="bodyMd" as="p">
                  Fill out this form, and we&apos;ll get back to you soon.
                </Text>
                <div style={{ height: 24 }} />
              </>
            )}

            <Form onSubmit={preventFormSave(onSubmit)}>
              <FormLayout>
                <TextField
                  autoComplete="off"
                  name="person"
                  error={errors?.person}
                  placeholder="Full Name"
                  label="Contact Person Name *"
                  value={formValues?.person}
                  onChange={handleFullNameChange}
                />
                <TextField
                  label="Contact Phone Number *"
                  autoComplete="off"
                  name="phoneNumber"
                  placeholder="+1 xxx"
                  error={errors?.phoneNumber}
                  onChange={handlePhoneChange}
                  value={formValues?.phoneNumber}
                />
                <TextField
                  type="text"
                  autoComplete="off"
                  label="Brand Website *"
                  placeholder="Website URL"
                  name="websiteUrl"
                  error={errors?.websiteUrl}
                  onChange={handleWebsiteChange}
                  value={formValues?.websiteUrl}
                />
                <TextField
                  placeholder="Brand/Shop Name"
                  type="text"
                  autoComplete="off"
                  name="brandName"
                  label="Brand Name *"
                  error={errors?.brandName}
                  onChange={handleShopNameChange}
                  value={formValues?.brandName}
                />
                <div style={{ marginTop: 8 }}>
                  <Text variant="bodyMd" as="p">
                    Brand Logo *
                  </Text>
                </div>
                <Text variant="bodySm" as="p">
                  You can upload jpg, jpeg, or png format. Must be equal or less
                  than 10MB.
                </Text>
                {formValues?.logo ? (
                  <div
                    style={{
                      position: "relative",
                      width: "fit-content",
                      marginBottom: 24,
                    }}
                    onMouseEnter={toggle.on}
                    onMouseLeave={toggle.off}
                  >
                    <Thumbnail
                      size="medium"
                      alt={formValues?.logo?.name}
                      source={
                        formValues?.logo instanceof File
                          ? window.URL.createObjectURL(formValues?.logo)
                          : data?.brandLogoUrl
                      }
                    />
                    {isHovered && (
                      <div
                        style={styles.deleteIconHover}
                        onClick={onLogoDelete}
                      >
                        <DeleteIcon height={20} fill="#ffffff" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      height: 40,
                      width: 160,
                      marginTop: 8,
                    }}
                  >
                    <DropZone
                      allowMultiple={false}
                      variableHeight
                      type="image"
                      outline={false}
                      onDrop={handleDropZoneDrop}
                    >
                      <Button icon={PageUpIcon}>Upload Logo</Button>
                    </DropZone>
                  </div>
                )}
                <div>
                  <Button
                    submit
                    fullWidth
                    loading={loading}
                    disabled={
                      !formValues?.person ||
                      !formValues?.phoneNumber ||
                      !formValues?.brandName ||
                      !formValues?.logo ||
                      !formValues?.websiteUrl
                    }
                    variant="primary"
                  >
                    Submit
                  </Button>
                </div>
              </FormLayout>
            </Form>
          </Card>
        </BlockStack>
      </Layout.Section>
    </Page>
  );
}

const BrandVerifyPage = () => {
  const token = useRecoilValue(userToken);
  const { data, error, isLoading } = useSWR<Brand>(
    ["/brand/me", token],
    swrFetcher,
    {
      shouldRetryOnError: false,
    },
  );

  if (isLoading || !data) {
    return null;
  }

  return (
    <Suspense>
      <BrandVerify data={data} />
    </Suspense>
  );
};
export default BrandVerifyPage;
