import { Stack } from "expo-router/stack";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../Components/ProtectedRoute";
import { initializeSocket } from "../../utils/socketService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import api from "../../utils/api";
import * as SystemUI from "expo-system-ui";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { registerForPushNotificationsAsync } from "../../Components/registerForPushNotificationsAsync";
import { useColorScheme } from "react-native";

export default function Layout() {
  const [isRegistered, setIsRegistered] = useState(false);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const mutation = useMutation({
    mutationFn: async (token) => {
      const response = await api.put("/user/pushnotification", {
        pushToken: token,
      });
      return response.data;
    },
    onSuccess: (data) => {},
    onError: (error) => {},
  });

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
        const token = await registerForPushNotificationsAsync(mutation.mutate);

        if (token) {
          setIsRegistered(true);
        }
      }
    };
    registerPushNotifications();
  }, [isRegistered, mutation]);

  return (
    <ProtectedRoute>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          initialRouteName="(drawer)"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="(class)" options={{ headerShown: false }} />
          <Stack.Screen name="(connectS)" options={{ headerShown: false }} />
          <Stack.Screen name="(resource)" options={{ headerShown: false }} />
          <Stack.Screen name="(library)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
