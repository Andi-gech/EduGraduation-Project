import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function User({ onclose }) {
  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View className="w-full h-[18%]  blur-lg  "></View>
      <View className="w-full h-[86%] flex items-center">
        <LinearGradient
          colors={["#262626", "#010101"]}
          locations={[0.0, 0.9]}
          className="w-[96%]  h-full rounded-t-[30px] shadow-white z-40 shmd  "
        >
          <View className="w-full h-[50px]  bg-opacity-50 flex flex-row justify-between items-center px-5">
            <Text className="text-white text-xl font-semibold">Users</Text>
            <TouchableOpacity onPress={onclose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            className="w-full h-[80%] "
            data={[
              {
                name: "John Doe",
                status: "Online",
                pp: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
              },
            ]}
            renderItem={({ item }) => (
              <View className="w-full h-[60px] my-2 flex flex-col justify-center items-center">
                <View className="w-full h-[80%] flex flex-row justify-between items-center px-5">
                  <View className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <Image
                      src={item.pp}
                      className="w-full h-full object-cover"
                    />
                  </View>
                  <View className="flex flex-col">
                    <Text className="text-white text-xl font-semibold">
                      {item.name}
                    </Text>
                    {item.status === "Online" ? (
                      <Text className="text-green-400 text-sm font-semibold">
                        {item.status}
                      </Text>
                    ) : (
                      <Text className="text-gray-400 text-sm font-semibold">
                        {item.status}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* <View className="w-full h-[80%] flex flex-col justify-center items-center">
            <Text className="text-white text-xl font-semibold">No Users</Text>
          </View> */}
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
