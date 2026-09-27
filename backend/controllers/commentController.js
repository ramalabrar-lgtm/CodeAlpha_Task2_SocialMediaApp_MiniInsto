const Comment = require("../models/Comment");
const addComment = async function (req, res) {
    try {

        const {
            postId,
            text
        } = req.body;

        if (!text || !text.trim()) {

            return res.status(400).json({
                message: "Comment cannot be empty"
            });

        }

        if (!postId) {

            return res.status(400).json({
                message: "Post ID is required"
            });

        }


        const comment =
            await Comment.create({

                post: postId,

                user: req.user.id,

                text: text.trim()

            });

        res.status(201).json({

            message: "Comment added successfully",

            comment: comment

        });


    } catch (error) {

        console.error("Add comment error:", error);
        res.status(500).json({

            message: "Failed to add comment",

            error: error.message

        });

    }
};

const getComments = async function (req, res) {
    try {

        const postId =
            req.params.postId;


        const comments =
            await Comment.find({
                post: postId
            })
            .populate(
                "user",
                "name username profileImage"
            )
            .sort({
                createdAt: 1
            });


        res.status(200).json(
            comments
        );


    } catch (error) {

        console.error(
            "Get comments error:",
            error
        );

        res.status(500).json({

            message: "Failed to load comments",

            error: error.message

        });

    }
};

const deleteComment = async function (req, res) {
    try {

        const comment = await Comment.findById(req.params.id);


        if (!comment) {

            return res.status(404).json({

                message: "Comment not found"

            });

        }


        if (comment.user.toString() !== req.user.id) {

            return res.status(403).json({

                message: "You can only delete your own comment"

            });

        }

        await Comment.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            message:
                "Comment deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete comment error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete comment",

            error: error.message

        });

    }
};


module.exports = {

    addComment,
    getComments,
    deleteComment

};