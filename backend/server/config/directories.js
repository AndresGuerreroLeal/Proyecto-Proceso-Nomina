/**
 * Archivo encargado de crear los directorios necesarios para el servidor
 *
 * @author Juan-CamiloF
 */

const fs = require("fs");
const log = require("./logger");

const pathArchivos = `${__dirname}/../archivos`;
const pathDocumentos = `${__dirname}/../archivos/documentos`;
const createDirectories = () => {
  //Directorio padres "archivos"
  if (!fs.existsSync(pathArchivos)) {
    fs.mkdir(pathArchivos, (err) => {
      if (err) {
        log.error(`Error al crear directorios ${err}`);
      }
    });
  }
  //Directorio hijo para "documentos"
  if (!fs.existsSync(pathDocumentos)) {
    fs.mkdir(pathDocumentos, (err) => {
      if (err) {
        log.error(`Error al crear directorios ${err}`);
      }
    });
    log.info("Directorios creados éxitosamente");
  }
};

module.exports = createDirectories;
