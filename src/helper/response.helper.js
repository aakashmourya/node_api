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

module.exports =
{
    createResponse, createError
};