const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
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
  upload.single("image"),
  editProfile
);
router.get("/suggested-users", authMiddleware, getSuggestedUsers);
router.post("/follow/:id", authMiddleware, followOrUnfollow);

module.exports = router;
