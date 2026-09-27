function getLikeToken() {

    return localStorage.getItem("miniInstoToken");

}

async function checkLikeStatus(postId) {

    const token = getLikeToken();


    if (!token || !postId) {

        return false;

    }


    try {

        const response =await fetch("http://localhost:5000/api/likes/status/check?post=" + encodeURIComponent(postId),
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            console.error("Like status request failed:",response.status);

            return false;

        }


        const data = await response.json();


        return !!data.isLiked;


    } catch (error) {

        console.error("Like status error:",error);

        return false;

    }

}



async function likePost(postId) {

    const token = getLikeToken();


    if (!token || !postId) {

        console.error("Token or post ID missing.");

        return null;

    }


    try {

        const response = await fetch("http://localhost:5000/api/likes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({post: postId})
                }
            );


        const data = await response.json();


        if (!response.ok) {

            console.error("Like failed:",data.message);

            return null;

        }


        return data;


    } catch (error) {

        console.error("Like request error:",error);

        return null;

    }

}


async function unlikePost(postId) {

    const token = getLikeToken();


    if (!token || !postId) {

        console.error("Token or post ID missing.");

        return null;

    }


    try {

        const response = await fetch("http://localhost:5000/api/likes",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({post: postId})
                }
            );


        const data = await response.json();


        if (!response.ok) {

            console.error("Unlike failed:", data.message);

            return null;

        }


        return data;


    } catch (error) {

        console.error("Unlike request error:", error);

        return null;

    }

}

function updateLikeButton(
    button,
    isLiked
) {

    if (!button) {
        return;
    }


    button.classList.toggle("liked",isLiked);

    const svg = button.querySelector("svg");


    if (svg) {

        svg.setAttribute(
            "fill",
            isLiked
                ? "currentColor"
                : "none"
        );

    }

}

function updateAllLikeButtons(
    postId,
    isLiked,
    likesCount
) {

    if (!postId) {
        return;
    }

    const cards = document.querySelectorAll(".post-card[data-post-id='" + postId + "']");
    cards.forEach(function (card) {

            const likeBtn = card.querySelector(".like-btn");
            const likesCountElement = card.querySelector(".likes-count");

            updateLikeButton(likeBtn,isLiked);


            if (likesCountElement) {

                likesCountElement.textContent = Number(likesCount || 0) + " likes";

            }

        }
    );

}

async function initializeLikeButton(
    button
) {

    if (!button) {
        return;
    }


    const article = button.closest( ".post-card");


    if (!article) {
        return;
    }


    const postId = article.dataset.postId;


    if (!postId) {
        return;
    }


    const isLiked = await checkLikeStatus(postId);


    updateLikeButton(button, isLiked);

}

function setupGlobalLikeButtons() {

    if (
        document.body.dataset.likeSystemReady === "true"
    ) {

        return;

    }


    document.body.dataset.likeSystemReady = "true";

    document.addEventListener("click", async function (event) {

            const likeBtn = event.target.closest(".like-btn");


            if (!likeBtn) {
                return;
            }


            const article = likeBtn.closest(".post-card");

            if (!article) {
                return;
            }


            const postId = article.dataset.postId;


            if (!postId) {

                return;

            }


            event.preventDefault();
            event.stopPropagation();


            if (typeof checkLogin === "function") {

                if (!checkLogin()) {

                    return;

                }

            }


            if (likeBtn.disabled) {

                return;

            }


            likeBtn.disabled = true;


            const currentlyLiked = likeBtn.classList.contains("liked");

            let result = null;

            if (currentlyLiked) {

                result = await unlikePost(postId);

            } else {

                result = await likePost(postId);

            }


            if (result) {

                const newLikedState = !currentlyLiked;
                const newLikesCount = Number(result.likesCount || 0);

                updateAllLikeButtons(
                    postId,
                    newLikedState,
                    newLikesCount
                );

            }


            likeBtn.disabled = false;

        }
    );

}


function initializeAllLikeButtons() {

    const buttons = document.querySelectorAll(".post-card[data-post-id] .like-btn");


    buttons.forEach(function (button) {

            initializeLikeButton(button);

        }
    );

}