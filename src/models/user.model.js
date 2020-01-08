var SCodes=require('../helper/success-codes')
var ErrCodes=require('../helper/error-codes')
var dbHelper = require('../helper/db.helper')

function getDetail(user_id) {
    var sql = `SELECT 
    users.user_id,
    parent_id,
    email,
    status,
    users.datetime,
    name,
    company_name,
    mobile,
    address,
    gst,
    reg_type FROM users LEFT JOIN user_details on users.user_id=user_details.user_id where users.user_id=?`;//`select ${columns}
    return dbHelper.executeQuery(sql,[user_id]);
}
module.exports = {getDetail};
