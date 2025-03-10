import React, { useRef, useEffect } from "react";
import { FlatList, View, StyleSheet, useColorScheme, Text } from "react-native";
import {  AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import ChatMessage from "./ChatMessage";

export default function ChatBox({ chats }) {
  const flatListRef = useRef(null);
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  useEffect(() => {
    if (chats.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chats]);

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["rgba(9,9,11,0.8)", "rgba(24,24,27,0.9)"]
          : ["rgba(248,250,252,0.9)", "rgba(241,245,249,0.9)"]
      }
      className="flex-1 rounded-t-3xl overflow-hidden"
    >
    

      <AnimatePresence>
        <FlatList
          ref={flatListRef}
          data={chats}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={({ item, index }) => (
            <View
              from={{ opacity: 0, translateX: item.sender === "me" ? 50 : -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 300 }}
            >
              <ChatMessage
                message={item.message}
                sender={item.sender}
                date={item.date}
              />
            </View>
          )}
          ListEmptyComponent={
            <View
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 items-center justify-center p-4"
            >
              <Text className="text-zinc-500 dark:text-zinc-400 text-lg">
                Start the conversation...
              </Text>
            </View>
          }
        />
      </AnimatePresence>

      {/* Scroll Indicator */}
      <View
        animate={{ opacity: chats.length > 5 ? 1 : 0 }}
        className="absolute bottom-4 right-4 w-8 h-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
        style={styles.scrollIndicator}
      >
        <FontAwesome6 name="chevron-down" size={14} color={accentColor} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollIndicator: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});