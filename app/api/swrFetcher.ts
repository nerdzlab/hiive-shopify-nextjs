import axiosInstance from "./axios";
import { AxiosResponse } from "axios";

/**
 * Type definition for the fetcher function arguments.
 * You can adjust this type to match the actual types you expect.
 */
type FetcherArgs = [string, string]; // Adjust to include any additional types as needed

/**
 * SWR Fetcher function using Axios.
 *
 * @param args - The arguments to pass to the fetcher, usually the URL string.
 * @returns A promise that resolves with the fetched data.
 */
const swrFetcher = async <T>(args: FetcherArgs): Promise<T> => {
  const [url, token] = args;
  const response: AxiosResponse<T> = await axiosInstance.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export { swrFetcher };
