import {
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NotificationCard({ data }) {
  const [lineshown, setlineshown] = useState(false);

  const toggleLines = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setlineshown(!lineshown);
  };

  return (
    <TouchableOpacity
      onPress={toggleLines}
      className="w-11/12 flex flex-row items-center justify-evenly bg-zinc-900 shadow-md my-1 p-2 rounded-lg min-h-16"
    >
      <Ionicons name="notifications-outline" size={24} color="white" />
      <View className="flex-1 flex-col justify-evenly py-2 ml-2">
        <Text numberOfLines={lineshown ? 5 : 2} className="text-white text-sm">
          {data?.notification}
        </Text>
        <Text className="text-gray-400 mt-2 self-end text-xs font-bold">
          12/12/2022 - 12:12AM
        </Text>
      </View>
    </TouchableOpacity>
  );
}
