import { Stack } from "expo-router/stack";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../Components/ProtectedRoute";
import { initializeSocket } from "../../utils/socketService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { registerForPushNotificationsAsync } from "../../Components/registerForPushNotificationsAsync";

export default function Layout() {
  const [isRegistered, setIsRegistered] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    initializeSocket();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const user = await AsyncStorage.getItem("id");
      dispatch({ type: "SET_USER", payload: user });
    };
    getUser();
  }, [dispatch]);

  useEffect(() => {
    const registerPushNotifications = async () => {
      if (!isRegistered) {
        await registerForPushNotificationsAsync();
        setIsRegistered(true);
      }
    };
    registerPushNotifications();
  }, [isRegistered]);

  return (
    <ProtectedRoute>
      <Stack initialRouteName="(drawer)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(class)" options={{ headerShown: false }} />
        <Stack.Screen name="(connectS)" options={{ headerShown: false }} />
        <Stack.Screen name="(resource)" options={{ headerShown: false }} />
        <Stack.Screen name="(library)" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
}
