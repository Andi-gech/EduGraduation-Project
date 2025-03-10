import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack
      initialRouteName="Classes"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Classes" index options={{ headerShown: false }} />
      <Stack.Screen
        name="ClassSchedule"
        index
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pay"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 200,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
