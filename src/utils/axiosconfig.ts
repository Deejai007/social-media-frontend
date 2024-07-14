import axios from "axios";
import { env } from "process";

axios.defaults.withCredentials = true;

// console.log(import.meta.env.VITE_SERVER_URL);
const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  // baseURL: "http://localhost:8967",
  // timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true, // Ensures that cookies are sent with every request
});

export default axiosApi;
