import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Buttons from "./Buttons";
import { Image } from "expo-image";

import { LinearGradient } from "expo-linear-gradient";
import { Asset } from "expo-asset";

const TutorialModal = ({ isVisible, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ispostImageLoaded, setispostImageLoaded] = useState(false);
  const flatListRef = useRef(null);
  const colorScheme = useColorScheme();
  const width = useWindowDimensions().width;
  useEffect(() => {
    Asset.fromModule(tutorialSteps[0].image)
      .downloadAsync()
      .then(() => {
        setispostImageLoaded(true);
      });
  }, [currentIndex]);
  const tutorialSteps = [
    {
      id: "1",
      title: "Dec Gallery",
      description: "Discover and share your favorite photos ",
      image: require("../assets/post.png"), // Replace with actual image path
    },
    {
      id: "2",
      title: "Digital ID",
      description:
        "Request and share your digital ID with anyone, anywhere, anytime.",
      image: require("../assets/DigitalId.png"), // Replace with actual image path
    },
    {
      id: "3",
      title: "Pay Your Cafe Subscription",
      description: "Pay your cafe subscription with a single tap.",
      image: require("../assets/paychapa.png"), // Replace with actual image path
    },
    {
      id: "4",
      title: "Dec Connect",
      description: "Chat with friends and family in a secure environment.",
      image: require("../assets/chatWithFriend.png"), // Replace with actual image path
    },
  ];

  const renderItem = ({ item }) => (
    <View
      style={{ width: width }}
      className="flex items-center justify-center  "
    >
      <Image
        source={item.image}
        style={{ width: "90%" }}
        className=" h-[70%]  mb-5 rounded-md"
        contentFit="contain"
      />
      <Text className="text-xl text-white font-bold mb-3">{item.title}</Text>
      <Text className="text-base text-white text-center mb-5">
        {item.description}
      </Text>
    </View>
  );

  const scrollToIndex = (index) => {
    flatListRef.current.scrollToIndex({ animated: true, index });
    setCurrentIndex(index);
  };

  const nextStep = () => {
    if (currentIndex < tutorialSteps.length - 1) {
      scrollToIndex(currentIndex + 1);
      setispostImageLoaded(false);
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
      setispostImageLoaded(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {}
      <View className="flex-1 relative justify-center  items-center  bg-opacity-50">
        <View className="absolute top-0 left-0 w-screen h-screen bg-zinc-900 dark:bg-black opacity-50"></View>
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ["#010101", "#262626"]
              : ["#5b3f35", "#011B29"]
          }
          className=" dark:bg-black py-6  rounded-t-[30px] absolute bottom-0 z-50 h-[90%] w-full flex  flex-col justify-between"
        >
          {!ispostImageLoaded ? (
            <View className=" ">
              <ActivityIndicator size="large" color="#facc15" />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              horizontal
              data={tutorialSteps}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              style="my-4"
              scrollEnabled={false}
              initialScrollIndex={currentIndex}
              getItemLayout={(data, index) => ({
                length: width, // width of each item (match `w-[300px]` in your renderItem)
                offset: width * index, // position of each item
                index,
              })}
            />
          )}

          <View className="items-center mt-4">
            <Text className="text-base mb-3 text-white">
              Step {currentIndex + 1} of {tutorialSteps.length}
            </Text>
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={prevStep}
                disabled={currentIndex === 0}
                className="mr-4"
              >
                <Ionicons
                  name="chevron-back"
                  size={30}
                  color={currentIndex === 0 ? "gray" : "white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={nextStep}
                disabled={currentIndex === tutorialSteps.length - 1}
                className="ml-4"
              >
                <Ionicons
                  name="chevron-forward"
                  size={30}
                  color={
                    currentIndex === tutorialSteps.length - 1 ? "gray" : "white"
                  }
                />
              </TouchableOpacity>
            </View>
            <View className="w-[90%] h-[50px]">
              <Buttons
                name={
                  currentIndex === tutorialSteps.length - 1 ? "Finish" : "Next"
                }
                onPress={() => {
                  if (currentIndex === tutorialSteps.length - 1) {
                    onClose();
                  } else {
                    nextStep();
                  }
                }}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default TutorialModal;
