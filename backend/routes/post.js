const express = require("express");
const router = express.Router();
const {
  addNewPost,
  getAllPosts,
  getUserPost,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost,
  bookmarkPost
} = require("../controllers/post");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

router.post("/createPost", authMiddleware, upload.single("image"), addNewPost);
router.get("/getAllPosts", authMiddleware, getAllPosts);
router.get("/getPost/:id", authMiddleware, getUserPost);
router.delete("/deletePost/:id", authMiddleware, deletePost);
router.post("/likePost/:id", authMiddleware, likePost);
router.post("/dislikePost/:id", authMiddleware, dislikePost);
router.post("/addComment/:id", authMiddleware, addComment);
router.get("/getComments/:id", authMiddleware, getCommentsOfPost);
router.post("/bookmarkPost/:id", authMiddleware, bookmarkPost);

module.exports = router;
