/**
 * Archivo de datos para base de datos cuando se despliega servidor.
 *
 * @author Juan-CamiloF
 */

const { Roles } = require("../models/roles");
const { Usuario } = require("../models/usuarios");

const log = require("./logger");
const data = async () => {
  try {
    //Cargar roles
    const cantidadRoles = await Roles.estimatedDocumentCount().exec();
    if (!cantidadRoles) {
      await Promise.all([
        new Roles({ _id: "ADMIN" }).save(),
        new Roles({ _id: "REPORTS" }).save(),
      ]);
      log.info("ROLES registrados en la base de datos.");
    }

    //Cargar usuarios
    const cantidadUsuarios = await Usuario.estimatedDocumentCount().exec();
    if (!cantidadUsuarios) {
      await Promise.all([
        new Usuario({
          nombre: process.env.NOMBRE,
          correo: process.env.CORREO_ADMIN,
          usuario: "admin",
          roles: ["ADMIN", "REPORTS"],
          contrasenia:
            "$2a$10$mC77qjUBQz5SiyZ1jtcHa.2GKrJ/PgKFw7Q19ahCeoCHJKqefCCOq",
          ultimoAcceso: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }).save(),
        new Usuario({
          nombre: "Reports",
          correo: "Sin correo registrado",
          usuario: "report",
          roles: ["REPORTS"],
          contrasenia:
            "$2a$10$t9kXisVwtND6eJSBJ04UP.g3R9izEQu7cEZJrgmxOGlN/Jdxp6niS",
          ultimoAcceso: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }).save(),
      ]);
      log.info("USUARIOS registrados en la base de datos.");
    }
  } catch (err) {
    log.error("Error al cargar los datos: ", err);
  }
};

module.exports = { data };
