const express = require("express");
const router = express.Router();
const {
  createUser,
  removeUser,
  updateUser,
  getUserProfile,
} = require("../controllers/userController");
// check for only admin or owner can CRUD users
const { adminOrOwner } = require("../middlewares/roleMiddleware");
const { validateToken } = require("../middlewares/validateTokenHandler");
// Express executes left → right.So this runs as: adminOrOwner → createUser
app.use(validateToken);
router.post("/create", adminOrOwner, createUser); // admin ,owner only
router.delete("/:id", adminOrOwner, removeUser); //  admin ,owner only
router.patch("/:id/role", adminOrOwner, updateUser); //  admin ,owner only
router.get("/profile", getUserProfile); // all

module.exports = router;
