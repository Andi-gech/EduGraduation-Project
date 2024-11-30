// api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://eduapi.senaycreatives.com", // Replace with your API's base URL
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Add logging for debugging
        config.headers.Authorization = `${token}`;
      } else {
        console.error("No token found"); // Add logging for debugging
      }
    } catch (error) {
      console.error("Error fetching token:", error); // Add logging for debugging
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
