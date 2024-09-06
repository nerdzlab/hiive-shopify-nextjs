export enum PublishStatus {
  Published = "published",
  Unpublished = "unpublished",
  Draft = "draft",
  Rejected = "rejected",
  PublishRequested = "publish_requested",
}

export type Product = {
  COGS: string | null;
  discount: number;
  id: string;
  amount: number;
  images: { url: string }[];
  status: PublishStatus;
  title: string;
  SKU: string;
  price: string;
};
