import { activeProductModal } from "@/atoms/activeProductModal";
import { PublishStatus } from "@/types/Product";
import { Button } from "@shopify/polaris";
import { useSetRecoilState } from "recoil";
import { postUnPublishProduct } from "../api/services/Product.service";

const ProductActionButton = ({
  status,
  id,
  price,
  revalidatePage,
}: {
  status: PublishStatus;
  id: string;
  price?: string;
  revalidatePage: () => void;
}) => {
  const setId = useSetRecoilState(activeProductModal);
  if (
    status === PublishStatus.Unpublished ||
    status === PublishStatus.Rejected
  ) {
    return (
      <Button
        onClick={() => {
          setId({
            id,
            retailPrice: price,
          });
          (
            document.getElementById("my-modal") as HTMLElement & {
              show: () => void;
            }
          )?.show();
        }}
        variant="primary"
        size="large"
      >
        Publish
      </Button>
    );
  }

  const unPublishProduct = async () => {
    await postUnPublishProduct(String(id));
    revalidatePage();
  };

  return (
    <Button size="large" onClick={unPublishProduct}>
      Unpublish
    </Button>
  );
};

export { ProductActionButton };
