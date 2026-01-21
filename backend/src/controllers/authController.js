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
    $or: [{ email }, { phone }],
  });

  if (userAvailable) {
    res.status(400);
    throw new Error("Email or phone already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1️⃣ Create workspace
  const workspace = await Workspace.create({
    name: workspaceName,
  });

  // 2️⃣ Create owner
  const owner = await User.create({
    username,
    email,
    phone,
    password: hashedPassword,
    role: "owner",
    workspaceId: workspace._id,
  });

  // 3️⃣ Attach owner to workspace
  workspace.ownerId = owner._id;
  await workspace.save();

  // 4️⃣ Generate token
  const token = jwt.sign(
    {
      _id: owner._id,
      role: owner.role,
      workspaceId: owner.workspaceId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  res.status(201).json({
    message: "Owner registered successfully",
    token,
    user: {
      id: owner._id,
      username: owner.username,
      email: owner.email,
      role: owner.role,
    },
    workspace: {
      id: workspace._id,
      name: workspace.name,
    },
  });
});

const loginAll = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const owner = await User.findOne({ email });
  if (!owner) {
    res.status(400);
    throw new Error("Owner not found, please register");
  }
  const passwordIsCorrect = await bcrypt.compare(password, owner.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    {
      _id: owner._id,
      role: owner.role,
      workspaceId: owner.workspaceId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "25m" },
  );
  res.status(200).json({
    message: "Owner logged in successfully",
    token,
    user: {
      id: owner._id,
      username: owner.username,
      email: owner.email,
      role: owner.role,
    },
  });
});
module.exports = { registerOwner, loginAll };
