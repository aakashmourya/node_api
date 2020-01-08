function createResponse(message = "", success = true, key = "result") {
    return { success, [key]: message }
}

function createError(error, code = 500, onlyObj = false) {
    let obj = { code, message: error.message };
    if (onlyObj) {
        return obj;
    }
    return { error: obj }
}

function errorHandler(res,error, code = 500, onlyObj = false) {
  // var fun= function (error) {
        res.status(code).json(createError(error,code,onlyObj));
    // }
   // return fun;
}

module.exports =
{
    createResponse, createError,errorHandler
};