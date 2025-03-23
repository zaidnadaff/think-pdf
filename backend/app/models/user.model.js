const sequelize = require("../config/db.config.js");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

User.associate = (models) => {
  User.hasMany(models.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
  });
  User.hasMany(models.Document, {
    foreignKey: "userId",
    as: "documents",
  });
};

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = { User };
