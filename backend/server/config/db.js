/**
 * Archivo de conexión a base de datos.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { data } = require("./data");
const log = require("./logger");

const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env;

const DB_URI = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI;

const connection = () => {
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
