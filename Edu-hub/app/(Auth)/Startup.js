import { Image, Text, View, TouchableOpacity } from "react-native";
import curvestyle from "../../assets/curvestyle.png";
import { Feather, Ionicons } from "@expo/vector-icons";

import Buttons from "../../Components/Buttons";
import { router } from "expo-router";
import Logo from "../../Components/Logo";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const handleStart = () => {
    router.replace("/login");
  };

  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.5]}
      className=" bg-white flex-1 flex items-center  flex-col"
    >
      <StatusBar style="light" />
      <View className="mt-[70px]">
        <Logo />
      </View>

      <View className="flex items-center justify-between mt-[49] w-full bg-black-200 h-[160px]">
        <View className="flex items-center justify-center">
          <Text className="text-[23.52px] text-yellow-400  font-bold">
            Ethiopian Defence University
          </Text>
          <Text className="text-[23.52px] text-white">
            Collage of Enginnering
          </Text>
        </View>

        <Text className="text-[23.52px] text-white">Student Fixlet Portal</Text>
      </View>
      <TouchableOpacity onPress={handleStart} className="mt-[89px]">
        <View className=" h-[50px]  bg-yellow-400  px-4 rounded-md flex flex-row items-center justify-center">
          <Text className="text-black text-center font-bold">Get Started</Text>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <Image
        source={curvestyle}
        style={{}}
        className="w-full h-full  opacity-[0.05] -z-10 absolute top-0"
      />
    </LinearGradient>
  );
}
