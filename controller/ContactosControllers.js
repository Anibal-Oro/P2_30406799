const ContactosModel = require("../models/ContactosModel");

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {

    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      res.status(400).send("Faltan datos requeridos");
      return;
    }

    const ip = req.ip;
    const fecha = new Date().toISOString();

    await this.contactosModel.crearContactos(nombre, email, mensaje, ip, fecha);
    
    /*const contactos = await this.contactosModel.obtenerAllContactos();
    console.log(contactos);*/

    res.send("Mensaje enviado correctamente");
  }
}

module.exports = ContactosController;