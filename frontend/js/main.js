

function getSession() {

    const sessionData = localStorage.getItem("miniInstoSession");

    if (!sessionData) {
        return null;
    }

    try {

        return JSON.parse(sessionData);

    } catch (error) {

        console.log("Unable to read MiniInsto session:", error);

        return null;
    }
}

function isLoggedIn() {

    return getSession() !== null;
}


function checkLogin() {

    if (isLoggedIn()) {
        return true;
    }

    const authModal = document.getElementById("authModal");

    if (authModal) {
        authModal.classList.add("active");
    }

    return false;
}


function setupAuthModal() {

    const exploreButton = document.getElementById("exploreMiniInsto");
    const authModal = document.getElementById("authModal");
    const closeAuthModal =document.getElementById("closeAuthModal");


    if (exploreButton && authModal) {

        exploreButton.addEventListener("click",function () {

                if (isLoggedIn()) {

                    const feedSection = document.getElementById("posts");

                    if (feedSection) {

                        feedSection.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                } else {

                    authModal.classList.add("active");
                }
            }
        );
    }


    if (closeAuthModal && authModal) {

        closeAuthModal.addEventListener("click",function () {

                authModal.classList.remove("active");
            }
        );
    }


    if (authModal) {

        authModal.addEventListener("click", function (event) {

                if (event.target === authModal) {

                    authModal.classList.remove("active");
                }
            }
        );
    }
}


function setupNavbarAvatar() {

    const navAvatar = document.getElementById("navAvatar");

    if (!navAvatar) {
        return;
    }

    const session = getSession();

    if (!session) {

        navAvatar.textContent = "U";

        return;
    }

    const userName = session.name || session.username || "";

    if (userName) {

        navAvatar.textContent =
            userName
                .charAt(0)
                .toUpperCase();

    } else {

        navAvatar.textContent = "U";
    }
}

function setupAuthUI() {

    const guestNav = document.getElementById("guestNav");
    const userNav = document.getElementById("userNav");
    const mobileGuestNav = document.getElementById("mobileGuestNav");
    const mobileUserNav = document.getElementById("mobileUserNav");
    const feedSection = document.getElementById("posts");
    const mobileBottomNav = document.querySelector(".mobile-bottom-nav");
    const createOptions = document.getElementById("createOptions");
    const footer = document.querySelector(".footer");
    const heroSection = document.querySelector(".hero-section");
    const session = getSession();


    if (!session) {

        if (guestNav) {
            guestNav.style.display = "flex";
        }

        if (userNav) {
            userNav.style.display = "none";
        }

        if (mobileGuestNav) {
            mobileGuestNav.style.display = "block";
        }

        if (mobileUserNav) {
            mobileUserNav.style.display = "none";
        }

        if (heroSection) {
            heroSection.style.display = "block";
        }

        if (feedSection) {
            feedSection.style.display = "none";
        }

        if (mobileBottomNav) {
            mobileBottomNav.style.display = "none";
        }

        if (createOptions) {
            createOptions.style.display = "none";
        }

        if (footer) {
            footer.style.display = "none";
        }

        return;
    }


    if (guestNav) {
        guestNav.style.display = "none";
    }

    if (userNav) {
        userNav.style.display = "flex";
    }

    if (mobileGuestNav) {
        mobileGuestNav.style.display = "none";
    }

    if (mobileUserNav) {
        mobileUserNav.style.display = "block";
    }

    if (feedSection) {
        feedSection.style.display = "block";
    }

    if (mobileBottomNav) {
        mobileBottomNav.style.display = "flex";
    }

    if (createOptions) {
        createOptions.style.display = "none";
    }

    if (footer) {
        footer.style.display = "block";
    }

    if (heroSection) {
        heroSection.style.display = "block";
    }



    const userName = session.name || session.username || "User";

    const navAvatar = document.getElementById("navAvatar");

    if (navAvatar) {

        navAvatar.textContent = userName.charAt(0).toUpperCase();
    }
    const bottomAvatar = document.getElementById("bottomAvatar");

    if (bottomAvatar) {

        bottomAvatar.textContent = userName.charAt(0).toUpperCase();
    }
}

function setupLogout() {

    const logoutBtn = document.getElementById("logoutBtn");
    const mobileLogout = document.getElementById("mobileLogout");

    function logoutUser() {

        localStorage.removeItem("miniInstoSession");
        localStorage.removeItem("miniInstoToken");
        window.location.href = "index.html";
    }


    if (logoutBtn) {

        logoutBtn.addEventListener("click",logoutUser);
    }


    if (mobileLogout) {

        mobileLogout.addEventListener("click",logoutUser);
    }
}

function setupMobileMenu() {

    const menuToggle = document.getElementById("menuToggle");

    const mobileMenu = document.getElementById("mobileMenu");


    if (!menuToggle || !mobileMenu) {
        return;
    }


    menuToggle.addEventListener("click", function () {

            mobileMenu.classList.toggle("active");
        }
    );


    const mobileLinks = mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(function (link) {

            link.addEventListener("click",function () {

                    mobileMenu.classList.remove("active");
                }
            );
        }
    );
}



const seeMoreBtn = document.getElementById("seeMoreBtn");
const homeNoMore = document.getElementById("homeNoMore");
const homeExploreContent = document.getElementById("homeExploreContent");


let homeContentIndex = 0;

const itemsPerClick = 5;

let homeAllContent = [];

let homeBackendContent = [];


async function checkPostComments(
    postId,
    commentsList
) {
    if (!postId || !commentsList) {
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/comments/post/" + postId);

        const comments = await response.json();

        if (!response.ok) {
            throw new Error(comments.message || "Failed to check comments");
        }

        commentsList.innerHTML = "";

        if (comments.length > 0) {

            const commentAdded = document.createElement("button");

            commentAdded.type = "button";

            commentAdded.classList.add("comment-added");

            commentAdded.textContent = "Comment added";

            commentAdded.addEventListener("click",function () {

                    openCommentsView(postId);

                }
            );

            commentsList.appendChild(commentAdded);
        }

    } catch (error) {

        console.error("Error checking comments:",error);
    }
}

function openCommentsView(postId) {

    if (!postId) {
        return;
    }


    let commentsView = document.getElementById("homeCommentsView");

    if (!commentsView) {

        commentsView = document.createElement("div");
        commentsView.id = "homeCommentsView";
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

        backBtn.addEventListener("click",function () {

                commentsView.style.display = "none";

                const homePosts = document.getElementById("posts");

                if (homePosts) {
                    homePosts.style.display = "block";
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
    const homePosts = document.getElementById("posts");

    if (homePosts) {
        homePosts.style.display = "none";
    }

    loadPostComments(
        postId,
        commentsList
    );
}

async function loadPostComments(
    postId,
    commentsList
) {

    if (!postId || !commentsList) {
        return;
    }

    try {

        console.log("Loading comments for post:",postId);

        const response = await fetch("http://localhost:5000/api/comments/post/" + postId);
        const comments = await response.json();

        console.log("Comments received:",comments);

        if (!response.ok) {

            throw new Error(comments.message || "Failed to load comments");

        }

        if (!Array.isArray(comments) || comments.length === 0) {

            const noComments = document.createElement("p");
            noComments.textContent = "No comments yet.";
            noComments.classList.add("comment");

            commentsList.appendChild(noComments);

            return;
        }

        comments.forEach(function (comment) {

                const commentElement = document.createElement("div");
                commentElement.classList.add("comment");

                const username = document.createElement("strong");

                if (comment.user && comment.user.username) {

                    username.textContent =
                        comment.user.username
                            .startsWith("@")
                            ? comment.user.username
                            : "@" +
                              comment.user.username;

                } else {

                    username.textContent = "@user";

                }

                const commentText = document.createTextNode(" " + (comment.text || ""));

                commentElement.appendChild(username);

                commentElement.appendChild(commentText);

                commentsList.appendChild(commentElement);

            }
        );

    } catch (error) {

        console.error("Error loading post comments:", error);

        const errorMessage = document.createElement("p");
        errorMessage.classList.add("comment");
        errorMessage.textContent = "Unable to load comments.";
        commentsList.appendChild(errorMessage);

    }
}

function createHomeContent(item) {

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

    postHeader.appendChild(postUser);


   const followBtn = document.createElement("button");

followBtn.type = "button";

followBtn.classList.add("post-follow-btn");

followBtn.dataset.username = item.username || "@user";

followBtn.dataset.userId = item.userId || "";

if (typeof updateFollowButton === "function" && followBtn.dataset.userId) {
    updateFollowButton(followBtn);
} else {
    followBtn.textContent = "Follow";
}

followBtn.addEventListener("click",async function (event) {

        event.preventDefault();
        event.stopPropagation();

        console.log("HOME FOLLOW CLICKED:", item.username);

        if (!followBtn.dataset.userId) {

            if (typeof getUserIdByUsername === "function") {

                const userId = await getUserIdByUsername(item.username);

                if (userId) {

                    followBtn.dataset.userId = userId;

                    console.log("HOME USER ID FOUND:",userId);

                } else {

                    console.log("HOME USER NOT FOUND:",item.username);

                    return;
                }
            }
        }

        

        if (typeof handleFollowClick === "function") {

            await handleFollowClick(followBtn);

        } else {

            console.error("handleFollowClick is not loaded.");
        }
    }
);

postHeader.appendChild(followBtn);

    let media;


    if (item.type === "reel") {

        media = document.createElement("video");
        media.src = item.file;
        media.classList.add("post-image");
        media.muted = true;
        media.loop = true;
        media.playsInline = true;

        media.setAttribute("playsinline","");
        media.setAttribute("webkit-playsinline","");

        media.preload = "auto";
        media.controls = true;
        media.addEventListener("loadeddata",function () {
                media.play().catch(function () {

                        console.log("Autoplay blocked. User can play video manually.");
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
        media.alt =(item.user || "MiniInsto") + " post";
        media.classList.add("post-image");
        media.addEventListener("error",function () {
        console.error("Image failed to load:",item.file);
            }
        );
    }

    const actions = document.createElement("div");
    actions.classList.add("post-actions");

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("action-btn","like-btn");

    likeBtn.type = "button";
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

    commentBtn.classList.add("action-btn","comment-btn");
    commentBtn.type = "button";
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
    shareBtn.classList.add("action-btn","share-btn");
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

    if (typeof item.likes !== "number") {

        const existingLikes = Number(item.likes);

        if (Number.isFinite(existingLikes)) {

            item.likes = existingLikes;

        } else {

            item.likes = 0;
        }
    }


    if (typeof item.liked !== "boolean") {

        item.liked = false;
    }


    const likesWrapper = document.createElement("div");
    likesWrapper.classList.add("likes-wrapper");

    const likesCount = document.createElement("span");
    likesCount.classList.add("likes-count");


    function updateLikeDisplay() {

        likesCount.textContent = item.likes + " likes";


        if (item.liked) {

            likeBtn.classList.add("liked");

        } else {

            likeBtn.classList.remove("liked");
        }
        const svg = likeBtn.querySelector("svg");


        if (svg) {

            svg.setAttribute(
                "fill",
                item.liked
                    ? "currentColor"
                    : "none"
            );
        }
    }


    likesWrapper.appendChild(likesCount);

    updateLikeDisplay();

    const caption = document.createElement("p");
    caption.classList.add("post-caption");

    const captionText = getCaption(item);


    const captionStrong = document.createElement("strong");
    captionStrong.textContent = item.user || "MiniInsto";
    caption.appendChild(captionStrong);
    caption.appendChild(document.createTextNode(" " + captionText)
    );

const commentsSection = document.createElement("div");
commentsSection.classList.add("comments-section");


const commentsList = document.createElement("div");
commentsList.classList.add("comments-list");


if (item.id) {

    checkPostComments(item.id, commentsList);

}

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

commentForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!checkLogin()) {
            return;
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

            const response = await fetch("http://localhost:5000/api/comments",
                    {
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
            const savedComment = data.comment;


const commentAdded = document.createElement("button");
commentAdded.type = "button";
commentAdded.classList.add("comment-added");

commentAdded.textContent = "Comment added";
commentAdded.addEventListener("click",function () {

        openCommentsView(item.id);
    }
);

commentsList.innerHTML = "";

commentsList.appendChild(commentAdded);

commentInput.value = "";


            console.log("Comment saved to MongoDB:",savedComment);
        } catch (error) {

            console.error("Comment save error:",error);
            alert(error.message || "Unable to add comment.");

        }

    }
);


    article.appendChild(postHeader);
    article.appendChild(media);
    article.appendChild(actions);
    article.appendChild(likesWrapper);
    article.appendChild(caption);
    article.appendChild(commentsSection);

    commentBtn.addEventListener("click",function () {

            if (!checkLogin()) {
                return;
            }

            commentInput.focus();
        }
    );

    shareBtn.addEventListener("click",async function () {

            if (!checkLogin()) {
                return;
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

    saveBtn.addEventListener("click",function () {

            if (!checkLogin()) {
                return;
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

function getCaption(item) {

    if (item.caption) {
        return item.caption;
    }


    if (item.type === "reel") {

        return "Enjoy this reel ✨";
    }


    return "Sharing a beautiful moment with MiniInsto✨";
}

async function loadHomeBackendContent() {

    const token = localStorage.getItem("miniInstoToken");


    if (!token) {
        return;
    }


    try {

        const response = await fetch("http://localhost:5000/api/posts");


        if (!response.ok) {

            throw new Error("Failed to load posts");
        }

        const posts = await response.json();
        homeBackendContent = posts.map(function (post) {

                    let mediaUrl = post.media || "";

                    if (mediaUrl && !mediaUrl.startsWith("http")) {

                        mediaUrl = "http://localhost:5000/" + mediaUrl.replace(/^\/+/,"");
                    }


                    return {

                        id:
                            post._id,

                        userId:
                            post.user
                                ? post.user._id
                                : null,

                        type:
                            post.type,

                        file:
                            mediaUrl,

                        user:
                            post.user
                                ? post.user.name
                                : "MiniInsto User",

                        username:
                            post.user
                                ? post.user.username
                                : "@user",

                        caption:
                            post.caption ||
                            "",

                        likes:
                            Number(
                                post.likesCount ||
                                0
                            ),

                        liked:
                            false,

                        comments:
                            []
                    };
                }
            );


        console.log("Posts from MongoDB:",homeBackendContent);

homeAllContent = homeAllContent.concat(homeBackendContent);

        console.log("Combined Home Content:",homeAllContent);

        initializeFrontendHomeContent();

        if (seeMoreBtn && homeContentIndex < homeAllContent.length) {

            seeMoreBtn.style.display = "block";
        }


        if (homeNoMore) {

            homeNoMore.style.display = "none";
        }

        if (homeContentIndex < homeAllContent.length) {

            if (seeMoreBtn) {

                seeMoreBtn.style.display = "block";
            }

        }


    } catch (error) {

        console.error("Error loading backend posts:", error);
    }
}

function syncStaticHomePostsWithBackend() {

    const postsContainer = document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    const staticPosts = postsContainer.querySelectorAll(".post-card");

    staticPosts.forEach(function (postCard) {

        const media = postCard.querySelector(".post-image, .post-video");

        if (!media) {
            return;
        }

        const src = media.getAttribute("src");

        if (!src) {
            return;
        }
        const staticFileName = src.split("/").pop();

        const backendPost = homeBackendContent.find(function (item) {

                const backendFileName =
                    item.file
                        ? item.file.split("/").pop()
                        : "";

                return backendFileName === staticFileName;
            });

        if (!backendPost) {
            return;
        }

        postCard.dataset.postId = backendPost.id;

const commentsList = postCard.querySelector(".comments-list");

if (commentsList && backendPost.id) {
    checkPostComments(backendPost.id,commentsList);
}

const nameElement = postCard.querySelector(".post-user h3");

if (nameElement && backendPost.user) {
    nameElement.textContent = backendPost.user;
}

const usernameElement = postCard.querySelector(".post-username");

if (usernameElement && backendPost.username) {
    usernameElement.textContent =
        backendPost.username.startsWith("@")
            ? backendPost.username
            : "@" + backendPost.username;
}

const postLikes = postCard.querySelector(".post-likes");

if (postLikes) {
    postLikes.textContent = Number(backendPost.likes || 0) + " likes";
}

const captionElement = postCard.querySelector(".post-info p");

if (captionElement) {
    captionElement.textContent = backendPost.caption || "";
}
        const likeBtn = postCard.querySelector(".like-btn");

        if (likeBtn && typeof initializeLikeButton === "function") {
            initializeLikeButton(likeBtn);
        }

    });

}

function loadMoreHomeContent() {

    if (!homeExploreContent || !seeMoreBtn) {

        return;
    }


    const nextItems = homeAllContent.slice(
            homeContentIndex,
            homeContentIndex +
            itemsPerClick
        );


    if (nextItems.length === 0) {

        seeMoreBtn.style.display = "none";


        if (homeNoMore) {

            homeNoMore.style.display = "block";
        }

        return;
    }


nextItems.forEach(function(item) {
    const card = createHomeContent(item);
    homeExploreContent.appendChild(card);

    if (item.id && typeof initializeLikeButton === "function") {
        initializeLikeButton(card.querySelector(".like-btn"));
    }
});
       


    homeContentIndex += nextItems.length;


    if (homeContentIndex >= homeAllContent.length) {

        seeMoreBtn.style.display = "none";


        if (homeNoMore) {

            homeNoMore.style.display = "block";
        }

    } else {

        seeMoreBtn.style.display = "block";


        if (homeNoMore) {

            homeNoMore.style.display = "none";
        }
    }
}



function setupStaticHomeLikes() {

    const postsContainer = document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    const posts = postsContainer.querySelectorAll(".post-card");

    posts.forEach(function (post) {

        const postActions = post.querySelector(".post-actions");
        const postLikes = post.querySelector(".post-likes");

        if (!postActions || !postLikes) {
            return;
        }
        postActions.insertAdjacentElement("afterend",postLikes);

    });

}
function prepareFrontendHomeContent() {

    homeAllContent = [];

    console.log("Frontend Home content disabled. Using backend posts only.");

}

function initializeFrontendHomeContent() {

    if (!homeExploreContent || !seeMoreBtn) {
        return;
    }

    if (homeAllContent.length > 0) {

        homeContentIndex = 0;

        homeExploreContent.innerHTML = "";

        if (homeNoMore) {
            homeNoMore.style.display = "none";
        }

        const initialItems = homeAllContent.slice(0, 3);


        initialItems.forEach(function(item) {

            const card = createHomeContent(item);

            homeExploreContent.appendChild(card);


            if (item.id && typeof initializeLikeButton === "function") {

                initializeLikeButton(card.querySelector(".like-btn"));

            }

        });

        homeContentIndex = 3;


        if (homeContentIndex < homeAllContent.length) {

            seeMoreBtn.style.display = "block";

        } else {

            seeMoreBtn.style.display = "none";

        }


    } else {

        console.log("No Home content found.");

    }

}

if (seeMoreBtn && homeExploreContent) {

    seeMoreBtn.addEventListener("click",function () {

            loadMoreHomeContent();
        }
    );
}

function initializeMiniInsto() {
    setupAuthUI();
    setupNavbarAvatar();
    setupAuthModal();
    setupLogout();
    setupMobileMenu();
    setupStaticHomeLikes();

    if (typeof setupGlobalLikeButtons === "function") {
    setupGlobalLikeButtons();
}
    

    prepareFrontendHomeContent();

    if (isLoggedIn()) {
        loadHomeBackendContent();
    }

    if (typeof setupGlobalFollowButtons === "function") {
        setupGlobalFollowButtons();
    }

    if (typeof setupHomeStaticFollowButtons === "function") {
        setupHomeStaticFollowButtons();
    }
}
async function setupHomeStaticFollowButtons() {

    const buttons = document.querySelectorAll("#postsContainer .post-follow-btn");

    for (const button of buttons) {

        const username = button.dataset.username;

        if (!username) {
            continue;
        }

        const userId = await getUserIdByUsername(username);

        if (!userId) {

            console.log("Home user not found:",username);

            continue;
        }

        button.dataset.userId = userId;

        const isFollowing = await checkFollowStatus(userId);

        button.textContent =
            isFollowing
                ? "Following"
                : "Follow";

        button.classList.toggle("following", isFollowing);

        button.addEventListener("click",async function(event) {

                event.preventDefault();
                event.stopPropagation();

                console.log("HOME FOLLOW CLICKED:",username);

                await handleFollowClick(button);

            }
        );
    }
}

if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded",function () {

            initializeMiniInsto();
        }
    );

} else {

    initializeMiniInsto();
}