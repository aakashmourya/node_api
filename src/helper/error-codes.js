module.exports = class ErrorCodes {
    static getMessage(code) {
        return {'code':code,'message':CODE_RES[code]};
    }
}

const CODE_RES =
{
    1000: 'Enter Name (only alphabets).',
    1010: 'Enter valid email address.',
    1030: 'Enter valid 10 digit mobile number (atleast 10 digits).',
    1040: "All fields are compulsory.",
    1050: 'You are already registered.',
    1060: 'Internal Problem Please Contact Admin.',
    1070: 'Invalid start date.',
    1080:'Information not available.',
    1090:'Invalid email and password',
}
