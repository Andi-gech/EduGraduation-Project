import { Text, View } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import RoundButton from "../../../Components/RoundButton";

import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import ImagePickerModal from "../../../Components/ImagePickerModal";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UseFetchMyData from "../../../hooks/UseFetchMyData";
import * as FileSystem from "expo-file-system";
import Loading from "../../../Components/Loading";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Components/Header";

export default function Profile() {
  const [image, setImage] = useState(null);
  const [, setImagefile] = useState(null);
  const [Loadings, setLoading] = useState(false);
  const { data } = UseFetchMyData();

  const pickImage = async () => {
    console.log("image");
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result);
      setImagefile(result.assets[0]);
    }
  };
  const queryclient = useQueryClient();
  const onSubmit = async () => {
    try {
      console.log("statinng ");
      setLoading(true);
      const response = await FileSystem.uploadAsync(
        `http://192.168.1.6:3000/user/updateProfilePic`,
        image,
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
      console.log(JSON.stringify(response, null, 4), "sucess");
      setLoading(false);
      queryclient.invalidateQueries("me");

      setImage(null);
    } catch (error) {
      console.log(error, "error");
      setImage(null);
    }
  };
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 1]}
      className="flex-1 items-center  "
    >
      {Loadings && <Loading />}
      <Header name="Profile Settings" />
      <View className="w-[99%]  flex-1  px-2    flex-row  justify-center  items-start   mt-2 flex ">
        <View className="w-[150px] h-[150px] flex items-center justify-center bg-gray-200 border-2 border-emerald-400 rounded-full">
          <Image
            source={{
              uri:
                `http://192.168.1.6:3000/${data?.data?.profilePic}` ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
            }}
            className="w-[150px] h-[150px] bg-zinc-600 rounded-full"
          />
          <View className="w-[40px] h-[40px] bg-zinc-800 rounded-full absolute top-0 right-0">
            <TouchableOpacity
              onPress={() => pickImage()}
              className=" z-[30]   h-[40px] w-[40px] flex items-center justify-center bottom-0 right-0 bg-gray-800 rounded-full"
            >
              <Feather name="camera" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ImagePickerModal
        onupdate={onSubmit}
        onclose={() => setImage(null)}
        image={image}
        visible={!!image}
      />
    </LinearGradient>
  );
}
