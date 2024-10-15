const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { protect } = require("../middleware/authMiddleware");
const { error } = require("console");
require("dotenv").config();

// Utility function to generate JWT token
const generateJWT = (id, expiresIn = '1d') => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// Nodemailer transporter setup with Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Please add all fields" });
  }
  if (!email.includes("@gmail") && !email.includes("@yahoo") && !email.includes("@outlook")) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: "User already exists!" });
  }
  
 if(password.length<6){
    return res.status(400).json({error:"Password Must be Min 6 characters!"})
 }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email
    });
  } else {
    return res.status(400).json({ error: "Invalid user data" });
  }
});

// Login user and set JWT in cookies
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user and explicitly select the password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  if (!user.password){
    return res.status(401).json({ error: "Login in other way!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateJWT(user.id);

  // Calculate cookie expiration date
  const cookieExpiresTime = parseInt(process.env.COOKIE_EXPIRES_TIME, 10);

  const options = {
    expires: new Date(Date.now() + cookieExpiresTime * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
  };

  res.cookie("token", token, options);
  return res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token,
  });
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes


  await user.save();
 

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please make a put request to the following link:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    await transporter.sendMail({
      from: "ReactMart <noreply@reactmart.com>",
      to: email,
      subject: 'ReactMart Password Reset Request',
      html: message,
    });

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ error: 'Email could not be sent' });
  }
});

// Reset password
router.post('/reset-password/:resetToken', async (req, res) => {
  const resetTokenHash = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid token or token has expired' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});

// Logout user and clear cookie
router.post("/logout", protect, (req, res) => {
  const options = {
    expires: new Date(0),
    httpOnly: true,
  };
  res.cookie("token", "", options);
  res.status(200).json({ message: "Logged out successfully" });
});

// Get user profile
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar:updatedUser.avatar
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

//Admin: Get All Users
router.get("/admin/users",protect,async (req,res)=>{
  const users = await User.find({})
  res.status(200).json({
    success:"True",
    nohits:users.length,
    users
  })
})

//Admin: Get Specific User 
router.get("/admin/user/:id",protect,async (req,res)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    res.json({
      success:"False",
      message:"User not found!"
    })
  }
  res.status(200).json({
    success:"True",
    user
  })
})

// Update user
router.put("/admin/user/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "User Not Found" });
  }
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });s
    res.status(200).json({ message: "user updated successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete product
router.delete("/admin/user/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "User Not Found" });
  }
  try {
    const user = await ProductSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
