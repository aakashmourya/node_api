var express = require('express');
var router = express.Router();
const checkAuth=require('../middleware/check-auth');
const UserController=require('../controllers/user')

router.post('/login', UserController.login);
router.post('/user',checkAuth,UserController.getUserDetails);

module.exports = router;
