const express = require("express");
const router = express.Router();
const {
  createTask,
  listTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/:Id", listTask);
router.patch("/:Id/status", updateTaskStatus);
router.delete("/:Id", deleteTask);
