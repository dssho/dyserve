var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 引入session
var session = require('express-session');
// 引入mongoose
var {Mongoose}=require('./untils/config.js');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 引入管理员
var adminRouter=require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//配置session  去express官网搜express-session配置
app.use(session({
  secret: '$#%$%$%',  //加密
  name : 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: {
	  maxAge : 1000*60*60  //过期时间
  }
})); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// 前面加一个/v3
app.use('/v3/users', usersRouter);
// 配置管理员
app.use('/v3/admin',adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 引入mongoose中的方法
Mongoose.connect();


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
