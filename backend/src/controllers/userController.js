const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc create a User
// @routes GET /api/users/create
// @access private - Only Admin , Owner

const createUser = asyncHandler(async (req, res) => {
  const { username, email, phone, password, role, workspaceId } = req.body;
  if (!username || !email || !phone || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const userExists = await User.findOne({
    $or: [{ email }, { phone }],
  });
  // if available
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
  const hashedPassword = await bcrypt.hashedPassword(password, 10);

  const user = await User.create({
    username,
    email,
    phone,
    password: hashedPassword,
    role,
    workspaceId,
  });
  res.status(201).json(user);
});

module.exports = { createUser };
