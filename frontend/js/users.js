document.addEventListener("DOMContentLoaded", function () {

    const usersContainer = document.getElementById("usersContainer");
    const searchInput = document.getElementById("userSearchInput");

    let allUsers = [];

    const token = localStorage.getItem("miniInstoToken");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    async function loadUsers() {
        try {
            const response = await fetch("http://localhost:5000/api/users",
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load users");
            }

            allUsers = await response.json();

displayUsers(allUsers);
        } catch (error) {
            console.log("Error loading users:", error);
        }
    }


    function displayUsers(users) {

        usersContainer.innerHTML = "";

        users.forEach(function (user) {
            usersContainer.appendChild(createUserCard(user));
        });
    }


    function createUserCard(user) {

        const card = document.createElement("div");
        card.className = "user-card";

        const profileLink = document.createElement("div");
        profileLink.className = "user-info";

        profileLink.innerHTML = `
            <div class="user-avatar">
                ${user.name.charAt(0).toUpperCase()}
            </div>

            <div class="user-details">
                <h3>${user.name}</h3>
                <p>@${user.username}</p>

                <span
    class="followers-count"
    data-user-id="${user._id}"
>
    ${user.followersCount || 0} followers
</span>
            </div>
        `;


        profileLink.addEventListener("click", function () {
            window.location.href = "user-profile.html?user=" + encodeURIComponent(user.username);
        });


        const followButton = document.createElement("button");

followButton.className = "follow-btn";
followButton.textContent = "Follow";
followButton.dataset.userId = user._id;


        async function loadFollowStatus() {

    const isFollowing = await checkFollowStatus(user._id);

    followButton.textContent =
        isFollowing
            ? "Following"
            : "Follow";

    followButton.classList.toggle("following",isFollowing);
}

       followButton.addEventListener("click", async function (event) {

    event.stopPropagation();

    await handleFollowClick(followButton);

    const updatedResponse = await fetch(`http://localhost:5000/api/users/${user._id}`);

    if (updatedResponse.ok) {

        const updatedUser = await updatedResponse.json();

        followersText.textContent =`${updatedUser.followers || 0} followers`;
    }
});


        const followersText = profileLink.querySelector(".followers-count");


        card.appendChild(profileLink);
        card.appendChild(followButton);

        loadFollowStatus();

        return card;
    }


    if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchValue = searchInput.value.toLowerCase().trim();
        const filteredUsers = allUsers.filter(function (user) {
            const name = (user.name || "").toLowerCase();
            const username = (user.username || "").toLowerCase();

            return (name.includes(searchValue) || username.includes(searchValue));
        });

        displayUsers(filteredUsers);
    });
}
if (typeof setupGlobalFollowButtons === "function") {
    setupGlobalFollowButtons();
}

    loadUsers();

});