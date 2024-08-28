export enum BrandApprovalStatus {
  Pending = "pending",
  Approved = "approved",
  Declined = "declined",
}

export type Brand = {
  approvalStatus: BrandApprovalStatus;
  brandLogoUrl: string;
  brandName: string;
  createdAt: Date;
  email: string;
  id: number;
  person: string;
  phoneNumber: string;
  updatedAt: Date;
  websiteUrl: string;
};
