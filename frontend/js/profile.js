document.addEventListener("DOMContentLoaded", function () {

    const profileAvatar = document.getElementById("profileAvatar");
    const navAvatar = document.getElementById("navAvatar");
    const bottomAvatar = document.getElementById("bottomAvatar");
    const profileName = document.getElementById("profileName");
    const profileUsername = document.getElementById("profileUsername");
    const profileFollowers = document.getElementById("profileFollowers");
    const profileFollowing = document.getElementById("profileFollowing");
    const profilePosts = document.getElementById("profilePosts");
    const profileBio = document.getElementById("profileBio");
    const profileEmail = document.getElementById("profileEmail");
    const profilePostsGrid = document.getElementById("profilePostsGrid");
    const profileNoPosts = document.getElementById("profileNoPosts");
    const logoutBtn = document.getElementById("logoutBtn");
    const mobileLogout = document.getElementById("mobileLogout");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const followingButton = document.getElementById("followingButton");
    const followersButton = document.getElementById("followersButton");
    const followingSection = document.getElementById("followingSection");
    const followingList = document.getElementById("followingList");
    const followingEmpty = document.getElementById("followingEmpty");
    const closeFollowingBtn = document.getElementById("closeFollowingBtn");
    const createProfileBtn = document.getElementById("createProfileBtn");
    const mobileCreateBtn = document.getElementById("mobileCreateBtn");
    const editProfileBtn = document.getElementById("editProfileBtn");

    const sessionData =localStorage.getItem("miniInstoSession");


    let session = null;


    if (sessionData) {

        try {

            session = JSON.parse(sessionData);

        } catch (error) {

            console.log("Unable to read MiniInsto session.");

        }

    }

    if (!session) {

        window.location.href = "login.html";

        return;

    }

    const currentName = session.name || "User";

    let currentUsername = session.username || "@user";


    const currentBio = session.bio || "Welcome to my MiniInsto profile ✨";
    const currentEmail = session.email || "";


    currentUsername = currentUsername.trim().toLowerCase();


    if (!currentUsername.startsWith("@")) {

        currentUsername ="@" + currentUsername;

    }

    const firstLetter = currentName.charAt(0).toUpperCase();


    if (profileAvatar) {

        profileAvatar.textContent = firstLetter;

    }


    if (navAvatar) {

        navAvatar.textContent = firstLetter;

    }


    if (bottomAvatar) {

        bottomAvatar.textContent = firstLetter;

    }

    if (profileName) {

        profileName.textContent = currentName;

    }


    if (profileUsername) {

        profileUsername.textContent = currentUsername;

    }


    if (profileBio) {

        profileBio.textContent = currentBio;

    }


    if (profileEmail && currentEmail) {

        profileEmail.textContent = currentEmail;

    }

    function getFollowData() {

        const saved = localStorage.getItem("miniInstoFollowData");


        if (!saved) {

            return {};

        }


        try {

            return JSON.parse(saved);

        } catch (error) {

            return {};

        }

    }


    function saveFollowData(data) {

        localStorage.setItem("miniInstoFollowData",JSON.stringify(data));

    }

    function getUsers() {

        if (typeof miniInstoUsers === "undefined") {

            return [];

        }


        if (!Array.isArray(miniInstoUsers)) {

            return [];

        }


        return miniInstoUsers;

    }

    function getFollowingUsers() {

        const followData = getFollowData();


        const users = getUsers();


        return users.filter(function (user) {

                return (followData[user.username] === true);

            }
        );

    }

    function updateFollowingCount() {

        const followingUsers = getFollowingUsers();


        let count = followingUsers.length;


        if (count === 0 && !localStorage.getItem("miniInstoFollowInitialized")) {

            count = 5;

        }


        if (profileFollowing) {

            profileFollowing.textContent = count;

        }
        return count;

    }

    updateFollowingCount();

    function displayFollowingUsers() {

        if (!followingList) {

            return;

        }


        followingList.innerHTML = "";


        const followingUsers = getFollowingUsers();


        if (followingUsers.length === 0) {

            if (followingEmpty) {

                followingEmpty.style.display = "block";

            }

            return;

        }


        if (followingEmpty) {

            followingEmpty.style.display = "none";

        }


        followingUsers.forEach(function (user) {

                const row = document.createElement("div");
                row.classList.add("following-user");

                const avatar = document.createElement("div");
                avatar.classList.add("following-avatar");
                avatar.textContent = (user.name || "U").charAt(0).toUpperCase();

                const info = document.createElement("div");
                info.classList.add("following-info");


                const name = document.createElement("strong");
                name.textContent = user.name || "User";

                const username = document.createElement("span");
                username.textContent = user.username;


                info.appendChild(name);
                info.appendChild(username);


                const unfollowBtn = document.createElement("button");
                unfollowBtn.type = "button";


                unfollowBtn.classList.add("following-unfollow-btn");
                unfollowBtn.textContent = "Following";
                unfollowBtn.dataset.username = user.username;
                unfollowBtn.addEventListener("click",function () {

                    const followData = getFollowData();


                        delete followData[user.username];
                        saveFollowData(followData);
                        localStorage.setItem("miniInstoFollowInitialized","true");

                        updateFollowingCount();
                        displayFollowingUsers();

                    }
                );


                row.appendChild(avatar);
                row.appendChild(info);
                row.appendChild(unfollowBtn);
                followingList.appendChild(row);

            }
        );

    }

    if (followingButton) {

        followingButton.addEventListener("click",function () {

                if (!followingSection) {

                    return;

                }


                followingSection.style.display = "block";
                displayFollowingUsers();


                followingSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }

    if (closeFollowingBtn) {

        closeFollowingBtn.addEventListener("click", function () {

                followingSection.style.display = "none";

            }
        );

    }

    if (followersButton) {

        followersButton.addEventListener("click", function () {

                alert("Followers section will be connected next.");

            }
        );

    }

async function displayOwnContent() {

    if (!profilePostsGrid) {
        return;
    }

    try {

        const token = localStorage.getItem("miniInstoToken");

if (!token) {

    console.log("Token not found.");

    return;
}

        const userId = session.id || session._id || session.userId;

        if (!userId) {

            console.log("User ID not found in session.");

            return;
        }

        const response = await fetch("http://localhost:5000/api/posts/user/" + userId);
        const content = await response.json();


        if (!response.ok) {

            throw new Error(content.message || "Failed to load posts");

        }

        if (profilePosts) {

            profilePosts.textContent = content.length;

        }

        profilePostsGrid.innerHTML = "";

        if (content.length === 0) {

            if (profileNoPosts) {

                profileNoPosts.style.display = "block";

            }

            return;

        }


        if (profileNoPosts) {

            profileNoPosts.style.display = "none";

        }

        content.forEach(function (item) {

                createProfilePost(item);

            }
        );


    } catch (error) {

        console.error("Error loading profile content:", error);


        if (profilePosts) {

            profilePosts.textContent = "0";

        }


        profilePostsGrid.innerHTML = "";


        if (profileNoPosts) {

            profileNoPosts.style.display = "block";

        }

    }

}


    function createProfilePost(item) {

        const card = document.createElement("article");
        card.classList.add("profile-post-card");

        if (item.type === "reel") {

            const video = document.createElement("video");
           video.src = "http://localhost:5000" + item.media;


            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.setAttribute("playsinline", "");
            video.preload = "metadata";
            card.appendChild(video);

            const reelIcon = document.createElement("span");

            reelIcon.classList.add("profile-reel-icon");


            reelIcon.innerHTML = `
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white">

                    <path d="M8 5v14l11-7z"></path>

                </svg>
            `;


            card.appendChild(reelIcon);

        } else {

            const image = document.createElement("img");
            image.src = "http://localhost:5000" + item.media;

            image.alt = currentName + " post";
            card.appendChild(image);

        }

const overlay = document.createElement("div");
overlay.classList.add("profile-post-overlay");

const likes = document.createElement("span");
likes.textContent =(item.likesCount || 0) + " likes";

const actions = document.createElement("div");
actions.classList.add("profile-post-actions");

const editBtn = document.createElement("button");
editBtn.type ="button";
editBtn.textContent = "Edit";
editBtn.classList.add("profile-edit-btn");
editBtn.addEventListener("click",async function (event) {

        event.stopPropagation();
        const newCaption = prompt("Edit caption:", item.caption || "");

        if (newCaption === null) {
            return;
        }


        try {

            const token = localStorage.getItem("miniInstoToken");
            if (!token) {

                alert("Please login again.");

                window.location.href = "login.html";

                return;
            }


            const response = await fetch("http://localhost:5000/api/posts/" + item._id,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token
                        },

                        body: JSON.stringify({
                            caption:
                                newCaption.trim()
                        })
                    }
                );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(data.message || "Failed to update caption");

            }


            alert("Caption updated successfully!");
            displayOwnContent();


        } catch (error) {

            console.error("Edit caption error:",error);
            alert(error.message || "Something went wrong while updating caption.");
        }

    }
);

const deleteBtn = document.createElement("button");
deleteBtn.type = "button";
deleteBtn.textContent = "Delete";
deleteBtn.classList.add("profile-delete-btn");
deleteBtn.addEventListener("click",async function (event) {

        event.stopPropagation();
        const confirmed = confirm("Are you sure you want to delete this content?");


        if (!confirmed) {
            return;
        }


        try {

            const token = localStorage.getItem("miniInstoToken");

            if (!token) {

                alert("Please login again.");

                window.location.href = "login.html";

                return;
            }


            const response = await fetch("http://localhost:5000/api/posts/" + item._id,
                     {
                        method: "DELETE",

                        headers: {
                            "Authorization":
                                "Bearer " + token
                        }
                    }
                );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(data.message || "Failed to delete content");

            }

            alert("Content deleted successfully!");

            displayOwnContent();


        } catch (error) {

            console.error("Delete content error:",error);
            alert(error.message || "Something went wrong while deleting content.");

        }

    }
);

actions.appendChild(editBtn);
actions.appendChild(deleteBtn);

overlay.appendChild(likes);
overlay.appendChild(actions);

card.appendChild(overlay);
profilePostsGrid.appendChild(card);

    }

