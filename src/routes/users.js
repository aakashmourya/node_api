var express = require('express');
var router = express.Router();
const checkAuth=require('../middleware/check-auth');
const UserController=require('../controllers/user.controller')

router.post('/login', UserController.login);
router.post('/get_user_details',checkAuth,UserController.getUserDetails);
router.post('/get_user_types',checkAuth,UserController.getUserTypes);
router.post('/add_user',checkAuth,UserController.addUser);

module.exports = router;
