
import React from "react";
import { StyleSheet, Text, View, Linking, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { useColorScheme } from "react-native";
import UseFetchProfilepic from "../hooks/UseFetchProfilepic";

const ChatMessage = ({ message, sender, date }) => {
  const data = useSelector((state) => state.userData);
  const blurhash = "L8Glk-009GQ+MvxoVDD$*J+uxu9E";
  const { profile } = UseFetchProfilepic(sender);
  const isSender = sender === data?.userdata?._id;
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const timeWithoutSeconds = new Date(date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });


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


  const renderMessageWithLinks = (text) => {
    const words = text.split(" ");
    return words.map((word, index) => {
      const isLink = /^(http|https):\/\/[^ "]+$/.test(word);
      if (isLink) {
        return (
          <Text
            key={index}
            className="text-purple-200 underline"
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
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="w-full my-1.5"
    >
      <View className={`flex ${isSender ? "flex-row-reverse" : "flex-row"} items-end`}>
        {!isSender && (
          <MotiView
            from={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mr-2 mb-1"
          >
            {profile?.image ? (
              <Image
                source={{ uri: `https://eduapi.senaycreatives.com/${profile?.image}` }}
                className="w-10 h-10 rounded-full border-2"
                style={{ borderColor: accentColor }}
                placeholder={blurhash}
                transition={300}
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 items-center justify-center">
                <Ionicons name="person" size={20} color={accentColor} />
              </View>
            )}
          </MotiView>
        )}

        <LinearGradient
          colors={
            isSender
              ? ["#3b82f6", "#60a5fa"]
              : colorScheme === "dark"
              ? ["#374151", "#4b5563"]
              : ["#f3f4f6", "#e5e7eb"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`p-4 rounded-2xl ${
            isSender
              ? "rounded-br-none mr-2"
              : "rounded-bl-none ml-2"
          }`}
          style={[
            styles.messageShadow,
            {
              maxWidth: "80%",
              shadowColor: accentColor,
            },
          ]}
        >
          {!isSender && (
            <Text className="text-xs font-semibold mb-1 text-blue-500 dark:text-blue-300">
              {profile?.name || "Unknown User"}
            </Text>
          )}

          <Text
            className={`text-base ${
              isSender ? "text-white" : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {renderMessageWithLinks(message)}
          </Text>

          <Text
            className={`text-xs mt-1 ${
              isSender ? "text-blue-100" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {timeWithoutSeconds}
          </Text>
        </LinearGradient>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  messageShadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default React.memo(ChatMessage);