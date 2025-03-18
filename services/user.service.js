const User = require("../models/User");

exports.findUser = async (userId) => {
  const user = await User.findById(userId);
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  } else {
    return user;
  }
};

exports.searchUsers = async (keyword, userId) => {
  const users = await User.find({
    $or: [
      {
        username: { $regex: keyword, $options: "i" },
      },
      {
        email: { $regex: keyword, $options: "i" },
      },
    ],
  }).find({
    _id: { $ne: userId },
  });

  return users;
};
