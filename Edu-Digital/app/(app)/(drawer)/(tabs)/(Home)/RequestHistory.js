import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RequestCard from "../../../../../Components/RequestCard";
import RoundButton from "../../../../../Components/RoundButton";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../../../Components/Header";

export default function RequestHistory() {
  return (
    <View className="flex-1 flex items-center bg-white  dark:bg-black  flex-col">
      <Header name="Request History" />
      <View className="w-[99%]     mt-2 flex  items-center justify-center">
        <RequestCard />
        <RequestCard />
        <RequestCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
