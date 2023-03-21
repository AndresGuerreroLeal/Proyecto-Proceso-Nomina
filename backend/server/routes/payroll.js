/**
 * Archivo de rutas para los controladores relacionados con nóminas
 *
 * @author Juan-CamiloF
 */
const express = require("express");
const router = express.Router();
const { auth, admin, reports } = require("../middleware/auth");
const { validacionCrear, validacionObtener } = require("../validators/nominas");
/**
 * @see NominasController
 *
 * Se extrae métodos del objeto NominaController
 */
const {
  listarInformacion,
  crearNomina,
  descargarNomina,
  listarNominas,
  cantidadNominas,
  eliminarNomina,
  obtenerInformacion,
} = require("../controllers/nominasController");

//Ruta de crear nómina [POST]
router.post("/create", [auth, reports], validacionCrear, crearNomina);

//Ruta de descargar nóminas [GET]
router.get("/download/:file", [auth, reports], descargarNomina);

//Ruta de listar información para nómina [GET]
router.get("/list-info", [auth, reports], listarInformacion);

//Ruta de listar nóminas [GET]
router.get("/list", [auth, reports], listarNominas);

//Ruta de obtener cantidad de nóminas registradas [GET]
router.get("/", [auth, reports], cantidadNominas);

//Ruta de eliminar nómina [DELETE]
router.delete("/delete/:_id", [auth, admin], eliminarNomina);

//Ruta de obtener información de contrato para nómina
router.get("/get/:_id", [auth, reports], validacionObtener, obtenerInformacion);

module.exports = router;
