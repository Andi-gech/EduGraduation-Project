import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack initialRouteName="librarysys">
      <Stack.Screen name="librarysys" options={{ headerShown: false }} />
    </Stack>
  );
}
