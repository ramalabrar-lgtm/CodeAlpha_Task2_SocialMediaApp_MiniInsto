const User = require("../models/User");
const Follow = require("../models/Follow");
const getAllUsers = async function (req, res) {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get users",
            error: error.message
        });
    }
};
const getUserProfile = async function (req, res) {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
            followers: user.followersCount || 0,
            following: user.followingCount || 0,
            createdAt: user.createdAt
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get user profile",
            error: error.message
        });
    }
};

const updateUserProfile = async function (req, res) {
    try {

        const {
            name,
            username,
            bio,
            email,
            profileImage
        } = req.body;

        if (req.user.id !== req.params.id) {

            return res.status(403).json({
                message: "You can only update your own profile"
            });

        }


        const user = await User.findById(req.params.id);


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }
        if (name !== undefined) {
            user.name = name;
        }
        if (username !== undefined) {
            user.username = username;
        }

        if (email !== undefined) {
            user.email = email;
        }
        if (bio !== undefined) {
            user.bio = bio;
        }

        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }


        await user.save();


        res.status(200).json({

            message: "Profile updated successfully",

            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }

        });


    } catch (error) {

        res.status(500).json({

            message: "Failed to update profile",
            error: error.message

        });

    }
};

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUserProfile
};