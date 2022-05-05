/**
 * Archivo de rutas para los controladores relacionados con empleados
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
  listarActivos,
  listarInactivos,
  actualizarEmpleado,
  cantidadEmpleados,
} = require("../controllers/empleadosController");
const { auth, admin, reports } = require("../middleware/auth");
const {
  validacionCrear,
  validacionActualizar,
} = require("../validators/empleados");

//Ruta de crear empleado [POST]
router.post("/create", [auth, admin], validacionCrear, crearEmpleado);

//Ruta de descargar documento empleados [GET]
router.get("/download/:file", [auth, admin], descargarArchivo);

//Ruta de listar empleados activos [GET]
router.get("/list-active", [auth, reports], listarActivos);

//Ruta de listar empleados inactivos [GET]
router.get("/list-inactive", [auth, reports], listarInactivos);

//Ruta de cantidad de empleados [GET]
router.get("/", [auth, reports], cantidadEmpleados);

//Ruta de actualizar empleados [PUT]
router.put("/update", [auth, admin], validacionActualizar, actualizarEmpleado);

module.exports = router;
