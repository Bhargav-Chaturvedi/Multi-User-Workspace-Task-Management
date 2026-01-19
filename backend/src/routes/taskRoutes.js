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
app.use(validateToken);
router.route("/").post(createTask).get(listTask);
router.get("/:id", singleTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", deleteTask);

module.exports = router;
