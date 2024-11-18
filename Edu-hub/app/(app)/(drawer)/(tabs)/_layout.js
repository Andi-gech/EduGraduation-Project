import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Layout() {
  return (
    <Tabs
      initialRouteName="(Home)"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display: "flex",
          position: "absolute",

          elevation: 10,
          left: 0,

          borderTopWidth: 0.3,
          borderTopColor: "black",
          height: 60,
          overflow: "hidden", // To ensure rounded corners work
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={["#262626", "#010101"]}
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
                  ? `h-[60px] w-[60px] flex items-center justify-center border-t-[1px] border-zinc-500`
                  : ""
              }
            >
              <Ionicons
                size={20}
                name="home-outline"
                color={focused ? "white" : "gray"}
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
                  ? `h-[60px] w-[60px] flex items-center justify-center border-t-[1px] border-zinc-500`
                  : ""
              }
            >
              <Ionicons
                size={20}
                name="calendar-outline"
                color={focused ? "white" : "gray"}
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
                  ? `h-[60px] w-[60px] flex items-center justify-center border-t-[1px] border-zinc-500`
                  : ""
              }
            >
              <FontAwesome
                size={20}
                name="share-alt"
                color={focused ? "white" : "gray"}
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
                  ? `h-[60px] w-[60px] flex items-center justify-center border-t-[1px] border-zinc-500`
                  : ""
              }
            >
              <Ionicons
                size={20}
                name={"map-outline"}
                color={focused ? "white" : "gray"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
