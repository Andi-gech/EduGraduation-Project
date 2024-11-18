import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PendingSvg from "../../../Components/Pending";
import Buttons from "../../../Components/Buttons";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Verification() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.9]}
      className="flex-1 items-center  justify-center"
    >
      <View className="mt-2 w-[100px] h-[100px]">
        <PendingSvg className="w-[300px] h-[200px]" width={120} height={120} />
      </View>
      <Text className="mt-[20px] text-zinc-400  text-[20px] ">
        Waiting For Approval...
      </Text>
      <View className="w-[200px] h-[50px] mt-[20px]">
        <Buttons
          name={"Back To Login"}
          onPress={() => {
            router.replace("/(Auth)/login");
          }}
        />
      </View>

      <View className="flex flex-row items-center w-[80%] justify-center mt-[20px]">
        <Feather name="info" size={34} color={"white"} />
        <Text className="text-[14px] text-white ml-2">
          Verification could take up to 24 hours to be approved
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
