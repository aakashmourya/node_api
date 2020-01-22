var express = require('express');
var router = express.Router();
const checkAuth=require('../middleware/check-auth');

const MasterController=require('../controllers/master.controller')

router.post('/get_tests',checkAuth,MasterController.getTests);
router.post('/get_packages',checkAuth,MasterController.getPackages);

module.exports = router;

