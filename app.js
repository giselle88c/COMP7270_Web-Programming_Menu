var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ordersRouter = require('./routes/orders');
var adminRouter = require('./routes/admin');
/////////////////Below for Login/////////////////////////
var jwt = require('jsonwebtoken');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
passport.use(new BearerStrategy(
  function (token, done) {
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
      if (err) { return done(err); }
      return done(null, decoded, { scope: "all" });
    });
  }
));
///////////////Above for login///////////////////////////////
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('json spaces',2);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', passport.authenticate('bearer', { session: false }), usersRouter);
app.use('/orders', passport.authenticate('bearer', { session: false }), ordersRouter);
app.use('/admin', passport.authenticate('bearer', { session: false }), adminRouter);

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

//Below all for login
///////////////////////////////////////////
process.env.TOKEN_SECRET = 'secret';


module.exports = app;
