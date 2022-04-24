/**
 * Archivo de controlador para las funciones relacionadas con la autenticación
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const { Usuario } = require("../models/usuarios");
const bcrypt = require("bcrypt");
const httpError = require("../helpers/handleError");
const jwt = require("jsonwebtoken");
const { emailOlvideContrasenia } = require("../helpers/enviarCorreos");

const AuthController = {
  /**
   * @code POST /auth : Inicia sesión en el sistema
   *
   * @param usuario -> usuario y contraseña
   *
   * @return token de acceso @code 201 o credenciales errónes @code 401
   *
   */
  autenticar: async (req, res) => {
    log.info("[POST] Petición de inicio de sesión");

    try {
      const usuario = await Usuario.findOne({ usuario: req.body.usuario }).exec();
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
      }).exec();
      await dateUpdate.save();

      const token = usuario.generateJWT();
      log.info(`Inicio de sesión éxitoso: ${token}`);
      return res.status(200).send({ jwt: token });
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
  autenticado: async (req, res) => {
    log.info("[GET] Petición de validar sesión");

    try {
      let acceso = false;
      let token = req.header("Authorization");
      if (!token || !token.split(" ")[1]) {
        log.info(`acceso: ${acceso}`);
        return res.status(200).send({ acceso });
      }
      token = token.split(" ")[1];
      acceso = jwt.verify(token, process.env.SECR3T) ? true : false;
      log.info(`acceso: ${acceso}`);
      return res.status(200).send({ acceso });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /info : Información del usuario
   *
   * @param token -> token auth
   *
   * @return información @code 201 o el usuario no existe @code 404
   *
   */
  informacion: async (req, res) => {
    log.info("[GET] Petición de obtener información");

    try {
      const usuario = await Usuario.findById(req.usuario._id).exec();
      if (!usuario) {
        log.info("El usuario no existe");
        return res.status(404).send({ message: "El usuario no existe" });
      }

      const informacion = {
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        roles: usuario.roles,
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
  olvideContrasenia: async (req, res) => {
    log.info("[PUT] Petición de olvide mi contraseña");

    try {
      const correo = req.body.correo;
      const usuario = await Usuario.findOne({ correo: correo }).exec();
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
   * @param contraseña, @param token -> nueva contraseña y token
   *
   * @return contraseña cambiada @code 201 o no se pudo cambiar la contraseña @code 400
   *
   */
  nuevaContrasenia: async (req, res) => {
    log.info("[PUT] Petición crea nueva contraseña");

    try {
      const nuevaContrasenia = req.body.nuevaContrasenia;
      const tokenCuenta = req.params.reset;
      if (!tokenCuenta) {
        log.info("No se puede cambiar la contraseña");
        return res
          .status(400)
          .send({ message: "No se puede cambiar la contraseña" });
      }

      jwt.verify(tokenCuenta, process.env.SECR3T);

      const usuario = await Usuario.findOne({ tokenCuenta: tokenCuenta }).exec();
      if (!usuario) {
        log.info("No se puede cambiar la contraseña");
        return res
          .status(400)
          .send({ message: "No se puede cambiar la contraseña" });
      }
      usuario.contrasenia = await bcrypt.hash(nuevaContrasenia, 10);
      await usuario.save();
      log.info("Se ha cambiado la contraseña éxitosamente");
      return res
        .status(201)
        .send({ message: "Se ha cambiado la contraseña éxitosamente" });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code PUT /update-password : Actualizar la contraseña
   *
   * @param contraseña, @param nuevaContraseña -> contraseña y antigua contraseña
   *
   * @return contraseña actualizada @code 201 o no se pudo cambiar la contraseña @code 400
   *
   */
  actualizarContraseña: async (req, res) => {
    log.info("[PUT] Petición actualizar contraseña");

    try {
      const usuario = await Usuario.findById(req.usuario._id).exec();

      if (!usuario) {
        log.info("El usuario no existe");
        return res.status(400).send({ message: "El usuario no existe" });
      }

      const contraseniaCorrecta = await bcrypt.compare(
        req.body.contrasenia,
        usuario.contrasenia
      );

      if (!contraseniaCorrecta) {
        log.info("Contraseña inválida");
        return res.status(400).send({ message: "Contraseña inválida" });
      }

      usuario.contrasenia = await bcrypt.hash(req.body.nuevaContrasenia, 10);
      await usuario.save();
      log.info("Contraseña actualizada con éxito");
      return res
        .status(201)
        .send({ message: "Contraseña actualizada con éxito" });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code PUT /update-info : Actualizar la información
   *
   * @param usuario, @param nombre, @param correo -> Nueva información del usuario
   *
   * @param token -> auth
   *
   * @return contraseña actualizada @code 201 o no se pudo cambiar la contraseña @code 400
   *
   */
  actualizarInformacion: async (req, res) => {
    log.info("[PUT] Petición actualizar información");

    try {
      const usuario = await Usuario.findById(req.usuario._id).exec();

      if (!usuario) {
        log.info("El usuario no existe");
        return res.status(400).send({ message: "El usuario no existe" });
      }

      if (usuario.correo !== req.body.correo) {
        const correoExistente = await Usuario.findOne({
          correo: req.body.correo,
        }).exec();
        if (correoExistente) {
          log.info("El nuevo correo ya está registrado");
          return res
            .status(400)
            .send({ message: "El nuevo correo ya está registrado" });
        }
      }

      if (usuario.usuario !== req.body.usuario) {
        const usuarioExistente = await Usuario.findOne({
          usuario: req.body.usuario,
        }).exec();
        if (usuarioExistente) {
          log.info("El nuevo usuario ya está registrado");
          return res
            .status(400)
            .send({ message: "El nuevo usuario ya está registrado" });
        }
      }

      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        usuario._id,
        {
          nombre: req.body.nombre,
          usuario: req.body.usuario,
          correo: req.body.correo,
        },
        { new: true }
      ).exec();
      await usuarioActualizado.save();
      log.info(
        `La información se ha actualizado con éxito: ${JSON.stringify(
          usuarioActualizado
        )}`
      );
      return res.status(201).send(usuarioActualizado);
    } catch (err) {
      httpError(res, err);
    }
  },
};

module.exports = AuthController;
