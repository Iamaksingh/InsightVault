const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const controller = require('../controllers/preference.controller');

router.get('/', auth, controller.getPreferences);
router.put('/', auth, controller.updatePreferences);

module.exports = router;


