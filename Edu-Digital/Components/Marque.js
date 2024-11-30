import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Marque() {
  const animation = useRef(new Animated.Value(320)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: -width * 1.49, // Adjust this if needed
          duration: 13900, // Duration for the scroll
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 490,
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
          width: width * 3,
        }}
      >
        <Text
          numberOfLines={1}
          className="text-black ] px-[30px] whitespace-nowrap overflow-ellipsis w-[55%]"
        >
          Welcome to the Dec Super App — your ultimate destination for
          all-in-one solutions!
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({});
