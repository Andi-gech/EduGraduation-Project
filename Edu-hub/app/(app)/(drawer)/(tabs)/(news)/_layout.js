import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack initialRouteName="News">
      <Stack.Screen name="News" index options={{ headerShown: false }} />

      <Stack.Screen
        name="AddPost"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 200,
        }}
      />
    </Stack>
  );
}
