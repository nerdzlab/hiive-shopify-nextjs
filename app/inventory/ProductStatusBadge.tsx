import { PublishStatus } from "@/types/Product";
import { Badge } from "@shopify/polaris";

export const ProductStatusBadge = ({ status }: { status: PublishStatus }) => {
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
