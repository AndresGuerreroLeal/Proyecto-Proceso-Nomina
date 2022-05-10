/**
 * Archivo encargado de las funciones de los documentos
 *
 * @author Juan-CamiloF
 */

const path = require("path");
const fs = require("fs");
const subirDocumento = (nombre, documento) => {
  let documentoInformacion = {
    nombre: "",
    valido: false,
    error: "",
  };
  const extension = path.extname(documento.name);
  const archivo = nombre.split(" ").join("-") + "-" + Date.now() + extension;
  const ruta = path.normalize(
    `${process.cwd()}/server/archivos/documentos/${archivo}`
  );
  documento.mv(ruta, (err) => {
    if (err) {
      console.log(err);
      documentoInformacion.error = err;
      return documentoInformacion;
    }
  });
  documentoInformacion.nombre = archivo;
  documentoInformacion.valido = true;
  return documentoInformacion;
};

const eliminarDocumento = (archivo) => {
  let documentoEliminado = {
    eliminado: false,
    error: "",
  };
  const rutaCompleta = path.normalize(
    `${process.cwd()}/server/archivos/documentos/${archivo}`
  );
  fs.unlink(rutaCompleta, (err) => {
    if (err) {
      documentoEliminado.error = err;
      return documentoEliminado;
    }
  });
  documentoEliminado.eliminado = true;
  return documentoEliminado;
};

const existeDocumento = (ruta) => {
  if (fs.existsSync(ruta)) return true;
  return false;
};

module.exports = { subirDocumento, eliminarDocumento, existeDocumento };
