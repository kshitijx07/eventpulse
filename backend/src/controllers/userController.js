const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getReminders = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('reminderSettings');
    res.json({ success: true, data: user.reminderSettings });
  } catch (error) {
    next(error);
  }
};

const updateReminders = async (req, res, next) => {
  try {
    const { enabled, reminderTime } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        reminderSettings: {
          ...(enabled !== undefined && { enabled }),
          ...(reminderTime && { reminderTime })
        }
      },
      { new: true }
    );
    res.json({ success: true, data: user.reminderSettings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getReminders, updateReminders };
