import { swrFetcher } from "@/app/api/swrFetcher";
import { userToken } from "@/atoms/token";
import { ProductsCount } from "@/types/ProductsCount";
import { Banner, BlockStack, Button } from "@shopify/polaris";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

export const ProductsBanner = ({
  onManageAvailability,
}: {
  onManageAvailability: () => void;
}) => {
  const token = useRecoilValue(userToken);
  const { data, isLoading } = useSWR<ProductsCount>(
    ["/products/count", token],
    swrFetcher,
    {
      shouldRetryOnError: false,
    },
  );

  if (isLoading || !data) {
    return null;
  }

  return [
    <Banner
      key={1}
      title={`${data.publishedProductsCount} products are successfully published `}
      tone="success"
      hideIcon
    >
      <p>You can review them on Marketplace now</p>
    </Banner>,
    <Banner
      key={2}
      title={`${data.unpublishedProductsCount} products require more information before they can be published on Marketplace.`}
      tone="critical"
    >
      <BlockStack gap="200" inlineAlign="start">
        <p>Please review and update information related to those products</p>
        <Button onClick={onManageAvailability}>Add Information</Button>
      </BlockStack>
    </Banner>,
  ];
};
