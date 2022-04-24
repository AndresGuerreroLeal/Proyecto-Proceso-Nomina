/**
 * Archivo de configuración del servidor.
 *
 * @author Juan-CamiloF
 */

require("dotenv").config();
const express = require("express");
const upload = require("express-fileupload");
const cors = require("cors");
const log = require("./config/logger");
const app = express();
const connectionDB = require("./config/db");
const connectionEmail = require("./helpers/conexionEmail");
const createDirectories = require("./config/directories");

const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(upload());
app.use("/api/1.0", require("./routes"));

createDirectories();
connectionDB();
connectionEmail();

const server = app.listen(PORT, () => {
  log.info(`----- Servidor funcionando en puerto ${PORT} ------`);
});

module.exports = { app, server };
