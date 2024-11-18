import { Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function AppsCard({ name, icon, onpress }) {
  return (
    <TouchableOpacity
      onPress={onpress}
      className="w-[130px] h-[70px] rounded-md shrink-0  flex flex-col items-center justify-center bg-zinc-900 shadow-sm mx-2  mt-2"
    >
      <Ionicons name={icon} size={24} color="white" />
      <Text className=" text-white mt-2">{name}</Text>
    </TouchableOpacity>
  );
}
