import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function RequestCard({ name, date, status }) {
  return (
    <View className="w-[97%] shadow-sm bg-gray-100 dark:bg-zinc-900 dark:shadow-gray-800 rounded-sm  h-[70px]  mt-2 flex  flex-row  items-center justify-between px-3 ">
      <View className=" flex flex-row items-center  ">
        <Text className=" text-black dark:text-white text-lg font-bold mx-3">
          {new Date(date).toDateString()}
        </Text>
        <Ionicons name="calendar" size={22} color="white" />
      </View>
      {status === "pending" && (
        <FontAwesome5
          name="hourglass-half"
          size={22}
          color="gray"
          className="mr-3"
        />
      )}
      {status === "approved" && (
        <Ionicons
          name="checkmark-circle-outline"
          size={22}
          color="green"
          className="mr-3"
        />
      )}
      {status === "denied" && (
        <Ionicons
          name="close-circle-outline"
          size={22}
          color="red"
          className="mr-3"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
