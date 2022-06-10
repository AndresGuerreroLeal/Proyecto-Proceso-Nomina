/**
 * Archivo de modelo "reporte-nominas" para base de datos.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ReportesNominasSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    anio: {
      type: Number,
      required: true,
    },
    mes: {
      type: Number,
      required: true,
    },
    nomina: {
      type: String,
      trim: true,
      required: true,
    },
    cantidad_contratos: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReportesNominasSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("reportes-nomina", ReportesNominasSchema);
