const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({ name: name.trim(), email: cleanEmail, password });

    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    // If demo user doesn't exist yet, create it on the fly
    if (!user && cleanEmail === 'demo@eventpulse.com') {
      user = await User.create({
        name: 'Demo User',
        email: cleanEmail,
        password: password,
        reminderSettings: { enabled: false, reminderTime: '1 hour' }
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // If user record existed before passwords were required (legacy/seeded user)
    if (!user.password) {
      user.password = password;
      await user.save();
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    res.json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
