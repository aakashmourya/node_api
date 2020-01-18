module.exports = class ErrorCodes {
    static getMessage(code) {
        return {'code':code,'message':CODE_RES[code]};
    }
}

const CODE_RES =
{
    2000:'Invalid email and password',
    2001: 'Email id already exists.',
    2002: 'Company name already exists.',
    2003: 'Agent added successfully.',
    2004: "User not find.",
    2005: "Agent updated successfully.",
  
}
