/**
 * Archivo encargado de crear los directorios necesarios para el servidor
 *
 * @author Juan-CamiloF
 */

const fs = require("fs");
const log = require("./logger");

const pathArchivos = `${__dirname}/../archivos`;
const pathDocumentos = `${__dirname}/../archivos/documentos`;
const paths = [pathArchivos, pathDocumentos];
const createDirectories = () => {
  //Recorrer rutas y crear directorios
  for (let dir of paths) {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, (err) => {
        if (err) {
          log.error(`Error al crear directorios ${err}`);
        }
      });
    }
  }
};

module.exports = createDirectories;
