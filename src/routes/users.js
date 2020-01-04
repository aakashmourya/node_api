var express = require('express');
var router = express.Router();
const checkAuth=require('../middleware/check-auth');
const UserController=require('../controllers/user')

router.post('/login', UserController.login);
<<<<<<< HEAD
router.post('/user',checkAuth,UserController.getUserDetails);
=======
router.post('/user',checkAuth,UserController.user);
>>>>>>> 23f4cf5c513a58e84a02979cd547e94108a6ac59

module.exports = router;
