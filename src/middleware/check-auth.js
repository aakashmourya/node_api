const jwt = require('jsonwebtoken');
var resp = require("../helper/response.helper")
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        //console.log(decoded);
        next();
    }
    catch (error) {
        return res.status(401).json(resp.createError(new Error('Auth failed'),401));
    }
}