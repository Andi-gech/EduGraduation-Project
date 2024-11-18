import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <Stack initialRouteName="Home">
      <Stack.Screen name="Home" index options={{ headerShown: false }} />
      <Stack.Screen
        name="Id"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 200,
        }}
      />

      <Stack.Screen name="Permission" options={{ headerShown: false }} />
      <Stack.Screen name="RequestHistory" options={{ headerShown: false }} />
      <Stack.Screen name="Complain" options={{ headerShown: false }} />
      <Stack.Screen name="Clubs" options={{ headerShown: false }} />
      <Stack.Screen name="Assignment" options={{ headerShown: false }} />
      <Stack.Screen
        name="Notification"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 200,
        }}
      />
    </Stack>
  );
}
