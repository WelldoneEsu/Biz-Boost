const API = 'https://biz-boost.onrender.com/api/auth/signup'; 

const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", function (e) {
    e.preventDefault(); // stop default submit

    // get form values
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const bName = document.getElementById("bName");
    const email = document.getElementById("email");
    const phoneNumber = document.getElementById("phoneNumber");
    const password = document.getElementById("pWord");
    const cPassword = document.getElementById("cPassword");
    const terms = document.getElementById("terms");

    // error elements
    const firstNameError = document.getElementById("firstNameError");
    const lastNameError = document.getElementById("lastNameError");
    const bNameError = document.getElementById("BnameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const pwordError = document.getElementById("pwordError");
    const cPasswordError = document.getElementById("cPasswordError");
    const termsError = document.getElementById("termsError");

    let valid = true;

    // --- VALIDATIONS ---

    if (firstName.value.trim() === "" || firstName.value.length < 2) {
        firstNameError.textContent = "First name is required and must be at least 2 characters.";
        firstNameError.style.display = "block";
        firstName.classList.add("input-error");
        valid = false;
    } else {
        firstNameError.textContent = "";
        firstNameError.style.display = "none";
        firstName.classList.remove("input-error");
    }

    if (lastName.value.trim() === "" || lastName.value.length < 2) {
        lastNameError.textContent = "Last name is required and must be at least 2 characters.";
        lastNameError.style.display = "block";
        lastName.classList.add("input-error");
        valid = false;
    } else {
        lastNameError.textContent = "";
        lastNameError.style.display = "none";
        lastName.classList.remove("input-error");
    }

    if (bName.value.trim() === "" || bName.value.length < 2) {
        bNameError.textContent = "Business name is required and must be at least 2 characters.";
        bNameError.style.display = "block";
        bName.classList.add("input-error");
        valid = false;
    } else {
        bNameError.textContent = "";
        bNameError.style.display = "none";
        bName.classList.remove("input-error");
    }

    if (!email.value.includes("@") || !email.value.includes(".com")) {
        emailError.textContent = "Valid email is required.";
        emailError.style.display = "block";
        email.classList.add("input-error");
        valid = false;
    } else {
        emailError.textContent = "";
        emailError.style.display = "none";
        email.classList.remove("input-error");
    }

    if (phoneNumber.value.length !== 11) {
        phoneError.textContent = "Phone number must be exactly 11 digits.";
        phoneError.style.display = "block";
        phoneNumber.classList.add("input-error");
        valid = false;
    } else {
        phoneError.textContent = "";
        phoneError.style.display = "none";
        phoneNumber.classList.remove("input-error");
    }

    if (password.value.trim() === "" || password.value.length < 6) {
        pwordError.textContent = "Password is required and must be at least 6 characters.";
        pwordError.style.display = "block";
        password.classList.add("input-error");
        valid = false;
    } else {
        pwordError.textContent = "";
        pwordError.style.display = "none";
        password.classList.remove("input-error");
    }

    if (password.value !== cPassword.value) {
        cPasswordError.textContent = "Passwords do not match.";
        cPasswordError.style.display = "block";
        cPassword.classList.add("input-error");
        valid = false;
    } else {
        cPasswordError.textContent = "";
        cPasswordError.style.display = "none";
        cPassword.classList.remove("input-error");
    }

    if (!terms.checked) {
        termsError.textContent = "You must accept the terms and conditions.";
        termsError.style.display = "block";
        terms.classList.add("input-error");
        valid = false;
    } else {
        termsError.textContent = "";
        termsError.style.display = "none";
        terms.classList.remove("input-error");
    }

    // --- BACKEND SUBMISSION ---
    if (valid) {
        const payload = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            businessName: bName.value.trim(),
            email: email.value.trim(),
            phone: phoneNumber.value.trim(),
            password: password.value
        };

        fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Signup successful!");
                window.location.href = "sign in.html"; // ✅ Redirect
            } else {
                alert(data.message || "Signup failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Signup Error:", error);
            alert("An error occurred. Please try again later.");
        });
    }
});

// --- HAMBURGER MENU TOGGLE ---
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));
