import axiosInstance from "./axios";

const swrFetcher = (args) => {
  const [url, token] = args;
  return axiosInstance
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export { swrFetcher };
