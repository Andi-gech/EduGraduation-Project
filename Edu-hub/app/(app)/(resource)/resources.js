import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DownloadCard from "../../../Components/DownloadCard";

import { useNavigation } from "expo-router";
import UseFetchResource from "../../../hooks/UseFetchResource";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Components/Header";
export default function resources() {
  const { data } = UseFetchResource();
  const navigation = useNavigation();
  console.log(data?.data);

  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.6]}
      className="flex-1 bg-white flex items-center  flex-col "
    >
      <Header name="Resources" />
      <View className="w-full flex-1 flex  flex-col mb-5">
        <View className="w-full flex items-center justify-center h-[50px] fontbold flex-col mb-5">
          <Text className="text-white">4th Year Cse Resources</Text>
        </View>
        <View className="h-[500px]  flex items-center justify-center  w-full">
          <FlatList
            data={data?.data}
            renderItem={({ item }) => <DownloadCard item={item} />}
          />
          <View className="w-full flex flex-row    items-center justify-center px-5  bg-current h-[100px]">
            <Text className="text-white font-bold text-[18px] ">
              Other Year Resources{" "}
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              color={"white"}
              size={27}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
