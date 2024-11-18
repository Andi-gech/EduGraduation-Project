import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { Image } from "expo-image";
import UseFetchProfilepic from "../hooks/UseFetchProfilepic";

const ChatMessage = ({ message, sender }) => {
  const data = useSelector((state) => state.userData);
  const blurhash = "L8Glk-009GQ+MvxoVDD$*J+uxu9E";

  // Memoize the profile picture data to avoid unnecessary refetching
  const { profile } = UseFetchProfilepic(sender);
  console.log(profile);
  const isSender = sender === data?.userdata?._id;

  return (
    <View className="w-full mt-2 h-fit flex flex-col">
      <View
        className={`w-full mt-2 h-fit flex ${
          isSender ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isSender && (
          <Image
            source={{
              uri: `http://192.168.1.6:3000/${profile?.image}`,
            }}
            placeholder={{ blurhash }}
            className="w-[50px] h-[50px] mx-2 rounded-full"
          />
        )}
        <View
          style={
            isSender
              ? styles.messageContainerSent
              : styles.messageContainerReceived
          }
        >
          <LinearGradient
            colors={isSender ? ["#0078fe", "#00c6ff"] : ["#f0f0f0", "orange"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={
              isSender ? styles.messageBubbleSent : styles.messageBubbleReceived
            }
          >
            <Text style={{ fontSize: 16, color: isSender ? "#fff" : "#000" }}>
              {message}
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

// Use React.memo to optimize rendering
export default React.memo(ChatMessage);

const styles = StyleSheet.create({
  messageContainerSent: {
    marginLeft: "45%",
    marginRight: "5%",
    maxWidth: "50%",
    alignSelf: "flex-end",
  },
  messageBubbleSent: {
    padding: 10,
    borderRadius: 5,
  },
  messageContainerReceived: {
    marginLeft: "2%",
    maxWidth: "50%",
    alignSelf: "flex-start",
  },
  messageBubbleReceived: {
    padding: 10,
    borderRadius: 5,
  },
});
