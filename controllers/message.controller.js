const { updateLatestMessage } = require("../services/conversation.service.js");
const {
  createMessage,
  getConvoMessages,
  populateMessage,
} = require("../services/message.service.js");

exports.sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { message, convo_id, files } = req.body;

    // Parametre kontrolü
    if (!convo_id || (!message && !files)) {
      return res.status(500).json({ message: "Something wrong.." });
    }

    // Mesaj verisini hazırlıyoruz
    const msgData = {
      sender: user_id,
      message,
      conversation: convo_id,
      files: files || [],
    };

    // Mesajı veritabanına kaydediyoruz
    let newMessage = await createMessage(msgData);

    // Mesajı popüle ediyoruz (detayları alıyoruz)
    let populatedMessage = await populateMessage(newMessage._id);

    // Son mesajı güncelliyoruz
    await updateLatestMessage(convo_id, newMessage);

    // Popüle edilmiş mesajı geri döndürüyoruz
    res.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const convo_id = req.params.convo_id;

    // convo_id parametresi sağlanmamışsa hata döndür
    if (!convo_id) {
      return res.status(500).json({ message: "Something wrong.." });
    }

    // İlgili konuşmadaki mesajları alıyoruz
    const messages = await getConvoMessages(convo_id);

    // Mesajları döndürüyoruz
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
