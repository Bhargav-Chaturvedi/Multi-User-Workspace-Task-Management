const asyncHandler = require("express-async-handler");
const Task = require("../models/task");
const User = require("../models/User");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo } = req.body;

  if (!title || !description || !assignedTo) {
    res.status(400);
    throw new Error("All fields are required");
  }
  if (req.user.role !== "owner" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not permitted to create task.");
  }

  const assignedUser = await User.findById(assignedTo);
  if (!assignedUser) {
    res.status(404);
    throw new Error("Assigned user not found");
  }
  if (assignedUser.workspaceId.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Assigned user must be in the same workspace");
  }
  const task = await Task.create({
    title,
    description,
    status: "todo",
    assignedTo,
    createdBy: req.user._id,
    workspaceId: req.user.workspaceId,
  });
  res.status(201).json(task);
});

const listTask = asyncHandler(async (req, res) => {
  // only owner or admin
  if (req.user.role !== "owner" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only owner or admin can view all tasks");
  }

  const tasks = await Task.find({
    workspaceId: req.user.workspaceId,
  });

  res.status(200).json(tasks);
});

const singleTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // workspace isolation
  if (task.workspaceId.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  // member can see only assigned task
  if (
    req.user.role === "member" &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not allowed to view this task");
  }

  res.status(200).json(task);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Status is required");
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // workspace isolation
  if (task.workspaceId.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  // member restriction
  if (
    req.user.role === "member" &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You can update only your assigned task");
  }

  task.status = status;
  await task.save();

  res.status(200).json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.workspaceId.toString() !== req.user.workspaceId.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  await task.deleteOne();

  res.status(200).json({ message: "Task deleted successfully" });
});

module.exports = {
  createTask,
  listTask,
  singleTask,
  updateTaskStatus,
  deleteTask,
};
