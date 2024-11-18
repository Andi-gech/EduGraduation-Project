const { Notifications } = require("../Model/Notifications");
const { User } = require("../Model/User");
const { Expo } = require("expo-server-sdk"); // Destructure Expo directly

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

async function sendPushNotification(userId, notificationData) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Create and save the notification
    const notification = new Notifications(notificationData);
    await notification.save();

    const pushToken = user.PushToken;
    if (!Expo.isExpoPushToken(pushToken)) {
      throw new Error("Invalid push token");
    }

    const message = {
      to: pushToken,
      sound: "default",
      body: notificationData.notification, // Message content
      data: { withSome: "data" },
    };

    // Send the notification
    const ticket = await expo.sendPushNotificationsAsync([message]);
    return { notification, ticket };
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error; // Re-throw the error for handling in the route
  }
}

module.exports = sendPushNotification;
