require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes = require("./routes/followRoutes");
const likeRoutes = require("./routes/likeRoutes");


const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/likes", likeRoutes);

app.get("/", function (req, res) {
    res.send("MiniInsto Backend is running!");
});
mongoose.connect(process.env.MONGO_URI)
    .then(function () {
        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.db.databaseName);

        app.listen(PORT, function () {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(function (error) {
        console.log("MongoDB connection failed:", error);
    });
    