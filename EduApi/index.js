const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const User = require("./Routes/User");
const Auth = require("./Routes/Auth");
const Promotion = require("./Routes/Promotion");
const Enrollment = require("./Routes/Enrollment");
const Permissions = require("./Routes/Permissions");
const Posts = require("./Routes/Posts");
const http = require("http");
const socketIo = require("socket.io");
const Gate = require("./Routes/Gate");
const CafeController = require("./Routes/CafeController");
const Report = require("./Routes/Report");
const Chatroom = require("./Routes/ChatRoom");
const Complain = require("./Routes/Complain");
const resources = require("./Routes/Resource");
const notification = require("./Routes/Notifications");
const Social = require("./Routes/Social");
const Events = require("./Routes/Event");

const connect = require("./Connect");
const cors = require("cors");
require("./utils/swagger")(app);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

app.use("/user", User);
app.use("/auth", Auth);
app.use("/promotion", Promotion);
app.use("/enrollment", Enrollment);
app.use("/permissions", Permissions);
app.use("/gate", Gate);
app.use("/cafe", CafeController);
app.use("/report", Report);
app.use("/chatroom", Chatroom);
app.use("/complain", Complain);
app.use("/resource", resources);
app.use("/notification", notification);
app.use("/post", Posts);
app.use("/Social", Social);
app.use("/Events", Events);

const { initializeSocket } = require("./Routes/Chat");

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

const url = "172.20.10.3";

connect().then(() => {
  server.listen(port, () => {
    console.log(`Example app listening at http://${url}:${port}`);
  });
});
