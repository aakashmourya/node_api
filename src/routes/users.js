var express = require('express');
var router = express.Router();
const checkAuth=require('../middleware/check-auth');
const UserController=require('../controllers/user.controller')
const MasterController=require('../controllers/master.controller')
let multer = require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        
        let date =new Date();
       //console.log(file);
       let extention="";
       let dotIndex=file.originalname.lastIndexOf('.');
       if(dotIndex!=-1){
        extention=file.originalname.substring(dotIndex);
       }
        cb(null,`${date.toISOString().replace(/:/g,"_")}${extention}`);
    }
})
let upload = multer({storage:storage});
router.post('/login', UserController.login);
router.post('/get_user_details',checkAuth,UserController.getUserDetails);
router.post('/get_user_types',checkAuth,UserController.getUserTypes);
router.post('/add_user',checkAuth,UserController.addUser);
router.post('/edit_user',checkAuth,UserController.editUser);
router.post('/get_all_users',checkAuth,UserController.getAllUsers);
router.post('/check_reference_code',checkAuth,UserController.checkReferenceCode);

router.post('/add_contract',checkAuth,upload.single('doc_file'),UserController.addContract);
router.post('/get_contract_details',checkAuth,UserController.getContractDetails);

module.exports = router;

