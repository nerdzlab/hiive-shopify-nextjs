import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HIIVE_API_URL}/shopify`,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("user-token");
      // if (!window.location.href.includes("/login")) {
      //   window.location.href = "/login";
      // }
    } else {
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
