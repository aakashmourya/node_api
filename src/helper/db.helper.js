var mysql = require('mysql');
const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}
function executeQuery(query, values) {
    var promise = new Promise(function (resolve, reject) {
        var con = mysql.createConnection(dbconfig);
        
        con.connect(function (err) {
            if (err) {
                reject(err);
            }
            con.query(query, values, function (err, result, fields) {
                con.end(function (err) {
                    if (err) {
                        reject(err);
                    }
                });
                if (err) {
                    reject(err);
                }
                resolve(result)

            });
        });
    });
    return promise;
}
function select(tableName,condition = 1,parameter=[], columns = "*") {
    var sql = `select ${columns} from ${tableName} where ${condition}`;
    //console.log('sql',sql);
    return executeQuery(sql,parameter);
}
function insert(tableName,parameter=[], columns = '*') {
    var sql=`INSERT INTO ${tableName} ${columns=='*'?"":"("+columns+")"} VALUES ?`;
  //  var sql = `select ${columns} from ${tableName} where ${condition}`;
    return executeQuery(sql,[parameter]);
}
function deleterow(tableName,condition = 1,parameter=[]) {
    var sql = `delete from ${tableName} where ${condition}`;
    return executeQuery(sql,parameter);
}


module.exports =
    {
        executeQuery,
        select,
        insert,
        deleterow
        
    };