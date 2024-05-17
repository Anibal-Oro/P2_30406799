var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Programacion 2, Sección 2", 
nombre: "Emil",
apellido: "Oropeza",
cedula: 30406799, });
});


const ContactosControllers = require ("../controller/ContactosControllers");
const contactosControllers = new ContactosControllers();

router.post('/formulario', contactosControllers.add)

module.exports = router;
