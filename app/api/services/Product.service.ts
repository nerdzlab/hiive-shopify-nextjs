import axiosInstance from "../axios";

export const postPublishProduct = async (data: any) => {
  try {
    const token = localStorage.getItem("user-token");
    console.log(data);
    const response = await axiosInstance.post("/product/publish", data, {
      headers: {
        Authorization: `Bearer ${token?.replaceAll(`"`, "")}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};

export const postUnPublishProduct = async (productId: string) => {
  try {
    const token = localStorage.getItem("user-token");
    const response = await axiosInstance.post(
      "/product/publish",
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token?.replaceAll(`"`, "")}`,
        },
      },
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};
