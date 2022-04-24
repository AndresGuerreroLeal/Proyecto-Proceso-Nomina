/**
 * Archivo encargado de guardar el documento en el directorio
 *
 * @author Juan-CamiloF
 */

const path = require("path");
const subirDocumento = (nombre, documento) => {
  let documentoInformacion = {
    nombre: "",
    valido: false,
    error: "",
  };
  const extension = path.extname(documento.name);
  const archivo = nombre.split(" ").join("-") + "-" + Date.now() + extension;
  documento.mv(`${__dirname}/../archivos/documentos/${archivo}`, (err) => {
    if (err) {
      documentoInformacion.error = err;
      return documentoInformacion;
    }
  });
  documentoInformacion.nombre = archivo;
  documentoInformacion.valido = true;
  return documentoInformacion;
};

module.exports = subirDocumento;
