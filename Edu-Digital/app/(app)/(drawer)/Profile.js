import { useColorScheme, View, Text } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";

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
  const queryclient = useQueryClient();
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
      setTimeout(() => {
        setSucess(false);
      }, 3000);
      setImage(null);
    },
    onError: () => {
      setImage(null);
      setError("An error occured");
      setTimeout(() => {
        setError(false);
      }, 3000);
    },
    mutationKey: "updateProfilePic",
  });

  const onSubmit = async () => {
    setVisible(false);
    mutation.mutate(image);
  };

  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 items-center bg-white  dark:bg-black ">
      {(mutation.isPending || isLoading) && <Loading />}

      <Header name="Profile Settings" />
      {sucess && <Text className="text-green-500">{sucess}</Text>}
      {error && <Text className="text-red-500">{error}</Text>}

      <View className="w-[99%]  flex-1  px-2    flex-row  justify-center  items-start   mt-2 flex ">
        <View className="w-[150px] h-[150px] flex items-center justify-center bg-gray-200 border-2 border-emerald-400 rounded-full">
          <Image
            source={{
              uri:
                `https://eduapi.senaycreatives.com/${data?.data?.profilePic}` ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
            }}
            className="w-[150px] h-[150px] bg-zinc-50 dark:bg-zinc-600 rounded-full"
          />

          <View className="w-[40px] h-[40px] bg-zinc-100 dark:bg-zinc-800 rounded-full absolute top-0 right-0">
            <TouchableOpacity
              onPress={() => pickImage()}
              className=" z-[30]   h-[40px] w-[40px] flex items-center justify-center bottom-0 right-0 bg-zinc-100 dark:bg-zinc-800 rounded-full"
            >
              <Feather
                name="camera"
                size={30}
                color={colorScheme === "light" ? "black" : "white"}
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
      />
    </View>
  );
}
