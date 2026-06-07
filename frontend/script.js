// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data =
                await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "userName",
                    data.name
                );

                localStorage.setItem(
                    "userEmail",
                    email
                );

                // No Login Successful Alert

                window.location.href =
                    "dashboard.html";

            } else {

                alert(
                    data.message

                );
            }

        } catch (error) {

            console.log(error);

            alert("Server Error");
        }

    });

}


// ================= SIGNUP =================

const signupForm =
    document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        // Password Validation

        const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (
            !passwordRegex.test(password)
        ) {

            alert(
                "Password must contain:\n\n" +
                "• Minimum 8 characters\n" +
                "• One uppercase letter\n" +
                "• One lowercase letter\n" +
                "• One number\n" +
                "• One special symbol"
            );

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data =
                await response.json();

            alert(data.message);

            if (response.ok) {

                window.location.href =
                    "login.html";
            }

        } catch (error) {

            console.log(error);

            alert("Server Error");
        }

    });

}