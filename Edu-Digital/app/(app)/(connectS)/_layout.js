import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack
      initialRouteName="Connect"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Connect"
        index
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="AskChat"
        index
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="ClassChat"
        index
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
    </Stack>
  );
}
