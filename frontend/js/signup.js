document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("miniInstoToken");

    if (token) {

        window.location.href = "index.html";

        return;
    }

    const signupForm = document.getElementById("signupForm");

    if (!signupForm) {
        return;
    }

    signupForm.addEventListener("submit",async function (event) {

            event.preventDefault();

            const name = document.getElementById("signupName").value.trim();
            const username = document.getElementById("signupUsername").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("signupConfirmPassword").value;

            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }

            try {

                const response = await fetch("http://localhost:5000/api/auth/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                username: username,
                                email: email,
                                password: password
                            })
                        }
                    );


                const data = await response.json();


                if (!response.ok) {

                    alert(data.message || "Registration failed.");

                    return;
                }


                alert("Account created successfully. Please login.");

                window.location.href = "login.html";


            } catch (error) {

                console.error("Signup error:",error);
                alert("Cannot connect to MiniInsto server.");
            }

        }
    );

});