const createHttpError = require("http-errors");
const MessageModel = require("../models/messageModel.js"); // Modeli require ile dahil ediyoruz

// Mesaj oluşturma fonksiyonu
const createMessage = async (data) => {
  // Yeni mesajı veritabanına kaydediyoruz
  let newMessage = await MessageModel.create(data);

  // Eğer mesaj oluşturulamazsa, hata fırlatıyoruz
  if (!newMessage)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  return newMessage;
};

// Mesaj detaylarını popüle etme fonksiyonu
const populateMessage = async (id) => {
  // Mesajı ID ile buluyor ve gerekli alanları popüle ediyoruz
  let msg = await MessageModel.findById(id)
    .populate({
      path: "sender", // Gönderen kullanıcıyı popüle et
      select: "username picture", // Seçilecek alanlar
      model: "User", // Kullanıcı modelini belirt
    })
    .populate({
      path: "conversation", // Konuşma detaylarını popüle et
      select: "username picture isGroup", // Konuşma ile ilgili alanlar
      model: "ConversationModel", // Konuşma modelini belirt
      populate: {
        path: "users", // Konuşmaya dahil olan kullanıcıları popüle et
        select: "username email picture status", // Kullanıcıyla ilgili seçilecek alanlar
        model: "User", // Kullanıcı modelini belirt
      },
    });

  // Eğer mesaj bulunamazsa, hata fırlatıyoruz
  if (!msg) throw createHttpError.BadRequest("Oops...Something went wrong !");

  return msg;
};

// Belirli bir konuşmanın tüm mesajlarını almak için fonksiyon
const getConvoMessages = async (convo_id) => {
  // Verilen konuşma ID'sine göre mesajları alıyoruz ve popüle ediyoruz
  const messages = await MessageModel.find({ conversation: convo_id })
    .populate("sender", "username picture email status") // Gönderen kullanıcıyı popüle et
    .populate("conversation"); // Konuşma detaylarını popüle et

  // Eğer mesajlar bulunamazsa, hata fırlatıyoruz
  if (!messages) {
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  }

  return messages;
};

// Fonksiyonları dışarıya export ediyoruz
module.exports = {
  createMessage,
  populateMessage,
  getConvoMessages,
};
