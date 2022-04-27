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
} = require("../controllers/empleadosController");
<<<<<<< HEAD
const { auth, admin, reports } = require("../middleware/auth");
=======
const { auth, admin } = require("../middleware/auth");
>>>>>>> 38752dd748012371e590b65eefe6b5c0bb3d4641
const { validacionCrear } = require("../validators/empleados");

//Ruta de crear empleado [POST]
router.post("/create", [auth, admin], validacionCrear, crearEmpleado);

//Ruta de descargar documento empleados [GET]
router.get("/download/:file", [auth, admin], descargarArchivo);

//Ruta de listar empleados activos [GET]
router.get("/list-active", [auth,reports], listarActivos);

//Ruta de listar empleados inactivos [GET]
router.get("/list-inactive", [auth,reports], listarInactivos);

module.exports = router;
