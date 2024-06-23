var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv').config();
require('dotenv').config()
const TOKEN5 = process.env.TOKEN5;

const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const GoogleStrategy = require('passport-google-oauth20').Strategy;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

app.use(cookieParser( TOKEN5));

app.use(session({
  secret: "TOKEN5",
  resave: false,
  saveUninitialized: true,}));

  


//require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/auth/google',passport.authenticate('google', {scope: ['profile'] }));
app.route("/auth/google/Contactos")
  .get (passport.authenticate('google', {failureRedirect: "/Login" }),
    function (req, res) {
       res.redirect("/Contactos");
    });

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
