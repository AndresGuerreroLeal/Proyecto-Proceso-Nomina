/**
 * Archivo de validación de la información que llega al servidor
 *
 * @author Juan-CamiloF
 */

const { check } = require("express-validator");
const validate = require("./validate");

//Validación de datos de autenticación
exports.validacionAuth = [
  check("usuario").exists().notEmpty(),
  check("contrasenia").exists().notEmpty().isLength({ min: 5 }),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de datos de olvide mi contraseña
exports.validacionForgot = [
  check("correo").exists().notEmpty().isEmail(),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de datos de crear nueva contraseña
exports.validacionCreate = [
  check("nuevaContrasenia").exists().notEmpty().isLength({ min: 5 }),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de actualizar contraseña
exports.validacionUpdate = [
  check("contrasenia").exists().notEmpty().isLength({ min: 5 }),
  check("nuevaContrasenia").exists().notEmpty().isLength({ min: 5 }),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de actualizar información
exports.validacionUpdateInfo = [
  check("usuario").exists().notEmpty(),
  check("nombre").exists().notEmpty().isLength({ min: 3 }),
  check("correo").exists().notEmpty().isEmail(),
  (req, res, next) => {
    validate(req, res, next);
  },
];
