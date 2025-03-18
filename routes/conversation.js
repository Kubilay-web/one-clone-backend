const express = require("express");
const { authUser } = require("../middlwares/auth");
const {
  create_open_conversation,
  getConversations,
} = require("../controllers/conversation.controller.js");

const router = express.Router();

router.post("/conversation", authUser, create_open_conversation);
router.get("/conversation", authUser, getConversations);

module.exports = router;
