import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Loading() {
  return (
    <View className=" absolute   top-0  left-0    w-screen h-screen flex items-center justify-center">
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.8]}
        className="p-9 rounded-lg  z-30 border-[1px] border-gray-800"
      >
        <ActivityIndicator size="large" color="#facc15" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({});