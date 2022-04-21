/**
 * Archivo para retornar resultado de las validaciones
 *
 * @author Juan-CamiloF
 */

const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    res.status(400).send({ errors: err.array() });
  }
};

module.exports = validate;
