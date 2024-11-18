import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import commingsooonpng from "../../../assets/coming-soon.png";
import { useNavigation } from "expo-router";
import Headers from "../../../Components/Header";
import { LinearGradient } from "expo-linear-gradient";

export default function library() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.6]}
      className="flex   flex-1    flex-col"
    >
      <Headers name="Library" />
      <View className="w-[99%] h-[300px]   mb-[50px]  mt-2 flex  items-center justify-center">
        <Image source={commingsooonpng} className="w-[200px] h-[200px]" />

        <Text className="text-white text-lg font-bold">Coming Soon</Text>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Text className="text-white text-md ">Back to Home</Text>
        </TouchableWithoutFeedback>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
