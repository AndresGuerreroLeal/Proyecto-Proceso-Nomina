/**
 * Archivo de validación de la información que llega al servidor para Empleados
 *
 * @author Juan-CamiloF
 */

const { param } = require("express-validator");
const validate = require("./validate");
const mongoose = require("mongoose");

//Validación de la información actualizar estado de empleados
exports.validacionId = [
  param("_id")
    .exists()
    .notEmpty()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return Promise.reject("No hay identificador de reporte");
      }
      return Promise.resolve(true);
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];
