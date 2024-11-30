import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../../../Components/Header";
import { Ionicons } from "@expo/vector-icons";

import SucessPopup from "../../../../../Components/SucessPopup";
import Loading from "../../../../../Components/Loading";
import ErrorPopup from "../../../../../Components/ErrorPopup";
import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddPost() {
  const [image, setImage] = useState(null);
  const [content, setcontent] = useState(null);
  const [sucess, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false); // For image validation
  const [Loadings, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageError(false); // Clear error if image is selected
    }
  };

  const onSubmit = async () => {
    if (!image) {
      setImageError(true); // Show error if no image is selected
      return;
    }
    setLoading(true);

    const multform = new FormData();
    multform.append("content", content);
    multform.append("Image", {
      uri: image,
      name: "image.jpg",
      type: "image/jpg",
    });

    try {
      const response = await fetch(`https://eduapi.senaycreatives.com/post`, {
        method: "POST",
        body: multform,
        headers: {
          Authorization: `${await AsyncStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      if (result) {
        setLoading(false);
        setSucess(true);
        setTimeout(() => {
          setSucess(false);
        }, 2000);

        setImage(null);
        setcontent("");
      }
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);

      setLoading(false);
      setImage(null);
    }
  };

  return (
    <View className="flex-1 flex bg-white dark:bg-black  items-center flex-col">
      <Header name={"Create Posts "} />
      {sucess && <SucessPopup message="Post Created" />}
      {error && <ErrorPopup message="Failed to create post" />}
      {Loadings && <Loading />}
      {image && (
        <View className=" p-2 flex items-center justify-center bg-gray-200 border-2 border-yellow-400 rounded-md">
          <Image
            source={{ uri: image }}
            className="w-[80px] h-[80px] bg-zinc-600 rounded-md"
          />
        </View>
      )}
      <TextInput
        value={content}
        onChange={(e) => setcontent(e.nativeEvent.text)}
        multiline
        placeholder="Tell us more"
        className="w-[92%] h-[100px] bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white  rounded-[12px] px-2 mt-2"
      />
      <TouchableOpacity
        onPress={pickImage}
        className="w-[99%] flex-row items-center justify-center mt-7  flex "
      >
        <Ionicons
          name="add-circle"
          size={24}
          className=" text-black dark:text-white "
        />
        <Text className=" text-black dark:text-white mx-3 font-semibold">
          Add Image
        </Text>
      </TouchableOpacity>
      {imageError && (
        <Text className="text-red-500 mx-3 mt-2">Please select an image</Text>
      )}

      <TouchableOpacity
        onPress={onSubmit}
        className="w-[89%] rounded-md h-[50px] flex-row items-center justify-center mt-7 bg-yellow-400  flex "
      >
        <Text className="text-black mx-3 font-semibold">Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
