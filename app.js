var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'),
    serverConfig = require('./config/serverConfig'),
    passport =  require('passport');

mongoose.connect(serverConfig.config.dbUrl);

var routes = require('./router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

/**
 * Bootstrap passport config
 */
require('./config/passportConfig')();

/**
 *  Initialize route
 */
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  // If the error object doesn't exists
  if (!err) return next();

  // Log it
  console.error(err.stack);

  // Error page
  res.status(500).send({
    error: err.stack
  });
});

// Assume 404 since no middleware responded
app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl,
    error: 'Not Found'
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
