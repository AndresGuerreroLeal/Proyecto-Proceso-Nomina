/**
 * Archivo de conexión a base de datos.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const data = require("./data");
const log = require("./logger");

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;

const DB_URI = NODE_ENV === "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;

const connectionDB = async () => {
  await mongoose
    .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      if (NODE_ENV !== "test") data();
      log.info("----- Conexión a base de datos éxitosa -----");
    })
    .catch((err) => {
      log.error("Hubo un problema:", err);
    });
};

module.exports = connectionDB;
