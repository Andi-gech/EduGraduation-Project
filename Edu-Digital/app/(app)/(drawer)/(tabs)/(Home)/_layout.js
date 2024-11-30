import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack initialRouteName="Home">
      <Stack.Screen
        name="Home"
        index
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="Id"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 200,
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="Permission"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 20,
        }}
      />
      <Stack.Screen
        name="RequestHistory"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 20,
        }}
      />
      <Stack.Screen
        name="Complain"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="Clubs"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="Assignment"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="Notification"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 200,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="Subscribe"
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
