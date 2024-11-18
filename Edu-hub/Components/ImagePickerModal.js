import {
  Modal,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";

export default function ImagePickerModal({
  visible,
  image,
  onclose,
  onupdate,
}) {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View className="w-[98%] h-[85%]   overflow-hidden rounded-t-[40px] self-center bg-white shadow-sm shadow-black absolute bottom-0 flex items-center justify-start  z-40">
        <View className="w-full h-[50px] px-[20px] flex  flex-row   justify-between items-center">
          <TouchableOpacity onPress={onclose}>
            <Text className="text-[20px]  text-black  w-[80px] font-bold">
              cancle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onupdate}>
            <Text className="text-[20px]  text-black  w-[80px] font-bold">
              update
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1  bg-black w-full">
          <Image source={{ uri: image }} className="w-full h-full" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
