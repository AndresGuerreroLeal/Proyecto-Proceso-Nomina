/**
 * Archivo de datos para base de datos cuando se despliega servidor.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const log = require("./logger");
const data = () => {
  mongoose.connection.db
    .listCollections({ name: "usuarios" })
    .next(function (err, usuarios) {
      if (!usuarios) {
        mongoose.connection.collection("usuarios").insertOne({
          nombre: process.env.NOMBRE,
          correo: process.env.CORREO_ADMIN,
          usuario: "admin",
          contrasenia:
            "$2a$10$mC77qjUBQz5SiyZ1jtcHa.2GKrJ/PgKFw7Q19ahCeoCHJKqefCCOq",
          ultimoAcceso: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });

        log.info(
          "Se cargó por primera vez la aplicación: \n ADMINISTRADOR registrado en base de datos."
        );
      }
    });
};

module.exports = { data };
