import { PublishStatus } from "@/types/Product";
import { Badge } from "@shopify/polaris";

export const ProductStatusBadge = ({ status }: { status: PublishStatus }) => {
  if (status === PublishStatus.Published) {
    return <Badge tone="success">Published</Badge>;
  }
  if (status === PublishStatus.Unpublished) {
    return <Badge>Unpublished</Badge>;
  }
  if (status === PublishStatus.PublishRequested) {
    return <Badge tone="warning">In review</Badge>;
  }
  return <Badge tone="critical">Rejected</Badge>;
};
