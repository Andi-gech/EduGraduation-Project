import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  View,
  useWindowDimensions,
  RefreshControl,
} from "react-native";

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

  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { data, isLoading, isError, error,refetch } = UseFetchMyData();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { height } = useWindowDimensions();
  const heightS = height > 700 ? 300 : 250;

  const accentColor = colorScheme === "dark" ? "#f59e0b" : "#3b82f6";



  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

   
  }, []);

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

  const { data: cafestatus, isError: isCafeStatusError } = UseFetchCafeStatus();
  const isFirstFiveDaysOfMonth = new Date().getDate() <= 31;
  const isAlreadySubscribed = cafestatus?.data?.status;
  const blurhash = "L8Glk-009GQ+MvxoVDD$*J+uxu9E";

  const isCafeSubscribeBtnActive = useMemo(() => 
    !isAlreadySubscribed && isFirstFiveDaysOfMonth,
    [cafestatus, isFirstFiveDaysOfMonth]
  );

  useEffect(() => {
    const remainTime = calculateRemainingTime();
    setTimeRemaining(remainTime);
    const interval = setInterval(() => setTimeRemaining(remainTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = useMemo(() => 
    formatDuration(timeRemaining),
    [timeRemaining]
  );

  const memoizedData = useMemo(() => data?.data, [data]);
  const profileImageUri = useMemo(
    () => `https://eduapi.senaycreatives.com/${memoizedData?.profilePic}`,
    [memoizedData?.profilePic]
  );


  if (isError || isCafeStatusError) {
    return (
      <View className="flex-1 bg-white dark:bg-zinc-900 items-center justify-center">
        <Ionicons name="sad" size={64} color="gray" />
        <Text className="text-red-300">
          {error?.message || "An error occurred"}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={
        colorScheme === "dark" ? ["#09090b", "#18181b"] : ["#4f46e5", "#0891b2"]
      }
      locations={[0.1, 0.9]}
      className="flex-1 items-center   pt-[20px] z-10 flex-col"
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="w-[98%] rounded-lg mt-2 px-2"
        style={{ 
          height: heightS,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }}
      >
        <View 
          className="absolute top-0 -right-10 w-[200px] h-full"
          from={{ rotate: '0deg' }}
          animate={{ rotate: '5deg' }}
          transition={{ loop: true, duration: 30000 }}
        >
          {[...Array(4)].map((_, rowIndex) =>
            [...Array(3)].map((_, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.box,
                  {
                    top: rowIndex * 50,
                    left: colIndex * 50,
                    backgroundColor: (rowIndex + colIndex) % 2 === 0 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.03)',
                  },
                ]}
                from={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1500 }}
              />
            ))
          )}
        </View>

        <View className="w-full flex-row justify-between items-center z-50 px-1 mb-4">
          <RoundButton
            onPress={() => navigation.openDrawer()}
            size={28}
            icon="bars"
            iconColor={accentColor}
          />
          <TouchableOpacity 
            onPress={() => navigation.navigate("Notification")}
            className="p-2 bg-white/10 rounded-full"
          >
            <Ionicons name="notifications-outline" size={24} color={accentColor} />
          </TouchableOpacity>
        </View>

        <View className="w-full z-50 h-[65px] flex-row items-center px-2">
          <View
            from={{ borderWidth: 0 }}
            animate={{ borderWidth: 2 }}
            transition={{ type: 'timing', duration: 1000, loop: true }}
            className="border-2 border-dashed rounded-full"
            style={{ borderColor: accentColor }}
          >
            {isLoading ? (
  <Skeleton radius="round" width={60} height={60} colorMode={colorScheme} />
) : memoizedData?.profilePic ? (
  <Image
    source={{ uri: profileImageUri }}
    placeholder={{ blurhash }}
    className="w-[60px] h-[60px] rounded-full"
  />
) : (
  <View className="w-[60px] h-[60px] rounded-full bg-zinc-200 dark:bg-zinc-700 items-center justify-center">
    <Ionicons name="person" size={50} color={accentColor} />
  </View>
)}


          </View>
          <View className="ml-3">
  {isLoading ? (
    <View className="space-y-1 ">
      <View className="mb-[5px]">
      <Skeleton 
        width={150} 
        height={24} 
        colorMode={colorScheme}
      

      />
      </View>
      <Skeleton 
        width={120} 
        height={20} 
        colorMode={colorScheme}
    

      />
    </View>
  ) : (
    <>
      <Text className="text-white text-xl font-extrabold tracking-wide">
        {String(memoizedData?.firstName).toUpperCase()}{" "}
        {String(memoizedData?.lastName).toUpperCase()}
      </Text>
      <View className="flex-row items-center space-x-2 mt-1">
        <Text className="text-zinc-300 text-sm font-medium">
          {memoizedData?.studentid}
        </Text>
        <View className="px-2 py-1 bg-white/10 rounded-full">
          <Text className="text-xs font-bold text-white">
            {memoizedData?.isMilitary ? "Military" : "Civilian"}
          </Text>
        </View>
      </View>
    </>
  )}
</View>
        </View>

        <View className="mt-4 flex-row items-center justify-between bg-white/10 p-3 rounded-2xl">
          <Text className="text-white font-semibold">Cafe Status:</Text>
          <View className="flex-row items-center space-x-2">
            <View className={`w-3 h-3 rounded-full ${isAlreadySubscribed ? 'bg-green-400' : 'bg-red-400'}`} />
            <Text className="text-white font-bold">
              {isAlreadySubscribed ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        <View className="mt-4 h-6 overflow-hidden">
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)', 'transparent']}
            className="absolute w-full h-full z-10"
          />
          <Marque />
        </View>
      </View>

      <View className="w-[98%] pb-[64px] flex-1 pt-6 bg-white dark:bg-zinc-900 rounded-t-[40px] shadow-2xl">
        <Text className="text-center text-2xl font-bold text-black dark:text-white mb-6">
          Hub Essentials
        </Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading}
              onRefresh={
                () => {
                  refetch();
                  setTimeRemaining(calculateRemainingTime());
                }
              }
              colors={[accentColor]}
            />
          }
         
        >
          <View className="flex-row flex-wrap justify-center ">
            {isCafeSubscribeBtnActive && !isLoading && (
             <AppCard 
                name="Cafe Subscription" 
                icon="cafe" 
                type="limited"
                countDown={formattedTime}
                onpress={() => navigation.navigate("Subscribe")} 
                accentColor={accentColor}
              />
            )}

            {[
              { name: "Grade Calcualtor", icon: "calculator", screen: "GradeCalculator" ,type:"new" },
              { name: 'Permission', icon: 'people-outline', screen: 'Permission' },
              { name: 'Class', icon: 'school-outline', screen: '(class)' },
              { name: 'Complain', icon: 'megaphone-outline', screen: 'Complain' },
              { name: 'Connect', icon: 'chatbox-outline', screen: '(connectS)' },
              { name: 'Resource', icon: 'document-text-outline', screen: '(resource)' },
              { name: 'Clubs And Socials', icon: 'share-social-outline', screen: 'Clubs' },
            ].map((card, index) => (
              <View
                key={card.name}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 50 }}
              >
                <AppCard
                  name={card.name}
                  icon={card.icon}
                  onpress={() => navigation.navigate(card.screen)}
                  accentColor={accentColor}
                  type={card.type}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="absolute z-[300] bottom-[60px] right-4"
      >
        <TouchableOpacity
          className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-xl items-center justify-center shadow-lg"
          style={{
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            zIndex: 100,
          }}
          onPress={() => navigation.navigate("Id")}
        >
          <AntDesign name="qrcode" size={32} color={accentColor} />
        </TouchableOpacity>
      </View>

      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    width: 50,
    height: 50,
    transform: [{ rotate: "45deg" }],
  },
});