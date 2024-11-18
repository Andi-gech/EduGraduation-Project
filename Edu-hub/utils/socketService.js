// socketService.js

import socketIOClient from "socket.io-client";
import { store } from "../Redux/store"; // Import your Redux store
import { setSocket } from "../Redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SOCKET_SERVER_URL = "ws://eduapi.senaycreatives.com"; // Replace with your server URL

let socket;

export const initializeSocket = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    return;
  }
  socket = socketIOClient(SOCKET_SERVER_URL, {
    transports: ["websocket"], // Use WebSocket transport
    reconnection: true, // Enable reconnection
    reconnectionAttempts: Infinity, // Number of reconnection attempts (-1 for infinite)
    reconnectionDelay: 1000, // Initial delay before attempting a new reconnection (ms)
    reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts (ms)
    randomizationFactor: 0.5,
    extraHeaders: {
      authorization: token,
    }, // Randomization factor applied to the reconnection delay (0 to 1)
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.io server");
    store.dispatch(setSocket(socket));
  });

  socket.on("disconnect", (reason) => {
    store.dispatch(setSocket(null));
    console.log(`Disconnected from Socket.io server: ${reason}`);
    // Handle disconnect reason if needed
  });

  socket.on("reconnect", (attemptNumber) => {
    console.error("recoo");
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
