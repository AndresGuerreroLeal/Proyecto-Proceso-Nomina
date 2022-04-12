/**
 * Archivo de modelo "usuarios" para base de datos.
 * 
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    correo: {
      type: String,
      trim: true,
      required: true,
    },
    usuario: {
      type: String,
      trim: true,
      required: true,
    },
    contrasenia: {
      type: String,
      required: true,
    },
    roles: [
      {
        ref: "Roles",
        type: String,
      },
    ],
    ultimoAcceso: {
      type: Date,
    },
    tokenCuenta: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UsuarioSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      nombre: this.nombre,
    },
    process.env.SECR3T,
    {
      expiresIn: "1d",
    }
  );
};

const Usuario = mongoose.model("usuario", UsuarioSchema);
module.exports.Usuario = Usuario;
