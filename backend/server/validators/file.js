/**
 * Archivo de validación de los documentos
 *
 * @author Juan-CamiloF
 */

const validarDocumento = (documento) => {
  let valido = {
    booleano: true,
    mensaje: "VALIDO",
  };
  //Validar extensión
  const mimeType = "application/pdf";
  if (documento.mimetype !== mimeType) {
    valido.booleano = false;
    valido.mensaje = "Extensión no valida";
  }
  //Validar tamaño
  const tamañoMax = 5000000;
  if (documento.size > tamañoMax) {
    valido.booleano = false;
    valido.mensaje = "No puede tener un tamaño superior a 5MB";
  }
  return valido;
};

module.exports = validarDocumento;