function openEditProfile() {

    const newName = prompt("Enter your name:", currentName);


    if (newName === null) {
        return;
    }


    const newUsername = prompt("Enter your username:",currentUsername);

    if (newUsername === null) {
        return;
    }


    const newBio = prompt("Enter your bio:",currentBio);
    if (newBio === null) {
        return;
    }
    const newEmail = prompt("Enter your email:",currentEmail);
    if (newEmail === null) {
        return;
    }


    updateProfile(
        newName.trim(),
        newUsername.trim(),
        newBio.trim(),
        newEmail.trim()
    );

    

}

async function updateProfile(
    name,
    username,
    bio,
    email
) {
    
    try {

        const token = localStorage.getItem("miniInstoToken");


        if (!token) {

            alert("Please login again.");
            window.location.href = "login.html";

            return;

        }

        const userId =
            session.id ||
            session._id ||
            session.userId;


        if (!userId) {

            alert("User ID not found.");

            return;

        }


        const response = await fetch("http://localhost:5000/api/users/" + userId,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({

                        name: name,
                        username: username,
                        bio: bio,
                        email: email

                    })
                }
            );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(data.message || "Failed to update profile");

        }
        const updatedUser = data.user;


        localStorage.setItem("miniInstoSession",JSON.stringify(updatedUser));


        alert("Profile updated successfully!");
        window.location.reload();


    } catch (error) {

        console.error("Profile update error:",error);
        alert(error.message ||"Something went wrong while updating profile.");

    }

}
if (editProfileBtn) {

    editProfileBtn.addEventListener("click",openEditProfile);

}

    function openCreatePage() {

        window.location.href = "create.html";

    }


    if (createProfileBtn) {

        createProfileBtn.addEventListener("click",openCreatePage);

    }


    if (mobileCreateBtn) {

        mobileCreateBtn.addEventListener("click",openCreatePage);

    }

    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click",function () {

                mobileMenu.classList.toggle("active");

            }
        );

    }

    function logout() {

        localStorage.removeItem("miniInstoSession");
        window.location.href = "index.html";

    }


    if (logoutBtn) {

        logoutBtn.addEventListener("click",logout);

    }


    if (mobileLogout) {

        mobileLogout.addEventListener("click",logout);

    }

    displayOwnContent();

});