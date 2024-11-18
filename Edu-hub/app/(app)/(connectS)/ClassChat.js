import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";

import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import ChatBox from "../../../Components/ChatBox";

import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Components/Header";

import { useNavigation } from "expo-router";

export default function ClassChat() {
  const [Message, setMessage] = React.useState("");
  const [Chats, setChats] = React.useState([]);

  const navigation = useNavigation();

  const sendMessage = () => {
    setChats([...Chats, { sender: "me", message: Message }]);
    setMessage("");
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 ">
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.6]}
        className=" flex-1 flex bg-white"
      >
        <View className="relative">
          <Header name="Dec 4th Year Chat" />
          <View className="absolute top-[40px] right-[10px] ">
            <FontAwesome5 name="users" size={24} color="white" />
          </View>
        </View>

        <View className="w-full flex-1 flex  mb-5">
          <ChatBox chats={Chats} />
        </View>
        <View className="w-full mb-3 h-[60px] flex  flex-row justify-between items-center px-[5px]">
          <TextInput
            value={Message}
            onChange={(e) => setMessage(e.nativeEvent.text)}
            className="  h-[50px] flex-1 mx-[10px]  bg-zinc-900 rounded-md px-2"
            placeholder="Enter Message"
            placeholderTextColor={"gray"}
          />

          <TouchableHighlight
            onPress={sendMessage}
            className="w-[50px] h-[50px] full flex items-center justify-center bg-yellow-400 rounded-full"
          >
            <Ionicons
              name="send-outline"
              className=" mr-3 "
              color={"black"}
              size={28}
            />
          </TouchableHighlight>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
