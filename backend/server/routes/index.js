/**
 * Archivo de configuración para rutas dinámicas.
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const fileSystem = require("fs");
const log = require("../config/logger");

const pathRouter = `${__dirname}`;

const removeExtension = (fileName) => {
  return fileName.split(".").shift();
};

fileSystem.readdirSync(pathRouter).filter((file) => {
  const fileWithoutExt = removeExtension(file);
  const skip = ["index"].includes(fileWithoutExt);
  if (!skip) {
    log.info(`Ruta cargada ---> ${fileWithoutExt}`);
    return router.use(`/${fileWithoutExt}`, require(`./${fileWithoutExt}`));
  }
});

router.get("*", (req, res) => {
  res.status(404).send({message:"Not found"});
});

module.exports = router;
