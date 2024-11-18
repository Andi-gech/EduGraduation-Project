import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Marque() {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: -width, // Adjust this if needed
          duration: 5000, // Duration for the scroll
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 170,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  return (
    <View className="w-full overflow-hidden rounded-full bg-yellow-400 h-[20px]">
      <Animated.View
        style={{
          transform: [{ translateX: animation }],
          flexDirection: "row",
          alignItems: "center",
          width: width,
        }}
      >
        <Text
          numberOfLines={1}
          className="text-black px-[30px] whitespace-nowrap overflow-ellipsis w-screen"
        >
          Well Come to the Dec Super App for all your needs
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({});
