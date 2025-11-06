const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('../models/User');
const { generateUserId } = require('../utils/generateId');
const sendEmail = require('../utils/sendEmail');
const { welcomeEmail, otpEmail, resetPasswordEmail } = require('../utils/sentEmail');
const { generateOtp, generateResetToken, generateJwtToken } = require('../utils/tokenGenerator');
const crypto = require('crypto');

// ------------------ REGISTER ------------------
exports.register = async (req, res) => {
  try {
    const {  email, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    // Generate unique userId
    let userId;
    let isUnique = false;

    while (!isUnique) {
      const tempId = await generateUserId(role || "user");
      const existingId = await User.findOne({ userId: tempId });
      if (!existingId) {
        userId = tempId;
        isUnique = true;
      }
    }

    const user = await User.create({
      userId, 
      email,
      role: role || "user",
    });

    try {
      await sendEmail(user.email, "Welcome to Game World", welcomeEmail(user));
    } catch (e) {
      console.error("Welcome email failed:", e.message);
    }

    const token = generateJwtToken({ id: user._id });
    res.status(201).json({ message: "User registered", user, token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// ------------------ LOGIN ------------------

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validate input ---
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // --- Find user by email ---
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ⛔ Don't delete this section
    // if (!user.isVerified)
    //   return res.status(403).json({ message: "Account not verified" });
    // if (!user.isActive)
    //   return res.status(403).json({ message: "Account is deactivated" });

    // --- Compare passwords ---
    // const isMatch = await user.comparePassword(password);

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "The password is incorrect." });
    }

    // --- Update last login timestamp ---
    user.lastLogin = new Date();
    await user.save();

    // --- Generate JWT token ---
    const token = generateJwtToken({ id: user._id, role: user.role, email: user.email });

    // --- Remove sensitive data before sending response ---
    const { password: _, otp, otpExpire, ...safeUser } = user.toObject();

    res.status(200).json({
      message: "Logged in successfully",
      user: safeUser,
      token,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

// ----------------token



// ------------------ LOGOUT ------------------
exports.logout = (req, res) => {
  res.json({ message: 'Logged out (client should discard the token)' });
};

// ------------------ SEND OTP ------------------
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpire = Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES || '10') * 60 * 1000);
    await user.save();

    try {
      await sendEmail(email, 'Your OTP Code', otpEmail(otp));
    } catch (e) {
      console.error('OTP email failed:', e.message);
    }

    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// ------------------ VERIFY OTP ------------------
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verify failed', error: err.message });
  }
};



// ------------------ SET PASSWORD ------------------
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify your email first" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    const token = generateJwtToken({ id: user._id });

    res.status(200).json({
      success: true,
      message: "Password set successfully",
      token,
    });
  } catch (err) {
    console.error("Set password error:", err);
    res.status(500).json({ message: "Failed to set password", error: err.message });
  }
};

// ------------------ FORGOT PASSWORD ------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { resetToken, resetTokenHash } = generateResetToken();
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + (10 * 60 * 1000);
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    try {
      await sendEmail(email, 'Password Reset', resetPasswordEmail(resetURL));
    } catch (e) {
      console.error('Reset email failed:', e.message);
    }

    res.json({ message: 'Reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Forgot password failed', error: err.message });
  }
};

// ------------------ RESET PASSWORD ------------------
exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Reset password failed', error: err.message });
  }
};
