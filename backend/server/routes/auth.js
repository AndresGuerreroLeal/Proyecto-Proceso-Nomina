/**
 * Archivo de controlador para todo lo relacionado con inicio de sesión
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
//Objetos
const AuthController = require("../controllers/authController");

//Ruta de inicio de sesión [POST]
router.post("/", AuthController.autenticar);

//Ruta de validar sesión del usuario [GET]
router.get("/", auth, AuthController.autenticado);

//Ruta de obtener información del usuario [GET]
router.get("/info", auth, AuthController.informacion);

//Ruta de olvide mi contraseña [PUT]
router.put("/forgot-password/", AuthController.olvideContrasenia);

//Ruta para crear una nueva contraseña [PUT]
router.put("/create-new-password/:reset", AuthController.crearNuevaContrasenia);

module.exports = router;
