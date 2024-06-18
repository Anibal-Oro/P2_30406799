var express = require('express');
var router = express.Router();
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv').config();
require('dotenv').config()
const user = process.env.USER;
const pass = process.env.PASS;
const Token1 = process.env.token1;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Programacion 2, Sección 2", 
Token1: process.env.token1,});
});

const ContactosControllers = require ("../controller/ContactosControllers");
const contactosControllers = new ContactosControllers();
const PassportLocal = require('passport-local').Strategy;


passport.use(new PassportLocal(function(username, password, done){
 if (username === user && password === pass)
return done(null,{id: 1, name: "Autorizado"});

done (null, false);
}));

// { id: 1, name: "Cody" }
// 1 = Serialización
passport.serializeUser (function(user,done){
done (null, user. id);
})
// Deserialización
passport.deserializeUser(function(id, done){
  done (null, {id: 1, name: "Autorizado" });
  })


router.get('/Login', (req, res) => {
  res.render('Login');
});

router.post('/Login', passport.authenticate('local', {
  successRedirect: '/Contactos',
  failureRedirect: '/Login'
}));

router.get('/Contactos', isLoggedIn, contactosControllers.list);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/Login');
}


/*router.get('/Contactos', contactosControllers.list(req, res) => {
  res.render('Contactos');
  //var sql="";
});

router.get('/Contactos', (req, res, next) =>{
  if (req.isAuthenticated()) return next();
  res.redirect ("/Login")}, 
  (req, res)=>(contactosControllers.list));

router.get('/Contactos', isLoggedIn, contactosControllers.add);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/Login');
}
*/

router.post('/formulario', contactosControllers.add)


module.exports = router;
