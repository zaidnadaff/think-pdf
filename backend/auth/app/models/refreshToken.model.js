const sequelize = require("../config/db.config.js");

const { DataTypes } = require("sequelize");

const { User } = require("../models/user.model.js");

const RefreshToken = sequelize.define(
  "refreshToken",

  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    token: { type: DataTypes.STRING, allowNull: false },

    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },

  { timestamps: true }
);

User.hasMany(RefreshToken);

RefreshToken.belongsTo(User);

module.exports = { RefreshToken };
