import axios from "axios";
import axiosInstance from "../axios";
import { BrandFormValues } from "@/types/Brand";

export const postBrandValidation = async ({
  shop,
  token,
  formValues,
  shopifyAccessToken,
  signal,
}: {
  shop: string;
  token: string;
  formValues: BrandFormValues;
  shopifyAccessToken: string;
  signal: AbortSignal;
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  formdata.append("person", formValues?.person as string);
  formdata.append("phoneNumber", formValues?.phoneNumber as string);
  formdata.append("websiteUrl", formValues?.websiteUrl as string);
  formdata.append("brandName", formValues?.brandName as string);
  formdata.append("brandLogo", formValues?.logo as File);
  formdata.append("shopifyAccessToken", shopifyAccessToken);
  formdata.append("shopifyStoreName", shop);

  const response = await axiosInstance.post("/brand/validate", formdata, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
