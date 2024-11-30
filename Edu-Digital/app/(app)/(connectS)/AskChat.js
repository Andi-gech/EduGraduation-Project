import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import ChatBox from "../../../Components/ChatBox";
import Header from "../../../Components/Header";
import User from "../../../Components/User";
import UseFetchChat from "../../../hooks/UseFetchChats";
import Loading from "../../../Components/Loading";

export default function AskChat() {
  const [message, setMessage] = useState();
  const { data: recentChats, isLoading } = UseFetchChat("ask");

  const [chats, setChats] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const data = useSelector((state) => state.userData);
  const socket = useSelector((state) => state.socket.socket);
  const colorScheme = useColorScheme();
  useEffect(() => {
    if (recentChats) {
      setChats(
        recentChats?.data?.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    }
  }, [recentChats]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", "ask");
      socket.on("message", (data) => {
        setChats((prevChats) => [...prevChats, data]);
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
        { sender: data?.userdata?._id, message },
      ]);
      setMessage("");
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <View className="flex-1 bg-white dark:bg-black">
        {isLoading && <Loading />}
        {showUsers && <User onclose={() => setShowUsers(false)} />}
        <View className="relative">
          <Header name="Ask Chat" />
          <TouchableOpacity
            onPress={() => setShowUsers(true)}
            className="absolute top-[40px] right-[10px]"
          >
            <FontAwesome5
              name="users"
              size={24}
              color={colorScheme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-1 mb-5">
          <ChatBox chats={chats} />
        </View>

        <View className="w-full mb-3 h-[60px] flex-row justify-between items-center px-[5px]">
          <TextInput
            value={message}
            onChangeText={setMessage}
            className="h-[50px] flex-1 mx-[10px] bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white rounded-md px-2"
            placeholder="Enter Message"
            placeholderTextColor={"gray"}
          />
          <TouchableHighlight
            onPress={sendMessage}
            className="w-[50px] h-[50px] bg-yellow-400 rounded-full flex items-center justify-center"
          >
            <Ionicons name="send-outline" color={"black"} size={28} />
          </TouchableHighlight>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
