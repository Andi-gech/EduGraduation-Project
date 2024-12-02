import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="ResetPassword1"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ResetPassword1" options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword2" options={{ headerShown: false }} />
    </Stack>
  );
}
