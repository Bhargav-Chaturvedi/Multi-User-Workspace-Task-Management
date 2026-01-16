const express = require("express");
const router = express.Router();
const {
  createWorkspace,
  workspaceInfo,
  deleteWorkspace,
  transferOwnership,
} = require("../controllers/workspaceController");

router.post("/", createWorkspace);
router.get("/:Id", workspaceInfo);
router.delete("/:Id", deleteWorkspace);
router.patch("/:Id/transfer-ownership", transferOwnership);

module.exports = router;
