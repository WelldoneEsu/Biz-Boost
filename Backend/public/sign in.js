const API  = 'https://biz-boost.onrender.com';

const signinForm = document.getElementById("signinForm");
signinForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    let valid = true;

    // Email validation
    if (email.value.includes("@") && email.value.includes(".com")) {
        emailError.textContent = "";
        emailError.style.display = "none";
        email.classList.remove("input-error");
    } else {
        emailError.textContent = "Valid email is required.";
        emailError.style.display = "block";
        email.classList.add("input-error");
        valid = false;
    }

    // Password validation
    if (password.value.trim() === "" || password.value.length < 6) {
        passwordError.textContent = "Password is required and must be at least 6 characters.";
        passwordError.style.display = "block";
        password.classList.add("input-error");
        valid = false;
    } else {
        passwordError.textContent = "";
        passwordError.style.display = "none";
        password.classList.remove("input-error");
    }

    if (!valid) return;

    try {
        const response = await fetch(`${API}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token & user data to localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Invalid email or password.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
    }

    signinForm.reset();
});