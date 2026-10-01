const router = require('express').Router();
const { getProfile, updateProfile, getReminders, updateReminders } = require('../controllers/userController');

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/me/reminders', getReminders);
router.patch('/me/reminders', updateReminders);

module.exports = router;
