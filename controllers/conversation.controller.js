const { findUser } = require("../services/user.service");
const {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} = require("../services/conversation.service");

exports.create_open_conversation = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id } = req.body;

    if (!receiver_id) {
      return res.status(500).json({ message: "Please provide user id" });
    }

    const existed_conversation = await doesConversationExist(
      sender_id,
      receiver_id
    );

    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      //let receiver_user = await findUser(receiver_id);
      let convoData = {
        username: "conversation username",
        picture: "conversation picture",
        isGroup: false,
        users: [sender_id, receiver_id],
      };

      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
