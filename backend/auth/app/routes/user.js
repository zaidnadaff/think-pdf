// routes/users.js
const router = require("express").Router();
const { User } = require("../models");
const auth = require("../middleware/auth.js");

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user.id, {
      attributes: ["id", "email", "createdAt", "updatedAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
