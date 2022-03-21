/**
 * Archivo de conexión a base de datos.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { data } = require("./data");
const log = require("./logger");

const connection = () => {
  const DB_URI = process.env.MONGO_DB_URI;
  mongoose
    .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      data();
      log.info("----- Conexión a base de datos éxitosa -----");
    })
    .catch((err) => {
      log.error("Hubo un problema:", err);
    });
};

module.exports = { connection };
