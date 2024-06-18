const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var router = express.Router();

// Configure Passport.js to use the LocalStrategy
passport.use(new LocalStrategy({
  usernameField: '123',
  passwordField: '123'
}, (username, password, done) => {
  // Verify the username and password
  // For example, you can query your database to check if the user exists
  // and if the password is correct
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    if (!user.verifyPassword(password)) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    return done(null, user);
  });
}));

// Serialize the user to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

function entrar(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("Faltan datos requeridos (username o password)");
  }

  const { username, password } = req.body;
console.log(username);
console.log(password);

  try {
    const isValidUser = validateUser(username, password); // Replace with actual validation function

    if (isValidUser) {
      // Login successful, redirect to contacts page
      return res.render("/Contactos"); // Assuming the template is named "Contactos.ejs"
    } else {
      return res.render("/Login", { errorMessage: "Usuario o contraseña incorrecta" });
    }
  } catch (error) {
    console.error("Error", error);
    return res.status(500).send("Error interno del servidor"); 
  }
}

function validateUser(username, password) {
  return username == "123" && password == "123";
  }

  module.exports = passport;