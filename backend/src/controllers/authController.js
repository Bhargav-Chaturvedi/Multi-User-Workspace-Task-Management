const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Workspace = require("../models/workspace");

// @desc create a User
// @routes GET /api/users/create
// @access public - but only once, user become owner
const registerOwner = asyncHandler(async (req, res) => {
  const { username, email, phone, password, workspaceName } = req.body;
  if (!username || !email || !phone || !password || !workspaceName) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const userAvailable = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (userAvailable) {
    if (userAvailable.email === email) {
      res.status(400);
      throw new Error("Email already registered");
    }
    if (userAvailable.phone === phone) {
      res.status(400);
      throw new Error("Phone number already registered");
    }
  }
});

module.exports = { registerOwner };
