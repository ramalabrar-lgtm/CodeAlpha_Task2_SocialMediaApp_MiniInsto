document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem("miniInstoToken");

    if (token) {

        window.location.href = "index.html";

        return;
    }

    const loginForm = document.getElementById("loginForm");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();


            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;


            try {

                const response = await fetch("http://localhost:5000/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data = await response.json();


                if (!response.ok) {

                    alert(data.message || "Invalid email or password.");

                    return;
                }

                localStorage.setItem("miniInstoToken", data.token);
                localStorage.setItem("miniInstoSession", JSON.stringify(data.user));


                alert("Login successful!");

                window.location.href = "index.html";


            } catch (error) {

                console.error("Login error:", error);

                alert("Cannot connect to MiniInsto server.");
            }

        }
    );

});