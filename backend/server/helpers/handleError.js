/**
 * Arvhico de configuración de errores para los controladores
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");

const httpError = (res, err) => {
  log.error(err);
  res.status(500).send({ error: "Algo ha ocurrido" });
};

module.exports = httpError;
