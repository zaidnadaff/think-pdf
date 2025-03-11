// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./app/config/db.config.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./app/routes/auth.js"));
app.use("/api/users", require("./app/routes/user.js"));

// Protected route example
app.get("/api/protected", require("./app/middleware/auth.js"), (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// const startServer = async () => {
//   try {
//     await sequelize.sync();
//     console.log("Database synced successfully");

//     if (process.env.NODE_ENV !== "test") {
//       app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//       });
//     }
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();

module.exports = app;
// server.js
