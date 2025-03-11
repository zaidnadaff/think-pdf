const { User, RefreshToken } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    // console.log(User);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }
    const checkExistingUser = await User.findOne({ where: { email: email } });
    if (checkExistingUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    await User.create({ name, email, password });
    return res.status(200).json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and passoword" });
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    const expiresInMinutes =
      parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10) || 10;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000); // Convert ms to Date

    await RefreshToken.create({
      token: refreshToken,
      expiresAt: expiresAt,
      userId: user.id,
    });
    res.status(200).json({
      message: "Login succesful",
      accessToken,
      refreshToken,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh Token present" });
    }

    const tokenExists = RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!tokenExists) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const payload = {
      user: {
        id: decoded.user.id,
        email: decoded.user.email,
      },
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      accessToken: accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is Expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token is Expired" });
    }
    res.status(404).json({ message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Delete refresh token from database
    await RefreshToken.destroy({
      where: { token: refreshToken },
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
