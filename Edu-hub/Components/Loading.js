import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Loading() {
  return (
    <View
      style={{
        backgroundColor: "rgba(1,1,1,0.5)",
      }}
      className=" absolute   top-0 z-30 left-0    w-screen h-screen flex items-center justify-center"
    >
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.8]}
        className="p-9 rounded-lg"
      >
        <ActivityIndicator size="large" color="#facc15" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({});
