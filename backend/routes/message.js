const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {sendMessage, getMessage} = require("../controllers/message");

router.post("/send-message/:id", authMiddleware, sendMessage);
router.get("/get-message/:id", authMiddleware, getMessage);

module.exports = router;
