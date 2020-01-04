module.exports = class ErrorCodes {
    static getMessage(code) {
        return CODE_RES[code];
    }
}

const CODE_RES =
{
    100: 'Info100: Enter Name (only alphabets).',
    101: 'Info101: Enter valid email address.',
    103: 'Info103: Enter valid 10 digit mobile number (atleast 10 digits).',
    104: "Info104: All fields are compulsory.",
    105: 'Info105: You are already registered.',
    106: 'ERROR106: Internal Problem Please Contact Admin.',
    107: 'Warning232: invalid start date.',
    108:'Info108: Information not available.',
    109:'Info109: Invalid email and password.',
}
