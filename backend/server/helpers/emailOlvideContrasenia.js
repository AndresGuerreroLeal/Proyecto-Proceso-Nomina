/**
 * Archivo para enviar correos de olvido su contraseña
 *
 * @author Juan-CamiloF
 */

const nodemailer = require("nodemailer");

const emailOlvideContrasenia = async (email, nombre, token) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.CORREO, // generated ethereal user
      pass: process.env.CONTRASENIA, // generated ethereal password
    },
  });

  if (process.env.NODE_ENV !== "test") {
    await transporter.sendMail({
      from: `Olvido su contraseña <juancamilo.fb19@gmail.com>`, // sender address
      to: `${email}`, // list of receivers
      subject: "Olvido su contraseña", // Subject line
      html: `
            <h1>Proyecto Proceso Nómina </h1>
            <br>
            <p> Hola ${nombre}, se solicito un cambio de contraseña, para seguir con el proceso por favor haga click en el siguente enlace: 
              <a href="${process.env.FRONTEND_URL}olvide-contrasenia/${token}" target="_blank">Link</a> 
            </p>
           
            <br>
            <small>
              Fundación Universitaria Los Libertadores 
              <br>
              Ingeniería de Sistemas
              <br>
            </small>`,
    });
  }
};

module.exports = emailOlvideContrasenia;
