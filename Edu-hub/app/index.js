import { useRootNavigationState, useRouter, useSegments } from "expo-router";

import React from "react";
import { Text, View } from "react-native";
import { isAuthenticated } from "../utils/auth";
import Loading from "../Components/Loading";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const isLoggedIn = isAuthenticated();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to the login page.
      console.log("redirecting to login");
      router.push("/(Auth)/Startup");
    } else if (isLoggedIn) {
      // go to tabs root.
      router.replace("/(app)/Home");
    }
  }, [isLoggedIn, segments, navigationState?.key]);

  return <View>{!navigationState?.key ? <Loading /> : <></>}</View>;
};
export default Index;
