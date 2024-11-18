import {
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function DownloadCard({ item }) {
  console.log(item);
  console.log(item?.resource.split("/")[1]);

  const download = () => {
    Linking.openURL(`http://192.168.1.6:3000/${item?.resource}`);
  };

  return (
    <View className="w-[85%] relative mx-[10px] mt-[10px] h-[70px] flex-row shadow-sm rounded-md shadow-gray-900 bg-zinc-950 items-center px-2 justify-between">
      <View className="flex flex-col justify-center items-center">
        <Text className="text-black font-semibold text-md">
          {item?.course?.CourseName}
        </Text>
      </View>
      <TouchableHighlight
        onPress={download}
        className="h-[50px] bg-zinc-900 w-[50px] rounded-full border-2 flex items-center justify-center border-white"
      >
        <MaterialCommunityIcons
          name="download-outline"
          size={24}
          color="white"
        />
      </TouchableHighlight>
      <Text className="text-white flex text-end py-1 px-1 absolute bottom-0 left-0 text-[10px]">
        {item?.size} MB
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
