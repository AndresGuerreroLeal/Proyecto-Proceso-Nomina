/**
 * Archivo de validación de la información que llega al servidor para Contratos
 *
 * @author Juan-CamiloF
 */

const { check, param } = require("express-validator");
const validate = require("./validate");
const mongoose = require("mongoose");

const regex = /^[0-9]*$/;
let validacion = {
  valido: false,
  message: "",
};
const numeros = (campo) => {
  let validacionNumeros = Object.assign({}, validacion);
  if (!regex.test(campo)) {
    validacionNumeros.message = "Debe ser solo números";
    return validacionNumeros;
  }
  validacionNumeros.valido = true;
  return validacionNumeros;
};
const numero_documento = (campo) => {
  let validacionDocumento = Object.assign({}, validacion);
  if (campo.length < 5 || campo.length > 10) {
    validacionDocumento.message = "No es un número de documento válido";
    return validacionDocumento;
  }
  let validacionNumeros = numeros(campo);
  if (!validacionNumeros.valido) {
    validacionDocumento.message = validacionNumeros.message;
    return validacionDocumento;
  }
  validacionDocumento.valido = true;
  return validacionDocumento;
};

//Validación de la información para crear contratos
exports.validacionCrear = [
  check("numero_contrato")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionCrearDocumento = numero_documento(value);
      if (!validacionCrearDocumento.valido)
        return Promise.reject(validacionCrearDocumento.message);
      return Promise.resolve(true);
    }),
  check("tipo_contrato").exists().notEmpty(),
  check("fecha_inicio").exists().notEmpty().isISO8601().toDate(),
  check("fecha_fin").optional().isISO8601().toDate(),
  check("sueldo").isInt({ min: 6, max: 100000000 }),
  check("cargo").exists().notEmpty(),
  check("tipo_cotizante").exists().notEmpty(),
  check("auxilio_transporte").isInt(),
  check("fondo_salud").exists().notEmpty(),
  check("porcentaje_salud_empleado").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_salud_empleador").exists().isFloat({ min: 0, max: 100 }),
  check("fondo_pensiones").exists().notEmpty(),
  check("porcentaje_pension_empleado").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_pension_empleador").exists().isFloat({ min: 0, max: 100 }),
  check("arl").exists().notEmpty(),
  check("porcentaje_arl").exists().isFloat({ min: 0, max: 100 }),
  check("fondo_cesantias").exists().notEmpty(),
  check("porcentaje_parafiscal_sena").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_parafiscal_icbf").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_parafiscal_caja_compensacion")
    .exists()
    .isFloat({ min: 0, max: 100 }),
  check("salario_integral").exists().isBoolean(),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de la información para actualizar contratos
exports.validacionActualizar = [
  check("_id").exists().notEmpty().isLength({ max: 24, min: 24 }),
  check("numero_contrato")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionCrearDocumento = numero_documento(value);
      if (!validacionCrearDocumento.valido)
        return Promise.reject(validacionCrearDocumento.message);
      return Promise.resolve(true);
    }),
  check("tipo_contrato").exists().notEmpty(),
  check("fecha_inicio").exists().notEmpty().isISO8601().toDate(),
  check("fecha_fin").optional().isISO8601().toDate(),
  check("sueldo").isInt({ min: 6, max: 100000000 }),
  check("cargo").exists().notEmpty(),
  check("tipo_cotizante").exists().notEmpty(),
  check("auxilio_transporte").isInt(),
  check("fondo_salud").exists().notEmpty(),
  check("porcentaje_salud_empleado").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_salud_empleador").exists().isFloat({ min: 0, max: 100 }),
  check("fondo_pensiones").exists().notEmpty(),
  check("porcentaje_pension_empleado").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_pension_empleador").exists().isFloat({ min: 0, max: 100 }),
  check("arl").exists().notEmpty(),
  check("porcentaje_arl").exists().isFloat({ min: 0, max: 100 }),
  check("fondo_cesantias").exists().notEmpty(),
  check("porcentaje_parafiscal_sena").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_parafiscal_icbf").exists().isFloat({ min: 0, max: 100 }),
  check("porcentaje_parafiscal_caja_compensacion")
    .exists()
    .isFloat({ min: 0, max: 100 }),
  check("salario_integral").exists().isBoolean(),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de la información obtener un empleados
exports.validacionObtener = [
  param("_id")
    .exists()
    .notEmpty()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return Promise.reject("No hay identificador del contrato");
      return Promise.resolve(true);
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];
