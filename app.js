var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var resp = require("./src/helper/response.helper")
//var indexRouter = require('./routes/index');
var usersRouter = require('./src/routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header('Access-Control_Allow-Origin',"*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method==='OPTIONS'){
    res.header("Access-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
 });

//app.use('/', indexRouter);
app.use('/api/v1/', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
 // next(createError(404));

 const error=new Error("Not Found");
 error.status=404;
 next(error);
});

// error handler
app.use(function(error, req, res, next) {

res.status(error.status || 500);
console.log(resp.createError(error.message));
res.json(resp.createError(error,error.status || 500));

  // set locals, only providing error in development
 // res.locals.message = error.message;
 // res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
 // res.status(error.status || 500);
 // res.json({error});
 // res.render('error');
});

module.exports = app;
