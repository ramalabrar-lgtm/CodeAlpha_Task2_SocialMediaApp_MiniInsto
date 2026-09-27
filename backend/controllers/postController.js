const Post = require("../models/Post");


const createPost = async function (req, res) {
    try {
        const { type, caption } = req.body;

        if (!type || !req.file) {
            return res.status(400).json({
                message: "Type and media file are required"
            });
        }

        if (type !== "post" && type !== "reel") {
            return res.status(400).json({
                message: "Type must be post or reel"
            });
        }

        const mediaPath = "/uploads/" + req.file.filename;

        const newPost = await Post.create({
            user: req.user.id,
            type: type,
            media: mediaPath,
            caption: caption || ""
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
};
const getAllPosts = async function (req, res) {
    try {
        const posts = await Post.find()
            .populate("user", "name username profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get posts",
            error: error.message
        });
    }
};
const getUserPosts = async function (req, res) {
    try {
        const posts = await Post.find({
            user: req.params.userId
        })
            .populate("user", "name username profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get user posts",
            error: error.message
        });
    }
};

const getSinglePost = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "name username profileImage");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get post",
            error: error.message
        });
    }
};
const updatePost = async function (req, res) {
    try {
        const { caption, media } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own post"
            });
        }

        if (caption !== undefined) {
            post.caption = caption;
        }

        if (media !== undefined) {
            post.media = media;
        }

        await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            post: post
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update post",
            error: error.message
        });
    }
};
const deletePost = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own post"
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
};
const increaseViewCount = async function (req, res) {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $inc: {
                    viewsCount: 1
                }
            },
            {
                new: true
            }
        );

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "View count updated",
            viewsCount: post.viewsCount
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update view count",
            error: error.message
        });
    }
};


module.exports = {
    createPost,
    getAllPosts,
    getUserPosts,
    getSinglePost,
    updatePost,
    deletePost,
    increaseViewCount
};