var express = require('express');
var router = express.Router();
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv').config();
require('dotenv').config()
const user = process.env.USER;
const pass = process.env.PASS;
const Token1 = process.env.Token1;
const TOKEN3 = process.env.TOKEN3;
const TOKEN4 = process.env.TOKEN4;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// GET home page. //
router.get('/', function(req, res, next) {
  res.render('index', { title: "Programacion 2, Sección 2", 
Token1: process.env.Token1,});
});

const ContactosControllers = require ("../controller/ContactosControllers");
const contactosControllers = new ContactosControllers();
const PassportLocal = require('passport-local').Strategy;



// Autenticacion Local //
passport.use(new PassportLocal(
  function(username, password, done){
   if (username === user && password === pass){
      return done(null,{id: 1, username: user});
   } else {
      return done(null, false, { message: 'Usuario o contraseña incorrectos' });
    }
    }
));
// Serialización
passport.serializeUser (function(user,done){
  done (null, user. id);
  })
  // Deserialización
  passport.deserializeUser(function(id, done){
    done (null, {id: 1, name: " aaa " });
    })
  

// Rutas //
router.get('/Login', (req, res) => {
  res.render('Login');
});

router.post('/Login', passport.authenticate('local', {
  successRedirect: '/Contactos',
  failureRedirect: '/Login'
}));


//passport.use(Usuario.createStrategy);

router.get('/Contactos', isLoggedIn, contactosControllers.list);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/Login');
}


// Autenticación con Google //
passport.use(new GoogleStrategy({
  clientID: TOKEN3,
  clientSecret: TOKEN4,
  callbackURL: ["http://localhost:3000/auth/google/Contactos", "https://p2-30406799.onrender.com/auth/google/Contactos"]
},
function(accessToken, refreshToken, profile, done) {
    return done (null, profile);
  }
));


// Serialización //
passport.serializeUser (function(user,done){
done (null, user. id);
})
// Deserialización //
/*passport.deserializeUser(function(id, done){
  done (null, {id: 1, name: user});
  })
*/

passport.deserializeUser(function(id, done) {
  const user = { id: 1, username: user };
  done(null, user);
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


router.post('/formulario', contactosControllers.add)


module.exports = router;
