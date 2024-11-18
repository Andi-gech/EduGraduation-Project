import { Image, View } from "react-native";
import React from "react";
import Ellipse from "../assets/logo.png";
export default function Logo() {
  return (
    <View className="flex items-center justify-center  w-[135px]  h-[135px]">
      <Image source={Ellipse} className=" w-full h-full" />
    </View>
  );
}
