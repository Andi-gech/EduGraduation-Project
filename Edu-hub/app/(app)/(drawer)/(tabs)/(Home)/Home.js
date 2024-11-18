import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { Image } from "expo-image";
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
import { useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { setUserData } from "../../../../../Redux/actions";

import * as Notifications from "expo-notifications";

export default function Home() {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = UseFetchMyData();

  useEffect(() => {
    dispatch(
      setUserData({
        profilePic: data?.data?.profilePic,
        _id: data?.data?._id,
        firstName: data?.data?.firstName,
        department: data?.data?.Class?.department,
        yearLevel: data?.data?.Class?.yearLevel,
        semister: data?.data?.Class?.semister,
      })
    );
  }, [data?.data]);
  const {
    data: cafestatus,
    isError: isCafeStatusError,
    error: CafeStatusError,
  } = UseFetchCafeStatus();
  const [timeRemaining, setTimeRemaining] = useState(0);

  const isFirstFiveDaysOfMonth = new Date().getDate() <= 15;
  const isAlreadySubscribed = cafestatus?.data?.status;
  const blurhash = "L8Glk-009GQ+MvxoVDD$*J+uxu9E";
  const isCafeSubscribeBtnActive = useMemo(() => {
    return !cafestatus?.data?.status && isFirstFiveDaysOfMonth;
  }, [cafestatus, isFirstFiveDaysOfMonth]);

  useEffect(() => {
    const remainTime = calculateRemainingTime();
    setTimeRemaining(remainTime);

    const interval = setInterval(() => {
      setTimeRemaining(remainTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
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
  console.log(memoizedData);

  const profileImageUri = useMemo(
    () => `http://192.168.1.6:3000/${memoizedData?.profilePic}`,
    [memoizedData?.profilePic]
  );
  if (isError || isCafeStatusError) {
    return (
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.2]}
        className="flex-1 flex flex-col items-center justify-center "
      >
        <Ionicons name="sad" size={64} color="gray" />
        <Text className=" text-red-300 ">
          {error?.message || CafeStatusError?.message}
        </Text>
      </LinearGradient>
    );
  }
  return (
    <LinearGradient
      colors={["#010101", "#262626"]}
      locations={[0.0, 0.2]}
      className=" flex-1 flex items-center     flex-col"
    >
      <StatusBar style="light" />
      <View className="flex relative justify-between py-4 flex-col z-0 w-[98%]    rounded-md h-[250px] mt-2  px-2">
        <View className="w-full flex flex-row justify-between items-center z-50 px-1">
          <RoundButton onPress={() => navigation.openDrawer()} icon={"bars"} />
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="w-full z-50 h-[50px] flex flex-row  mt-[10px] items-center  px-2">
          {isLoading ? (
            <Skeleton
              colorMode="dark"
              radius={"round"}
              width={50}
              height={50}
            />
          ) : (
            <>
              {!profileImageUri ? (
                <Ionicons
                  name="person-circle-outline"
                  size={60}
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
              <Skeleton colorMode="dark" width={200} height={20} />
            ) : (
              <Text className="text-white text-[17px] font-bold ">
                {String(memoizedData?.firstName).toUpperCase()}{" "}
                {String(memoizedData?.lastName).toUpperCase()}
              </Text>
            )}

            {isLoading ? (
              <View className="mt-1">
                <Skeleton colorMode="dark" width={60} height={14} />
              </View>
            ) : (
              <Text className="text-zinc-400 text-[14px] mt-[1px] font-bold ">
                0008/12
              </Text>
            )}
            {isLoading ? (
              <View className=" mt-1">
                <Skeleton colorMode="dark" width={70} height={14} />
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
              <Skeleton colorMode="dark" width={167} height={30} />
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
            <Skeleton colorMode="dark" width={"100%"} height={15} />
          </View>
        ) : (
          <Marque />
        )}
      </View>

      <View className="w-[98%] pb-[64px] flex-1 bg-zinc-950 rounded-t-[40px] ">
        <View className=" w-full  h-[50px] items-center justify-center flex-col">
          {isLoading ? (
            <View className="my-2">
              <Skeleton colorMode="dark" width={10} height={10} />
            </View>
          ) : (
            <View className="w-[10px] h-[10px] bg-yellow-400 rounded-full"></View>
          )}
          {isLoading ? (
            <Skeleton colorMode="dark" width={100} height={15} />
          ) : (
            <Text className="text-white">Hub Essentials</Text>
          )}
        </View>
        <ScrollView className="w-full  mb-[0px]  ">
          <View className="w-full  mb-[0px] flex flex-row flex-wrap items-center  justify-center">
            {isCafeSubscribeBtnActive && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Permission")}
                className="w-[130px] h-[70px] rounded-md shrink-0  flex flex-col items-center justify-center bg-zinc-800 shadow-sm mx-2  mt-2"
              >
                <Ionicons name="cash-outline" size={24} color="white" />
                <Text className=" mt-2 text-white">Cafe Subscription</Text>
                <Text className="text-blue-400 absolute top-0 left-0 text-[12px] mt-[1px] font-bold ">
                  {formattedTime}
                </Text>
              </TouchableOpacity>
            )}
            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode="dark"
                  width={130}
                  height={70}
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
                  colorMode="dark"
                  width={130}
                  height={70}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name="Class"
                icon="school-outline"
                onpress={() => {
                  console.log("memo", memoizedData);
                  router.push({
                    pathname: "(class)",
                    params: {
                      semister: Number(memoizedData?.semester),
                      year: Number(memoizedData?.yearLevel),
                    },
                  });
                }}
              />
            )}

            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode="dark"
                  width={130}
                  height={70}
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
                  colorMode="dark"
                  width={130}
                  height={70}
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
                  colorMode="dark"
                  width={130}
                  height={70}
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
                  colorMode="dark"
                  width={130}
                  height={70}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name="library"
                icon="book-outline"
                onpress={() => navigation.navigate("(library)")}
              />
            )}

            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode="dark"
                  width={130}
                  height={70}
                  className="mt-2"
                />
              </View>
            ) : (
              <AppCard
                name={"Assignment"}
                icon={"folder-open-outline"}
                onpress={() => navigation.navigate("Assignment")}
              />
            )}
            {isLoading ? (
              <View className="mt-3 mx-2">
                <Skeleton
                  colorMode="dark"
                  width={130}
                  height={70}
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
        className=" absolute bottom-[62px] bg-zinc-900 right-[7px] rounded-md w-[50px] h-[50px]  flex items-center justify-center shadow-sm  shadow-gray-500"
      >
        <AntDesign name="qrcode" size={32} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}
