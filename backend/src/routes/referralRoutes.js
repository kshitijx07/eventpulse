const router = require('express').Router();
const { createShareLink, getFriendsAttending } = require('../controllers/referralController');

router.post('/:eventId/share', createShareLink);
router.get('/:eventId/friends-count', getFriendsAttending);

module.exports = router;
