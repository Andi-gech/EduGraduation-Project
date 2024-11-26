import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function CoursesCard({ item }) {
  return (
    <View className="w-full  flex my-[5px]  pl-[10px] justify-center flex-col bg-zinc-100 dark:bg-zinc-900 shadow-sm dark:shadow-gray-800 h-[70px]">
      <Text className="font-bold text-black dark:text-white">
        {item?.course?.Coursename}
      </Text>
      <View className=" font-bold flex flex-row  w-full justify-between  text-gray-500">
        <Text className="mr-[10px] text-black dark:text-white">
          {item?.course?.Coursecode}
        </Text>
        <Text className="mr-[10px] text-yellow-400">
          {item?.course?.creaditHrs}hr
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
