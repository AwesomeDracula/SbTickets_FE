import Axios from "axios";
import { baseUrl } from "./urlAPI";
const instance = Axios.create({
  baseURL: baseUrl,
  // timeout: 100000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  try {
    let token = getToken();
    console.log(token);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: token,
      };
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error?.response?.data || error?.message);
  }
);

export const getToken = () => {
  return localStorage.getItem("id_token") || "";
};

export default instance;
