"use client";
import { useCallback, useState } from "react";

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
import { useRouter } from "next/navigation";
import { postBrandValidation } from "@/app/api/services/OfflineToken.service";
import { useRecoilValue } from "recoil";
import { userToken } from "@/atoms/token";
import { useLazyQuery } from "@apollo/client";
import { graphql } from "@/lib/gql";

type FormValues = {
  person?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  brandName?: string;
  logo?: File;
};

const styles = {
  deleteIconHover: {
    cursor: "pointer",
    position: "absolute",
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

const GET_SHOP = graphql(`
  #graphql
  query getShop {
    shop {
      name
    }
  }
`);

export default function NewPage() {
  const router = useRouter();
  const [getShop] = useLazyQuery(GET_SHOP, {
    fetchPolicy: "network-only",
  });
  const token = useRecoilValue(userToken);
  const [errors, setErrors] = useState<FormValues>({});
  const [loading, toggleLoading] = useBoolean();
  const [isHovered, toggle] = useBoolean();

  const [formValues, setFormValue] = useState<FormValues>();

  const onSubmit = async () => {
    toggleLoading.on();

    try {
      await validationSchema.validate(formValues, { abortEarly: false });

      const response = await fetch("/api/hello");
      const result = await response.json();

      await postBrandValidation({
        shop: result.data?.shop,
        token,
        formValues,
        shopifyAccessToken: result.data.accessToken,
      })
        .then(() => {
          // shopify.toast.show("Brand Creation Form is successfully sent.", {
          //   duration: 5000,
          // });
          router.push("/brand/status");
        })
        .catch((error) => console.error(error));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
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
    <Page narrowWidth>
      <Layout.Section>
        <BlockStack gap="500" align="start">
          <div>
            <Button onClick={router.back} icon={ChevronLeftIcon}>
              Back
            </Button>
          </div>
          <Card>
            <Text variant="heading2xl" as="h2">
              Brand Creation Form
            </Text>
            <Text variant="bodyMd" as="p">
              Please fill out this form, and we'll contact you soon.
            </Text>
            <div style={{ height: 24 }} />

            <Form onSubmit={onSubmit}>
              <FormLayout>
                <TextField
                  autoComplete="off"
                  name="person"
                  error={errors?.person}
                  label="Owner/Contact person Full Name *"
                  value={formValues?.person}
                  onChange={handleFullNameChange}
                />
                <TextField
                  label="Phone Number *"
                  autoComplete="off"
                  name="phoneNumber"
                  error={errors?.phoneNumber}
                  onChange={handlePhoneChange}
                  value={formValues?.phoneNumber}
                />
                <TextField
                  type="text"
                  autoComplete="off"
                  label="Website *"
                  name="websiteUrl"
                  error={errors?.websiteUrl}
                  onChange={handleWebsiteChange}
                  value={formValues?.websiteUrl}
                />
                <TextField
                  type="text"
                  autoComplete="off"
                  name="brandName"
                  label="Brand Shop Name *"
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
                      source={window.URL.createObjectURL(formValues?.logo)}
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
                      <Button icon={PageUpIcon}>Upload brand avatar</Button>
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
