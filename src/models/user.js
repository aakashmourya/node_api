var SCodes=require('../helper/success-codes')
var ErrCodes=require('../helper/error-codes')

class User {

    get name() {
        return this._name;
    }
    set name(value) {
        if (value.length < 4) {
            throw(ErrCodes.getMessage(100));
            return;
        }
        this._name = value;
    }


}
module.exports = User;