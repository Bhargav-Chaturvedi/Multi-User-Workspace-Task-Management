const express = require("express");
const router = express.Router();
const {
  createWorkspace,
  workspaceInfo,
  deleteWorkspace,
  transferOwnership,
} = require("../controllers/workspaceController");

router.post("/", createWorkspace);
router.get("/:id", workspaceInfo);
router.delete("/:id", deleteWorkspace);
router.patch("/:id/transfer-ownership", transferOwnership);

module.exports = router;
