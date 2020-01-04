function createResponse(message="",success=true,key="message"){
    return {success,[key]:message}
}

function createError(error){
    return {error:{message:error.message}}
}
function createJoiError(error){
    return {error:{message:error.details[0].message}}
}

module.exports =
    {
        createResponse,createError,createJoiError
    };