const ContactosModel = require("../models/ContactosModel");

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {

    const responseGoogle = req.body["g-recaptcha-response"];
    const secretGoogle = "6Ld2T-0pAAAAAEh4WKrCI1MjS7Tq7ZCxj-0IqqvE";
    const urlGoogle = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogle}&response=${responseGoogle}`;
    const RecaptchaGoogle = await fetch(urlGoogle, { method: "post", });
    const google_response_result = await RecaptchaGoogle.json();
    console.log(google_response_result)
    if (google_response_result.success == true) {

    const { nombre, email, mensaje, pais } = req.body;

    if (!nombre || !email || !mensaje || !pais) {
      res.status(400).send("Faltan datos requeridos");
      return;
    }

    const ip = req.ip;
    const fecha = new Date().toISOString();
    //const pais= data.country; 

    const nodemailer = require('nodemailer');
    router.post('/register', (req, res) => {
      const user = req.body;
      const transporter = nodemailer.createTransport({
        host: 'mtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '19-10569@usb.ve',
          pass: 'Pokemon2+',
        }
      });
    
      const mailOptions = {
        from: '19-10569@usb.ve',
        to: 'programacion2ais@dispostable.com',
        subject: 'Informacion del Contacto',
        text: `Nombre: ${user.nombre}\nCorreo electrónico: ${user.email}\nComentario ${user.mensaje} \nip ${user.ip} \nFecha ${user.fecha}\nPaís: ${user.country}`
      };
    
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al enviar correo electrónico');
        } else {
          res.send('Correo electrónico enviado correctamente');
        }
      });
    });

    await this.contactosModel.crearContactos(nombre, email, mensaje, pais, ip, fecha);
    
    /*const contactos = await this.contactosModel.obtenerAllContactos();
    console.log(contactos);*/

    res.send("Mensaje enviado correctamente");
  } else {
    res.send('Verifica el captcha para avanzar')
  }
}
}

module.exports = ContactosController;