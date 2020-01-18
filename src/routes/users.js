var express = require('express');
var router = express.Router();
const checkAuth=require('../middleware/check-auth');
const UserController=require('../controllers/user.controller')

router.post('/login', UserController.login);
router.post('/get_user_details',checkAuth,UserController.getUserDetails);
router.post('/get_user_types',checkAuth,UserController.getUserTypes);
router.post('/add_user',checkAuth,UserController.addUser);
router.post('/edit_user',checkAuth,UserController.editUser);
router.post('/get_all_users',checkAuth,UserController.getAllUsers);

module.exports = router;
