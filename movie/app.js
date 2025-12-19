var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require('cors');
var app = express();
app.use(cors());

//跨域问题
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   res.header("Content-Type", "text/html");
//   next();
// });



var util = require('./util/util');
app.all('/*', function (req, res, next) {
  let url = req.url.split('?')[0]
  console.log(url)
  console.log(url.indexOf("/getFile"))
  if(url.indexOf("/login")==-1&&url.indexOf("/getFile")==-1&&url.indexOf("/register")==-1&&url.indexOf("/type/list")==-1&&url.indexOf("/movie/list")==-1&&url.indexOf("/product/list")==-1){
    var token = req.headers['authorization']
    
      if(typeof token == 'undefined') {
          res.json({code: 401, reason: '无访问权限'})
      } else {
        var token = token.split(' ')[1]
        
        util.verifyToken(token).then(data => {
            console.log(data)
              next();
          }).catch(err => {
              res.json({code: 403, reason: '身份信息校验失败'})
          })
      }
  }else {
      next();
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
