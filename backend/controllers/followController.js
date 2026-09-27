const Follow = require("../models/Follow");
const User = require("../models/User");

const followUser = async function (req, res) {
    try {
        const { following } = req.body;

        if (!following) {
            return res.status(400).json({
                message: "Following user is required"
            });
        }

        const follower = req.user.id;

        if (follower === following) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const targetUser = await User.findById(following);

        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingFollow = await Follow.findOne({
            follower: follower,
            following: following
        });

        if (existingFollow) {
            return res.status(400).json({
                message: "Already following this user"
            });
        }

        const newFollow = await Follow.create({
            follower: follower,
            following: following
        });

        await User.findByIdAndUpdate(
            follower,
            { $inc: { followingCount: 1 } }
        );

        await User.findByIdAndUpdate(
            following,
            { $inc: { followersCount: 1 } }
        );

        res.status(201).json({
            message: "User followed successfully",
            follow: newFollow
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to follow user",
            error: error.message
        });
    }
};


const unfollowUser = async function (req, res) {
    try {
        const { following } = req.body;

        if (!following) {
            return res.status(400).json({
                message: "Following user is required"
            });
        }

        const follower = req.user.id;

        const deletedFollow = await Follow.findOneAndDelete({
            follower: follower,
            following: following
        });

        if (!deletedFollow) {
            return res.status(404).json({
                message: "Follow relationship not found"
            });
        }

        await User.findByIdAndUpdate(
            follower,
            { $inc: { followingCount: -1 } }
        );

        await User.findByIdAndUpdate(
            following,
            { $inc: { followersCount: -1 } }
        );

        res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to unfollow user",
            error: error.message
        });
    }
};


const getFollowers = async function (req, res) {
    try {
        const followers = await Follow.find({
            following: req.params.userId
        })
            .populate("follower", "name username profileImage");

        res.status(200).json(followers);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get followers",
            error: error.message
        });
    }
};


const getFollowing = async function (req, res) {
    try {
        const following = await Follow.find({
            follower: req.params.userId
        })
            .populate("following", "name username profileImage");

        res.status(200).json(following);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get following",
            error: error.message
        });
    }
};


const checkFollowStatus = async function (req, res) {
    try {
        const { following } = req.query;

        if (!following) {
            return res.status(400).json({
                message: "Following user is required"
            });
        }

        const follower = req.user.id;

        const follow = await Follow.findOne({
            follower: follower,
            following: following
        });

        res.status(200).json({
            isFollowing: !!follow
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to check follow status",
            error: error.message
        });
    }
};


module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollowStatus
};