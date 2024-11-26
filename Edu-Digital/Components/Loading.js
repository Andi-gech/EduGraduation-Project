import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Loading() {
  return (
    <View className=" absolute  z-[900]  top-0  left-0    w-screen h-screen flex items-center justify-center">
      <View
        locations={[0.0, 0.8]}
        className="p-9 rounded-lg  bg-white dark:bg-black  z-30 border-[1px] border-gray-300 dark:border-gray-900 "
      >
        <ActivityIndicator size="large" color="#facc15" />
      </View>
      <View className="absolute top-0 left-0 w-screen h-screen bg-white dark:bg-black opacity-50"></View>
    </View>
  );
}

const styles = StyleSheet.create({});
