/**
 * Archivo de rutas para los controladores relacionados con contratos
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const { auth, admin, reports } = require("../middleware/auth");
const { validacionCrear } = require("../validators/contratos");
/**
 * @see ContratosController
 *
 * Se extrae métodos del objeto ContratosController
 */
const { crearContrato } = require("../controllers/contratoController");

//Ruta de crear contratos [POST]
router.post("/create", [auth, admin], validacionCrear, crearContrato);

module.exports = router;
