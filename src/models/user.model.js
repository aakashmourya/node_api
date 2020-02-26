var SCodes = require('../helper/success-codes')
var ErrCodes = require('../helper/error-codes')
var dbHelper = require('../helper/db.helper')

function getDetail(user_id) {
    var sql = `SELECT users.user_id, added_by, email, password, status, users.datetime, name, company_name, mobile, address, gst, users.ref_code, reg_type,user_references.ref_code as 'referred_by',percentage,user_contracts.contract_no FROM users LEFT JOIN user_details on users.user_id=user_details.user_id LEFT JOIN user_references on users.user_id=user_references.user_id LEFT JOIN user_contracts on user_contracts.user_id=users.user_id where (user_references.datetime IS NULL or user_references.datetime=(SELECT max(datetime) from user_references WHERE user_id=users.user_id)) and users.user_id=?`;//`select ${columns}
    return dbHelper.executeQuery(sql, [user_id]);
}

function getAllUsers(user_id,ref_code) {
    let sql = `SELECT users.user_id, added_by, email, password, status, users.datetime, name, company_name, mobile, address, gst, users.ref_code, reg_type,user_references.ref_code as 'referred_by',percentage,user_contracts.contract_no FROM users LEFT JOIN user_details on users.user_id=user_details.user_id LEFT JOIN user_references on users.user_id=user_references.user_id LEFT JOIN user_contracts on user_contracts.user_id=users.user_id where (user_references.datetime IS NULL or user_references.datetime=(SELECT max(datetime) from user_references WHERE user_id=users.user_id)) and (users.added_by=? OR user_references.ref_code=?)`;

    return dbHelper.executeQuery(sql, [user_id,ref_code]);
}

function getContractDetails(contract_no){
    var sql = `SELECT user_contracts.user_id,user_contracts.contract_no,user_contracts.from_date,user_contracts.to_date,user_contracts.document,user_contracts.datetime, added_by, email, name, company_name, mobile, address, gst,reg_type FROM user_contracts left JOIN users on users.user_id=user_contracts.user_id left JOIN user_details on user_details.user_id=users.user_id WHERE user_contracts.contract_no=?`;//`select ${columns}
    return dbHelper.executeQuery(sql, [contract_no]);
}

function getContractTests(contract_no){
    var sql = `SELECT contract_no,test_id,test,user_contract_tests.mrp,user_contract_tests.percentage,package_id,packages.name as package,min_test_range,max_test_range FROM user_contract_tests left JOIN test_master on test_master.id=user_contract_tests.test_id left JOIN packages on packages.id=user_contract_tests.package_id where contract_no=?`;//`select ${columns}
    return dbHelper.executeQuery(sql, [contract_no]);
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

function editUser(user_data, user_detail, user_references,user_id) {
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

module.exports = { getDetail, addUser, editUser, getAllUsers, addContract,getContractDetails,getContractTests };
