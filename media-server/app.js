var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();


//routes
var routes = require('./routes/index');
var conf = require('./common/conf.js').get(process.env.NODE_ENV);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, uid, token");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS ');
  next();
});

app.use(express.static(path.join(__dirname, './')));
import media from './src/media/router';
// ./src/media
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade');
app.use('/media', media);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



//서버 열기
app.listen(conf.server.port, function(){
  console.log('node-rest-demo pid %s listening on %d in %s',
    process.pid,conf.server.port, process.env.NODE_ENV);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});






module.exports = app;
