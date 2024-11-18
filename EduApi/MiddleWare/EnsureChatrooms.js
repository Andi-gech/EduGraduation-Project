const { Chatroom } = require("../Model/Chatrooms");
const { User } = require("../Model/User");

const EnsureChatrooms = async (req, res, next) => {
  try {
    // Check if the user has a chat room named "ask"
    const askRoom = await Chatroom.findOne({
      name: "ask",
      user: req.user._id,
    });

    // Create "ask" room if not found
    if (!askRoom) {
      await Chatroom.create({
        name: "ask",
        user: req.user._id,
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Error ensuring chat rooms:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = EnsureChatrooms;
