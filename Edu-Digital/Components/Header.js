import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RoundButton from "./RoundButton";
import { useNavigation } from "expo-router";

export default function Header({ name }) {
  const navigation = useNavigation();
  return (
    <View className="w-[99%] h-[50px] mt-[30px] px-2   flex flex-row items-center">
      <RoundButton icon="angle-left" onPress={() => navigation.goBack()} />
      <Text className="font-bold mx-4 text-white text-[20px]">{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
