const { User } = require("../models/user.model.js");
const { RefreshToken } = require("../models/refreshToken.model.js");
console.log(User);
module.exports = {
  User,
  RefreshToken,
};
