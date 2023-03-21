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

const emailDesprendibleNomina = async (empleado) => {
  if (process.env.NODE_ENV !== "test") {
    let transporter = transport();
    await transporter.sendMail({
      from: `Proyecto Proceso Nómina Libertadores <${process.env.CORREO}>`,
      to: `${empleado.correo}`,
      subject: "Desprendible nómina empleado",
      html: `
             <h1>Desprendible de nómina</h1>
             <br>
             <p> Hola ${empleado.nombres}  ${
        empleado.apellidos
      }, se ha generado desprendible de nómina.</p>
             <br>
             <br>

             <table style="border-collapse: collapse; width: 100%; height: 36px;" border="1">
              <tbody>
              <tr style="height: 18px;">
              <td style="width: 50%; height: 18px; text-align: center;">INGRESOS</td>
              <td style="width: 50%; height: 18px; text-align: center;">DEDUCCIONES</td>
              </tr>
              <tr style="height: 18px;">
              <td style="width: 50%; height: 18px;">
              <table style="border-collapse: collapse; width: 100%;" border="1">
              <tbody>
              <tr>
              <td style="width: 33.3333%; text-align: center;">Concepto</td>
              <td style="width: 33.3333%; text-align: center;">Valor</td>
              </tr>
              <tr>
              <td style="width: 33.3333%;">Salario</td>
              <td style="width: 33.3333%;">${empleado.sueldo}</td>
              </tr>
              <tr>
              <td style="width: 33.3333%;">Auxilio transporte</td>
              <td style="width: 33.3333%;">${empleado.auxilio_transporte}</td>
              </tr>
              <tr>
              <td style="width: 33.3333%;">Novedades</td>
              <td style="width: 33.3333%;">${empleado.valor_novedad}</td>
              </tr>
              <tr>
              <td style="width: 33.3333%;">Total ingresos</td>
              <td style="width: 33.3333%;">${
                empleado.auxilio_transporte + empleado.sueldo + empleado.valor_novedad
              }</td>
              </tr>
              </tbody>
              </table>
              </td>
              <td style="width: 50%; height: 18px;">
              <table style="border-collapse: collapse; width: 100%;" border="1">
              <tbody>
              <tr>
              <td style="width: 33.3333%; text-align: center;">Concepto</td>
              <td style="width: 33.3333%; text-align: center;">Valor</td>
              </tr>
              <tr>
              <td style="width: 33.3333%;">Fondo salud</td>
              <td style="width: 33.3333%;">${
                empleado.aportes_salud_empleado
              }</td>
              </tr>
              <tr>
              <td style="width: 33.3333%;">Fondo pensión</td>
              <td style="width: 33.3333%;">${
                empleado.aportes_pension_empleado
              }</td>
              </tr>
              <tr>
              <td style="width: 33.3333%;">Total deducciones</td>
              <td style="width: 33.3333%;">${empleado.total_deducciones}</td>
              </tr>
              </tbody>
              </table>
              </td>
              </tr>
              </tbody>
              </table>
              <table style="border-collapse: collapse; width: 100%;" border="1">
              <tbody>
              <tr>
              <td style="width: 100%;">Neto a pagar ${
                empleado.total_devengos
              }</td>
              </tr>
              </tbody>
              </table>

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

module.exports = {
  emailOlvideContrasenia,
  emailRegistroEmpleado,
  emailDesprendibleNomina,
};
