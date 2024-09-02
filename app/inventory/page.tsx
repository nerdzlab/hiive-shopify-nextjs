// @ts-nocheck // TODO because of api changes for now we need this
"use client";
import {
  IndexTable,
  ButtonGroup,
  Button,
  Page,
  Card,
  BlockStack,
  Spinner,
} from "@shopify/polaris";
import { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { userToken } from "@/atoms/token";
import { swrFetcher } from "../api/swrFetcher";
import { PublishProductModal } from "./PublishProductModal";

import { CardWithHeaderActions } from "./CardWithHeaderActions";
import { InventoryTable } from "./Table";
import { ITEMS_PER_PAGE } from "./utils";

const GET_PRODUCTS = gql`
  query GetProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        media(first: $first) {
          nodes {
            preview {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
`;

const makeIds = (list = []) =>
  list.map(({ id }) => id.replace("gid://shopify/Product/", "")).join(",");

const aggregateItems = (syncItems, shopifyItems) =>
  shopifyItems.map((shopifyItem) => {
    const itemId = shopifyItem.id.replace("gid://shopify/Product/", "");
    const item = syncItems.find(({ id }) => id === itemId);
    return { ...shopifyItem, status: item?.status };
  });

export default function Products() {
  const token = useRecoilValue(userToken);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { first: 10 },
  });
  const { data: productsList } = useSWR(
    data
      ? [`/product/sync?productIds=${makeIds(data?.products?.nodes)}`, token]
      : null,
    swrFetcher,
    {
      shouldRetryOnError: false,
    },
  );

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const items = useMemo(() => {
    if (!data || !productsList) return [];
    return aggregateItems(productsList, data?.products?.nodes);
  }, [productsList, data]);
  const totalPages = Math.ceil(items?.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  return (
    <Page
      title="Inventory"
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing eli."
    >
      <BlockStack gap="500">
        <CardWithHeaderActions />
        <PublishProductModal />
        <Card>
          <InventoryTable currentPage={currentPage} items={items} />

          <div className="polaris-btn">
            <ButtonGroup segmented>
              <Button
                primary
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous Page
              </Button>
              <span className="space-page">{currentPage} </span>
              <span> / </span> <span className="space-page">{totalPages}</span>
              <Button
                primary
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next Page
              </Button>
            </ButtonGroup>
          </div>
        </Card>
      </BlockStack>
    </Page>
  );
}
