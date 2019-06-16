var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user_controller');

router.post('/consumers/signin', [user_controller.sign_in]);
router.get('/consumers/get_current_user',[user_controller.loginRequired]);
router.get('/consumers/all',[user_controller.usersList]);
router.post('/consumers/signup', [user_controller.register]);
router.get('/consumers/:userId', [user_controller.getById]);
router.post('/consumers/logout', [user_controller.logout]);
router.get('/largest/invoice', [user_controller.largestInvoice]);
router.get('/largest/units', [user_controller.largestUnits]);

module.exports = router;
