const User = require('../models/User');

// Middleware that attaches a demo user to every request.
// Structured so real authentication can replace this later.
const demoUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: 'demo@eventpulse.com' });
    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email: 'demo@eventpulse.com',
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
