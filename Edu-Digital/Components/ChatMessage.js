import React from "react";
import { StyleSheet, Text, View, Linking, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import UseFetchProfilepic from "../hooks/UseFetchProfilepic";

const ChatMessage = ({ message, sender, date }) => {
  const data = useSelector((state) => state.userData);
  const blurhash = "L8Glk-009GQ+MvxoVDD$*J+uxu9E";

  const { profile } = UseFetchProfilepic(sender);

  const isSender = sender === data?.userdata?._id;
  const timeWithoutSeconds = new Date(date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Function to handle link press
  const handleLinkPress = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Invalid URL", `Cannot open: ${url}`);
        }
      })
      .catch((err) => console.error("Error opening URL: ", err));
  };

  // Function to render message with links
  const renderMessageWithLinks = (text) => {
    const words = text.split(" ");
    return words.map((word, index) => {
      const isLink = /^(http|https):\/\/[^ "]+$/.test(word);
      if (isLink) {
        return (
          <Text
            key={index}
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() => handleLinkPress(word)}
          >
            {word}{" "}
          </Text>
        );
      }
      return <Text key={index}>{word} </Text>;
    });
  };

  return (
    <View className="w-full mt-2 h-fit flex flex-col">
      <View
        className={`w-full  h-fit flex ${
          isSender ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isSender && (
          <View>
            {!profile?.image ? (
              <Ionicons name="person-circle" size={50} color="gray" />
            ) : (
              <Image
                source={{
                  uri: `https://eduapi.senaycreatives.com/${profile?.image}`,
                }}
                cachePolicy={"memory-disk"}
                placeholder={blurhash}
                className="w-[50px] h-[50px] mx-2 rounded-full"
              />
            )}
          </View>
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
              {renderMessageWithLinks(message)}
            </Text>
            <Text style={{ fontSize: 10 }} className="text-blue-900">
              {timeWithoutSeconds}
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default React.memo(ChatMessage);

const styles = StyleSheet.create({
  messageContainerSent: {
    marginRight: "5%",
    maxWidth: "70%",
    alignSelf: "flex-end",
  },
  messageBubbleSent: {
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  messageContainerReceived: {
    marginLeft: 4,
    maxWidth: "70%",
    marginTop: 20,
    alignSelf: "flex-start",
  },
  messageBubbleReceived: {
    padding: 10,
    borderRadius: 10,
  },
});
