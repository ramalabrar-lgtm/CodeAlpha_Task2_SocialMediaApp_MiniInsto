const Like = require("../models/Like");
const Post = require("../models/Post");
const likePost = async function (req, res) {
    try {
        const { post } = req.body;

        if (!post) {
            return res.status(400).json({
                message: "Post is required"
            });
        }

        const user = req.user.id;

        const existingLike = await Like.findOne({
            post: post,
            user: user
        });

        if (existingLike) {
            return res.status(400).json({
                message: "Post already liked"
            });
        }

        await Like.create({
            post: post,
            user: user
        });

        const updatedPost = await Post.findByIdAndUpdate(
            post,
            {
                $inc: {
                    likesCount: 1
                }
            },
            {
                new: true
            }
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(201).json({
            message: "Post liked successfully",
            likesCount: updatedPost.likesCount
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to like post",
            error: error.message
        });
    }
};
const unlikePost = async function (req, res) {
    try {
        const { post } = req.body;

        if (!post) {
            return res.status(400).json({
                message: "Post is required"
            });
        }

        const user = req.user.id;

        const deletedLike = await Like.findOneAndDelete({
            post: post,
            user: user
        });

        if (!deletedLike) {
            return res.status(404).json({
                message: "Like not found"
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            post,
            {
                $inc: {
                    likesCount: -1
                }
            },
            {
                new: true
            }
        );

        res.status(200).json({
            message: "Post unliked successfully",
            likesCount: updatedPost ? updatedPost.likesCount : 0
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to unlike post",
            error: error.message
        });
    }
};

const checkLikeStatus = async function (req, res) {
    try {
        const { post } = req.query;

        if (!post) {
            return res.status(400).json({
                message: "Post is required"
            });
        }

        const user = req.user.id;

        const like = await Like.findOne({
            post: post,
            user: user
        });

        res.status(200).json({
            isLiked: !!like
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to check like status",
            error: error.message
        });
    }
};


// Get Likes of a Post
const getPostLikes = async function (req, res) {
    try {
        const likes = await Like.find({
            post: req.params.postId
        })
            .populate("user", "name username profileImage");

        res.status(200).json(likes);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get likes",
            error: error.message
        });
    }
};


module.exports = {
    likePost,
    unlikePost,
    checkLikeStatus,
    getPostLikes
};