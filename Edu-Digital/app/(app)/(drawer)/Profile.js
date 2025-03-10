import { useColorScheme, View, Text } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import {  AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import ImagePickerModal from "../../../Components/ImagePickerModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UseFetchMyData from "../../../hooks/UseFetchMyData";
import * as FileSystem from "expo-file-system";
import Loading from "../../../Components/Loading";
import Header from "../../../Components/Header";

export default function Profile() {
  const [image, setImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [sucess, setSucess] = useState(null);
  const [error, setError] = useState(null);
  const { data, isLoading } = UseFetchMyData();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === 'dark' ? '#f59e0b' : '#3b82f6';
  const queryclient = useQueryClient();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setVisible(true);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await FileSystem.uploadAsync(
        `https://eduapi.senaycreatives.com/user/updateProfilePic`,
        data,
        {
          fieldName: "profilePic",
          httpMethod: "PUT",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            Authorization: await AsyncStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries("me");
      setSucess("Profile Picture Updated");
      setTimeout(() => setSucess(false), 3000);
      setImage(null);
    },
    onError: () => {
      setImage(null);
      setError("Failed to update profile picture");
      setTimeout(() => setError(false), 3000);
    },
    mutationKey: "updateProfilePic",
  });

  const onSubmit = async () => {
    setVisible(false);
    mutation.mutate(image);
  };

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" 
          ? ["#09090b", "#18181b"] 
          : ["#f8fafc", "#e2e8f0"]
      }
      className="flex-1 pt-[20px]"
    >
      <Header name="Profile Settings" accentColor={accentColor} />

      <View className="flex-1 items-center px-4 pt-8">
        {(mutation.isPending || isLoading) && <Loading />}

        <AnimatePresence>
          {sucess && (
            <View
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-20 z-50"
            >
              <View className="bg-green-500/90 px-4 py-2 rounded-full flex-row items-center">
                <Feather name="check" size={16} color="white" />
                <Text className="text-white ml-2">{sucess}</Text>
              </View>
            </View>
          )}

          {error && (
            <View
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-20 z-50"
            >
              <View className="bg-red-500/90 px-4 py-2 rounded-full flex-row items-center">
                <Feather name="alert-circle" size={16} color="white" />
                <Text className="text-white ml-2">{error}</Text>
              </View>
            </View>
          )}
        </AnimatePresence>

        <View
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <View className="w-40 h-40 rounded-full border-4"
            style={{ borderColor: accentColor + '30' }}>
            <Image
              source={{
                uri: data?.data?.profilePic 
                  ? `https://eduapi.senaycreatives.com/${data.data.profilePic}`
                  : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
              }}
              className="w-full h-full rounded-full"
            />
            
            <View
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-1 right-1 bg-white dark:bg-zinc-800 p-2 rounded-full"
              style={{
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              <TouchableOpacity onPress={pickImage}>
                <Feather
                  name="camera"
                  size={24}
                  color={accentColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ImagePickerModal
          onupdate={onSubmit}
          onclose={() => {
            setVisible(false);
            setImage(null);
          }}
          visible={visible}
          image={image}
          accentColor={accentColor}
        />
      </View>
    </LinearGradient>
  );
}