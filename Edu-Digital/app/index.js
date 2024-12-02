import React from "react";
import { useColorScheme, View } from "react-native";
import { isAuthenticated } from "../utils/auth";
import { StatusBar } from "expo-status-bar";
import Loading from "../Components/Loading";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isLoggedIn = isAuthenticated();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.push("/(Auth)/Startup");
    } else if (isLoggedIn) {
      router.replace("/(app)/Home");
    }
  }, [isLoggedIn, segments, navigationState?.key]);

  return (
    <View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {!navigationState?.key ? <Loading /> : <></>}
    </View>
  );
};
export default Index;
