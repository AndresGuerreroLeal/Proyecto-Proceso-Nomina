/**
 * Archivo de validación de la información que llega al servidor para Empleados
 *
 * @author Juan-CamiloF
 */

const { check, param } = require("express-validator");
const validate = require("./validate");
const mongoose = require("mongoose");

//Funciones para validar campos del empleado
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
const numero_celular = (campo) => {
  let validacionCelular = Object.assign({}, validacion);
  if (campo.length !== 10) {
    validacionCelular.message = "No es un número de celular";
    return validacionCelular;
  }
  let validacionNumeros = numeros(campo);
  if (!validacionNumeros.valido) {
    validacionDocumento.message = validacionNumeros.message;
    return validacionDocumento;
  }
  validacionCelular.valido = true;
  return validacionCelular;
};
const numero_cuenta = (campo) => {
  let validacionCuenta = Object.assign({}, validacion);
  if (campo.length < 10 && campo.length > 16) {
    validacionCuenta.message = "No es un número de cuenta válido";
  }
  let validacionNumeros = numeros(campo);
  if (!validacionNumeros.valido) {
    validacionDocumento.message = validacionNumeros.message;
    return validacionDocumento;
  }
  validacionCuenta.valido = true;
  return validacionCuenta;
};

//Validación de la información para crear empleados
exports.validacionCrear = [
  check("nombres").exists().notEmpty(),
  check("apellidos").exists().notEmpty(),
  check("tipo_documento").exists().notEmpty().isLength({ max: 2, min: 2 }),
  check("numero_documento")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionCrearDocumento = numero_documento(value);
      if (!validacionCrearDocumento.valido)
        return Promise.reject(validacionCrearDocumento.message);
      return Promise.resolve(true);
    }),
  check("correo").exists().notEmpty().isEmail(),
  check("numero_celular")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionCrearCelular = numero_celular(value);
      if (!validacionCrearCelular.valido)
        return Promise.reject(validacionCrearCelular.message);
      return Promise.resolve(true);
    }),
  check("ciudad_residencia").exists().notEmpty(),
  check("direccion_residencia").exists().notEmpty(),
  check("metodo_pago").exists().notEmpty(),
  check("entidad_bancaria").exists().notEmpty(),
  check("tipo_cuenta").exists().notEmpty(),
  check("numero_cuenta")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionCrearCuenta = numero_cuenta(value);
      if (!validacionCrearCuenta.valido)
        return Promise.reject(validacionCrearCuenta.message);
      return Promise.resolve(true);
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de la información para actualizar información de empleados
exports.validacionActualizar = [
  check("_id").exists().notEmpty().isLength({ max: 24, min: 24 }),
  check("nombres").exists().notEmpty(),
  check("apellidos").exists().notEmpty(),
  check("tipo_documento").exists().notEmpty().isLength({ max: 2, min: 2 }),
  check("numero_documento")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionActualizarDocumento = numero_documento(value);
      if (!validacionActualizarDocumento.valido)
        return Promise.reject(validacionActualizarDocumento.message);
      return Promise.resolve(true);
    }),
  check("documento")
    .exists()
    .notEmpty()
    .custom((value) => {
      const urlArray = value.split("/");
      const valida = urlArray.filter((url) => {
        return (
          url === "api" ||
          url === "1.0" ||
          url === "employee" ||
          url === "download"
        );
      });
      if (valida.length !== 4)
        Promise.reject("No es una ruta de archivo válida");
      return Promise.resolve(true);
    }),
  check("correo").exists().notEmpty().isEmail(),
  check("numero_celular")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionActualizarCelular = numero_celular(value);
      if (!validacionActualizarCelular.valido)
        return Promise.reject(validacionActualizarCelular.message);
      return Promise.resolve(true);
    }),
  check("ciudad_residencia").exists().notEmpty(),
  check("direccion_residencia").exists().notEmpty(),
  check("metodo_pago").exists().notEmpty(),
  check("entidad_bancaria").exists().notEmpty(),
  check("tipo_cuenta").exists().notEmpty(),
  check("numero_cuenta")
    .exists()
    .notEmpty()
    .custom((value) => {
      const validacionActualizarCuenta = numero_cuenta(value);
      if (!validacionActualizarCuenta.valido)
        return Promise.reject(validacionActualizarCuenta.message);
      return Promise.resolve(true);
    }),
  check("nuevo_archivo").exists().notEmpty().isBoolean(),
  (req, res, next) => {
    validate(req, res, next);
  },
];

//Validación de la información actualizar estado de empleados
exports.validacionEstado = [
  param("_id")
    .exists()
    .notEmpty()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return Promise.reject("No hay identificador de empleado");
      }
      return Promise.resolve(true);
    }),
  check("concepto").exists().notEmpty(),
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
        return Promise.reject("No hay identificador de empleado");
      return Promise.resolve(true);
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];
