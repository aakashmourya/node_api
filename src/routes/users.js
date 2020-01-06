var express = require('express');
var router = express.Router();
const checkAuth=require('../middleware/check-auth');
const UserController=require('../controllers/user.controller')

router.post('/login', UserController.login);
router.post('/get_user_details',checkAuth,UserController.getUserDetails);

module.exports = router;
