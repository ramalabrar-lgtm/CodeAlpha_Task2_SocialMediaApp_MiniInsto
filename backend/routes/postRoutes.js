const express = require("express");

const {
    createPost,
    getAllPosts,
    getUserPosts,
    getSinglePost,
    updatePost,
    deletePost,
    increaseViewCount
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/", authMiddleware, upload.single("media"), createPost);
router.get("/", getAllPosts);
router.get("/user/:userId", getUserPosts);
router.get("/:id", getSinglePost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id/view", increaseViewCount);
module.exports = router;