/**
 * Archivo de modelo "contratos" para base de datos.
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ContratoSchema = new mongoose.Schema(
  {
    numero_contrato: {
      type: String,
      trim: true,
      required: true,
    },
    tipo_contrato: {
      type: String,
      trim: true,
      required: true,
    },
    fecha_inicio: {
      type: Date,
      required: true,
    },
    fecha_fin: {
      type: Date,
    },
    sueldo: {
      type: Number,
      required: true,
    },
    cargo: {
      type: String,
      trim: true,
      required: true,
    },
    tipo_cotizante: {
      type: String,
      trim: true,
      required: true,
    },
    auxilio_transporte: {
      type: Number,
      required: true,
    },
    fondo_salud: {
      type: String,
      trim: true,
      required: true,
    },
    porcentaje_salud_empleado: {
      type: Number,
      required: true,
    },
    porcentaje_salud_empleador: {
      type: Number,
      required: true,
    },
    aportes_salud_empleado: {
      type: Number,
      required: true,
    },
    aportes_salud_empleador: {
      type: Number,
      required: true,
    },
    fondo_pensiones: {
      type: String,
      trim: true,
      required: true,
    },
    porcentaje_pensiones_empleado: {
      type: Number,
      required: true,
    },
    porcentaje_pensiones_empleador: {
      type: Number,
      required: true,
    },
    aportes_pension_empleado: {
      type: Number,
      required: true,
    },
    aportes_pension_empleador: {
      type: Number,
      required: true,
    },
    arl: {
      type: String,
      trim: true,
      required: true,
    },
    porcentaje_arl: {
      type: Number,
      required: true,
    },
    valor_arl: {
      type: Number,
      required: true,
    },
    valor_prima_servicios: {
      type: Number,
      required: true,
    },
    fondo_cesantias: {
      type: String,
      trim: true,
      required: true,
    },
    valor_cesantias: {
      type: Number,
      required: true,
    },
    valor_intereses_cesantias: {
      type: Number,
      required: true,
    },
    valor_vacaciones: {
      type: Number,
      required: true,
    },
    porcentaje_parafiscal_sena: {
      type: Number,
      required: true,
    },
    valor_parafiscal_sena: {
      type: Number,
      required: true,
    },
    porcentaje_parafiscal_ICBF: {
      type: Number,
      required: true,
    },
    valor_parafiscal_ICBF: {
      type: Number,
      required: true,
    },
    porcentaje_parafiscal_caja_compensacion: {
      type: Number,
      required: true,
    },
    valor_parafiscal_caja_compensacion: {
      type: Number,
      required: true,
    },
    total_devengos: {
      type: Number,
      required: true,
    },
    total_deducciones: {
      type: Number,
      required: true,
    },
    total_valor_empleado: {
      type: Number,
      required: true,
    },
    salario_integral: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ContratoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("contrato", ContratoSchema);
