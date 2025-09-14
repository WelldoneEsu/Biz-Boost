const newsLetterForm = document.querySelector(".newsLetter-form");
  const successMsg = document.getElementById("successMsg");

  // Get input fields
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const comments = document.getElementById("comments");

  // Get error message containers
  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    comments: document.getElementById("commentsError"),
  };

  newsLetterForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Clear previous error messages
    Object.values(errors).forEach(error => {
      error.textContent = "";
      error.style.display = "none";
    });

    successMsg.textContent = "";
    successMsg.style.display = "none";

    // Validation
    let isValid = true;

    if (name.value.trim().length < 3) {
      errors.name.textContent = "Name must be at least 3 characters";
      errors.name.style.display = "block";
      isValid = false;
    }

    if (!email.value.includes("@") || !email.value.includes(".")) {
      errors.email.textContent = "Enter a valid email address";
      errors.email.style.display = "block";
      isValid = false;
    }


    if (comments.value.trim() === "") {
      errors.comments.textContent = "Comments cannot be empty";
      errors.comments.style.display = "block";
      isValid = false;
    }

    if (!isValid) {
      return; // Stop if validation failed
    }

    // Prepare data to send
    const formData = {
      name: name.value,
      email: email.value,
      comments: comments.value,
    };

    try {
      const response = await fetch("https://biz-boost.onrender.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.text();
        successMsg.textContent = data || "Form Submitted Successfully!";
        successMsg.style.display = "block";

        newsLetterForm.reset();

        setTimeout(() => {
          successMsg.style.display = "none";
        }, 5000);
      } else {
        successMsg.textContent = "Failed to submit form. Please try again.";
        successMsg.style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      successMsg.textContent = "Server error. Please try again later.";
      successMsg.style.display = "block";
    }
  });