/**
 * Archivo encargado de las funciones de los cálculos de nómina
 *
 * @author Juan-CamiloF
 */
const calculosNomina = (contrato) => {
  //Sueldo base
  const sueldo = contrato.sueldo;

  /* Cálculo de aportes para salud */
  const porcentajeSaludEmpleado = contrato.porcentaje_salud_empleado;
  const porcentajeSaludEmpleador = contrato.salario_integral
    ? contrato.porcentaje_salud_empleador
    : 0;
  const valorSaludEmpleado = Math.round(
    sueldo * (porcentajeSaludEmpleado / 100)
  );
  const valorSaludEmpleador = contrato.salario_integral
    ? Math.round(sueldo * (porcentajeSaludEmpleador / 100))
    : 0;

  /* Cálculo de aportes para pensión */
  const porcentajePensionEmpleado = contrato.porcentaje_pension_empleado;
  const porcentajePensionEmpleador = contrato.porcentaje_pension_empleador;
  const valorPensionEmpleado = Math.round(
    sueldo * (porcentajePensionEmpleado / 100)
  );
  const valorPensionEmpleador = Math.round(
    sueldo * (porcentajePensionEmpleador / 100)
  );

  /* Cálculo de aportes para ARL */
  const porcentajeArl = contrato.porcentaje_arl;
  const valorArl = Math.round(sueldo * (porcentajeArl / 100));

  /* Total devengos y descuentos */
  const totalDeducciones = valorSaludEmpleado + valorPensionEmpleado;
  const totalDevengos = sueldo + contrato.auxilio_transporte - totalDeducciones;

  /* Cálculo prestaciones sociales */
  const porcentajePrimaServicios = 100 / 12;
  const valorPrimaServicios = Math.round(
    (sueldo + contrato.auxilio_transporte) * (porcentajePrimaServicios / 100)
  );

  const porcentajeCesantias = 100 / 12;
  const valorCesantias = Math.round(
    (sueldo + contrato.auxilio_transporte) * (porcentajeCesantias / 100)
  );

  const porcentajeInteresesCesantias = 1;
  const valorInteresesCesantias = Math.round(
    (sueldo + contrato.auxilio_transporte) *
      (porcentajeInteresesCesantias / 100)
  );

  const porcentajeVacaciones = 50 / 12;
  const valorVacaciones = Math.round(sueldo * (porcentajeVacaciones / 100));

  /* Cálculo parafiscales */
  const porcentajeParafiscalSENA = contrato.salario_integral
    ? contrato.porcentaje_parafiscal_sena
    : 0;
  const valorParafiscalSENA = Math.round(
    sueldo * (porcentajeParafiscalSENA / 100)
  );

  const porcentajeParafiscalICBF = contrato.salario_integral
    ? contrato.porcentaje_parafiscal_icbf
    : 0;
  const valorParafiscalICBF = Math.round(
    sueldo * (porcentajeParafiscalICBF / 100)
  );

  const porcentajeParafiscalCajaCompensacion =
    contrato.porcentaje_parafiscal_caja_compensacion;
  const valorParafiscalCajaCompesacion = Math.round(
    sueldo * (porcentajeParafiscalCajaCompensacion / 100)
  );

  /* Costo empleador por empleado */
  const totalValorEmpleado =
    sueldo +
    contrato.auxilio_transporte +
    (valorSaludEmpleador + valorPensionEmpleador + valorArl) +
    (valorPrimaServicios +
      valorCesantias +
      valorInteresesCesantias +
      valorVacaciones) +
    (valorParafiscalSENA +
      valorParafiscalICBF +
      valorParafiscalCajaCompesacion);

  const valoresContrato = {
    sueldo: sueldo,
    porcentaje_salud_empleado: porcentajeSaludEmpleado,
    porcentaje_salud_empleador: porcentajeSaludEmpleador,
    aportes_salud_empleado: valorSaludEmpleado,
    aportes_salud_empleador: valorSaludEmpleador,
    porcentaje_pension_empleado: porcentajePensionEmpleado,
    porcentaje_pension_empleador: porcentajePensionEmpleador,
    aportes_pension_empleado: valorPensionEmpleado,
    aportes_pension_empleador: valorPensionEmpleador,
    porcentaje_arl: porcentajeArl,
    valor_arl: valorArl,
    valor_prima_servicios: valorPrimaServicios,
    valor_cesantias: valorCesantias,
    porcentaje_intereses_cesantias: porcentajeInteresesCesantias,
    valor_intereses_cesantias: valorInteresesCesantias,
    porcentaje_vacaciones: porcentajeVacaciones,
    valor_vacaciones: valorVacaciones,
    porcentaje_parafiscal_sena: porcentajeParafiscalSENA,
    valor_parafiscal_sena: valorParafiscalSENA,
    porcentaje_parafiscal_icbf: porcentajeParafiscalICBF,
    valor_parafiscal_icbf: valorParafiscalICBF,
    porcentaje_parafiscal_caja_compensacion:
      porcentajeParafiscalCajaCompensacion,
    valor_parafiscal_caja_compensacion: valorParafiscalCajaCompesacion,
    total_devengos: totalDevengos,
    total_deducciones: totalDeducciones,
    total_valor_empleado: totalValorEmpleado,
  };
  return valoresContrato;
};

module.exports = calculosNomina;
