/**
 * Archivo de rutas para los controladores relacionados con contratos
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const { auth, admin, reports } = require("../middleware/auth");
const {
  validacionCrear,
  validacionObtener,
} = require("../validators/contratos");
/**
 * @see ContratosController
 *
 * Se extrae métodos del objeto ContratosController
 */
const {
  crearContrato,
  obtenerContrato,
  listarContratos,
} = require("../controllers/contratoController");

//Ruta de crear contratos [POST]
router.post("/create", [auth, admin], validacionCrear, crearContrato);

//Ruta de listar contratos [GET]
router.get("/list", [auth, reports], listarContratos);

//Ruta de obtener contrato [GET]
router.get("/:_id", [auth, reports], validacionObtener, obtenerContrato);

module.exports = router;
