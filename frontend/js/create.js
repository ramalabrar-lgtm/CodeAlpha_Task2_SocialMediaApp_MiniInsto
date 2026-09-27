document.addEventListener("DOMContentLoaded", function () {

    const postTypeBtn = document.getElementById("postTypeBtn");
    const reelTypeBtn = document.getElementById("reelTypeBtn");
    const mediaInput = document.getElementById("mediaInput");
    const selectedFileName = document.getElementById("selectedFileName");
    const captionInput = document.getElementById("captionInput");
    const createPreview = document.getElementById("createPreview");
    const cancelCreateBtn = document.getElementById("cancelCreateBtn");
    const publishBtn = document.getElementById("publishBtn");
    const navAvatar = document.getElementById("navAvatar");
    const logoutBtn = document.getElementById("logoutBtn");
    const sessionData = localStorage.getItem("miniInstoSession");


    if (!sessionData) {

        window.location.href = "login.html";

        return;

    }
    let session;

    try {

        session = JSON.parse(sessionData);

    } catch (error) {

        window.location.href = "login.html";

        return;

    }

    if (navAvatar) {

        const currentName =
            session.name ||
            session.username ||
            "User";

        navAvatar.textContent =
            currentName
                .charAt(0)
                .toUpperCase();

    }

    const currentName =
        session.name ||
        session.username ||
        "User";


    let currentUsername =
        session.username ||
        "";


    if (
        currentUsername &&
        !currentUsername.startsWith("@")
    ) {

        currentUsername =
            "@" + currentUsername;

    }

    let selectedType = "post";

    let postDraft = {

        file: null,

        caption: ""

    };


    let reelDraft = {

        file: null,

        caption: ""

    };

    function showEmptyPreview() {

        createPreview.innerHTML = `
            <p>Media preview will appear here.</p>
        `;

    }

    function clearFileName() {

        if (selectedFileName) {

            selectedFileName.textContent = "";

        }

    }

    function showPostDraft() {

        captionInput.value = postDraft.caption;

        if (postDraft.file) {

            if (selectedFileName) {

                selectedFileName.textContent = postDraft.file.name;

            }


            const fileURL = URL.createObjectURL(postDraft.file);
            createPreview.innerHTML = "";
            const image = document.createElement("img");


            image.src = fileURL;
            image.alt = "Post preview";
            createPreview.appendChild(image);

        } else {

            clearFileName();

            showEmptyPreview();

        }

    }

    function showReelDraft() {

        captionInput.value = reelDraft.caption;

        if (reelDraft.file) {

            if (selectedFileName) {

                selectedFileName.textContent = reelDraft.file.name;

            }

            const fileURL = URL.createObjectURL(reelDraft.file);
            createPreview.innerHTML = "";
            const video = document.createElement("video");


            video.src = fileURL;
            video.controls = true;
            video.muted = true;
            video.playsInline = true;
            createPreview.appendChild(video);

        } else {

            clearFileName();
            showEmptyPreview();

        }

    }

    if (postTypeBtn) {

        postTypeBtn.addEventListener("click", function () {

                reelDraft.caption = captionInput.value;

                if (mediaInput.files[0] && mediaInput.files[0].type.startsWith("video/")) {

                    reelDraft.file = mediaInput.files[0];

                }

                selectedType = "post";

                postTypeBtn.classList.add("active");
                reelTypeBtn.classList.remove("active");
                mediaInput.accept = "image/*";
                mediaInput.value = "";

                showPostDraft();

            }
        );

    }

    if (reelTypeBtn) {

        reelTypeBtn.addEventListener("click", function () {
                postDraft.caption = captionInput.value;

                if (mediaInput.files[0] && mediaInput.files[0].type.startsWith("image/")) {

                    postDraft.file = mediaInput.files[0];

                }

                selectedType = "reel";
                reelTypeBtn.classList.add("active");
                postTypeBtn.classList.remove("active");
                mediaInput.accept = "video/*";
                mediaInput.value = "";

                showReelDraft();

            }
        );

    }

    if (mediaInput) {

        mediaInput.addEventListener("change",function () {

                const file = mediaInput.files[0];


                if (!file) {

                    return;

                }

                if (selectedType === "post") {

                    postDraft.file = file;

                } else {

                    reelDraft.file = file;

                }

                if (selectedFileName) {

                    selectedFileName.textContent = file.name;

                }

                const fileURL = URL.createObjectURL(file);

                createPreview.innerHTML = "";

                if (selectedType === "post") {

                    const image = document.createElement("img");
                    image.src = fileURL;


                    image.alt = "Post preview";


                    createPreview.appendChild(image);

                } else {

                    const video = document.createElement("video");

                    video.src = fileURL;
                    video.controls = true;
                    video.muted = true;
                    video.playsInline = true;
                    createPreview.appendChild(video);

                }

            }
        );

    }

    if (captionInput) {

        captionInput.addEventListener("input",function () {

                if (selectedType === "post") {

                    postDraft.caption = captionInput.value;

                } else {

                    reelDraft.caption = captionInput.value;

                }

            }
        );

    }

    function openDatabase() {

        return new Promise(
            function (resolve, reject) {

                const request = indexedDB.open("MiniInstoDB", 1);


                request.onupgradeneeded = function (event) {

                        const db = event.target.result;


                        if (!db.objectStoreNames.contains("userContent")) {

                            db.createObjectStore("userContent",
                                {
                                    keyPath: "id"
                                }
                            );

                        }

                    };


                request.onsuccess = function () {

                        resolve(request.result);

                    };

                request.onerror = function () {

                        reject(request.error);

                    };

            }
        );

    }

    function saveContent(content) {

        return openDatabase()
            .then(function (db) {

                    return new Promise(function (resolve,reject) {

                            const transaction = db.transaction("userContent", "readwrite");
                            const store = transaction.objectStore("userContent");
                            const request = store.add(content);

                            request.onsuccess = function () {

                                    resolve();

                                };

                            request.onerror = function () {

                                    reject(request.error);

                                };

                        }
                    );

                }
            );

    }

    if (cancelCreateBtn) {

        cancelCreateBtn.addEventListener("click",function () {

                window.location.href = "profile.html";

            }
        );

    }

    if (publishBtn) {

        publishBtn.addEventListener("click", async function () {

                let file;
                let caption;


                if (selectedType === "post") {

                    file = postDraft.file;
                    postDraft.caption = captionInput.value;
                    caption = postDraft.caption;

                } else {

                    file = reelDraft.file;
                    reelDraft.caption = captionInput.value;
                    caption = reelDraft.caption;

                }

                if (!file) {

                    alert("Please choose a photo or video.");

                    return;

                }

                if (selectedType === "post" && !file.type.startsWith("image/")) {

                    alert("Please select an image for a photo post.");

                    return;

                }

                if (selectedType === "reel" && !file.type.startsWith("video/")) {

                    alert("Please select a video for a reel.");

                    return;

                }

try {

    const formData = new FormData();


    formData.append("type", selectedType);
    formData.append("caption", caption);
    formData.append("media",file);


    const token = localStorage.getItem("miniInstoToken");


    if (!token) {

        alert("Please login again.");

        window.location.href = "login.html";

        return;

    }


    const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    Authorization:
                        "Bearer " + token
                },

                body: formData
            }
        );


    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message || "Failed to create post");

    }


    console.log("Post created successfully:",data.post);
    alert("Your content has been published successfully!");
    window.location.href = "profile.html";


} catch (error) {

    console.error("Publish error:", error);
    alert("Something went wrong while publishing. Please try again.");

}

        }
    );

}

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

                localStorage.removeItem("miniInstoSession");
                window.location.href = "index.html";

            }
        );

    }

});