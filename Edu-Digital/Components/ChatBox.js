import React, { useRef, useEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ChatMessage from "./ChatMessage";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ChatBox({ chats }) {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (chats.length > 0) {
      console.log("chats changed");
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chats]); // Dependency array ensures this runs when chats changes

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.onlineIndicator}>
        <FontAwesome6 name="dot-circle" size={15} style={styles.icon} />
      </View>
      <FlatList
        ref={flatListRef}
        data={chats}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => (
          <ChatMessage
            key={index}
            message={item.message}
            sender={item.sender}
            date={item.date}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  onlineIndicator: {
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 50,
    height: 20,
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#34D399", // Green color for the dot
  },
});
