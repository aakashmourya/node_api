function createResponse(message="",success=true,key="result"){
    return {success,[key]:message}
}

function createError(error,code=500){
    return {error:{code,message:error.message}}
}
function createJoiError(error){
    return {error:{message:error.details[0].message}}
}

module.exports =
    {
        createResponse,createError,createJoiError
    };