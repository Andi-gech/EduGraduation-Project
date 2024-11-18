import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function RequestCard() {
  return (
    <View className="w-[97%] shadow-sm bg-zinc-900 shadow-gray-800 rounded-sm  h-[70px]  mt-2 flex  flex-row  items-center justify-between px-3 ">
      <View className=" flex flex-row items-center  ">
        <Text className="text-white text-lg font-bold mx-3">10/12/2022</Text>
        <Ionicons name="calendar" size={22} color="white" />
      </View>
      <Ionicons
        name="checkmark-circle-outline"
        size={22}
        color="green"
        className="mr-3"
      />
    </View>
  );
}

const styles = StyleSheet.create({});
