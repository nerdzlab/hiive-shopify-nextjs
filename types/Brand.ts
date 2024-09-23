export enum BrandApprovalStatus {
  Pending = "pending",
  Approved = "approved",
  Declined = "declined",
}

export type Brand = {
  approvalStatus: BrandApprovalStatus;
  declineReason: string | null;
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

export type BrandFormValues = {
  person?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  brandName?: string;
  logo?: File | string;
};
