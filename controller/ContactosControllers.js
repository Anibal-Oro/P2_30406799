const ContactosModel = require("../models/ContactosModel");
const nodemailer = require('nodemailer');
require('dotenv').config();
const secretGoogle = process.env.token2;

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
    this.transporter = nodemailer.createTransport({
      service : 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.clave
    }
  });
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
    const response = await fetch(process.env.pais1);
    const data = await response.json();
    return data.country; // Retorna el país
  } catch (error) {
    console.error('Error al obtener el país:', error);
    return null; // Retorna null si hay un error
    }
  }

  async add(req, res) {

    const responseGoogle = req.body["g-recaptcha-response"];
    const secretGoogle = process.env.token2;
    const urlGoogle = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogle}&response=${responseGoogle}`;
    const RecaptchaGoogle = await fetch(urlGoogle);
    const google_response_result = await RecaptchaGoogle.json();
    console.log(google_response_result)
    if (google_response_result.success == true) { 

    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      res.status(400).send("Faltan datos requeridos");
      return;
    }

    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip); 

      

    await this.contactosModel.crearContactos(nombre, email, mensaje, pais, ip, fecha);
    
    /*const contactos = await this.contactosModel.obtenerAllContactos();
    console.log(contactos);*/

    const mailOptions = {
      from: process.env.email,
      to: 'programacion2ais@dispostable.com',
      subject: 'Informacion del Contacto',
      text: `Nombre: ${nombre}\nCorreo electrónico: ${email}\nComentario ${mensaje} \nip ${ip} \nFecha ${fecha}\nPaís: ${pais}`
    };

      this.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al enviar correo electrónico');
        } else {
          res.send('Correo electrónico enviado correctamente');
        }
      });
   
    res.send("Mensaje enviado correctamente");
  } else {
    res.send('Verifica el captcha para avanzar')
  }
}
/*async nodemailer(req, res){
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: process.env.email,
      pass: process.env.clave
    }
  });

  const mailOptions = {
    from: process.env.email,
    to: 'programacion2ais@dispostable.com',
    subject: 'Informacion del Contacto',
    text: `Nombre: ${nombre}\nCorreo electrónico: ${email}\nComentario ${mensaje} \nip ${ip} \nFecha ${fecha}\nPaís: ${pais}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al enviar correo electrónico');
    } else {
      res.send('Correo electrónico enviado correctamente');
    }
  });
}*/
}

module.exports = ContactosController;