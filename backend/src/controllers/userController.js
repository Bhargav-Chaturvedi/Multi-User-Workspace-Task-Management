const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc create a User
// @routes POST /api/users/create
// @access private - Only Admin , Owner
const createUser = asyncHandler(async (req, res) => {
  const { username, email, phone, password, role } = req.body;
  if (!username || !email || !phone || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  // if Owner is creating
  if (role === "owner") {
    res.status(403);
    throw new Error("Owner cannot be created");
  }
  // IF any user is already registered with email or phone
  const userAvailable = await User.findOne({
    $or: [{ email }, { phone }],
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
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    phone,
    password: hashedPassword,
    role: role || "member",
    workspaceId: req.user.workspaceId,
  });
  res.status(201).json(user);
});

// @desc remove a User
// @routes DELETE /api/users/:id
// @access private - Only Admin , Owner
const removeUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "owner") {
    res.status(403);
    throw new Error("Owner can't be deleted ");
  }
  if (user.workspaceId.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("not allowed");
  }
  await user.deleteOne();
  res.status(200).json({ message: "User removed successfully" });
});
// @desc remove a User
// @routes PATCH /api/users/:id
// @access private - Only Admin , Owner
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { username, email, phone, password, role } = req.body;

  // find user
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // workspace isolation
  if (user.workspaceId.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  // admin cannot update owner
  if (user.role === "owner" && req.user.role !== "owner") {
    res.status(403);
    throw new Error("Only owner can update owner");
  }

  // prevent setting role to owner
  if (role === "owner") {
    res.status(403);
    throw new Error("Cannot set role to owner");
  }

  // uniqueness checks
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }

  if (phone && phone !== user.phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      res.status(400);
      throw new Error("Phone already in use");
    }
  }

  // update allowed fields only
  if (username) user.username = username;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (role) user.role = role;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  });
});

// @desc    Get user profiles based on role
// @route   GET /api/users/profile
// @access  Private (Owner/Admin/Member)
const getUserProfile = asyncHandler(async (req, res) => {
  const { role, workspaceId, _id } = req.user;
  let user;
  // Owner -> all users in workspace
  if (role === "owner") {
    user = await User.find({ workspaceId }).select("-password");
  }
  // Admin -> all members in workspace
  else if (role === "admin") {
    user = await User.find({ workspaceId, role: "member" }).select("-password");
  }
  // Member -> own profile
  else {
    user = await User.findById(_id).select("-password");
  }
  res.status(200).json(user);
});

module.exports = { createUser, removeUser, updateUser, getUserProfile };
