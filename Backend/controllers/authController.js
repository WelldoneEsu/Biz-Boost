const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');

// Generate JWT Token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// @desc   Register a new user
exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, businessName, phoneNumber, email, password } = req.body;

    if (!firstName || !lastName || !email || !businessName || !phoneNumber || !password) {
      return res.status(400).json({
        message: 'firstName, lastName, email, businessName, phoneNumber, and password are required'
      });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (userExists) {
      return res.status(400).json({ message: 'Email or phone number already registered' });
    }

    const user = await User.create({
      firstName, 
      lastName,
      businessName,
      phoneNumber,
      email,
      password
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      businessName: user.businessName,
      phoneNumber: user.phoneNumber,
      token: createToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Login user
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      businessName: user.businessName,
      phoneNumber: user.phoneNumber,
      token: createToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = crypto.createHash('sha256').update(otp).digest('hex');
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    await sendMail(user.email, 'OTP for Password Reset', '', otp);

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Verify OTP and reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Logout user
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};



