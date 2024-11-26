import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import NotificationCard from "../../../../../Components/NotificationCard";
import Headers from "../../../../../Components/Header";
import UseFetchNotification from "../../../../../hooks/UseFetchNotification";
import IsLoading from "../../../../../Components/Loading";
export default function Notification() {
  const { data, isLoading } = UseFetchNotification();

  return (
    <View className="flex-1 px-2 flex items-center bg-white  dark:bg-black duration-75 transition-all ease-in-out   flex-col">
      <Headers name="Notification" />
      {isLoading && <IsLoading />}
      {data?.data && (
        <ScrollView
          className="w-full  flex  mb-[80px]  flex-col "
          showsVerticalScrollIndicator={false}
        >
          <Text className="  text-black dark:text-white  font-semibold my-2 text-[18px]">
            General
          </Text>
          <View className=" w-full flex flex-col items-center justify-center  min-h-[100px]">
            {data?.data
              ?.filter((item) => item.type == "General")
              .map((item) => (
                <NotificationCard key={item._id} data={item} />
              ))}
            {data?.data?.filter((item) => item.type == "General") == 0 && (
              <Text className="  text-black dark:text-white">
                No Notification
              </Text>
            )}
          </View>
          <Text className="  text-black dark:text-white  font-semibold my-2 text-[18px]">
            Announcment
          </Text>
          <View className=" w-full flex flex-col items-center  justify-center  min-h-[100px]">
            {data?.data
              ?.filter((item) => item.type == "Announcment")
              .map((item) => (
                <NotificationCard key={item._id} data={item} />
              ))}
            {data?.data?.filter((item) => item.type == "Announcment") == 0 && (
              <Text className="  text-black dark:text-white">
                No Notification
              </Text>
            )}
          </View>
          <Text className="  text-black dark:text-white  font-semibold my-2 text-[18px]">
            Notice
          </Text>
          <View className=" w-full flex-col flex items-center justify-center  min-h-[100px]">
            {data?.data
              ?.filter((item) => item.type == "Notice")
              .map((item) => (
                <NotificationCard key={item._id} data={item} />
              ))}
            {data?.data?.filter((item) => item.type == "Notice") == 0 && (
              <Text className="  text-black dark:text-white">
                No Notification
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
