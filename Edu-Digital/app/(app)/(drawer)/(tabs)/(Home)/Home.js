import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { Image, ImageBackground } from "expo-image";
import RoundButton from "../../../../../Components/RoundButton";

import { Ionicons, AntDesign } from "@expo/vector-icons";

import { useNavigation, useRouter } from "expo-router";
import UseFetchMyData from "../../../../../hooks/UseFetchMyData";
import { Skeleton } from "moti/skeleton";
import UseFetchCafeStatus from "../../../../../hooks/UseFetchCafeStatus";
import { LinearGradient } from "expo-linear-gradient";
import calculateRemainingTime from "../../../../../utils/calculateRemainingTime";
import formatDuration from "../../../../../utils/formatDuration";
import AppCard from "../../../../../Components/AppsCard";
import Marque from "../../../../../Components/Marque";
import TutorialModal from "../../../../../Components/TutorialModal";
import { useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { setUserData } from "../../../../../Redux/actions";

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { data, isLoading, isError, error } = UseFetchMyData();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { height } = useWindowDimensions();
  const heightS = height > 700 ? 300 : 250;

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const firstTime = await AsyncStorage.getItem("firstTime");

        if (!firstTime) {
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Error checking first time:", error);
      }
    };
    checkFirstTime();
  }, []);
  const handleCloseModal = async () => {
    try {
      await AsyncStorage.setItem("firstTime", "true"); // Save that the user has seen the modal
      setModalVisible(false);
    } catch (error) {
      console.error("Error setting first time:", error);
    }
  };
  useEffect(() => {
    dispatch(
      setUserData({
        profilePic: data?.data?.profilePic,
        _id: data?.data?._id,
        firstName: data?.data?.firstName,
        department: data?.data?.Class?.department,
        yearLevel: data?.data?.Class?.yearLevel,
        semister: data?.data?.Class?.semister,
        class: data?.data?.Class?._id,
      })
    );
  }, [data?.data]);

  const {
    data: cafestatus,
    isError: isCafeStatusError,
    error: CafeStatusError,
  } = UseFetchCafeStatus();

  const isFirstFiveDaysOfMonth = new Date().getDate() <= 5;
  const isAlreadySubscribed = cafestatus?.data?.status;
  const blurhash = "L8Glk-009GQ+MvxoVDD$*J+uxu9E";
  const isCafeSubscribeBtnActive = useMemo(() => {
    return !isAlreadySubscribed && isFirstFiveDaysOfMonth;
  }, [cafestatus, isFirstFiveDaysOfMonth]);

  useEffect(() => {
    const remainTime = calculateRemainingTime();
    setTimeRemaining(remainTime);

    const interval = setInterval(() => {
      setTimeRemaining(remainTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const { width } = useWindowDimensions();

  const cardWidth = width > 400 ? 150 : 130;
  const cardHeight = 80;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  const formattedTime = useMemo(
    () => formatDuration(timeRemaining),
    [timeRemaining]
  );
  const memoizedData = useMemo(() => data?.data, [data]);

  const profileImageUri = useMemo(
    () => `http://eduapi.senaycreatives.com/${memoizedData?.profilePic}`,
    [memoizedData?.profilePic]
  );

  if (isError || isCafeStatusError) {
    return (
      <View className="flex-1 flex bg-white dark:bg-zinc-900 flex-col items-center justify-center ">
        <Ionicons name="sad" size={64} color="gray" />
        <Text className=" text-red-300 ">
          {error?.message || CafeStatusError?.message}
        </Text>
      </View>
    );
  }
  return (
    <LinearGradient
      colors={
        colorScheme === "dark" ? ["#010101", "#262626"] : ["#795548", "#011B29"]
      }
      locations={[0.0, 0.4]}
      className=" flex-1 flex items-center     flex-col"
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {isModalVisible && (
        <TutorialModal visible={true} onClose={handleCloseModal} />
      )}
      <View
        className={`flex relative justify-between py-4 flex-col z-0 w-[98%]    rounded-md  mt-2  px-2`}
        style={{ height: heightS }}
      >
        <View className="absolute top-0 -right-10  w-[200px]   h-full ">
          {[...Array(4)].map((_, rowIndex) =>
            [...Array(3)].map((_, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.box,
                  {
                    top: rowIndex * 50,
                    left: colIndex * 50,

                    backgroundColor:
                      (rowIndex + colIndex) % 2 === 0
                        ? "rgba(224, 224, 224, 0.3)"
                        : "rgba(240, 240, 240, 0.05)",
                  },
                ]}
              />
            ))
          )}
        </View>
        <View className="w-full flex flex-row justify-between items-center z-50 px-1">
          <RoundButton
            onPress={() => navigation.openDrawer()}
            size={23}
            icon={"bars"}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={23} color="white" />
          </TouchableOpacity>
        </View>

        <View className="w-full z-50 h-[65px] flex flex-row  mt-[10px] items-center  px-2">
          {isLoading ? (
            <Skeleton
              colorMode={colorScheme}
              radius={"round"}
              width={50}
              height={50}
            />
          ) : (
            <>
              {!memoizedData?.profilePic ? (
                <Ionicons
                  name="person-circle-outline"
                  size={65}
                  className="bg-white rounded-full w-[60px] h-[60px]"
                  color="white"
                />
              ) : (
                <Image
                  source={{
                    uri: profileImageUri,
                  }}
                  placeholder={{ blurhash }}
                  className="w-[60px] bg-zinc-600 rounded-full h-[60px]"
                />
              )}
            </>
          )}

          <View className=" flex  flex-col ml-2">
            {isLoading ? (
              <Skeleton colorMode={colorScheme} width={200} height={20} />
            ) : (
              <Text className="text-white text-[17px] font-bold ">
                {String(memoizedData?.firstName).toUpperCase()}{" "}
                {String(memoizedData?.lastName).toUpperCase()}
              </Text>
            )}

            {isLoading ? (
              <View className="mt-1">
                <Skeleton colorMode={colorScheme} width={60} height={14} />
              </View>
            ) : (
              <Text className="text-zinc-400 text-[14px] mt-[1px] font-bold ">
                {memoizedData?.studentid}
              </Text>
            )}
            {isLoading ? (
              <View className=" mt-1">
                <Skeleton colorMode={colorScheme} width={70} height={14} />
              </View>
            ) : (
              <View className="   flex items-start justify-center mt-[4px] rounded-full">
                <Text className="text-white text-[12px] font-bold  ">
                  {memoizedData?.isMilitary ? "Military" : "Civilian"}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="flex z-20 flex-row justify-between w-full px-1 ">
          {isLoading ? (
            <View className="   mt-[10px]  mx-2">
              <Skeleton colorMode={colorScheme} width={167} height={30} />
            </View>
          ) : (
            <View className="w-[167px]  h-[20px]  flex flex-row  mt-[10px]  items-center  justify-center ">
              <Text className="text-white text-[15px] font-bold ">
                Cafe Status:
              </Text>
              <View className={` h-[10px]rounded-full ml-1`}>
                <Text className="text-white">
                  {isAlreadySubscribed ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          )}
        </View>
        {isLoading ? (
          <View className="-mb-[10px]">
            <Skeleton colorMode={colorScheme} width={"100%"} height={15} />
          </View>
        ) : (
          <Marque />
        )}
      </View>

      <View className="w-[98%] pb-[64px] flex-1  pt-5 bg-white dark:bg-black rounded-t-[40px] ">
        <View className=" w-full  h-[50px] items-center justify-center flex-col">
          {isLoading ? (
            <View className="my-2">
              <Skeleton colorMode={colorScheme} width={10} height={10} />
            </View>
          ) : (
            <View className="w-[10px] h-[10px] bg-yellow-400 rounded-full"></View>
          )}
          {isLoading ? (
            <Skeleton colorMode={colorScheme} width={100} height={15} />
          ) : (
            <Text className=" text-black dark:text-white">Hub Essentials</Text>
          )}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full  mb-[0px]  "
        >
          <View className="w-full  mb-[0px] flex flex-row flex-wrap items-center  justify-center">
            {isCafeSubscribeBtnActive && !isLoading && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Subscribe")}
                className="w-[130px] h-[70px] rounded-md shrink-0  flex flex-col items-center justify-center  bg-zinc-100 dark:bg-zinc-800 shadow-sm mx-2  mt-2"
              >
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
                <Text className=" mt-2 text-black dark:text-white">
                  Cafe Subscription
                </Text>
                <Text className="text-blue-400 absolute top-0 left-0 text-[12px] mt-[1px] font-bold ">
                  {formattedTime}
                </Text>
              </TouchableOpacity>
            )}
            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode={colorScheme}
                  width={cardWidth}
                  height={cardHeight}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name={"Permission"}
                icon={"people-outline"}
                onpress={() => navigation.navigate("Permission")}
              />
            )}
            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode={colorScheme}
                  width={cardWidth}
                  height={cardHeight}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name="Class"
                icon="school-outline"
                onpress={() => {
                  router.push({
                    pathname: "(class)",
                    params: {
                      department: memoizedData?.Class?.department
                        ? memoizedData?.Class?.department
                        : "CSE",
                      year: memoizedData?.Class?.yearLevel
                        ? memoizedData?.Class?.yearLevel
                        : 1,
                      semister: memoizedData?.Class?.semister
                        ? memoizedData?.Class?.semister
                        : 1,
                    },
                  });
                }}
              />
            )}

            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode={colorScheme}
                  width={cardWidth}
                  height={cardHeight}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name={"Complain"}
                icon={"megaphone-outline"}
                onpress={() => navigation.navigate("Complain")}
              />
            )}

            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode={colorScheme}
                  width={cardWidth}
                  height={cardHeight}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name={"Connect"}
                icon={"chatbox-outline"}
                onpress={() => navigation.navigate("(connectS)")}
              />
            )}

            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode={colorScheme}
                  width={cardWidth}
                  height={cardHeight}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name={"Resource"}
                icon={"document-text-outline"}
                onpress={() => navigation.navigate("(resource)")}
              />
            )}

            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode={colorScheme}
                  width={cardWidth}
                  height={cardHeight}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name={"Clubs And Socials"}
                icon={"share-social-outline"}
                onpress={() => navigation.navigate("Clubs")}
              />
            )}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Id");
        }}
        className=" absolute bottom-[62px] bg-zinc-50 dark:bg-zinc-900 right-[7px] rounded-md w-[50px] h-[50px]  flex items-center justify-center shadow-sm  shadow-gray-300 dark:shadow-gray-500"
      >
        <AntDesign
          name="qrcode"
          size={32}
          color={colorScheme === "light" ? "black" : "white"}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  pattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    right: 0,
  },
  box: {
    position: "absolute",
    width: 50,
    height: 50,
    transform: [{ rotate: "45deg" }],
  },
});
