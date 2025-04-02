import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Document);

Document.belongsTo(User);

export { Document };
