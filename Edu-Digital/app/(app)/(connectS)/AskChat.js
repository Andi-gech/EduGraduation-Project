import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import {  AnimatePresence } from "moti";
import ChatBox from "../../../Components/ChatBox";
import Header from "../../../Components/Header";
import User from "../../../Components/User";
import UseFetchChat from "../../../hooks/UseFetchChats";
import Loading from "../../../Components/Loading";

export default function AskChat() {
  const [message, setMessage] = useState("");
  const { data: recentChats, isLoading } = UseFetchChat("ask");
  const [chats, setChats] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const data = useSelector((state) => state.userData);
  const socket = useSelector((state) => state.socket.socket);
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  useEffect(() => {
    if (recentChats) {
      setChats(recentChats?.data?.sort((a, b) => new Date(a.date) - new Date(b.date)));
    }
  }, [recentChats]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", "ask");
      socket.on("message", (data) => {
        setChats((prevChats) => [
          ...prevChats,
          { sender: data.sender, message: data.message, date: data.date },
        ]);
      });
    }

    return () => {
      socket?.off("message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { message });
      setChats((prevChats) => [
        ...prevChats,
        { sender: data?.userdata?._id, message, date: new Date() },
      ]);
      setMessage("");
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior="padding" 
      className="flex-1 pt-[20px]"
   
    >
      <LinearGradient
        colors={
          colorScheme === "dark" 
            ? ["#09090b", "#18181b"] 
            : ["#f8fafc", "#e2e8f0"]
        }
        className="flex-1 pt-[20px]"
      >
        {isLoading && <Loading />}

        <Header 
          name="Ask Chat" 
          rightIcon="people-outline"
          onRightPress={() => setShowUsers(true)}
          accentColor={accentColor}
        />

        <ChatBox chats={chats} />

        <LinearGradient
          colors={
            colorScheme === "dark" 
              ? ["#18181b", "#262626"] 
              : ["#ffffff", "#f8fafc"]
          }
          className="mx-4 mb-4 p-2 rounded-2xl shadow-lg"
          style={{
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
        >
          <View className="flex-row items-center space-x-2">
            <TextInput
              value={message}
              onChangeText={setMessage}
              className="flex-1 h-12 px-4 text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
              placeholder="Type your message..."
              placeholderTextColor="#71717a"
              multiline
            />
            <View
              animate={{ scale: message ? 1.1 : 1 }}
              transition={{ type: 'timing' }}
            >
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!message}
                className="w-12 h-12 bg-emerald-500 items-center justify-center rounded-xl"
                style={{ 
                  opacity: message ? 1 : 0.5,
                  backgroundColor: accentColor
                }}
              >
                <Ionicons 
                  name="send" 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <AnimatePresence>
          {showUsers && (
            <View
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 right-0 bottom-0 bg-black/30"
            >
              <User 
                onClose={() => setShowUsers(false)} 
                accentColor={accentColor}
              />
            </View>
          )}
        </AnimatePresence>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Add any specific styles if needed
});