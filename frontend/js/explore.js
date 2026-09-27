document.addEventListener("DOMContentLoaded", async function () {

    const searchInput = document.getElementById("exploreSearch");
    const filterButtons = document.querySelectorAll(".explore-filter");
    const exploreContainer = document.getElementById("exploreGrid");
    const noResults = document.getElementById("noResults");
    const logoutBtn = document.getElementById("logoutBtn");

let exploreItems = [];

try {

    const response = await fetch("http://localhost:5000/api/posts");

    if (!response.ok) {
        throw new Error("Failed to fetch posts.");
    }

    const posts = await response.json();

    exploreItems = posts.map(function (item) {

            return {

                id:
                    item._id,
                
                userId: item.user
        ? item.user._id
        : null,

                type:
                    (
                        item.type ||
                        "post"
                    ).toLowerCase(),

                file:
                    "http://localhost:5000" +
                    item.media,

                user:
                    item.user
                        ? item.user.name
                        : "MiniInsto User",

                username:
                    item.user
                        ? "@" + item.user.username
                        : "@user",

                caption:
                    item.caption ||
                    "",

                search:
                    item.caption ||
                    "",

                likes:
                    Number(item.likesCount) || 0,

                liked:
                    false,

                comments:
                    []

            };

        });

    console.log("Explore posts from MongoDB:", exploreItems);

} catch (error) {

    console.error("Failed to load Explore posts:",error);

    if (noResults) {
        noResults.style.display = "block";
        noResults.textContent = "Unable to load posts.";
    }

    return;
}

let currentFilter = "all";


async function checkExploreComments(postId, commentsList) {

    if (!postId || !commentsList) {
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/comments/post/" + postId);
        const comments = await response.json();

        if (!response.ok) {
            return;
        }

        if (comments.length > 0) {

             commentsList.innerHTML = "";
            const commentAdded = document.createElement("button");

            commentAdded.type = "button";
            commentAdded.classList.add("comment-added");
            commentAdded.textContent ="Comment added";

            commentAdded.addEventListener("click",function () {

                    openExploreCommentsView(postId);

                }
            );
            commentsList.appendChild(commentAdded);

        }

    } catch (error) {

        console.error("Error checking Explore comments:", error);

    }

}

async function loadExplorePostComments(postId,commentsList) {

    if (!postId || !commentsList) {
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/comments/post/" + postId);
        const comments = await response.json();

        if (!response.ok) {

            throw new Error(comments.message ||"Failed to load comments");

        }

        commentsList.innerHTML = "";

        comments.forEach(function (commentItem) {

                const comment = document.createElement("div");
                comment.classList.add("comment");


                const commentUser =commentItem.user? (commentItem.user.username || commentItem.user.name || "User"): "User";
                const commentText = commentItem.text || "";
                const strong = document.createElement("strong");

                strong.textContent = commentUser;
                comment.appendChild(strong);
                comment.appendChild(document.createTextNode(" " + commentText)
                );

                commentsList.appendChild(comment);

            }
        );


    } catch (error) {

        console.error("Error loading Explore comments:",error);

    }

}


function openExploreCommentsView(postId) {

    if (!postId) {
        return;
    }

    let commentsView = document.getElementById("exploreCommentsView");


    if (!commentsView) {

        commentsView = document.createElement("div");
        commentsView.id = "exploreCommentsView";
        commentsView.classList.add("home-comments-view");

        const header = document.createElement("div");
        header.classList.add("comments-view-header");

        const backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.classList.add("comments-back-btn");

        backBtn.textContent = "Back";
        const title = document.createElement("h2");
        title.textContent = "Comments";


        header.appendChild(backBtn);
        header.appendChild(title);

        const commentsList = document.createElement("div");

        commentsList.classList.add("comments-view-list");
        commentsView.appendChild(header);
        commentsView.appendChild(commentsList);

        backBtn.addEventListener("click", function () {

                commentsView.style.display = "none";


                if (exploreContainer) {

                    exploreContainer.style.display = "grid";

                }

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        document.body.appendChild(commentsView);

    }

    const commentsList = commentsView.querySelector(".comments-view-list");

    commentsList.innerHTML = "";

    commentsView.style.display = "block";

    if (exploreContainer) {

        exploreContainer.style.display = "none";

    }

    loadExplorePostComments(postId, commentsList);

}

function createExploreCard(item) {

    const article = document.createElement("article");
    article.classList.add("post-card");

    if (item.id) {

        article.dataset.postId = item.id;

    }

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
        const userName = document.createElement("h3");
        userName.textContent = item.user || "MiniInsto User";

        const userUsername = document.createElement("p");

        userUsername.textContent = item.username || "@user";

        userInfo.appendChild(userName);
        userInfo.appendChild(userUsername);
        postUser.appendChild(userAvatar);
        postUser.appendChild(userInfo);

        const followBtn = document.createElement("button");

        followBtn.type = "button";
        followBtn.classList.add("post-follow-btn");
        followBtn.dataset.username = item.username || "@user";
        followBtn.dataset.userId = item.userId || "";

        if (typeof updateFollowButton === "function") {

            updateFollowButton(followBtn);

        } else {

            followBtn.textContent ="Follow";

        }

        followBtn.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                if (typeof handleFollowClick === "function") {

                    handleFollowClick(followBtn);

                } else {

                    console.log("Global follow system not loaded.");

                }

            }
        );

        postHeader.appendChild(postUser);
        postHeader.appendChild(followBtn);

        let media;


        if (item.type === "reel") {

            media = document.createElement("video");
            media.src = item.file;
            media.classList.add("post-image");
            media.muted =true;
            media.loop =true;
            media.playsInline =true;
            media.setAttribute("playsinline", "");
            media.setAttribute("webkit-playsinline", "");
            media.preload = "metadata";
            media.controls = true;


            media.addEventListener("loadeddata", function () {

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

                    } else {

                        media.pause();

                    }

                }
            );


        } else {

            media = document.createElement("img");
            media.src = item.file;
            media.alt = (item.user || "MiniInsto") + " post";
            media.classList.add("post-image");

        }

        const actions = document.createElement("div");
        actions.classList.add("post-actions");

        const likeBtn = document.createElement("button");

        likeBtn.classList.add("action-btn", "like-btn");
        likeBtn.type = "button";
        likeBtn.setAttribute("aria-label", "Like post");


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
        commentBtn.classList.add("action-btn","comment-btn");
        commentBtn.type = "button";

        commentBtn.setAttribute("aria-label", "Comment");


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

        shareBtn.classList.add("action-btn", "share-btn");
        shareBtn.type = "button";

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

        saveBtn.classList.add("action-btn","save-btn");
        saveBtn.type = "button";
        saveBtn.setAttribute("aria-label", "Save post");


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

        const likesCount = document.createElement("span");

        likesCount.classList.add("likes-count");
        likesCount.textContent = item.likes + " likes";

        if (item.liked) {

            likeBtn.classList.add("liked");
            const svg = likeBtn.querySelector("svg");


            if (svg) {

                svg.setAttribute("fill","currentColor");

            }

        }


        const likesWrapper = document.createElement("div");

        likesWrapper.classList.add("likes-wrapper");
        likesWrapper.appendChild(likesCount);

        const caption = document.createElement("p");
        caption.classList.add("post-caption");

        const captionStrong = document.createElement("strong");

        captionStrong.textContent = item.user || "MiniInsto";
        caption.appendChild(captionStrong);


        const captionText = item.caption || item.search || "Enjoy this content ✨";
        caption.appendChild(document.createTextNode(" " + captionText)
);

        const commentsSection = document.createElement("div");
        commentsSection.classList.add("comments-section");

        const commentsList = document.createElement("div");
        commentsList.classList.add("comments-list");

if (item.id) {

    checkExploreComments(item.id,commentsList);

}

        const commentForm = document.createElement("form");
        commentForm.classList.add("comment-form");


        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.classList.add("comment-input");
        commentInput.placeholder ="Add a comment...";
        commentInput.autocomplete = "off";

        const commentPostBtn = document.createElement("button");
        commentPostBtn.type = "submit";
        commentPostBtn.classList.add("comment-post-btn");
        commentPostBtn.textContent = "Post";
        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentPostBtn);
        commentsSection.appendChild(commentsList);
        commentsSection.appendChild(commentForm);

commentForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (typeof checkLogin === "function") {

            if (!checkLogin()) {
                return;
            }

        }

        if (!item.id) {

            console.error("Post ID not found for comment.");

            return;

        }

        const commentText = commentInput.value.trim();


        if (!commentText) {
            return;
        }

        const token = localStorage.getItem("miniInstoToken");

        if (!token) {

            alert("Please login again.");

            return;

        }


        try {

            const response = await fetch("http://localhost:5000/api/comments", {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                token
                        },

                        body:
                            JSON.stringify({

                                postId:
                                    item.id,

                                text:
                                    commentText

                            })
                    }
                );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(data.message || "Failed to add comment");

            }


            commentInput.value =
                "";

            commentsList.innerHTML = "";

            const commentAdded = document.createElement("button");

            commentAdded.type = "button";
            commentAdded.classList.add("comment-added");
            commentAdded.textContent = "Comment added";
            commentAdded.addEventListener("click", function () {

                    openExploreCommentsView(item.id);

                }
            );


            commentsList.appendChild(commentAdded);
            console.log("Explore comment saved to MongoDB:", data.comment);


        } catch (error) {

            console.error("Explore comment save error:", error);


            alert(error.message || "Unable to add comment."
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

        commentBtn.addEventListener("click", function () {

                if (typeof checkLogin === "function") {

                    if (!checkLogin()) {
                        return;
                    }

                }


                commentInput.focus();

            }
        );

        shareBtn.addEventListener("click", async function () {

                if (typeof checkLogin === "function") {

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

                    } catch (error) {

                        console.log("Share cancelled.");

                    }


                } else if (navigator.clipboard) {

                    try {

                        await navigator.clipboard.writeText(window.location.href);
                        alert("Post link copied!");


                    } catch (error) {

                        alert("Unable to copy post link.");

                    }


                } else {

                    alert("Share is not supported on this browser.");

                }

            }
        );

        saveBtn.addEventListener("click", function () {

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


        return article;

    }

    function displayContent() {

        exploreContainer.innerHTML = "";


        const searchText = searchInput? searchInput.value.trim().toLowerCase(): "";


        let visibleCards = 0;

        exploreItems.forEach(function (item) {

                const typeMatches = currentFilter === "all" || item.type === currentFilter;

                const searchableText =
                    (
                        item.search +
                        " " +
                        item.username +
                        " " +
                        item.user +
                        " " +
                        item.caption
                    ).toLowerCase();

                const searchWords =
                    searchText
                        .split(/\s+/)
                        .filter(
                            function (word) {

                                return (
                                    word.length > 0
                                );

                            }
                        );


                const searchMatches = searchWords.length === 0 || searchWords.every(
                        function (word) {

                            return searchableText
                                .includes(word);

                        }
                    );

                if (typeMatches && searchMatches) {

                    const card = createExploreCard(item);

                    exploreContainer.appendChild(card);
                    visibleCards++;

                }

            }
        );


        if (typeof setupGlobalFollowButtons === "function") {

            setupGlobalFollowButtons();

        }

if (typeof initializeAllLikeButtons === "function") {

    initializeAllLikeButtons();

}

        if (noResults) {

            noResults.style.display =
                visibleCards === 0
                    ? "block"
                    : "none";

        }

    }


filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

                filterButtons.forEach(function (btn) {

                        btn.classList.remove("active");

                    }
                );


                button.classList.add("active");
                currentFilter = button.getAttribute("data-filter") || "all";

                displayContent();

            }
        );

    }
);


if (searchInput) {

    searchInput.addEventListener("input", function () {

            displayContent();

        }
    );

}


    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");


    if (type === "reels") {

        currentFilter = "reel";

        filterButtons.forEach(function (button) {

                button.classList.remove("active");


                if (button.getAttribute("data-filter") === "reel") {

                    button.classList.add("active");

                }

            }
        );

    }


    displayContent();


    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

                localStorage.removeItem("miniInstoSession");
                window.location.href = "index.html";

            }
        );

    }

    const sessionData = localStorage.getItem("miniInstoSession");

    let session = null;


    if (sessionData) {

        try {

            session = JSON.parse(sessionData);

        } catch (error) {

            console.log("Unable to read session.");

        }

    }


    const navAvatar = document.querySelector(".nav-avatar");


    const bottomAvatar = document.querySelector(".bottom-avatar");


    if (session && session.name) {

        const initial =
            session.name
                .trim()
                .charAt(0)
                .toUpperCase();


        if (navAvatar) {

            navAvatar.textContent = initial;

        }


        if (bottomAvatar) {

            bottomAvatar.textContent = initial;

        }

    }

});