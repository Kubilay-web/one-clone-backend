const express = require("express");
const { authUser } = require("../middlwares/auth");
const {
  sendMessage,
  getMessages,
} = require("../controllers/message.controller.js");

const router = express.Router();

router.post("/message", authUser, sendMessage);
router.get("/message/:convo_id", authUser, getMessages);

module.exports = router;
