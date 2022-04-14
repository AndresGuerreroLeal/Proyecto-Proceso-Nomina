/**
 * Archivo de rutas para todo lo relacionado con empleados
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
/**
 * @see EmpleadosController
 *
 * Se extrae métodos del objeto EmpleadosController
 */
const {
  crearEmpleado,
  descargarArchivo,
} = require("../controllers/empleadosController");
const { auth, admin } = require("../middleware/auth");
const { validacion } = require("../validators/empleados");

//Ruta de crear empleado [POST]
router.post("/create", [auth, admin], validacion, crearEmpleado);

//Ruta de descargar documento empleados [GET]
router.get("/download/:file", [auth, admin], descargarArchivo);

module.exports = router;
