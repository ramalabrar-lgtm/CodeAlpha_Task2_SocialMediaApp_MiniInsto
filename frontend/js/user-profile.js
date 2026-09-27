document.addEventListener("DOMContentLoaded", async function () {

    const profileAvatar = document.getElementById("profileAvatar");
        const navAvatar = document.getElementById("navAvatar");

if (navAvatar) {


const sessionData = localStorage.getItem("miniInstoSession");

if (sessionData) {

    try {

        const session = JSON.parse(sessionData);

        const currentName = session.name || session.username || "User";

        navAvatar.textContent = currentName.charAt(0).toUpperCase();

    } catch (error) {

        navAvatar.textContent = "U";

    }

}


}


    const profileName = document.getElementById("profileName");
    const profileUsername = document.getElementById("profileUsername");
    const profileBio = document.getElementById("profileBio");
    const profileFollowers = document.getElementById("profileFollowers");
    const profileFollowing = document.getElementById("profileFollowing");
    const profileFollowBtn = document.getElementById("profileFollowBtn");

    const profilePosts = document.getElementById("profilePosts");
    const profilePostsGrid = document.getElementById("profilePostsGrid");
    const profileNoPosts = document.getElementById("profileNoPosts");

    const urlParams = new URLSearchParams(window.location.search);

    let requestedUsername = urlParams.get("user");


    if (!requestedUsername) {

        window.location.href = "users.html";

        return;

    }
    requestedUsername = requestedUsername.trim().toLowerCase();


    if (!requestedUsername.startsWith("@")) {

        requestedUsername = "@" + requestedUsername;

    }
let selectedUser = null;

try {

    const token = localStorage.getItem("miniInstoToken");

const usersResponse = await fetch("http://localhost:5000/api/users",
        {
            headers: {
                "Authorization":
                    "Bearer " + token
            }
        }
    );

    if (!usersResponse.ok) {
        throw new Error("Failed to load users.");
    }

    const users = await usersResponse.json();
    selectedUser = users.find(function (user) {

            const username = String(user.username || "").trim().toLowerCase().replace("@", "");
            const requested = requestedUsername.replace("@", "");

            return username === requested;

        });

    if (!selectedUser) {

        window.location.href = "users.html";

        return;

    }

} catch (error) {

    console.error("Failed to load user:",error);

    return;
}
try {

    const profileResponse = await fetch("http://localhost:5000/api/users/" + selectedUser._id);

    if (profileResponse.ok) {

    const profileData = await profileResponse.json();

    selectedUser.followers = profileData.followers || 0;
    selectedUser.following = profileData.following || 0;

    profileFollowers.textContent = selectedUser.followers;
    profileFollowing.textContent = selectedUser.following;

}

} catch (error) {

    console.error("Failed to load follow counts:",error);

}
    profileAvatar.textContent = selectedUser.name.charAt(0).toUpperCase();
    profileName.textContent = selectedUser.name;
    profileUsername.textContent = selectedUser.username;
    profileBio.textContent = selectedUser.bio;
    profileFollowing.textContent = selectedUser.following || 0;

const token = localStorage.getItem("miniInstoToken");

profileFollowBtn.dataset.username = selectedUser.username;
console.log("FOLLOW LISTENER REACHED");

profileFollowBtn.dataset.userId = selectedUser._id;
    updateFollowButton(profileFollowBtn);


profileFollowBtn.addEventListener("click",async function () {

        await handleFollowClick(profileFollowBtn);
        await updateFollowButton(profileFollowBtn);

        const updatedUserResponse = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`);

        if (updatedUserResponse.ok) {

            const updatedUser = await updatedUserResponse.json();

            profileFollowers.textContent = updatedUser.followers || 0;
        }
    }
);


    function normalizeContentUsername(username) {

        let value = String(username || "").trim().toLowerCase();

        if (!value) {

            return "";

        }

        if (!value.startsWith("@")) {

            value = "@" + value;

        }

        return value;

    }

async function getUserContent() {

    try {
        console.log("FOLLOW CLICKED");

        const response = await fetch("http://localhost:5000/api/posts/user/" + selectedUser._id);
            

        if (!response.ok) {
            throw new Error("Failed to load user posts.");
        }

        const posts = await response.json();

        return posts.map(function (item) {

            return {

                id:
                    item._id,

                type:
                    item.type,

                file:
                    "http://localhost:5000" +
                    item.media,

                user:
                    item.user
                        ? item.user.name
                        : selectedUser.name,

                username:
                    item.user
                        ? "@" + item.user.username
                        : selectedUser.username,

                caption:
                    item.caption || "",

                likes:
                    Number(item.likesCount) || 0,

                comments:
                    []

            };

        });

    } catch (error) {

        console.error("Failed to load user posts:",error);

        return [];

    }

}

    function createProfilePost(item) {

        const article = document.createElement("article");
        article.classList.add("post-card");

        const postHeader = document.createElement("div");
        postHeader.classList.add("post-header");

        const postUser = document.createElement("div");
        postUser.classList.add("post-user");

        const userAvatar = document.createElement("div");
        userAvatar.classList.add("post-avatar");


        userAvatar.textContent =
            item.user
                ? item.user
                    .charAt(0)
                    .toUpperCase()
                : "U";


        const userInfo = document.createElement("div");
        userInfo.classList.add("post-user-info");


        const userName = document.createElement("strong");
        userName.textContent = item.user || "MiniInsto User";

        const userUsername = document.createElement("span");
        userUsername.textContent = item.username || "@user";

        userInfo.appendChild(userName);
        userInfo.appendChild(userUsername);

        postUser.appendChild(userAvatar);
        postUser.appendChild(userInfo);

        const followBtn = document.createElement("button");

followBtn.type = "button";
followBtn.classList.add("post-follow-btn");
followBtn.textContent = "Follow";
followBtn.dataset.username = item.username || selectedUser.username;
followBtn.dataset.userId = selectedUser._id;

    updateFollowButton(followBtn);


followBtn.addEventListener("click",async function (event) {

        event.preventDefault();
        event.stopPropagation();

        await handleFollowClick(followBtn);
    }
);

        postHeader.appendChild(postUser);
        postHeader.appendChild(followBtn);

        let media;


        if (item.type === "reel") {

            media = document.createElement("video");
            media.src = item.file;
            media.classList.add("post-image");
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
            media.controls = true;
            media.setAttribute("playsinline","");
            media.setAttribute("webkit-playsinline","");
            media.preload = "metadata";
            media.addEventListener("loadeddata",function () {
            media.play().catch(function () {

            console.log("Autoplay blocked.");

                        }
                    );

                }
            );


            media.addEventListener("click",function () {

                    if (media.paused) {

                        media.play().catch(function () {
                        console.log("Video could not be played.");

                            }
                        );

                    }

                    else {

                        media.pause();

                    }

                }
            );

        }

        else {

            media = document.createElement("img");
            media.src = item.file;
            media.alt = (item.user || "MiniInsto") + " post";
            media.classList.add("post-image");

        }

        const actions = document.createElement("div");

        actions.classList.add("post-actions");

        const likeBtn = document.createElement("button");

        likeBtn.type = "button";
        likeBtn.classList.add("action-btn","like-btn");
        likeBtn.setAttribute("aria-label","Like post");

        likeBtn.innerHTML = `
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <path d="
                    M20.8 8.8
                    c0-3-2.4-5.3-5.3-5.3
                    -1.7 0-3.2.8-4.2 2.1
                    -1-1.3-2.5-2.1-4.2-2.1
                    -2.9 0-5.3 2.3-5.3 5.3
                    0 5.8 9.5 10.5 9.5 10.5
                    s9.5-4.7 9.5-10.5z">
                </path>

            </svg>
        `;


        const commentBtn = document.createElement("button");
        commentBtn.type = "button";
        commentBtn.classList.add("action-btn","comment-btn");
        commentBtn.setAttribute("aria-label","Comment");
        commentBtn.innerHTML = `
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <path d="
                    M21 11.5
                    a8.4 8.4 0 0 1-9 8.5
                    9.8 9.8 0 0 1-4-.8
                    L3 21l1.8-4.7
                    A8.4 8.4 0 0 1 3 11.5
                    8.5 8.5 0 0 1 12 3
                    a8.5 8.5 0 0 1 9 8.5z">
                </path>

            </svg>
        `;

        const shareBtn = document.createElement("button");
        shareBtn.type = "button";
        shareBtn.classList.add("action-btn","share-btn");
        shareBtn.setAttribute("aria-label","Share");

        shareBtn.innerHTML = `
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <path d="M22 2L11 13"></path>

                <path d="
                    M22 2l-7 20-4-9-9-4z">
                </path>

            </svg>
        `;

        const saveBtn = document.createElement("button");

        saveBtn.type = "button";
        saveBtn.classList.add("action-btn","save-btn");
        saveBtn.setAttribute("aria-label","Save post");

        saveBtn.innerHTML = `
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <path d="
                    M6 3
                    h12
                    a1 1 0 0 1 1 1
                    v17
                    l-7-4-7 4V4
                    a1 1 0 0 1 1-1z">
                </path>

            </svg>
        `;


        actions.appendChild(likeBtn);
        actions.appendChild(commentBtn);
        actions.appendChild(shareBtn);
        actions.appendChild(saveBtn);

        let likes = Number(item.likes) || 0;


        const likesWrapper = document.createElement("div");
        likesWrapper.classList.add("likes-wrapper");

        const likesCount = document.createElement("span");
        likesCount.classList.add("likes-count");
        likesCount.textContent = likes + "likes";
        likesWrapper.appendChild(likesCount);

        const caption = document.createElement("p");
        caption.classList.add("post-caption");

        const captionStrong = document.createElement("strong");
        captionStrong.textContent = item.user || "MiniInsto";

        caption.appendChild(captionStrong);
        caption.appendChild(document.createTextNode(" " + (item.caption || item.search || "")
    )
);

        const commentsSection = document.createElement("div");
        commentsSection.classList.add("comments-section");

        const commentsList = document.createElement("div");
        commentsList.classList.add("comments-list");

        const comments =
            Array.isArray(
                item.comments
            )
                ? item.comments
                : [];


        comments.forEach(function (commentItem) {

                const comment = document.createElement("div");
                comment.classList.add("comment");

                const strong = document.createElement("strong");
                strong.textContent = commentItem.username || commentItem.user || "User";

                comment.appendChild(strong);
                comment.appendChild(document.createTextNode(" " + (commentItem.text || commentItem.comment || "")
            )
                );
                commentsList.appendChild(comment);

            }
        );
        const commentForm = document.createElement("form");
        commentForm.classList.add("comment-form");

        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.classList.add("comment-input");
        commentInput.placeholder = "Add a comment...";
        commentInput.autocomplete = "off";

        const commentPostBtn = document.createElement("button");
        commentPostBtn.type = "submit";
        commentPostBtn.classList.add("comment-post-btn");
        commentPostBtn.textContent = "Post";
        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentPostBtn);
        commentsSection.appendChild(commentsList);
        commentsSection.appendChild(commentForm);

        commentForm.addEventListener("submit",function (event) {

                event.preventDefault();


                if (typeof checkLogin === "function") {

                    if (!checkLogin()) {

                        return;

                    }

                }


                const text = commentInput.value.trim();

                if (!text) {

                    return;

                }

                let currentUsername = "You";

                const sessionData = localStorage.getItem("miniInstoSession");

                if (sessionData) {

                    try {

                        const session = JSON.parse(sessionData);
                        currentUsername = session.username || session.name || "You";

                    }

                    catch (error) {

                        currentUsername = "You";

                    }

                }

                if (!Array.isArray(item.comments)) {

                    item.comments = [];

                }


                item.comments.push({

                    username:
                        currentUsername,

                    text:
                        text

                });


                const comment = document.createElement("div");
                comment.classList.add("comment");

                const strong = document.createElement("strong");
                strong.textContent = currentUsername;

                comment.appendChild(strong);
                comment.appendChild(document.createTextNode(" " + text));
                commentsList.appendChild(comment);
                commentInput.value = "";

            }
        );

async function loadLikeStatus() {

    try {

        const token = localStorage.getItem("miniInstoToken");

        const response = await fetch("http://localhost:5000/api/likes/status/check?post=" + item.id,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        if (data.isLiked) {

            likeBtn.classList.add("liked");

            const svg = likeBtn.querySelector("svg");

            if (svg) {
                svg.setAttribute("fill","currentColor");
            }

        }

    } catch (error) {

        console.error("Failed to load like status:",error);

    }

}

loadLikeStatus();

likeBtn.addEventListener("click",async function () {

        if (typeof checkLogin === "function" && !checkLogin()) {
            return;
        }

        const token = localStorage.getItem("miniInstoToken");
        const liked = likeBtn.classList.contains("liked");

        try {

            const response = await fetch("http://localhost:5000/api/likes",
                    {
                        method:
                            liked
                                ? "DELETE"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token
                        },

                        body:
                            JSON.stringify({
                                post: item.id
                            })
                    }
                );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Unable to update like.");

                return;

            }

            if (liked) {

                likes = Math.max(0, likes - 1);

                likeBtn.classList.remove("liked");

            } else {

                likes++;
                likeBtn.classList.add("liked");

            }

            likesCount.textContent = likes + " likes";

            const svg = likeBtn.querySelector("svg");

            if (svg) {

                svg.setAttribute(
                    "fill",
                    !liked
                        ? "currentColor"
                        : "none"
                );
            }

        } catch (error) {

            console.error("Like error:",error);

        }

    }
);

        commentBtn.addEventListener("click",function () {

                if (typeof checkLogin === "function") {

                    if (!checkLogin()) {

                        return;

                    }

                }

                commentInput.focus();

            }
        );

        shareBtn.addEventListener("click",async function () {

                if (typeof checkLogin === "function"
) {

                    if (!checkLogin()) {

                        return;

                    }

                }


                const shareText = "Check out " + (item.username || item.user || "this post") + " on MiniInsto!";


                if (navigator.share) {

                    try {

                        await navigator.share({

                            title:
                                "MiniInsto",

                            text:
                                shareText,

                            url:
                                window.location.href

                        });

                    }

                    catch (error) {

                        console.log("Share cancelled.");

                    }

                }

                else if (navigator.clipboard) {

                    try {

                        await navigator.clipboard.writeText(window.location.href);


                        alert("Post link copied!");

                    }

                    catch (error) {

                        alert("Unable to copy post link.");

                    }

                }

                else {

                    alert("Share is not supported on this browser.");

                }

            }
        );

        saveBtn.addEventListener("click",function () {

                if (typeof checkLogin === "function") {

                    if (!checkLogin()) {

                        return;

                    }

                }


                saveBtn.classList.toggle("saved");
                const svg = saveBtn.querySelector("svg");
                if (svg) {

                    svg.setAttribute(
                        "fill",
                        saveBtn.classList.contains(
                            "saved"
                        )
                            ? "currentColor"
                            : "none"
                    );

                }

            }
        );

        article.appendChild(postHeader);
        article.appendChild(media);
        article.appendChild(actions);
        article.appendChild(likesWrapper);
        article.appendChild(caption);
        article.appendChild(commentsSection);

        return article;

    }

    const userContent = await getUserContent();


    if (profilePosts) {

        profilePosts.textContent = userContent.length;

    }


    if (profilePostsGrid) {

        profilePostsGrid.innerHTML = "";


        if (userContent.length === 0) {

            if (profileNoPosts) {

                profileNoPosts.style.display = "block";

            }

        }

        else {

            if (profileNoPosts) {

                profileNoPosts.style.display = "none";

            }


            userContent.forEach(function (item) {

                    const card = createProfilePost(item);
                    profilePostsGrid.appendChild(card);

                }
            );

        }

    }

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click",function () {

                mobileMenu.classList.toggle("active");

            }
        );

    }

});