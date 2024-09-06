"use client";
import {
  ButtonGroup,
  Button,
  Page,
  Card,
  BlockStack,
  Spinner,
} from "@shopify/polaris";
import { useRecoilValue } from "recoil";
import useSWRInfinite from "swr/infinite";
import queryString from "query-string";

import { userToken } from "@/atoms/token";
import { swrFetcher } from "../api/swrFetcher";
import { PublishProductModal } from "./PublishProductModal";

import { CardWithHeaderActions } from "./CardWithHeaderActions";
import { InventoryTable } from "./Table";
import { Product, PublishStatus } from "@/types/Product";
import { defaultProductsFilters, ITEMS_PER_PAGE } from "./utils";
import { useState } from "react";

type ApiPagination = {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
};

type ProductsApiResponse = {
  products: Product[];
  pageInfo: ApiPagination;
};

export type ProductsFilters = {
  search?: string;
  status?: string;
  inventory?: {
    min?: number;
    max?: number;
  };
};

const StatusMap: { [key: string]: PublishStatus } = {
  "Pending for publish": PublishStatus.PublishRequested,
  Published: PublishStatus.Published,
  "Not published": PublishStatus.Unpublished,
  Rejected: PublishStatus.Rejected,
};

export default function Products() {
  const [filters, setFilters] = useState<ProductsFilters>(
    defaultProductsFilters,
  );
  const token = useRecoilValue(userToken);
  const { data, size, setSize, error, isLoading } =
    useSWRInfinite<ProductsApiResponse>((pageIndex, previousPageData) => {
      const status = filters.status ? StatusMap[filters.status] : undefined;
      const query = queryString.stringify({
        status,
        search: filters.search,
        minInventory: filters?.inventory?.min,
        maxInventory: filters?.inventory?.max,
        direction: "forward",
        limit: ITEMS_PER_PAGE,
        endCursor: previousPageData?.pageInfo?.endCursor,
        startCursor: previousPageData?.pageInfo?.startCursor,
      });

      if (!pageIndex && !previousPageData) {
        return [`/products?${query}`, token];
      }
      return [`/products?${query}`, token];
    }, swrFetcher);

  const handlePageChange = (newPage: number) => setSize(newPage);

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
        <CardWithHeaderActions setFilters={setFilters} filters={filters} />
        <PublishProductModal />
        <Card>
          {isLoading || !data?.[size - 1] ? (
            <div className="flex items-center justify-center h-full">
              <Spinner accessibilityLabel="Spinner example" size="large" />
            </div>
          ) : (
            <InventoryTable items={data?.[size - 1]?.products} />
          )}

          <div className="polaris-btn mt-4">
            <ButtonGroup variant="segmented">
              <Button
                variant="primary"
                onClick={() => handlePageChange(size - 1)}
                disabled={!data?.[size - 1]?.pageInfo?.hasPreviousPage}
              >
                Previous Page
              </Button>
              <Button
                variant="primary"
                onClick={() => handlePageChange(size + 1)}
                disabled={!data?.[size - 1]?.pageInfo?.hasNextPage}
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
