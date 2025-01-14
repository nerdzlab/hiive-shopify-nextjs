"use client";
import { swrFetcher } from "@/app/api/swrFetcher";
import { userToken } from "@/atoms/token";
import { ProductsCount } from "@/types/ProductsCount";
import { BlockStack, Text } from "@shopify/polaris";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

export const ProductSuccess = ({
  publishedProductsCount,
}: {
  publishedProductsCount: number;
}) => {
  return (
    <Text as="p">
      <BlockStack gap="500">
        <p>
          <Text as="span" fontWeight="semibold">
            {publishedProductsCount}
          </Text>{" "}
          products are{" "}
          <Text as="span" fontWeight="semibold">
            available
          </Text>{" "}
          to Marketplace.
        </p>
      </BlockStack>
    </Text>
  );
};

export const ProductError = ({
  allProductsCount,
}: {
  allProductsCount: number;
}) => {
  return (
    <>
      <Text as="p">
        <BlockStack gap="500">
          <p>
            <Text as="span" fontWeight="semibold">
              {allProductsCount}
            </Text>{" "}
            products are{" "}
            <Text as="span" fontWeight="semibold">
              available
            </Text>{" "}
            to Marketplace.
          </p>
        </BlockStack>
      </Text>
    </>
  );
};

export const ProductsContainer = () => {
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

  return data?.unpublishedProductsCount ? (
    <ProductError allProductsCount={data.allProductsCount} />
  ) : (
    <ProductSuccess publishedProductsCount={data.publishedProductsCount} />
  );
};
