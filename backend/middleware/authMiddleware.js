const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  try {
    if (req.cookies.token) {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id)

      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }

      next();
    } else {
      return res.status(401).json({ error: 'Not authorized, no token passed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = { protect };
