const User = require('../models/User');

const demoUser = async (req, res, next) => {
  try {
    const headerUserId = req.headers['x-user-id'];
    if (headerUserId) {
      const user = await User.findById(headerUserId);
      if (user) {
        req.userId = user._id;
        return next();
      }
    }

    // Fallback to demo user if no valid header passed
    let user = await User.findOne({ email: 'demo@eventpulse.com' });
    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email: 'demo@eventpulse.com',
        password: 'demopassword123',
        reminderSettings: { enabled: false, reminderTime: '1 hour' }
      });
    }
    req.userId = user._id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = demoUser;
