const router = require('express').Router();
const { createRsvp, getUserRsvps, deleteRsvp, getUserRsvpEventIds } = require('../controllers/rsvpController');

router.post('/', createRsvp);
router.get('/', getUserRsvps);
router.get('/event-ids', getUserRsvpEventIds);
router.delete('/:eventId', deleteRsvp);

module.exports = router;
