/**
 * Archivo de modelo "empleados" para base de datos.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const EmpleadoSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      trim: true,
      required: true,
    },
    apellidos: {
      type: String,
      trim: true,
      required: true,
    },
    tipo_documento: {
      type: String,
      required: true,
    },
    numero_documento: {
      type: String,
      trim: true,
      required: true,
    },
    genero:{
      type: String,
      trim: true,
      requied: true
    },
    documento: {
      type: String,
      trim: true,
      required: true,
    },
    correo: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    numero_celular: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    ciudad_residencia: {
      type: String,
      trim: true,
      required: true,
    },
    direccion_residencia: {
      type: String,
      trim: true,
      required: true,
    },
    metodo_pago: {
      type: String,
      required: true,
    },
    entidad_bancaria: {
      type: String,
      required: true,
    },
    tipo_cuenta: {
      type: String,
      required: true,
    },
    numero_cuenta: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      required: true,
    },
    concepto: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

EmpleadoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("empleado", EmpleadoSchema);
