const express = require("express");

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollowStatus
} = require("../controllers/followController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();



router.post("/", authMiddleware, followUser);
router.delete("/", authMiddleware, unfollowUser);
router.get("/status/check", authMiddleware, checkFollowStatus);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
module.exports = router;