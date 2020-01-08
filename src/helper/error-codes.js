module.exports = class ErrorCodes {
    static getMessage(code) {
        return {'code':code,'message':CODE_RES[code]};
    }
}

const CODE_RES =
{
    1000: 'Email id already exists.',
    1010: 'Company name already exists.',
    1020: 'Agent added successfully.',
    1030: 'Agent could not be added.',
    1040: "All fields are compulsory.",
    1050: 'You are already registered.',
    1060: 'Internal Problem Please Contact Admin.',
    1070: 'Invalid start date.',
    1080:'Information not available.',
    1090:'Invalid email and password',
}
