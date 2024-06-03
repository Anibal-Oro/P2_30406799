const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

class ContactosModel {
  constructor() {
    this.db = new sqlite3.Database("./config/baseDatos.db", (err) => {
      if (err) {
        console.error(err.message);
        return
      }
      console.log("Conectado a la lista de espera");
    });

    this.db.run(
      "CREATE TABLE IF NOT EXISTS Contactos (nombre TEXT, email TEXT, mensaje TEXT, pais TEXT, ip TEXT, fecha TEXT, id INTEGER PRIMARY KEY AUTOINCREMENT)",
      (err) => {
        if (err) {
          console.error(err.message);
        }
      },
      console.log("Lista de espera creada")
    );
  }

  crearContactos(nombre, email, mensaje, pais, ip, fecha) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Contactos (nombre, email, mensaje, pais, ip, fecha) VALUES (?, ?, ?, ?, ?, ?)`;
      this.db.run(sql, [nombre, email, mensaje, pais, ip, fecha], function (err) {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        console.log(`Se ha insertado una nueva peticion en la fila ${this.lastID}`);
        resolve(this.lastID);
      });
    });
  }


  async obtenerContactos(email) {
    const sql = `SELECT * FROM contactos WHERE email = ?`;
    const get = promisify(this.db.get).bind(this.db);
    return await get(sql, [email]);
  }

  async obtenerAllContactos() {
    const sql = `SELECT * FROM contactos`;
    const all = promisify(this.db.all).bind(this.db);
    return await all(sql);
  }

  async actualizarContactos(nombre, email, mensaje){
    return await this.db.table("Contactos").update({nombre: nombre, email: email, mensaje: mensaje}).where({email})
}

async eliminarContactos (email){
    return await this.db.table("Contactos").delete().where({email})
}
};

module.exports = ContactosModel;