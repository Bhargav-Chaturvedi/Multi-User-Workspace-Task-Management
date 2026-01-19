const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/validateTokenHandler");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

app.use(validateToken);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
