import React, { useRef, useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import ChatMessage from "./ChatMessage";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ChatBox({ chats }) {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (chats.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [chats]);

  return (
    <View className="flex-1 flex-col justify-center">
      <View className="w-full h-[20px] mt-2 flex items-center justify-center flex-row">
        <FontAwesome6 name="dot-circle" size={15} className="text-green-500" />
        <Text className="text-gray-400 text-sm mx-2 font-semibold">
          You are Online!!
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={chats}
        renderItem={({ item, index }) => (
          <ChatMessage
            key={index}
            message={item.message}
            sender={item.sender}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
