var SCodes = require('../helper/success-codes')
var ErrCodes = require('../helper/error-codes')
var dbHelper = require('../helper/db.helper')

function getDetail(user_id) {
    var sql = `SELECT 
    users.user_id,
    parent_id,
    email,
    password,
    status,
    users.datetime,
    name,
    company_name,
    mobile,
    address,
    gst,
    reg_type FROM users LEFT JOIN user_details on users.user_id=user_details.user_id where users.user_id=?`;//`select ${columns}
    return dbHelper.executeQuery(sql, [user_id]);
}
function getAllUsers(user_id) {
    let sql = `SELECT users.user_id,
    parent_id,
    email,
    password,
    status,
    users.datetime,
    name,
    company_name,
    mobile,
    address,
    gst,
    reg_type FROM users LEFT JOIN user_details on users.user_id=user_details.user_id where users.parent_id=?`;

    return dbHelper.executeQuery(sql, [user_id]);
}


function addUser(user_data, user_detail) {
    var promise = new Promise(function (resolve, reject) {
        dbHelper.getConnection().then(connection => {
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                let sql = dbHelper.generateInsertSql('users', user_data);
                connection.query(sql, dbHelper.convertInsertData(user_data), function (error, results, fields) {
                    if (error) {
                        connection.rollback(function () {
                            reject(error);
                        });
                    }
                    let sql = dbHelper.generateInsertSql('user_details', user_detail);
                    connection.query(sql, dbHelper.convertInsertData(user_detail), function (error, results, fields) {
                        if (error) {
                            connection.rollback(function () {
                                reject(error);
                            });
                        }
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    reject(err);
                                });
                            }
                            connection.end(function (err) {
                                if (err) {
                                    reject(err);
                                }
                            });
                            resolve(results)
                        });
                    });
                });
            });
        }).catch((error) => {
            reject(error);
        });

    });
    return promise;
}

function editUser(user_data, user_detail,user_id) {
    var promise = new Promise(function (resolve, reject) {
        dbHelper.getConnection().then(connection => {
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                let sql = dbHelper.generateUpdateSql('users', user_data,"user_id=?");
           
                connection.query(sql, dbHelper.convertUpdateData(user_data,[user_id]), function (error, results, fields) {
                    if (error) {
                        connection.rollback(function () {
                            reject(error);
                        });
                    }
                    
                    let sql = dbHelper.generateUpdateSql('user_details', user_detail,"user_id=?");
                   
                    connection.query(sql,dbHelper.convertUpdateData(user_detail,[user_id]), function (error, results, fields) {
                        if (error) {
                            connection.rollback(function () {
                                reject(error);
                            });
                        }
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    reject(err);
                                });
                            }
                            connection.end(function (err) {
                                if (err) {
                                    reject(err);
                                }
                            });
                            resolve(results)
                        });
                    });
                });
            });
        }).catch((error) => {
            reject(error);
        });

    });
    return promise;
}

module.exports = { getDetail, addUser,editUser, getAllUsers };
