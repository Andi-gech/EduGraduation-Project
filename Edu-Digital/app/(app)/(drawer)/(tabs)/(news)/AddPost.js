import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SucessPopup from "../../../../../Components/SucessPopup";
import ErrorPopup from "../../../../../Components/ErrorPopup";
import Loading from "../../../../../Components/Loading";

export default function AddPost() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [sucess, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [Loadings, setLoading] = useState(false);

  // Theme configurations
  const gradientColors = colorScheme === "dark" 
    ? ["#09090b", "#18181b"] 
    : ["#4f46e5", "#0891b2"];
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";
  const cardBg = colorScheme === "dark" ? "#18181b" : "#ffffff";
  const borderColor = colorScheme === "dark" ? "#3f3f46" : "#e5e7eb";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageError(false);
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss(); // Dismiss keyboard on submit
    if (!image) {
      setImageError(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("Image", {
      uri: image,
      name: "post_image.jpg",
      type: "image/jpeg",
    });

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("https://eduapi.senaycreatives.com/post", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Post creation failed");

      setSucess(true);
      setTimeout(() => {
        setSucess(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error("Post error:", error);
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
      setImage(null);
      setContent("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={gradientColors}
        locations={[0.1, 0.9]}
        className="flex-1 "
      >
        <View className="flex-1 px-4 pt-8">
          {/* Header Section */}
          <View
            className="flex-row items-center justify-between mb-6"
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
          >
            <Text className="text-2xl font-bold text-white">Create Post</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2"
            >
              <Ionicons name="close" size={28} color={accentColor} />
            </TouchableOpacity>
          </View>

          {/* Main Content Card */}
          <View
            className="rounded-3xl p-6 mb-4"
            style={[styles.card, { backgroundColor: cardBg }]}
            from={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
          >
            {/* Image Upload Section */}
            <View
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 200 }}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={[styles.imageContainer, { borderColor }]}
                className="items-center justify-center mb-4"
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    className="w-full h-full rounded-xl"
                    transition={300}
                  />
                ) : (
                  <View className="items-center space-y-2">
                    <Ionicons
                      name="camera-outline"
                      size={32}
                      color={colorScheme === 'dark' ? '#71717a' : '#9ca3af'}
                    />
                    <Text className="text-neutral-400 dark:text-zinc-500 text-sm">
                      Add Featured Image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {imageError && (
                <Text className="text-red-400 text-sm ml-2 mb-2">
                  Please select an image
                </Text>
              )}
            </View>

            {/* Content Input */}
            <View
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 100 }}
            >
              <TextInput
                value={content}
                onChangeText={setContent}
                multiline
                placeholder="Share your thoughts..."
                placeholderTextColor="#9ca3af"
                style={[
                  styles.input,
                  { 
                    backgroundColor: colorScheme === 'dark' ? '#27272a' : '#f3f4f6',
                    color: colorScheme === 'dark' ? '#f4f4f5' : '#18181b'
                  }
                ]}
                className="rounded-xl p-4 text-base leading-5"
                textAlignVertical="top"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            {/* Submit Button */}
            <View
              className="mt-6"
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 300 }}
            >
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.buttonShadow}
              >
                <LinearGradient
                  colors={['#facc15', '#eab308']}
                  className="w-full py-4 rounded-xl items-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-white font-semibold text-base">
                    Publish Post
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Indicators */}
          {Loadings && <Loading />}
          <SucessPopup visible={sucess} message="Post created successfully!" />
          <ErrorPopup visible={error} message="Failed to create post" />
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  input: {
    height: 120,
  },
  buttonShadow: {
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});