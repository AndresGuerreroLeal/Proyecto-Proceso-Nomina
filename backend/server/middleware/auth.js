/**
 * Archivo para validación de autenticación
 *
 * @author Juan-CamiloF
 */

const jwt = require("jsonwebtoken");
const log = require("../config/logger");
const Roles  = require("../models/roles");
const Usuario  = require("../models/usuarios");

const auth = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.status(401).send({ message: "Sin autorización" });

  token = token.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Sin autorización" });
  try {
    const payload = jwt.verify(token, process.env.SECR3T);
    req.usuario = payload;
    next();
  } catch (err) {
    log.error(err);
    res.status(403).send({ message: "Sin autorización" });
  }
};

const admin = async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario._id).exec();
  const roles = await Roles.find({ _id: { $in: usuario.roles } }).exec();

  for (let rol of roles) {
    if (rol._id === "ADMIN") {
      next();
      return;
    }
  }
  log.warn(`Sin autorización de admin, usuario: ${JSON.stringify(usuario)}`);
  return res.status(403).send({ message: "Sin autorización" });
};

const reports = async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario._id).exec();
  const roles = await Roles.find({ _id: { $in: usuario.roles } }).exec();

  for (let rol of roles) {
    if (rol._id === "REPORTS") {
      next();
      return;
    }
  }
  log.warn(`Sin autorización de reportes, usuario: ${JSON.stringify(usuario)}`);
  return res.status(403).send({ message: "Sin autorización" });
};

module.exports = { admin, auth, reports };
