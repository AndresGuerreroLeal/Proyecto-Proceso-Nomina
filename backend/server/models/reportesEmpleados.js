/**
 * Archivo de modelo "reportes-empleados" para base de datos.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ReportesEmpleadosSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    cantidad_empleados: {
      type: Number,
      required: true,
    },
    fecha_inicio: {
      type: Date,
      required: true,
    },
    fecha_final: {
      type: Date,
      required: true,
    },
    reporte: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReportesEmpleadosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("reportes-empleado", ReportesEmpleadosSchema);
