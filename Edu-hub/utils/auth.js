// utils/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    return !!token; // Return true if token exists, false otherwise
  } catch (error) {
    return false;
  }
};
