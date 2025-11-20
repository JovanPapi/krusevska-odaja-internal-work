import axios, { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:8080";
type MethodType = "GET" | "POST" | "DELETE" | "UPDATE";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Extract data from response in interceptor to remove boilerplate code
// On response error, invoke react-hot-toast library const to show simple notification message.
// This removes boilerplate code of calling this constant across everywhere where HTTP request is made and catch the error inside .catch()
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => Promise.resolve(response.data),
  (error: AxiosError) => {
    toast.error(error.response?.data as string);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("adminToken");

    if (token !== null) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/** An async function which uses instance of axios for making request and returning Promise<T> result, which is later processed via .then() and .catch() methods.
 * It has explicit implemented interceptors for response and request.
 * Response interceptor returns Promise.resolve(response.data) if HTTP status ok, and a short message if HTTP status is anything but ok (400)
 * Request interceptor is implemented to put the generated bearer token from backend for user authorization, on all made requests
 * @param {string} url URL of the backend REST API
 * @param {MethodType} method Method for the HTTP request (GET, POST, PUT, DELETE)
 * @param {unknown} data Data returned from the backend REST API, it can be anything. Later this data is casted into specific data type (string, class, number etc.)
 */
const axiosApi = async <T>(url: string, method: MethodType = "GET", data: unknown = null): Promise<T> => {
  return await axiosInstance({
    baseURL: `${BASE_URL + url}`,
    method,
    data,
  });
};

export default axiosApi;
