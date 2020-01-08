var mysql = require('mysql');
const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

function executeQuery(query, values = []) {
    var promise = new Promise(function (resolve, reject) {
      
        let con = mysql.createConnection(dbconfig);

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
function select(tableName, condition = 1, parameter = [], columns = "*") {
    var sql = `select ${columns} from ${tableName} where ${condition}`;
    return executeQuery(sql, parameter);
}
// function insert(tableName,columns = '*', parameter = []) {
//     var sql = `INSERT INTO ${tableName} ${columns == '*' ? "" : "(" + columns + ")"} VALUES ?`;
//     console.log(sql);
//     return executeQuery(sql, [[parameter]]);
// }
function insert(tableName,data) {
    var sql = `INSERT INTO ${tableName} ${"(" + Object.keys(data).join(',') + ")"} VALUES ?`;
    console.log(sql);
    return executeQuery(sql, [[Object.keys(data).map((key)=>data[key])]]);
}
function deleteRow(tableName, condition = 1, parameter = []) {
    var sql = `delete from ${tableName} where ${condition}`;
    return executeQuery(sql, parameter);
}

async function getNewId(tableName, prefix = "", pad_length = 4) {
   
    var sql = `SELECT AUTO_INCREMENT as no
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = "${dbconfig.database}"
    AND TABLE_NAME = "${tableName}"`;//`SELECT max(id) as maxid  FROM ${tableName}`;
    let result = await executeQuery(sql).catch(error => {
        return 0;
    });
    if (result !== undefined && result.length) {
        let no=result[0]['no'].toString().padStart(pad_length, '0');
        let date=new Date();
        let formateDate=`${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        return `${prefix.toUpperCase()}${formateDate}${no}`;
    }
    return 0;
}


module.exports =
{
    executeQuery,
    select,
    insert,
    deleteRow,
    getNewId

};