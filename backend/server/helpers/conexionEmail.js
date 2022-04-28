/**
 * Archivo para verificar conexión con el email para enviar correos
 *
 * @author Juan-CamiloF
 */

const nodemailer = require("nodemailer");
const log = require("../config/logger.js");
const connectionEmail = () => {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secureConnection: false,
    auth: {
      user: process.env.CORREO, // generated ethereal user
      pass: process.env.CONTRASENIA, // generated ethereal password
    },
    tls: {
      ciphers:'SSLv3'
  }
  });

  transporter
    .verify()
    .then(() => {
      log.info("Servidor listo para enviar correos");
    })
    .catch((err) => {
      log.error(`Servidor NO puede enviar correos ${err}`);
    });
};

module.exports = connectionEmail;
