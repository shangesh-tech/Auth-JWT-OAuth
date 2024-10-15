const express = require("express");
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

router.post("/auth", async (req, res) => {
  try {
    const { clientId, credential } = req.body;
    const decodedToken = jwt.decode(credential);

    if (!decodedToken) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Verify the token with Google's tokeninfo endpoint
    const tokenInfoResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const tokenInfo = tokenInfoResponse.data;

    // Check if the token is valid and matches the client ID
    if (tokenInfo.aud !== clientId) {
      return res.status(400).json({ error: 'Token does not match the client ID' });
    }

    const userId = decodedToken.sub;
    const userEmail = decodedToken.email;
    const userName = decodedToken.name;
   

    // Check if the user already exists in the database
    let user = await User.findOne({ googleId: userId });

    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        googleId: userId,
        email: userEmail,
        name: userName,
      });
    }

    // Generate a JWT token for your application
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d', // Token expiration time
    });

    // Calculate cookie expiration date
    const cookieExpiresTime = parseInt(process.env.COOKIE_EXPIRES_TIME, 10) || 7;

    const options = {
      expires: new Date(Date.now() + cookieExpiresTime * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
    };

    res.cookie('token', token, options);

    return res.json({
      message: 'Google login successful',
      _id: user._id,
      name: userName,
      email: userEmail,
      token,
    });

  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 

module.exports = router;
