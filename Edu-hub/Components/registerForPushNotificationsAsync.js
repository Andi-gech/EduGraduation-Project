import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../utils/api";
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put("/user/pushnotification", {
        pushToken: data,
      });
      return response.data;
    },
    mutationKey: ["pushToken"],
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "1b489b7f-f7a8-4412-ad37-4e26e0160c39", // you can hard code project id if you dont want to use expo Constants
      })
    ).data;
    mutation.mutate(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
