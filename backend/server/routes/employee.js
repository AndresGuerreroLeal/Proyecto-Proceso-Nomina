/**
 * Archivo de rutas para los controladores relacionados con empleados
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const { auth, admin, reports } = require("../middleware/auth");
const {
  validacionCrear,
  validacionActualizar,
  validacionEstado,
  validacionObtener,
} = require("../validators/empleados");
/**
 * @see EmpleadosController
 *
 * Se extrae métodos del objeto EmpleadosController
 */
const {
  crearEmpleado,
  descargarDocumento,
  listarActivos,
  listarInactivos,
  cantidadEmpleados,
  actualizarEmpleado,
  estadoEmpleado,
  obtenerEmpleado,
  empleadosSinContrato,
} = require("../controllers/empleadosController");

//Ruta de crear empleado [POST]
router.post("/create", [auth, admin], validacionCrear, crearEmpleado);

//Ruta de descargar documento empleados [GET]
router.get("/download/:file", [auth, admin], descargarDocumento);

//Ruta de listar empleados activos [GET]
router.get("/list-active", [auth, reports], listarActivos);

//Ruta de listar empleados inactivos [GET]
router.get("/list-inactive", [auth, reports], listarInactivos);

//Ruta de cantidad de empleados [GET]
router.get("/", [auth, reports], cantidadEmpleados);

//Ruta de actualizar información empleados [PUT]
router.put("/update", [auth, admin], validacionActualizar, actualizarEmpleado);

//Ruta de actualizar estado empleados [PUT]
router.put("/state/:_id", [auth, admin], validacionEstado, estadoEmpleado);

//Ruta de obtener empleado [GET]
router.get("/get/:_id", [auth, reports], validacionObtener, obtenerEmpleado);

//Ruta de obtener empleados sin contrato [GET]
router.get("/without-contract", [auth, reports], empleadosSinContrato);

module.exports = router;
