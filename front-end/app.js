var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser=require('body-parser');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentRouter = require('./routes/student');
var companyRouter = require('./routes/company');
var schoolRouter = require('./routes/school');
var adminRouter = require('./routes/admin');

var app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({
  secret : 'gouyixia', // sign
  resave : true,
  saveUninitialized: false, // 
  cookie : {
    maxAge : 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
  },
}));
db = require('./service/mongodb')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static",express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/student', studentRouter);
app.use('/company', companyRouter);
app.use('/school', schoolRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
