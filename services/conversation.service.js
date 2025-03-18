const User = require("../models/User");
const ConversationModel = require("../models/ConversationModel");

exports.doesConversationExist = async (sender_id, receiver_id) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },

      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos) {
    return res.status(400).json({ message: "Something wrong" });
  }

  convos = await User.populate(convos, {
    path: "latestMessage.sender",
    select: "username email picture password",
  });

  return convos[0];
};

exports.createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo) {
    return res.status(402).json({ message: "Something went wrong" });
  } else {
    return newConvo;
  }
};

exports.populateConversation = async (id, fieldToPopulate, fieldsToRemove) => {
  const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldsToRemove
  );
  if (!populatedConvo) {
    return res.status(402).json({ message: "Something went wrong" });
  } else {
    return populatedConvo;
  }
};

exports.getUserConversations = async (user_id) => {
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "username email picture status",
      });
      conversations = results;
    })
    .catch((err) => {
      return res.status(402).json({ message: "Something went wrong" });
    });
  return conversations;
};

exports.updateLatestMessage = async (convo_id, msg) => {
  const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg,
  });

  if (!updatedConvo) {
    return res.status(400).json({ message: "Something went wrong" });
  } else {
    return updatedConvo;
  }
};
