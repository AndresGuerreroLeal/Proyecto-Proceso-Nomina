/**
 * Archivo de rutas para los controladores relacionados con nóminas
 *
 * @author Juan-CamiloF
 */
const express = require("express");
const router = express.Router();
const { auth, admin, reports } = require("../middleware/auth");
/**
 * @see NominasController
 *
 * Se extrae métodos del objeto NominaController
 */
const { listarInformacion } = require("../controllers/nominasController");

//Ruta de listar información para nómina [GET]
router.get("/list-info", [auth, reports], listarInformacion);

module.exports = router;
