import axios from "axios";
import axiosInstance from "../axios";

export const getOfflineToken = async ({ apiKey, apiSecret, token, shop }) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const body = {
    client_id: apiKey,
    client_secret: apiSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: token,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    requested_token_type:
      "urn:shopify:params:oauth:token-type:offline-access-token",
  };

  console.log(body);

  try {
    const response = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      body,
      {
        headers: headers,
      },
    );

    return response.access_token;
  } catch (err) {
    // console.log(err);
  }
};

export const postBrandValidation = async ({
  shop,
  token,
  formValues,
  shopifyAccessToken,
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  formdata.append("person", formValues?.person);
  formdata.append("phoneNumber", formValues?.phoneNumber);
  formdata.append("websiteUrl", formValues?.websiteUrl);
  formdata.append("brandName", formValues?.brandName);
  formdata.append("brandLogo", formValues.logo);
  formdata.append("shopifyAccessToken", shopifyAccessToken);
  formdata.append("shopifyStoreName", shop);

  const response = await axiosInstance.post("/brand/validate", formdata, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return null;
};
