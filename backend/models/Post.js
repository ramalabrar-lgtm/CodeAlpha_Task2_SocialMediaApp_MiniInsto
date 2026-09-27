const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ["post", "reel"],
            required: true
        },

        media: {
            type: String,
            required: true
        },

        caption: {
            type: String,
            default: ""
        },

        likesCount: {
            type: Number,
            default: 0
        },

        viewsCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;