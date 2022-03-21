/**
 * Archivo de modelo "usuarios" para base de datos.
 * 
 * @author Juan-CamiloF
 */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoke");
const generarId = require("../helpers/generateId");

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
    ultimoAcceso: {
      type: Date,
    },
    tokenCuenta: {
      type: String,
      default: generarId(),
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
    process.env.SECRET
  );
};

const Usuario = mongoose.model("usuario", esquemaUsuario);
module.exports.Usuario = Usuario;
