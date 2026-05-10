const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  executeCode,
} = require("../controllers/codeController");

const router = express.Router();

router.post(
  "/run",
  protect,
  executeCode
);

module.exports = router;