/**
 * Archivo de configuración para rutas dinámicas.
 * 
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const fileSystem = require("fs");

const pathRouter = `${__dirname}`;

const removeExtension = (fileName) => {
  return fileName.split(".")[0];
};

fileSystem.readdirSync(pathRouter).filter((file) => {
  const fileWithoutExtension = removeExtension(file);
  const skip = ["index"].includes(fileWithoutExtension);
  if (!skip) {
    router.use(`/${fileWithoutExtension}`, require(`./${fileWithoutExtension}`));
    console.log("Rutas cargadas", fileWithoutExtension);
  }
});

router.get("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports = router;
