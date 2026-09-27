require("dotenv").config();

const mongoose = require("mongoose");
const Post = require("./models/Post");

const users = {
    noor: "6ab7772a76411aa2708e6bd3",
    alina: "6ab779b976411aa2708e6bd4",
    zara: "6ab779d576411aa2708e6bd5",
    hania: "6ab779ed76411aa2708e6bd6",
    rania: "6ab77a0376411aa2708e6bd7",
    sara: "6ab77a0f76411aa2708e6bd8",
    maya: "6ab77a1e76411aa2708e6bd9",
    emma: "6ab77a3276411aa2708e6bda"
};

const posts = [
    
    {
        user: users.maya,
        type: "reel",
        media: "/uploads/music1.mp4",
        caption: "music song trending entertainment"
    },
    {
        user: users.maya,
        type: "reel",
        media: "/uploads/reel9.mp4",
        caption: "ai videos funny"
    },

    {
        user: users.noor,
        type: "reel",
        media: "/uploads/music2.mp4",
        caption: "music song trending entertainment"
    },
    {
        user: users.noor,
        type: "reel",
        media: "/uploads/reel3.mp4",
        caption: "music song trending audio entertainment"
    },
    {
        user: users.noor,
        type: "reel",
        media: "/uploads/reel5.mp4",
        caption: "music ai video"
    },
    {
        user: users.noor,
        type: "reel",
        media: "/uploads/reel6.mp4",
        caption: "ai funny videos"
    },
    {
        user: users.noor,
        type: "reel",
        media: "/uploads/reel7.mp4",
        caption: "makeup reel"
    },

    {
        user: users.alina,
        type: "post",
        media: "/uploads/post1.jpg",
        caption: "makeup post"
    },
    {
        user: users.alina,
        type: "post",
        media: "/uploads/wedding2.jpg",
        caption: "wedding dresses"
    },
    {
        user: users.alina,
        type: "post",
        media: "/uploads/wedding3.jpg",
        caption: "wedding dresses"
    },
    {
        user: users.alina,
        type: "reel",
        media: "/uploads/reel4.mp4",
        caption: "makeup tutorial pose reel"
    },

    {
        user: users.zara,
        type: "post",
        media: "/uploads/post3.jpg",
        caption: "cooking template"
    },
    {
        user: users.zara,
        type: "reel",
        media: "/uploads/reel11.mp4",
        caption: "weight loss drink morning tea"
    },

    {
        user: users.sara,
        type: "post",
        media: "/uploads/post2.jpg",
        caption: "pose a picture post"
    },
    {
        user: users.sara,
        type: "reel",
        media: "/uploads/reel8.mp4",
        caption: "ai videos funny"
    },

    {
        user: users.emma,
        type: "post",
        media: "/uploads/post4.jpg",
        caption: "cooking post template"
    },
    {
        user: users.emma,
        type: "reel",
        media: "/uploads/reel12.mp4",
        caption: "dresses wedding parties designs pose to make a video shoot"
    },

    
    {
        user: users.hania,
        type: "post",
        media: "/uploads/post5.jpg",
        caption: "pose paris"
    },
    {
        user: users.hania,
        type: "post",
        media: "/uploads/post8.jpg",
        caption: "positive energy post"
    },
    {
        user: users.hania,
        type: "reel",
        media: "/uploads/reel10.mp4",
        caption: "weight loss drink kahva morning tea"
    },

    
    {
        user: users.rania,
        type: "post",
        media: "/uploads/post6.jpg",
        caption: "paris tower"
    },
    {
        user: users.rania,
        type: "post",
        media: "/uploads/post9.jpg",
        caption: "memory post"
    },
    {
        user: users.rania,
        type: "reel",
        media: "/uploads/reel13.mp4",
        caption: "haircut pose"
    }
];

async function migratePosts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");
        console.log("Database:", mongoose.connection.db.databaseName);
        console.log(`Existing posts: ${await Post.countDocuments()}`);


        await Post.insertMany(posts);

        console.log(`${posts.length} posts/reels added successfully.`);

        process.exit();

    } catch (error) {
        console.log("Migration failed:", error);
        process.exit(1);
    }
}

migratePosts();