import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomDrawerContent from "../../../Components/Drawercontent";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={(props) => CustomDrawerContent(props)}
        screenOptions={{
          headerShown: false,

          drawerStyle: {
            backgroundColor: colorScheme === "light" ? "black" : "white",
          },
          drawerLabelStyle: {
            color: colorScheme === "light" ? "black" : "white",
            marginTop: 10,
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "Home",

            drawerIcon: ({ color, size, focused }) => (
              <FontAwesome
                name="home"
                color={
                  focused
                    ? "orange"
                    : `${colorScheme === "light" ? "black" : "white"}`
                }
                size={size}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          options={{
            title: "Profile",
            drawerIcon: ({ color, size, focused }) => (
              <FontAwesome
                name="user"
                color={
                  focused
                    ? "orange"
                    : focused
                    ? "orange"
                    : `${colorScheme === "light" ? "black" : "white"}`
                }
                size={size}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
