const Sequelize = require("sequelize");
require("dotenv").config();

const db_url = process.env.DATABASE_URL;

const sequelize = new Sequelize(db_url, {
  dialect: "postgres", // or "postgres" if you've switched
  logging: false,
  dialectOptions: {
    connectTimeout: 20000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
