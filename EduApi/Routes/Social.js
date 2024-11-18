const AuthMiddleware = require("../MiddleWare/AuthMiddleware");
const { Auth } = require("../Model/Auth");
const { Social } = require("../Model/Socials");
const express = require("express");
const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const socials = await Social.find();
    return res.send(socials);
  } catch (error) {
    return res.status(500).send(error.message || "Something went wrong");
  }
});

Router.post("/", async (req, res) => {
  try {
    const social = new Social(req.body);
    await social.save();
    return res.send(social);
  } catch (error) {
    return res.status(500).send(error.message || "Something went wrong");
  }
});
Router.put("/join/:id", AuthMiddleware, async (req, res) => {
  try {
    const social = await Social.findById(req.params.id);
    if (!social) {
      return res.status(404).send("Social not found");
    }

    if (social.clubMembers.includes(req.user.userid)) {
      return res.status(400).send("User already joined");
    }
    social.clubMembers.push(req.user.userid);
    await social.save();
    return res.send(social);
  } catch (error) {
    return res.status(500).send(error.message || "Something went wrong");
  }
});

module.exports = Router;
