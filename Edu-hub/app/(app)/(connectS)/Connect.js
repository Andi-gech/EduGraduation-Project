import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import RoundButton from "../../../Components/RoundButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Components/Header";

export default function Connect() {
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.8]}
      className="  flex-1 bg-white"
    >
      <Header name="Connect" />
      <View className="w-full h-[500px] flex flex-col items-center  pt-5 ">
        <TouchableOpacity
          onPress={() => navigation.navigate("AskChat")}
          className="w-[95%] h-[70px]  shadow-sm shadow-zinc-800 rounded-md flex-row flex items-center  pl-[20px] bg-zinc-950 mt-5"
        >
          <>
            <View className="w-[50px] h-[50px] full flex items-center justify-center bg-yellow-500 rounded-full">
              <MaterialCommunityIcons
                name="head-question-outline"
                size={24}
                color="white"
              />
            </View>

            <Text className="ml-3 font-semibold text-white">Dec (Ask) </Text>
          </>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ClassChat")}
          className="w-[95%] h-[70px] rounded-md shadow-sm  s8adow-zinc-600 flex flex-row items-center  pl-[20px] bg-zinc-950 mt-5"
        >
          <>
            <View className="w-[50px] h-[50px] full flex items-center justify-center bg-yellow-500 rounded-full">
              <Ionicons
                name="chatbubble-outline"
                className=" mr-3 "
                color={"white"}
                size={28}
              />
            </View>

            <Text className="ml-3 font-semibold text-white">
              Dec (4th) Year Student
            </Text>
          </>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
