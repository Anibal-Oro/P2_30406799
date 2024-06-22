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

// GET home page. //
router.get('/', function(req, res, next) {
  res.render('index', { title: "Programacion 2, Sección 2", 
Token1: process.env.Token1,});
});

const ContactosControllers = require ("../controller/ContactosControllers");
const contactosControllers = new ContactosControllers();
const PassportLocal = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// Autenticacion Local //
passport.use(new PassportLocal(function(username, password, done){
 if (username === user && password === pass)
return done(null,{id: 1, name: "Autorizado"});

done (null, false);
}));
// { id: 1, name: "Cody" } //
// 1 = Serialización //
passport.serializeUser (function(user,done){
done (null, user. id);
})
// Deserialización //
passport.deserializeUser(function(id, done){
  done (null, {id: 1, name: "Autorizado" });
  })


// Autenticación con Google //
passport.use(new GoogleStrategy({
  clientID: TOKEN3,
  clientSecret: TOKEN4,
  callbackURL: "http://localhost:3000/auth/google/Contactos"
},
function(accessToken, refreshToken, profile, cb) {
  findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


// Rutas //
router.get('/Login', (req, res) => {
  res.render('Login');
});

router.post('/Login', passport.authenticate('local', {
  successRedirect: '/Contactos',
  failureRedirect: '/Login'
}));


/* auth google
app.get('/auth/google',passport.authenticate('google', {scope: ['profile'] }));
  console.log(profile)
app.route("/auth/google/Contactos")
  .get (passport.authenticate('google', {failureRedirect: "/Login" }),
    function (req, res) {
       res.redirect("/Contactos");
    });
*/

//passport.use(Usuario.createStrategy);
// serializar //
passport.serializeUser(function(user, cb){
 process.nextTick(function() {
    cb(null, {id: user. id }); 
  });
});
// deserializar //
passport.deserializeUser(function(user, cb){
  process.nextTick(function() {
    return cb(null, user);
    });
});

router.get('/Contactos', isLoggedIn, contactosControllers.list);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/Login');
}

router.post('/formulario', contactosControllers.add)

/*router.get('/Contactos', contactosControllers.list(req, res) => {
  res.render('Contactos');
  //var sql="";
});

router.get('/Contactos', (req, res, next) =>{
  if (req.isAuthenticated()) return next();
  res.redirect ("/Login")}, 
  (req, res)=>(contactosControllers.list));

*/

module.exports = router;
