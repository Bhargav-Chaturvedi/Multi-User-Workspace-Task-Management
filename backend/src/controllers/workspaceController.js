const asyncHandler = require("express-async-handler");
const Workspace = require("../models/workspace");
const User = require("../models/User");

const workspaceInfo = asyncHandler(async (req, res) => {
  console.log("1️⃣ Controller hit");

  const workspaceId = req.params.id;

  const workspace = await Workspace.findById(workspaceId).populate(
    "ownerId",
    "username email",
  );

  console.log("2️⃣ Workspace fetched");

  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }
  
  if (workspace._id.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  console.log("3️⃣ Sending response");

  return res.status(200).json({
    id: workspace._id,
    name: workspace.name,
    owner: workspace.ownerId,
    createdAt: workspace.createdAt,
  });
});
const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspaceId = req.params.id;

  // only owner
  if (req.user.role !== "owner") {
    res.status(403);
    throw new Error("Only owner can delete workspace");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }

  if (workspace._id.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  await workspace.deleteOne();

  res.status(200).json({ message: "Workspace deleted successfully" });
});

const transferOwnership = asyncHandler(async (req, res) => {
  const workspaceId = req.params.id;
  const { newOwnerId } = req.body;

  if (!newOwnerId) {
    res.status(400);
    throw new Error("New owner id is required");
  }

  // only owner
  if (req.user.role !== "owner") {
    res.status(403);
    throw new Error("Only owner can transfer ownership");
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }

  if (workspace._id.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  const newOwner = await User.findById(newOwnerId);
  if (!newOwner) {
    res.status(404);
    throw new Error("User not found");
  }

  if (newOwner.workspaceId.toString() !== workspaceId) {
    res.status(403);
    throw new Error("User not in this workspace");
  }

  // demote current owner
  await User.findByIdAndUpdate(req.user._id, { role: "admin" });

  // promote new owner
  newOwner.role = "owner";
  await newOwner.save();

  // update workspace owner
  workspace.ownerId = newOwner._id;
  await workspace.save();

  res.status(200).json({
    message: "Ownership transferred successfully",
    newOwnerId: newOwner._id,
  });
});

module.exports = {
  workspaceInfo,
  deleteWorkspace,
  transferOwnership,
};
