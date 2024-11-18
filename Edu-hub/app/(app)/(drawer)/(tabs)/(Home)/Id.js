import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import pattern from "../../../../../assets/Pattern (1).png";
import logo from "../../../../../assets/logo.png";
import ethiopia from "../../../../../assets/th (2).jpeg";
import UseFetchQrCode from "../../../../../hooks/UseFetchQrcode";
import UseFetchMyData from "../../../../../hooks/UseFetchMyData";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../../../Components/Header";

export default function Id() {
  const { data } = UseFetchQrCode();
  const { data: userdata } = UseFetchMyData();

  const navigation = useNavigation();
  const frontShotRef = useRef(null);
  const backShotRef = useRef(null);

  const date = new Date(userdata?.data?.date);
  const formattedDate = date.toLocaleDateString("en-GB");

  const handleCapture = async () => {
    try {
      // Define the file paths where images will be saved
      const frontPath = `${FileSystem.documentDirectory}front-page.png`;
      const backPath = `${FileSystem.documentDirectory}back-page.png`;

      // Capture front page
      const frontUri = await frontShotRef.current.capture({
        result: "file", // Save directly to file
        path: frontPath,
      });

      // Capture back page
      const backUri = await backShotRef.current.capture({
        result: "file",
        path: backPath,
      });

      // Share the images
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(frontUri);
        await Sharing.shareAsync(backUri);
      } else {
        Alert.alert("Success", "Images saved but sharing is not available");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while capturing the ID pages");
    }
  };

  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.6]}
      className="flex bg-black "
    >
      <Header name={"ID CARD"} />
      <ScrollView className="  mb-[80px]  flex  flex-col">
        <View className="w-[99%] h-[220px] mb-[420px] flex items-center">
          <View className="flex w-[99%] my-2 ">
            <Text className="font-bold text-white text-[20px]">Front Page</Text>
          </View>

          {/* Front Page Capture */}
          <ViewShot ref={frontShotRef} options={{ format: "png", quality: 1 }}>
            <View className="w-[95%] h-[220px] shadow-md overflow-hidden relative rounded-md  bg-zinc-100">
              <View className="w-full h-[50px] bg-gray-100 px-2 flex-row justify-between z-0 bg-opacity-30 flex items-center">
                <Image
                  source={logo}
                  className="w-[40px] h-[40px] rounded-full"
                />
                <View className="flex flex-col items-center">
                  <Text className="text-black text-[10px] font-extrabold">
                    Ethiopian Defence University
                  </Text>
                  <Text className="text-black text-[10px] font-sm">
                    የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
                  </Text>
                  <Text className="text-black text-[10px]  font-extrabold">
                    Student ID Card
                  </Text>
                </View>
                <Image source={ethiopia} className="w-[60px] h-[30px]" />
              </View>

              <View className="flex flex-row w-full">
                <Image
                  source={{
                    uri: `http://192.168.1.6:3000/${data?.data?.darkenedProfilePic}`,
                  }}
                  className="w-[110px] ml-2 h-[130px] z-0 mt-3 "
                />
                <View className="flex relative flex-1 items-center grayscale justify-center">
                  <ImageBackground
                    className="w-full brightness-0 z-10 grayscale opacity-5 absolute h-full"
                    source={logo}
                  />
                  <View className="w-full flex flex-col ml-[40px]">
                    <Text className="text-orange-800 font-bold text-[8px] mt-[20px]">
                      ሙሉ ስም/FullName
                    </Text>

                    <Text className="text-black font-bold text-[10px]">
                      {data?.data?.userdata.name.toUpperCase()}
                    </Text>

                    <Text className="text-orange-800 font-bold text-[8px] mt-1">
                      ጾታ/Gender
                    </Text>
                    <Text className="text-black font-bold text-[11px]">
                      {data?.data?.userdata.gender}
                    </Text>
                    <Text className="text-orange-800 font-bold text-[8px] mt-1">
                      የተሰጠ ቀን/ Date Issued
                    </Text>
                    <Text className="text-black font-bold text-[11px]">
                      {formattedDate}
                    </Text>
                    <Text className="text-orange-800 font-bold text-[8px] mt-1">
                      ጊዜው የሚያበቃበት ቀን/ Expire Date
                    </Text>
                    <Text className="text-black font-bold text-[11px]">
                      {data?.data?.userdata.expiredDate}
                    </Text>
                  </View>
                </View>
              </View>
              <ImageBackground
                className="absolute w-full h-full z-40"
                source={pattern}
              />
            </View>
          </ViewShot>

          <View className="flex w-[99%] my-2">
            <Text className="font-bold text-white text-[20px]">Back Page</Text>
          </View>

          {/* Back Page Capture */}
          <ViewShot
            ref={backShotRef}
            className="w-full flex items-center"
            options={{ format: "png", quality: 1 }}
          >
            <View className="w-[95%] h-[220px] shadow-md flex items-center justify-center overflow-hidden relative rounded-md bg-zinc-100">
              <View className=" flex items-center justify-center h-full">
                <Image
                  source={{ uri: data?.data?.qrurl }}
                  className="w-[200px] h-[200px]"
                />
                <Text className="text-black font-bold text-[11px]">
                  Scan QR Code to Get Details
                </Text>
              </View>
            </View>
          </ViewShot>

          <TouchableOpacity
            className="w-[200px] h-[50px] rounded-md mt-[10px] flex items-center justify-center bg-purple-400"
            onPress={handleCapture}
          >
            <Text className="text-white font-bold">Print</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
