<<<<<<< HEAD
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json(
            {
                error: {
                    message: 'Auth failed'
                }
            });
=======
const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
//console.log(token);
    const decoded=jwt.verify(token,process.env.JWT_KEY);
    req.userData=decoded;
    next();
    }
    catch(error){
        return res.status(401).json({
            message:'Auth failed'
        });
>>>>>>> 23f4cf5c513a58e84a02979cd547e94108a6ac59
    }
}