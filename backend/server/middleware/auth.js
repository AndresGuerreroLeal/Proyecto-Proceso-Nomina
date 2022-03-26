/**
 * Archivo para validación de autenticación
 *
 * @author Juan-CamiloF
 */

const jwt = require("jsonwebtoken");
const log  = require("../config/logger");

function auth(req, res, next) {
  let token = req.header("Authorization");

  token = token.split(" ")[1];

  if (!token) return res.status(401).send({message:"Sin autorización"});
  try {
    const payload = jwt.verify(token, process.env.SECR3T);
    req.usuario = payload;
    next();
  } catch (err) {
    log.error(err);
    res.status(403).send({message:"Sin autorización"});
  }
}

module.exports = auth;
