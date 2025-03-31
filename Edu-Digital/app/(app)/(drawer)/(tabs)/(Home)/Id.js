import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme,
  ImageBackground
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { FontAwesome5, Ionicons } from "@expo/vector-icons";


import logo from "../../../../../assets/logo.png";
import ethiopia from "../../../../../assets/th (2).jpeg";
import UseFetchQrCode from "../../../../../hooks/UseFetchQrcode";
import Header from "../../../../../Components/Header";
import ErrorMessage from "../../../../../Components/ErrorMessage";
import Loading from "../../../../../Components/Loading";

export default function Id() {
  const { data, isError, error, isLoading } = UseFetchQrCode();
  const frontShotRef = useRef(null);
  const backShotRef = useRef(null);
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";

  const handleCapture = async () => {
    try {
      const frontPath = `${FileSystem.documentDirectory}front-page.png`;
      const backPath = `${FileSystem.documentDirectory}back-page.png`;

      const frontUri = await frontShotRef.current.capture({
        result: "file",
        path: frontPath,
      });

      const backUri = await backShotRef.current.capture({
        result: "file",
        path: backPath,
      });

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
      colors={colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#f8fafc", "#e2e8f0"]}
      className="flex-1 pt-[20px]"
    >
      <Header name={"Digital ID Card"} />
      
      {isError && (
        <View
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 items-center justify-center p-8"
        >
          <FontAwesome5
            name="id-card"
            size={64}
            color={accentColor}
            className="mb-6"
          />
          <ErrorMessage type={"notice"} content={error.response.data} />
        </View>
      )}

      {isLoading && <Loading />}

      {data?.data && (
        <ScrollView className="flex-1 p-2" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Front ID Card */}
          <View
            from={{ translateY: 50, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="mb-6"
          >
            <Text className="text-lg font-bold text-zinc-600 dark:text-zinc-300 mb-3">
              Front Side
            </Text>
            
            <ViewShot ref={frontShotRef} options={{ format: "png", quality: 1 }}>
              <View className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                <LinearGradient
                  colors={["rgb(92, 61, 31)", "rgb(32, 31, 31)"]}
                  className="p-4 flex-row items-center justify-between"
                >
                  <Image
                    source={logo}
                    className="w-12 h-12 rounded-lg"
                  />
                  <View className="flex-1 mx-4">
                    <Text className="text-white font-bold text-center text-sm">
                      Ethiopian Defence University
                    </Text>
                    <Text className="text-white text-xs text-center mt-1">
                      የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
                    </Text>
                  </View>
                  <Image source={ethiopia} className="w-16 h-8" />
                </LinearGradient>

                <View className="flex-row p-4 bg-white/90 dark:bg-zinc-800/90">
                  <View className="relative">
                    <Image
                      source={{ uri: `https://eduapi.senaycreatives.com/${data?.data?.Photo}` }}
                      className="w-28 h-36 rounded-lg border-2 border-orange-500"
                    />
                   
                  </View>

                  <View className="flex-1 ml-4">
                    <View className="mb-3">
                      <Text className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                        ሙሉ ስም / FULL NAME
                      </Text>
                      <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {data?.data?.AmharicFirstName.toUpperCase()}
                      </Text>
                      <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {data?.data?.AmharicLastName.toUpperCase()}
                      </Text>
                      <Text className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        {data?.data?.EnglishFirstName.toUpperCase()}{" "}
                        {data?.data?.EnglishLastName.toUpperCase()}
                      </Text>
                    </View>

                    <View className="flex-row justify-between flex-wrap">
                      <View className="mb-2">
                        <Text className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                          ጾታ / GENDER
                        </Text>
                        <Text className="text-sm text-zinc-800 dark:text-zinc-300">
                          {data?.data.Gender.toUpperCase()}
                        </Text>
                      </View>

                      <View className="mb-2">
                        <Text className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                          ISSUED DATE
                        </Text>
                        <Text className="text-sm text-zinc-800 dark:text-zinc-300">
                          {new Date(data?.data.DateOfIssue).toLocaleDateString()}
                        </Text>
                      </View>

                      <View>
                        <Text className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                          EXPIRY DATE
                        </Text>
                        <Text className="text-sm text-zinc-800 dark:text-zinc-300">
                          {new Date(data?.data.DateOfExpiry).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ViewShot>
          </View>

          {/* Back ID Card */}
          <View
            from={{ translateY: 50, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 100 }}
          >
            <Text className="text-lg font-bold text-zinc-600 dark:text-zinc-300 mb-3">
              Back Side
            </Text>
            
            <ViewShot ref={backShotRef} options={{ format: "png", quality: 1 }}>
              <View className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xl p-6 items-center">
                <View className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl">
                  <Image
                    source={{ uri: data?.data?.Qr }}
                    className="w-48 h-48"
                  />
                </View>
                <Text className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mt-4">
                  Scan QR Code to Verify Authenticity
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                  This QR code contains encrypted student information
                </Text>
              </View>
            </ViewShot>
          </View>

          {/* Share Button */}
          <View
            from={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 200 }}
            className="mt-8"
          >
            <TouchableOpacity
              className="flex-row items-center justify-center bg-orange-500 dark:bg-orange-600 p-4 rounded-2xl shadow-lg"
              onPress={handleCapture}
            >
              <Ionicons name="share-social" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                Share ID Card
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}