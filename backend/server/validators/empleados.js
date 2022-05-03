/**
 * Archivo de validación de la información que llega al servidor
 *
 * @author Juan-CamiloF
 */

const { check } = require("express-validator");
const validate = require("./validate");

//Validación de la información del empleado
exports.validacionCrear = [
  check("nombres").exists().notEmpty(),
  check("apellidos").exists().notEmpty(),
  check("tipo_documento").exists().notEmpty().isLength({ max: 2, min: 2 }),
  check("numero_documento")
    .exists()
    .notEmpty()
    .custom((value) => {
      const regex = /^[0-9]*$/;
      if (value.length < 5 || value.length > 10)
        return Promise.reject("No es un número de cédula válido");
      if (!regex.test(value)) return Promise.reject("Debe ser solo números");
      return Promise.resolve(true);
    }),
  check("correo").exists().notEmpty().isEmail(),
  check("numero_celular")
    .exists()
    .notEmpty()
    .custom((value) => {
      const regex = /^([0-9])*$/;
      if (value.length !== 10)
        return Promise.reject("No es un número de telefono");
      if (!regex.test(value)) return Promise.reject("Debe ser solo números");
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
      const regex = /^[0-9]*$/;
      if (value.length < 10 || value.length > 16)
        return Promise.reject("No es un número de cuenta válido");
      if (!regex.test(value)) return Promise.reject("Debe ser solo números");
      return Promise.resolve(true);
    }),
  (req, res, next) => {
    validate(req, res, next);
  },
];
