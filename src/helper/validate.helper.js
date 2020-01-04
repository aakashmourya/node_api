function PhoneNumber(inputtxt) {
    var phoneno = /^\d{10}$/;
    return (inputtxt.trim().match(phoneno))? true:false;      
}
function Email(inputtxt) {
    var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (inputtxt.trim().match(email))? true:false;      
}
function Name(inputtxt) {
    var pattern = /^[a-zA-Z ]+$/;
    return (inputtxt.trim().match(pattern))? true:false;      
}
module.exports= {PhoneNumber,Email,Name}