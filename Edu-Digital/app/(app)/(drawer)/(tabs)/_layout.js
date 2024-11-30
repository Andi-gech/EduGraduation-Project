import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="(Home)"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display: "flex",
          position: "absolute",
          flexDirection: "row",

          left: 0,

          borderTopWidth: 0.3,
          borderTopColor: colorScheme === "dark" ? "#3C3C3C" : "#E0E0DF",
          height: 55,
          overflow: "hidden", // To ensure rounded corners work
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={
              colorScheme === "light"
                ? ["white", "white"]
                : ["#262626", "#010101"]
            }
            locations={[0.0, 0.8]}
            style={{ flex: 1 }}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="(Home)"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View
              className={
                focused
                  ? `h-[60px] w-[60px] flex pt-5 items-center justify-center  border-t-[1px] border-zinc-500`
                  : "h-[60px] w-[60px] flex pt-5 items-center justify-center   "
              }
            >
              <Ionicons
                size={20}
                name="home-outline"
                color={
                  focused
                    ? `${colorScheme === "light" ? "#0B71A8" : "white"}`
                    : `${colorScheme === "light" ? "black" : "gray"}`
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Calander"
        options={{
          title: "Calander",
          tabBarIcon: ({ focused }) => (
            <View
              className={
                focused
                  ? `h-[60px] w-[60px]  relative flex pt-5 items-center justify-center  border-t-[1px] border-zinc-500`
                  : "h-[60px] w-[60px] flex pt-5 items-center justify-center   "
              }
            >
              <Ionicons
                size={20}
                name="calendar-outline"
                color={
                  focused
                    ? `${colorScheme === "light" ? "#0B71A8" : "white"}`
                    : `${colorScheme === "light" ? "black" : "gray"}`
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(news)"
        options={{
          title: "(news)",
          tabBarIcon: ({ focused }) => (
            <View
              className={
                focused
                  ? `h-[60px] w-[60px] flex pt-5 items-center justify-center  border-t-[1px] border-zinc-500`
                  : "h-[60px] w-[60px] flex pt-5 items-center justify-center   "
              }
            >
              <FontAwesome
                size={20}
                name="share-alt"
                color={
                  focused
                    ? `${colorScheme === "light" ? "#0B71A8" : "white"}`
                    : `${colorScheme === "light" ? "black" : "gray"}`
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="About"
        options={{
          title: "About",
          tabBarIcon: ({ focused }) => (
            <View
              className={
                focused
                  ? `h-[60px] w-[60px] flex pt-5 items-center justify-center  border-t-[1px] border-zinc-500`
                  : "h-[60px] w-[60px] flex pt-5 items-center justify-center   "
              }
            >
              <Ionicons
                size={20}
                name={"map-outline"}
                color={
                  focused
                    ? `${colorScheme === "light" ? "#0B71A8" : "white"}`
                    : `${colorScheme === "light" ? "black" : "gray"}`
                }
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
