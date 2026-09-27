const express = require("express");

const {
    getAllUsers,
    getUserProfile,
    updateUserProfile
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", getUserProfile);
router.put("/:id", authMiddleware, updateUserProfile);
module.exports = router;
