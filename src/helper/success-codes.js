module.exports = class SuccessCodes {
    static getMessage(code) {
        return CODE_RES[code];
    }
}

const CODE_RES =
{
    100: 'Registration Success',
    101: 'Login Success',
    102: 'Update Success',
    103: 'Otp Matched',
    104: 'Success',
    105: 'Player Is Already Connected'
}
