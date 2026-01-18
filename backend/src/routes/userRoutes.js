const express = require("express");
const router = express.Router();
const {
  createUser,
  removeUser,
  updateUserRole,
  getUserProfile,
} = require("../controllers/userController");

router.post("/create", createUser); // admin ,owner only
router.delete("/:id", removeUser); //  admin ,owner only
router.patch("/:id/role", updateUserRole); // admin ,owner only
router.get("/profile", getUserProfile); // all

module.exports = router;
