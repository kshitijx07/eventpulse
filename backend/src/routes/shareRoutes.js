const router = require('express').Router();
const { resolveShareLink } = require('../controllers/referralController');

router.get('/:code', resolveShareLink);

module.exports = router;
