/**
 * Archivo con la configuración para enviar correos
 *
 * @author Juan-CamiloF
 */

 const nodemailer = require("nodemailer");

 const transport = () => {
   return nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 465,
     secure: true, // true for 465, false for other ports
     auth: {
       user: process.env.CORREO, // generated ethereal user
       pass: process.env.CONTRASENIA, // generated ethereal password
     },
   });
 };
 
 const emailOlvideContrasenia = async (email, nombre, token) => {
   if (process.env.NODE_ENV !== "test") {
     let transporter = transport();
     await transporter.sendMail({
       from: `Proyecto Proceso Nómina Libertadores <${process.env.CORREO}>`, // sender address
       to: `${email}`, // list of receivers
       subject: "Olvido su contraseña", // Subject line
       html: `
             <h1>Proyecto Proceso Nómina</h1>
             <br>
             <p> Hola ${nombre}, se realizó la solicitud de cambio de contraseña, para seguir con el proceso, por favor haga click en el siguiente enlace: 
               <a href="${process.env.FRONTEND_URL}olvide-contrasenia/${token}" target="_blank">Link</a> 
             </p>
            
             <br>
             <small>
               Fundación Universitaria Los Libertadores 
               <br>
               Ingeniería de Sistemas
               <br>
             </small>
             `,
     });
   }
 };
 
 const emailRegistroEmpleado = async (email, nombre) => {
   if (process.env.NODE_ENV !== "test") {
     let transporter = transport();
     await transporter.sendMail({
       from: `Proyecto Proceso Nómina Libertadores <${process.env.CORREO}>`,
       to: `${email}`,
       subject: "Bienvenido empleado",
       html: `
             <h1>Proyecto Proceso Nómina</h1>
             <br>
             <p> Hola ${nombre}, ha sido registrado por un administrador dentro del sistema de Proyecto Proceso Nómina.</p>
<<<<<<< HEAD
 
=======
>>>>>>> 75fa7c6 (Se añaden cambios de ortografia)
             <br>
             <small>
               Fundación Universitaria Los Libertadores 
               <br>
               Ingeniería de Sistemas
               <br>
             </small>
             `,
     });
   }
 };
 
<<<<<<< HEAD
 module.exports = { emailOlvideContrasenia, emailRegistroEmpleado };
=======
 module.exports = { emailOlvideContrasenia, emailRegistroEmpleado };
>>>>>>> 75fa7c6 (Se añaden cambios de ortografia)
