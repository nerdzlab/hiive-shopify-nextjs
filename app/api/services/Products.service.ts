import axiosInstance from "../axios";

export const getProductsById = async ({ requestId }) => {
  try {
    const response = await axiosInstance.get("/product/sync?");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};
