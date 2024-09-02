import { PublishStatus } from "@/types/Product";
import { Button } from "@shopify/polaris";

const ProductActionButton = ({ status }: { status: PublishStatus }) => {
  if (
    status === PublishStatus.Unpublished ||
    status === PublishStatus.Rejected
  ) {
    return (
      <Button
        onClick={() => {
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

  return <Button size="large">Unpublish</Button>;
};

export { ProductActionButton };
