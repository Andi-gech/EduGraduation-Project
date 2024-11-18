import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack
      initialRouteName="Connect"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Connect" index options={{ headerShown: false }} />
      <Stack.Screen name="AskChat" index options={{ headerShown: false }} />
      <Stack.Screen name="ClassChat" index options={{ headerShown: false }} />
    </Stack>
  );
}
