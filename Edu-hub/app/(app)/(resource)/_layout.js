import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack initialRouteName="resources">
      <Stack.Screen name="resources" options={{ headerShown: false }} />
    </Stack>
  );
}
