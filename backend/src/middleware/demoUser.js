const User = require('../models/User');

// Middleware that reads userId from x-user-id header.
// Falls back to demo user if no header (for share link page etc.)
const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.userId = user._id;
        return next();
      }
    }

    // No valid user header — return 401
    return res.status(401).json({ success: false, message: 'Authentication required' });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
};

module.exports = authMiddleware;
