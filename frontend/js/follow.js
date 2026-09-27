const FOLLOW_API = "http://localhost:5000/api/follows";
const USER_API = "http://localhost:5000/api/users";

function getFollowToken() {
    return localStorage.getItem("miniInstoToken");
}

async function getUserIdByUsername(username) {

    const token = getFollowToken();

    if (!token || !username) {
        return null;
    }

    try {

        const response = await fetch(
            USER_API +
            "?username=" +
            encodeURIComponent(
                username.replace("@", "")
            ),
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            console.log("User search failed:", response.status);

            return null;
        }

        const users = await response.json();

        if (!Array.isArray(users)) {
            return null;
        }

        const foundUser = users.find(function(user) {

                return (
                    user.username &&
                    user.username.toLowerCase() ===
                    username
                        .replace("@", "")
                        .toLowerCase()
                );

            });

        return foundUser
            ? foundUser._id
            : null;

    } catch (error) {

        console.log("Get user ID error:", error);

        return null;
    }
}

async function checkFollowStatus(userId) {

    const token = getFollowToken();

    if (!token || !userId) {
        return false;
    }

    try {

        const response = await fetch(
            FOLLOW_API +
            "/status/check?following=" +
            encodeURIComponent(userId),
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        return data.isFollowing === true;

    } catch (error) {

        console.log("Follow status error:", error);

        return false;
    }
}


async function updateFollowButton(button) {

    const userId = button.dataset.userId;

    if (!userId) {
        button.textContent = "Follow";
        return;
    }

    const isFollowing = await checkFollowStatus(userId);

    button.textContent =
        isFollowing
            ? "Following"
            : "Follow";

    button.classList.toggle(
        "following",
        isFollowing
    );
}

async function updateFollowCounts(userId) {

    try {

        const response =
            await fetch(
                USER_API +
                "/" +
                userId
            );

        if (!response.ok) {
            return;
        }

        const user = await response.json();

        const followerElements = document.querySelectorAll(`.followers-count[data-user-id="${userId}"]`);

        followerElements.forEach(function (element) {

                element.textContent =
                    (user.followers || 0) +
                    " followers";

            }
        );

        const profileFollowers = document.getElementById("profileFollowers");

        if (profileFollowers) {

            profileFollowers.textContent = user.followers || 0;

        }

        const sessionData = localStorage.getItem("miniInstoSession");

        if (!sessionData) {
            return;
        }

        const session = JSON.parse(sessionData);

        const loggedInUserId =
            session.id ||
            session._id ||
            (session.user &&
                (session.user.id ||
                 session.user._id));


        if (!loggedInUserId) {
            return;
        }

        const myResponse =await fetch(USER_API + "/" + loggedInUserId);

        if (!myResponse.ok) {
            return;
        }

        const myUser = await myResponse.json();

        const profileFollowing = document.getElementById("profileFollowing");

        if (profileFollowing) {

            profileFollowing.textContent = myUser.following || 0;

        }

    } catch (error) {

        console.log("Follow count error:", error);
    }
}

async function updateAllFollowButtons(userId) {

    if (!userId) {
        return;
    }

    const isFollowing = await checkFollowStatus(userId);

    const buttons = document.querySelectorAll(`button[data-user-id="${userId}"]`);

    buttons.forEach(function (button) {

        button.textContent =
            isFollowing
                ? "Following"
                : "Follow";

        button.classList.toggle(
            "following",
            isFollowing
        );

    });
}

async function handleFollowClick(button) {

    const token = getFollowToken();

    const userId = button.dataset.userId;

    if (!token || !userId) {
        return;
    }

    const currentlyFollowing = button.classList.contains("following");
        console.log("FOLLOW BUTTON CLICK:", userId, "Currently following:", currentlyFollowing);

    try {

        button.disabled = true;

        const response = await fetch(FOLLOW_API,
            {
                method:
                    currentlyFollowing
                        ? "DELETE"
                        : "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify({
                    following: userId
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Follow action failed.");

            return;
        }

        await updateAllFollowButtons(userId);

        await updateFollowCounts(userId);


    } catch (error) {

        console.log("Follow action error:", error);

    } finally {

        button.disabled = false;
    }
}

async function updateFollowCounts(userId) {

    try {

        const response =
            await fetch(
                USER_API +
                "/" +
                userId
            );

        if (!response.ok) {
            return;
        }

        const user = await response.json();

        const followerElements = document.querySelectorAll(`.followers-count[data-user-id="${userId}"]`);

        followerElements.forEach(function (element) {

                element.textContent = (user.followers || 0) + " followers";

            }
        );

        const profileFollowers = document.getElementById("profileFollowers");

        if (profileFollowers) {

            profileFollowers.textContent = user.followers || 0;

        }

    } catch (error) {

        console.log("Follow count error:", error);
    }
}

async function setupGlobalFollowButtons() {

    const buttons = document.querySelectorAll(".post-follow-btn, .follow-btn");

    for (const button of buttons) {

        const userId = button.dataset.userId;

        if (!userId) {
            continue;
        }

        await updateFollowButton(button);
    }
}