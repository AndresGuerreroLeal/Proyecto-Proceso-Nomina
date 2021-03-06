/**
 * Archivo para validación de autenticación
 *
 * @author Juan-CamiloF
 */
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  let token = req.header("Authorization");

  token = token.split(" ")[1];

  if (!token) return res.status(401).send("Sin autorización");

  try{
    const payload = jwt.verify(token,process.env.S3CRET)
    req.usuario = payload;
    next()
  }catch(err){
      console.log(err)
    res.status(403).send("Sin autorización");
  }
}

module.exports = auth;
