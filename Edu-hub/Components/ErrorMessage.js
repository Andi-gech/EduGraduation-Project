import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function ErrorMessage({ type, content }) {
  return (
    <View classname="flex w-full items-center flex-row  bg-black ">
      <Text
        style={{
          color: type === "error" ? "red" : "orange",
        }}
      >
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
