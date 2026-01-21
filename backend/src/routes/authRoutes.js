const express = require("express");
const router = express.Router();
const { registerOwner, loginAll } = require("../controllers/authController");

router.post("/register", registerOwner);
router.post("/login", loginAll);

module.exports = router;
