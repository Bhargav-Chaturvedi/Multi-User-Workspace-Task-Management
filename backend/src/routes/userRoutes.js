const express = require("express");
const router = express.Router();
const {
  inviteUser,
  removeUser,
  updateUserRole,
  getUserProfile,
  getUserWorkspaces,
} = require("../controllers/userController");

router.post("/invite", inviteUser);
router.delete("/:Id", removeUser);
router.patch("/:Id/role", updateUserRole);
router.get("/profile", getUserProfile);
router.get("/:Id/workspaces", getUserWorkspaces);

module.exports = router;
