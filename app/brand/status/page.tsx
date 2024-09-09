"use client";
import { swrFetcher } from "@/app/api/swrFetcher";
import withAuth from "@/app/components/WithAuth/WithAuth";
import { userToken } from "@/atoms/token";
import { Brand, BrandApprovalStatus } from "@/types/Brand";
import {
  Page,
  Text,
  Card,
  BlockStack,
  Badge,
  Link,
  Layout,
  Button,
  FooterHelp,
  Thumbnail,
} from "@shopify/polaris";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

const BrandReviewStatus = ({ status }: { status: BrandApprovalStatus }) => {
  const router = useRouter();

  const onResubmit = () => {
    router.push("/brand/verify");
  };

  if (status === "declined") {
    return (
      <BlockStack inlineAlign="center" gap="400">
        <BlockStack inlineAlign="center" gap="400">
          <BlockStack inlineAlign="center" gap="400">
            <Badge tone="critical">Rejected</Badge>
            <Badge tone="critical">
              Reason of rejection: “Lorem ipsum dolor sit amet, consectetur
              iscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore”.
            </Badge>
          </BlockStack>
          <Text variant="bodyLg" as="p">
            Your application has been rejected. Please check your email for more
            details. You can submit your brand for approval once again.
          </Text>
        </BlockStack>
        <Button size="large" variant="primary" onClick={onResubmit}>
          Resubmit the Form
        </Button>
        <FooterHelp>
          Do you have any questions?{" "}
          <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
            Contact Hiive
          </Link>
        </FooterHelp>
      </BlockStack>
    );
  }

  return (
    <BlockStack inlineAlign="center" gap="400">
      <Badge tone="warning">Pending for review</Badge>
      <Text variant="bodyLg" as="p">
        Your form has been sent. We&apos;ll contact you soon.
      </Text>
      <FooterHelp>
        Do you have any questions?{" "}
        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
          Contact Hiive
        </Link>
      </FooterHelp>
    </BlockStack>
  );
};

function BrandStatus() {
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
    <Page narrowWidth>
      <Layout.Section>
        <Card>
          <BlockStack inlineAlign="center">
            <div
              style={{
                maxWidth: 450,
              }}
            >
              <BlockStack inlineAlign="center" gap="400">
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: 40,
                  }}
                >
                  <Thumbnail
                    size="large"
                    transparent
                    source={data?.brandLogoUrl as string}
                    alt="Black choker necklace"
                  />
                </div>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h6" alignment="center">
                    Status of the {data?.brandName} Application
                  </Text>
                  <BrandReviewStatus status={data.approvalStatus} />
                </BlockStack>
              </BlockStack>
            </div>
          </BlockStack>
        </Card>
      </Layout.Section>
    </Page>
  );
}

export default withAuth(BrandStatus);
