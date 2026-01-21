const express = require("express");
const router = express.Router();
const {
  workspaceInfo,
  deleteWorkspace,
  transferOwnership,
} = require("../controllers/workspaceController");
const { validateToken } = require("../middlewares/validateTokenHandler");

router.use(validateToken);
router.get("/:id", workspaceInfo);
router.delete("/:id", deleteWorkspace);
router.patch("/:id/transfer-ownership", transferOwnership);

module.exports = router;
