/**
 * Archivo de rutas para los controladores relacionados con reportes-empleados
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const { auth, admin, reports } = require("../middleware/auth");
const { validacionId } = require("../validators/reportes");
/**
 * @see ReportesEmpleadosController
 *
 * Se extrae métodos del objeto ReportesEmpleadosController
 */
const {
  crearReporte,
  descargarReporte,
  listarReportes,
  eliminarReporte,
} = require("../controllers/reportesEmpleadosController");

//Ruta de crear reporte empleado [GET]
router.get("/create", [auth, reports], crearReporte);

//Ruta de descargar reportes empleados [GET]
router.get("/download/:file", [auth, reports], descargarReporte);

//Ruta de listar reportes de empleados [GET]
router.get("/list", [auth, reports], listarReportes);

//Ruta de eliminar reportes de empleados [DELETE]
router.delete("/delete/:_id", [auth, admin], validacionId, eliminarReporte);

module.exports = router;
