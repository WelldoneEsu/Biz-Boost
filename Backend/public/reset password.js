  const API  = 'https://biz-boost.onrender.com/api';
  
  const form = document.getElementById('resetForm');
  const emailError = document.getElementById('emailError');
  const otpError = document.getElementById('otpError');
  const newPasswordError = document.getElementById('newPasswordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const message = document.getElementById('message');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Clear previous error messages
    emailError.textContent = '';
    otpError.textContent = '';
    newPasswordError.textContent = '';
    confirmPasswordError.textContent = '';
    message.textContent = '';

    // Get values
    const email = document.getElementById('email').value.trim();
    const otp = document.getElementById('otp').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let valid = true;

    // Validate email
    if (!email || !email.includes('@') || !email.includes('.')) {
      emailError.textContent = 'Enter a valid email address';
      valid = false;
    }

    // Validate OTP
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      otpError.textContent = 'Enter a valid 6-digit OTP';
      valid = false;
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      newPasswordError.textContent = 'Password must be at least 6 characters long';
      valid = false;
    }

    // Validate confirm password
    if (confirmPassword !== newPassword) {
      confirmPasswordError.textContent = 'Passwords do not match';
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        message.style.color = 'red';
        message.textContent = data.message || 'Failed to reset password. Try again.';
        return;
      }

      message.style.color = 'green';
      message.textContent = 'Password reset successful! Redirecting...';

      // Redirect to sign-in page
      setTimeout(() => {
        window.location.href = 'sign in.html';
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      message.style.color = 'red';
      message.textContent = 'Server error. Please try again later.';
    }
  });
