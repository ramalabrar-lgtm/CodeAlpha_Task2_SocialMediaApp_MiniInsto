const express = require("express");

const {
    likePost,
    unlikePost,
    checkLikeStatus,
    getPostLikes
} = require("../controllers/likeController");

const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, likePost);
router.delete("/", authMiddleware, unlikePost);
router.get("/status/check", authMiddleware, checkLikeStatus);
router.get("/post/:postId", getPostLikes);
module.exports = router;