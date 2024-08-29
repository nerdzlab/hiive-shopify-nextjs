"use client";
import {
  IndexTable,
  ButtonGroup,
  Button,
  Page,
  Card,
  BlockStack,
  InlineGrid,
  Collapsible,
  Text,
  TextField,
  Badge,
  Spinner,
} from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import InventoryFilters from "../components/InventoryFilters";
import { gql, useQuery } from "@apollo/client";
import { graphql } from "@/lib/gql";
import useSWR from "swr";
import { useRecoilValue } from "recoil";
import { userToken } from "@/atoms/token";
import { swrFetcher } from "../api/swrFetcher";
import { PublishStatus } from "@/types/Product";
import { PublishProductModal } from "./PublishProductModal";

function CardWithHeaderActions() {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="200">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Filters
          </Text>
          <Button
            fullWidth
            textAlign="left"
            disclosure={open ? "up" : "down"}
            onClick={handleToggle}
          >
            {open ? "Hide filters" : "Show filters"}
          </Button>
        </InlineGrid>
        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{ duration: "250ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <BlockStack gap="500">
            <TextField
              label=""
              placeholder="Searching in all"
              type="number"
              // value={textFieldValue}
              // onChange={handleTextFieldChange}
              prefix="$"
              autoComplete="off"
            />
            <InventoryFilters />
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}

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

const ProductStatusBadge = ({ status }) => {
  if (status === PublishStatus.Published) {
    return <Badge tone="success">Published</Badge>;
  }
  if (status === PublishStatus.Unpublished) {
    return <Badge>Not published</Badge>;
  }
  if (status === PublishStatus.PublishRequested) {
    return <Badge tone="warning">Pending for publish</Badge>;
  }
  return <Badge tone="critical">Rejected</Badge>;
};

const ProductActionButton = ({ status }) => {
  if (
    status === PublishStatus.Unpublished ||
    status === PublishStatus.Rejected
  ) {
    return (
      <Button
        onClick={() => {
          console.log(document.getElementById("my-modal"));
          document.getElementById("my-modal").show();
        }}
        variant="primary"
        size="large"
      >
        Publish
      </Button>
    );
  }

  return <Button size="large">Unpublish</Button>;
};
export default function Products() {
  const token = useRecoilValue(userToken);
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

  const items = useMemo(() => {
    if (!data || !productsList) {
      return [];
    }

    return aggregateItems(productsList, data?.products?.nodes);
  }, [productsList, data]);

  const [currentPage, setCurrentPage] = useState(1);

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

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = items.slice(startIndex, endIndex);

  const totalPages = Math.ceil(items?.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  console.log(currentItems);
  const rowMarkup = currentItems.map(({ image, id, title, status }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
      <IndexTable.Cell>
        <img height={"40px"} src={image?.src} />{" "}
      </IndexTable.Cell>
      <IndexTable.Cell>{title}</IndexTable.Cell>
      <IndexTable.Cell>$22</IndexTable.Cell>
      <IndexTable.Cell>3 in stock</IndexTable.Cell>
      <IndexTable.Cell>
        <ProductStatusBadge status={status} />
      </IndexTable.Cell>
      <IndexTable.Cell>$21.99</IndexTable.Cell>
      <IndexTable.Cell>sku</IndexTable.Cell>
      <IndexTable.Cell>30%</IndexTable.Cell>
      <IndexTable.Cell>
        <ProductActionButton status={status} />
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page
      title="Inventory"
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing eli."
    >
      <BlockStack gap="500">
        <CardWithHeaderActions />
        <PublishProductModal />
        <Card>
          <IndexTable
            itemCount={data.products?.nodes?.length}
            headings={[
              { title: "Picture" },
              { title: "Product Title" },
              { title: "Product Price" },
              { title: "Amount" },
              { title: "Status" },
              { title: "COGS" },
              { title: "SKU" },
              { title: "Discount" },
              { title: "Action" },
            ]}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>

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
