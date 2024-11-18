// components/ProtectedRoute.js
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import Loading from "../Components/Loading";
import { isAuthenticated } from "../utils/auth";
import { LinearGradient } from "expo-linear-gradient";

const ProtectedRoute = ({ navigation, children }) => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.replace("/(Auth)/Startup");

        // Redirect to login if not authenticated
      } else {
        setLoading(false); // Stop loading if authenticated
      }
    };

    checkAuth();
  }, [navigation]);

  if (loading) {
    return (
      <LinearGradient
        colors={["#010101", "#262626"]}
        locations={[0.0, 0.9]}
        className="relative flex-1 flex items-center   flex-col"
      >
        <Loading />
      </LinearGradient>
    );
  }

  return children;
};

export default ProtectedRoute;
