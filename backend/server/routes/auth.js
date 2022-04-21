/**
 * Archivo de rutas para todo lo relacionado con inicio de sesión
 *
 * @author Juan-CamiloF
 */

const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.js");
/**
 * @see AuthController
 *
 * Se extrae métodos del objeto AuthController
 */
const {
  autenticar,
  autenticado,
  informacion,
  olvideContrasenia,
  actualizarContraseña,
  actualizarInformacion,
  nuevaContrasenia,
} = require("../controllers/authController");

const {
  validacionAuth,
  validacionForgot,
  validacionCreate,
  validacionUpdate,
  validacionUpdateInfo,
} = require("../validators/auth.js");

//Ruta de inicio de sesión [POST]
router.post("/", validacionAuth, autenticar);

//Ruta de validar sesión del usuario [GET]
router.get("/", autenticado);

//Ruta de obtener información del usuario [GET]
router.get("/info", auth, informacion);

//Ruta de olvide mi contraseña [PUT]
router.put("/forgot-password/", validacionForgot, olvideContrasenia);

//Ruta para crear una nueva contraseña [PUT]
router.put("/create-new-password/:reset", validacionCreate, nuevaContrasenia);

//Ruta para actualizar la contraseña [PUT]
router.put("/update-password", auth, validacionUpdate, actualizarContraseña);

//Ruta para actualizar la información [PUT]
router.put("/update-info", auth, validacionUpdateInfo, actualizarInformacion);

module.exports = router;
