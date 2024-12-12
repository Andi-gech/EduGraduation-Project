// socketService.js

import socketIOClient from "socket.io-client";
import { store } from "../Redux/store"; // Import your Redux store
import { setSocket } from "../Redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SOCKET_SERVER_URL = "wss://eduapi.senaycreatives.com";
let socket;

export const initializeSocket = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    return;
  }
  socket = socketIOClient(SOCKET_SERVER_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    extraHeaders: {
      authorization: token,
    },
  });

  socket.on("connect", () => {
    store.dispatch(setSocket(socket));
    console.log("Connected to Socket.io server");
  });

  socket.on("disconnect", (reason) => {
    store.dispatch(setSocket(null));
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected to Socket.io server (attempt ${attemptNumber})`);
    // Optionally handle reconnection logic here
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(
      `Attempting to reconnect to Socket.io server (attempt ${attemptNumber})`
    );
    // Optionally handle reconnection attempt logic here
  });

  socket.on("reconnect_error", (error) => {
    console.error("Error reconnecting to Socket.io server:", error.message);
    // Handle reconnect errors if needed
  });

  socket.on("reconnect_failed", () => {
    console.error("Failed to reconnect to Socket.io server");
    // Handle failed reconnections if needed
  });
  store.dispatch(setSocket(socket));

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error(
      "Socket.io not initialized. Call initializeSocket() first."
    );
  }
  return socket;
};
