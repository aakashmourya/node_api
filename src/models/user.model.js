var SCodes = require('../helper/success-codes')
var ErrCodes = require('../helper/error-codes')
var dbHelper = require('../helper/db.helper')

function getDetail(user_id) {
    var sql = `SELECT users.user_id, added_by, email, password, status, users.datetime, name, company_name, mobile, address, gst, users.ref_code, reg_type,user_references.ref_code as 'referred_by',percentage FROM users LEFT JOIN user_details on users.user_id=user_details.user_id LEFT JOIN user_references on users.user_id=user_references.user_id where  (user_references.datetime IS NULL or user_references.datetime=(SELECT max(datetime) from user_references WHERE user_id=users.user_id)) and users.user_id=?`;//`select ${columns}
    return dbHelper.executeQuery(sql, [user_id]);
}
function getAllUsers(user_id) {
    let sql = `SELECT users.user_id, added_by, email, password, status, users.datetime, name, company_name, mobile, address, gst, users.ref_code, reg_type,user_references.ref_code as 'referred_by',percentage FROM users LEFT JOIN user_details on users.user_id=user_details.user_id LEFT JOIN user_references on users.user_id=user_references.user_id where  (user_references.datetime IS NULL or user_references.datetime=(SELECT max(datetime) from user_references WHERE user_id=users.user_id)) and users.added_by=?`;

    return dbHelper.executeQuery(sql, [user_id]);
}


function addUser(user_data, user_detail, user_references = null) {
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
                        if (user_references !== null) {

                            let sql = dbHelper.generateInsertSql('user_references', user_references);
                            connection.query(sql, dbHelper.convertInsertData(user_references), function (error, results, fields) {
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
                        }
                        else {
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
                        }
                    });
                });
            });
        }).catch((error) => {
            reject(error);
        });

    });
    return promise;
}

function editUser(user_data, user_detail, user_id) {
    var promise = new Promise(function (resolve, reject) {
        dbHelper.getConnection().then(connection => {
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                let sql = dbHelper.generateUpdateSql('users', user_data, "user_id=?");

                connection.query(sql, dbHelper.convertUpdateData(user_data, [user_id]), function (error, results, fields) {
                    if (error) {
                        connection.rollback(function () {
                            reject(error);
                        });
                    }

                    let sql = dbHelper.generateUpdateSql('user_details', user_detail, "user_id=?");

                    connection.query(sql, dbHelper.convertUpdateData(user_detail, [user_id]), function (error, results, fields) {
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

function addContract(user_contract_data, user_contract_tests) {
    var promise = new Promise(function (resolve, reject) {
        dbHelper.getConnection().then(connection => {
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                let sql = dbHelper.generateInsertSql('user_contracts', user_contract_data);
                connection.query(sql, dbHelper.convertInsertData(user_contract_data), function (error, results, fields) {
                    if (error) {
                        connection.rollback(function () {
                            reject(error);
                        });
                    }
                    let sql = dbHelper.generateInsertSql('user_contract_tests', user_contract_tests[0]);
                    connection.query(sql, dbHelper.convertInsertBulkData(user_contract_tests), function (error, results, fields) {
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

module.exports = { getDetail, addUser, editUser, getAllUsers, addContract };
