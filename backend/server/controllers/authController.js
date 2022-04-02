/**
 * Archivo de ruta para todo lo relacionado con autenticación
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const { Usuario } = require("../models/usuarios");
const bcrypt = require("bcrypt");
const httpError = require("../helpers/handleError");
const jwt = require("jsonwebtoken");
const emailOlvideContrasenia = require("../helpers/emailOlvideContrasenia");
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
        return res.status(401).send({ message: "Credenciales erróneas" });
      }

      let contraseniaCorrecta = await bcrypt.compare(
        req.body.contrasenia,
        usuario.contrasenia
      );
      if (!contraseniaCorrecta) {
        log.info("Credenciales erróneas");
        return res.status(401).send({ message: "Credenciales erróneas" });
      }

      const dateUpdate = await Usuario.findByIdAndUpdate(usuario.id, {
        ultimoAcceso: Date.now(),
      });
      await dateUpdate.save();

      const token = usuario.generateJWT();
      log.info(`Inicio de sesión éxitoso: ${token}`);
      res.status(200).send({ token });
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
        return res.status(404).send({ message: "El usuario no existe" });
      }

      const informacion = {
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        ultimoAcceso: usuario.ultimoAcceso,
      };

      log.info(`Información obtenida ${JSON.stringify(informacion)}`);
      return res.status(200).send(informacion);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code PUT /forgot-password : Olvide mi contraseña
   *
   * @param correo -> correo para crear una nueva contraseña
   *
   * @return información enviado al correo @code 200 o mensaje @code 400
   *
   */
  olvideContrasenia: async function (req, res) {
    log.info("[PUT] Petición olvide mi contraseña");

    try {
      const correo = req.body.correo;
      const usuario = await Usuario.findOne({ correo: correo });
      if (!usuario) {
        log.info(`El usuario no existe, correo: ${correo}`);
        return res.status(400).send({
          message:
            "No se ha enviado las instrucciones al correo electrónico proporcionado",
        });
      }

      const token = jwt.sign(
        { userId: usuario.id, usuario: usuario.usuario },
        process.env.SECR3T,
        { expiresIn: "5m" }
      );
      usuario.tokenCuenta = token;
      await usuario.save();

      //Función para enviar correo
      emailOlvideContrasenia(correo, usuario.nombre, token);

      log.info(
        `Se envio por correo las intrucciones para cambio de contraseña, correo: ${correo}`
      );
      return res.status(200).send({
        message:
          "Se ha enviado las instrucciones al correo electrónico proporcionado",
      });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code PUT /create-new-password : Crear una nueva contraseña
   *
   * @param contrasenia, @param token -> nueva contraseña y token
   *
   * @return contraseña cambiada @code 201 o no se pudo cambiar la contraseña @code 400
   *
   */
  crearNuevaContrasenia: async function (req, res) {
    log.info("[PUT] Petición crea nueva contraseña");

    try {
      const nuevaContrasenia = req.body.nuevaContrasenia;
      const tokenCuenta = req.params.reset;
      if (!tokenCuenta) {
        return res
          .status(400)
          .send({ message: "No se puede cambiar la contraseña" });
      }
      jwt.verify(tokenCuenta, process.env.SECR3T);

      const usuario = await Usuario.findOne({ tokenCuenta: tokenCuenta });
      if (!usuario) {
        return res
          .status(400)
          .send({ message: "No se puede cambiar la contraseña" });
      }
      usuario.contrasenia = await bcrypt.hash(nuevaContrasenia, 10);
      await usuario.save();
      return res
        .status(201)
        .send({ message: "Se ha cambiado la contraseña éxitosamente" });
    } catch (err) {
      httpError(res, err);
    }
  },
};

module.exports = AuthController;
