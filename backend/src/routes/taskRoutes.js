const express = require("express");
const router = express.Router();
const {
  createTask,
  listTask,
  singleTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");
const { validateToken } = require("../middlewares/validateTokenHandler");
const { adminOrOwner } = require("../middlewares/roleMiddleware");
router.use(validateToken);
router.post("/", adminOrOwner, createTask);
router.get("/", listTask);
router.get("/:id", singleTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", adminOrOwner, deleteTask);

module.exports = router;
