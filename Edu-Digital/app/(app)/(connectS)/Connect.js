import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import RoundButton from "../../../Components/RoundButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Components/Header";

export default function Connect() {
  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <View className="  flex-1  bg-white dark:bg-black">
      <Header name="Connect" />
      <View className="w-full h-[500px] flex flex-col items-center  pt-5 ">
        <TouchableOpacity
          onPress={() => navigation.navigate("AskChat")}
          className="w-[95%] h-[70px]  shadow-sm shadow-zinc-200 dark:shadow-zinc-800 rounded-md flex-row flex items-center  pl-[20px] bg-zinc-50 dark:bg-zinc-950 mt-5"
        >
          <>
            <View className="w-[50px] h-[50px] full flex items-center justify-center bg-yellow-500 rounded-full">
              <MaterialCommunityIcons
                name="head-question-outline"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </View>

            <Text className="ml-3 font-semibold text-black dark:text-white">
              Dec (Ask){" "}
            </Text>
          </>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ClassChat")}
          className="w-[95%] h-[70px]  shadow-sm shadow-zinc-200 dark:shadow-zinc-800 rounded-md flex-row flex items-center  pl-[20px] bg-zinc-50 dark:bg-zinc-950 mt-5"
        >
          <>
            <View className="w-[50px] h-[50px] full flex items-center justify-center bg-yellow-500 rounded-full">
              <Ionicons
                name="chatbubble-outline"
                className=" mr-3 "
                color={colorScheme === "dark" ? "white" : "black"}
                size={28}
              />
            </View>

            <Text className="ml-3 font-semibold text-black dark:text-white">
              Dec (4th) Year Student
            </Text>
          </>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
