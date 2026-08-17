const API_URL = "http://127.0.0.1:8000";


// ==========================
// REGISTER
// ==========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");


        // Check passwords
        if (password !== confirmPassword) {

            message.innerText = "Passwords do not match";

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (data.success) {

                message.innerText =
                    "Registration successful! Redirecting to login...";

                setTimeout(function() {

                    window.location.href = "login.html";

                }, 1500);

            } else {

                message.innerText = data.message;

            }

        } catch (error) {

            message.innerText =
                "Unable to connect to server";

            console.error(error);

        }

    });
}


// ==========================
// LOGIN
// ==========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        try {

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (data.success) {

                message.innerText =
                    `Welcome ${data.name}! Login successful.`;

                // Later you can redirect to dashboard
                // window.location.href = "dashboard.html";

            } else {

                message.innerText =
                    data.message;

            }

        } catch (error) {

            message.innerText =
                "Unable to connect to server";

            console.error(error);

        }

    });
}