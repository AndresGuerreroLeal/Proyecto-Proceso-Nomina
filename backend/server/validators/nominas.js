/**
 * Archivo de validación de la información que llega al servidor para Nóminas
 *
 * @author Juan-CamiloF
 */
const { check, param } = require("express-validator");
const mongoose = require("mongoose");
const validate = require("./validate");
//Validación de la información para actualizar contratos
exports.validacionCrear = [
  check("nombre").exists().notEmpty(),
  check("anio").exists().isInt({ min: 2000, max: 2200 }),
  check("mes").exists().isInt({ min: 1, max: 12 }),
  check("novedades").optional(),
  check("enviar_desprendibles").exists().isBoolean(),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de la información obtener información de nómina
exports.validacionObtener = [
  param("_id")
    .exists()
    .notEmpty()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return Promise.reject("No hay identificador de contrato");
      return Promise.resolve(true);
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];
