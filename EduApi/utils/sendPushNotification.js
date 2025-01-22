const { Notifications } = require("../Model/Notifications");
const { User } = require("../Model/User");
const { Expo } = require("expo-server-sdk");

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});
async function sendtoadmin(notificationData) {
  try{
   await Notifications.create({
      notification: notificationData,
      type: "General",
      user: null,
      isForAdmin: true,


    })
  }
  catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}


async function sendPushNotification(userId, notificationData) {
  try {
    console.log("Sending push notification to user:", userId);
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    console.log("Sending push notification to user:", user);

    const notification = new Notifications(notificationData);
    await notification.save();

    const pushToken = user.PushToken;
    if (!Expo.isExpoPushToken(pushToken)) {
      throw new Error("Invalid push token");
    }

    const message = {
      to: pushToken,
      sound: "default",
      body: notificationData.notification,
      data: { withSome: "data" },
    };

    const ticket = await expo.sendPushNotificationsAsync([message]);
    return { notification, ticket };
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}

async function sendPushNotificationToAll(notificationData) {
  try {
    const users = await User.find({ PushToken: { $exists: true } }); // Get all users with push tokens
    if (!users.length) throw new Error("No users found with push tokens");

    const groupedMessages = {}; 
    const invalidTokens = [];
    Notifications.create({
      notification: notificationData,
      type: "General",
      user: null,


    })

    for (const user of users) {
      const pushToken = user.PushToken;
      if (Expo.isExpoPushToken(pushToken)) {
        const experienceId = pushToken.split("[")[1].split("]")[0]; // Extract experienceId from token
        if (!groupedMessages[experienceId]) {
          groupedMessages[experienceId] = [];
        }
        groupedMessages[experienceId].push({
          to: pushToken,
          sound: "default",

          body: notificationData,
          data: { withSome: "data" },
        });
      } else {
        invalidTokens.push(pushToken);
      }
    }

    const tickets = [];

    for (const [experienceId, messages] of Object.entries(groupedMessages)) {
      console.log(`Sending notifications for project: ${experienceId}`);
      const chunks = expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(
            `Error sending push notification chunk for ${experienceId}:`,
            error
          );
        }
      }
    }

    return { notificationData, tickets, invalidTokens };
  } catch (error) {
    console.error("Error sending push notification to all:", error);
    throw error;
  }
}

module.exports = {
  sendPushNotification,
  sendPushNotificationToAll,
  sendtoadmin,
};
