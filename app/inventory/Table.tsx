import { EmptySearchResult, Icon, IndexTable, Text } from "@shopify/polaris";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductActionButton } from "./ProductActionButton";
import { ITEMS_PER_PAGE } from "./utils";
import Image from "next/image";
import { InfoIcon } from "@shopify/polaris-icons";
import { PublishStatus } from "@/types/Product";

const tableHeaderTitle = (title: string, tooltip?: string) => ({
  title: (
    <div className="flex">
      <Text as="h3" variant="headingSm" fontWeight="bold">
        {title}
      </Text>
      {tooltip && <Icon source={InfoIcon} />}
    </div>
  ),
  tooltipContent: tooltip ? (
    <div>
      <Text as="h3" variant="headingSm" fontWeight="bold">
        {title}
      </Text>
      <Text as="p">{tooltip}</Text>
    </div>
  ) : null,
  id: title,
});

export const InventoryTable = ({
  items,
  currentPage,
}: {
  items: {
    image: { src: string };
    id: string;
    title: string;
    status: PublishStatus;
  }[];
  currentPage: number;
}) => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentItems = items.slice(startIndex, endIndex);

  const rowMarkup = currentItems.map(({ image, id, title, status }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
      <IndexTable.Cell>
        <Image height={40} alt="" src={image?.src} />
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

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No customers yet"}
      description={"Try changing the filters or search term"}
      withIllustration
    />
  );

  return (
    <IndexTable
      itemCount={items.length}
      emptyState={emptyStateMarkup}
      headings={[
        tableHeaderTitle("Picture"),
        tableHeaderTitle("Product Title"),
        tableHeaderTitle("Product Price"),
        tableHeaderTitle("Amount"),
        tableHeaderTitle("Status"),
        tableHeaderTitle("COGS", "Cost of goods sold"),
        tableHeaderTitle("SKU", "Stock keeping unit"),
        tableHeaderTitle("Discount"),
        tableHeaderTitle("Action"),
      ]}
      selectable={false}
    >
      {rowMarkup}
    </IndexTable>
  );
};
