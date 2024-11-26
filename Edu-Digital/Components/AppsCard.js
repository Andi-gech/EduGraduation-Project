import { Text, useColorScheme } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function AppsCard({ name, icon, onpress }) {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={onpress}
      className="w-[130px] h-[70px] rounded-md shrink-0  flex flex-col items-center justify-center  bg-zinc-100 dark:bg-zinc-900 shadow-sm mx-2  mt-2"
    >
      <Ionicons
        name={icon}
        size={24}
        color={colorScheme === "dark" ? "white" : "black"}
        className=" text-black dark:text-white "
      />
      <Text className="  text-black dark:text-white mt-2">{name}</Text>
    </TouchableOpacity>
  );
}
