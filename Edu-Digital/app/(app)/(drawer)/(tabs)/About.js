import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

export default function About() {
  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.9]}
      className="flex-1  bg-white items-center pt-[20px]"
    >
      <Icon name="information-circle" size={30} color="white" />
      <Text className="text-white font-bold text-[17px]">About</Text>
      <View className=" w-full px-[20px] flex-1 flex flex-col r">
        <View className="mt-[100px]">
          <Text className="text-white">Developed By: </Text>
          <Text className="text-orange-300">Andualem Getachew</Text>
          <Text className="text-orange-300">Mikias Adamu </Text>
          <Text className="text-orange-300">Samuel Kumsa</Text>
          <Text className="text-white mt-5">Project Advisor: </Text>
          <Text className="text-orange-300">Lt Solomon.T</Text>
          <Text className="text-white mt-5">Version: 1.0.0</Text>
          <Text className="text-white">Build: 1</Text>
          <Text className="text-white mt-5">
            Dec Hub is A Educational Platform For Students and Teachers to
            Connect With Each Other and share resource
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
