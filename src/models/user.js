var SCodes=require('../helper/success-codes')
var ErrCodes=require('../helper/error-codes')
var dbHelper = require('../helper/db.helper')

function getDetail(user_id) {
    var sql = `SELECT * FROM users LEFT JOIN user_details on users.user_id=user_details.user_id where users.user_id=?`;//`select ${columns} from ${tableName} where ${condition}`;
    //console.log('sql',sql);
    return dbHelper.executeQuery(sql,[user_id]);
}
module.exports = {getDetail};