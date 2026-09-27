require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Follow = require("./models/Follow");

const defaultCounts = {
    noor: { followers: 245, following: 180 },
    alina: { followers: 312, following: 205 },
    zara: { followers: 198, following: 156 },
    hania: { followers: 276, following: 194 },
    rania: { followers: 221, following: 167 },
    sara: { followers: 287, following: 172 },
    maya: { followers: 234, following: 149 },
    emma: { followers: 265, following: 188 }
};

async function initializeCounts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        for (const username in defaultCounts) {

            const user = await User.findOne({ username: username });

            if (!user) {
                console.log(`User not found: ${username}`);
                continue;
            }

            const actualFollowers = await Follow.countDocuments({
                following: user._id
            });

            const actualFollowing = await Follow.countDocuments({
                follower: user._id
            });

            const counts = defaultCounts[username];

            user.followersCount = counts.followers + actualFollowers;
            user.followingCount = counts.following + actualFollowing;

            await user.save();

            console.log(
                `${username}: ${user.followersCount} followers, ${user.followingCount} following`
            );
        }

        console.log("User counts initialized successfully");

        await mongoose.disconnect();

    } catch (error) {
        console.log("Error:", error.message);
    }
}

initializeCounts();