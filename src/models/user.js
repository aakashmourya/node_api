var SCodes=require('../helper/success-codes')
var ErrCodes=require('../helper/error-codes')
<<<<<<< HEAD
var dbHelper = require('../helper/db.helper')

function getDetail(user_id) {
    var sql = `SELECT * FROM users LEFT JOIN user_details on users.user_id=user_details.user_id where users.user_id=?`;//`select ${columns} from ${tableName} where ${condition}`;
    //console.log('sql',sql);
    return dbHelper.executeQuery(sql,[user_id]);
}
module.exports = {getDetail};
=======

class User {

    get name() {
        return this._name;
    }
    set name(value) {
        if (value.length < 4) {
            throw(ErrCodes.getMessage(100));
            return;
        }
        this._name = value;
    }


}
module.exports = User;
>>>>>>> 23f4cf5c513a58e84a02979cd547e94108a6ac59
