import axios from "axios";

axios.defaults.withCredentials = true;

const axiosApi = axios.create({
  baseURL: "http://localhost:8967",
  // timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },

  // withCredentials: true, // Ensures that cookies are sent with every request
});

export default axiosApi;
