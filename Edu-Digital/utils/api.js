// api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
 
  baseURL: "http://192.168.1.8:3000",
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `${token}`;
      } else {
        console.error("No token found");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
