import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import api from "../utils/api";

export async function registerForPushNotificationsAsync(mutate) {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

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

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "cfeb7182-da76-41bd-a557-8a99634dc3cf", // replace with your project ID
      })
    ).data;

    mutate(token); // Call the mutation function to send the token
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
