import { EmptySearchResult, Icon, IndexTable, Text } from "@shopify/polaris";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductActionButton } from "./ProductActionButton";
import Image from "next/image";
import { InfoIcon } from "@shopify/polaris-icons";
import { Product } from "@/types/Product";

const tableHeaderTitle = (title: string, tooltip?: string) => ({
  title: (
    <div className="flex">
      <Text as="h3" variant="headingSm" fontWeight="bold">
        {title}
      </Text>
      {tooltip && (
        <div>
          <Icon source={InfoIcon} />
        </div>
      )}
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

const ProductImageList = ({ images }: { images: Product["images"] }) => (
  <div className="border-[#E3E3E3] rounded-lg border-[1px] border-solid	h-[56px] w-[56px] overflow-hidden">
    <Image height={56} width={56} alt="" src={images[0]?.url} />
    {images?.length > 1 && (
      <div className="bg-[#303030] px-1 py-[2px] text-white rounded-lg absolute right-1.5 bottom-1">
        <Text variant="bodyXs" as="p">
          +{images?.length - 1}
        </Text>
      </div>
    )}
  </div>
);

export const InventoryTable = ({
  items,
  revalidatePage,
}: {
  items: Product[];
  revalidatePage: () => void;
}) => {
  const rowMarkup = items.map(
    (
      { images, discount, id, title, SKU, COGS, price, status, amount },
      index,
    ) => (
      <IndexTable.Row id={String(id)} key={id} position={index}>
        <IndexTable.Cell>
          {!!images?.length && <ProductImageList images={images} />}
        </IndexTable.Cell>
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>${price}</IndexTable.Cell>
        <IndexTable.Cell>{amount} in stock</IndexTable.Cell>
        <IndexTable.Cell>
          <ProductStatusBadge status={status} />
        </IndexTable.Cell>
        <IndexTable.Cell>${COGS || 0}</IndexTable.Cell>
        <IndexTable.Cell>{SKU}</IndexTable.Cell>
        <IndexTable.Cell>{discount}%</IndexTable.Cell>
        <IndexTable.Cell>
          <ProductActionButton
            revalidatePage={revalidatePage}
            status={status}
            id={id}
            price={price}
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

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
