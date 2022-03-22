/**
 * Archivo de ruta para todo lo relacionado con autenticación
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const { Usuario } = require("../models/usuarios");
const bcrypt = require("bcrypt");
const httpError = require("../helpers/handleError");

const AuthController = {
  /**
   * @code POST /auth : Inicia sesión en el sistema
   *
   * @param usuarios -> usuario y contraseña
   *
   * @return token de acceso @code 201 o credenciales errónes @code 401
   *
   */
  autenticar: async function (req, res) {
    log.info("[POST] Petición de inicio de sesión");

    try {
      const usuario = await Usuario.findOne({ usuario: req.body.usuario });
      if (!usuario) {
        log.info("Credenciales erróneas");
        return res.status(401).send("Credenciales erróneas");
      }

      let contraseniaCorrecta = await bcrypt.compare(
        req.body.contrasenia,
        usuario.contrasenia
      );
      if (!contraseniaCorrecta) {
        log.info("Credenciales erróneas");
        return res.status(401).send("Credenciales erróneas");
      }

      console.log(Date.now());
      const dateUpdate = await Usuario.findByIdAndUpdate(usuario.id, {
        ultimoAcceso: Date.now(),
      });
      await dateUpdate.save();

      const jwt = usuario.generateJWT();
      log.info(`Inicio de sesión éxitoso: ${jwt}`);
      res.status(201).send({ jwt });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /auth : Validar sesión en el sistema
   *
   * @param token -> id
   *
   * @return true o false @code 200
   *
   */
  autenticado: async function (req, res) {
    log.info("[GET] Petición de validar sesión");

    try {
      const acceso = req.usuario._id ? true : false;
      return res.status(200).send({ acceso: acceso });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code POST /info : Información del usuario
   *
   * @param token -> id
   *
   * @return información @code 201 o el usuario no existe @code 404
   *
   */
  informacion: async function (req, res) {
    log.info("[GET] Petición de obtener información");

    try {
      const usuario = await Usuario.findById(req.usuario._id);
      if (!usuario) {
        log.info("El usuario no existe");
        return res.status(404).send("El usuario no existe");
      }

      const informacion = {
        nombre: usuario.nombre,
        correo: usuario.correo,
        ultimoAcceso: usuario.ultimoAcceso,
      };

      log.info(`Información obtenida ${informacion}`);
      return res.status(200).send(informacion);
    } catch (err) {
      httpError(res, err);
    }
  },
};

module.exports = AuthController;
