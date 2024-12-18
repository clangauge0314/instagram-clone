const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  follow,
} = require("../controllers/user");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile/:id", authMiddleware, getProfile);
router.post(
  "/profile/edit",
  authMiddleware,
  upload.single("profilePicture"),
  editProfile
);
router.get("/suggest-users", authMiddleware, getSuggestedUsers);
router.post("/follow/:id", authMiddleware, follow);

module.exports = router;
