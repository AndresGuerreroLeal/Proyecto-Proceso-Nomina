/**
 * Archivo encargado de las funciones de los documentos
 *
 * @author Juan-CamiloF
 */

const path = require("path");
const fs = require("fs");
/* Función encargada de subir documentos de identidad al servidor */
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
      documentoInformacion.error = err;
      return documentoInformacion;
    }
  });
  documentoInformacion.nombre = archivo;
  documentoInformacion.valido = true;
  return documentoInformacion;
};
/* Función encargada de eliminar documentos de identidad del servidor */
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
/* Función encargada de buscar documentos de identidad en el servidor */
const existeDocumento = (ruta) => {
  if (fs.existsSync(ruta)) return true;
  return false;
};

module.exports = { subirDocumento, eliminarDocumento, existeDocumento };
