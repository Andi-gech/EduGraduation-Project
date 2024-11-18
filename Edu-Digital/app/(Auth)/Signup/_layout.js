import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="Signup_step1"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Signup_step1" options={{ headerShown: false }} />
      <Stack.Screen name="Signup_step2" options={{ headerShown: false }} />
      <Stack.Screen name="Verification" options={{ headerShown: false }} />
    </Stack>
  );
}
