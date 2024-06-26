const ContactosModel = require("../models/ContactosModel");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
require('dotenv').config()
//const secretGoogle = process.env.token2;
const CORREO = process.env.CORREO;
const CLAVE = process.env.CLAVE;

//smtp.gmail.com
//'programacion2ais@dispostable.com'

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
    this.list = this.list.bind(this)
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      port: 587,
      tls: {
        ciphers: 'SSLv3'
      },
      auth: {
        user: CORREO,
        pass: CLAVE,
      }
    });
    console.log('ContactosModel inicializado:', this.contactosModel); // Verificar inicialización
  }

  async obtenerIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // Retorna la ip
    } catch (error) {
      console.error('Error al obtener la ip:', error);
      return null; // Retorna null si hay un error
}
}

  async obtenerPais(ip) {
  try {
    const response = await fetch('https://ipinfo.io/json?9975e8e16232a8');
    const data = await response.json();
    return data.country; // Retorna el país
  } catch (error) {
    console.error('Error al obtener el país:', error);
    return null; // Retorna null si hay un error
}
}

nodemailer(CORREO, CLAVE, nombre, email, mensaje, ip, fecha, pais){
  const mailOptions = {
    from: CORREO,
    to: [CORREO, email],
    subject: 'Informacion del Contacto',
    text: `Nombre: ${nombre}\nCorreo electrónico: ${email}\nComentario ${mensaje} \nFecha ${fecha}\nPaís: ${pais}`
  };

  this.transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al enviar correo electrónico');
    } else {
      res.send('Correo electrónico enviado correctamente');
    }
  });
}

  async add(req, res) {

    const responseGoogle = req.body["g-recaptcha-response"];
    const secretGoogle = process.env.TOKEN2;
    const urlGoogle = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogle}&response=${responseGoogle}`;

   const RecaptchaGoogle = await fetch(urlGoogle);
    const google_response_result = await RecaptchaGoogle.json();
    console.log(google_response_result)
/* 
    try {
      const RecaptchaGoogle = await fetch(urlGoogle, { method: "post", });
      const google_response_result = await RecaptchaGoogle.json();
      console.log(google_response_result); // Ahora debería imprimir el resultado correctamente
    } catch (err) {
      console.error(err); // Maneja cualquier error que ocurra durante la solicitud
    }
*/

    if (google_response_result.success == true) { 
    console.log(google_response_result);
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      res.status(400).send("Faltan datos requeridos");
      return;
    }

    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip); 


    const contactos = await this.contactosModel.obtenerAllContactos();
    
    await this.nodemailer(CORREO, CLAVE, nombre, email, mensaje, ip, fecha, pais);      

    await this.contactosModel.crearContactos(nombre, email, mensaje, pais, ip, fecha);
    
    /*const contactos = await this.contactosModel.obtenerAllContactos();
    */

    res.send("Mensaje enviado correctamente");
  } else {
    res.send('Verifica el captcha para avanzar')
  }
} catch (error) {
  console.error(`Error al verificar reCAPTCHA: ${error}`);
}


  async list(req, res) {
  try {
    console.log('ContactosModel en list:', this.contactosModel); // Verificar inicialización
    const contactos = await this.contactosModel.obtenerAllContactos();
    res.render('Contactos', { contactos });
  } catch (error) {
    console.error("Error al mostrar los Contactos:", error);
    res.status(500).render('error', { mensaje: 'Error al mostrar los contactos' });
  }
}

}

module.exports = ContactosController;