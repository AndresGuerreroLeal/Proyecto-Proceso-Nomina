/**
 * Archivo para hacer calculos de contrato para nómina a los test
 *
 * @author Juan-CamiloF
 */

const calculosNominaTest = (contrato) => {
  const aportesSaludEmpleado = Math.round(
    contrato.sueldo * (contrato.porcentaje_salud_empleado / 100)
  );

  const porcentajeSaludEmpleador = contrato.salario_integral
    ? contrato.porcentaje_salud_empleado
    : 0;

  const aportesSaludEmpleador = contrato.salario_integral
    ? Math.round(contrato.sueldo * (porcentajeSaludEmpleador / 100))
    : 0;

  const aportesPensionEmpleado = Math.round(
    contrato.sueldo * (contrato.porcentaje_pension_empleado / 100)
  );
  const aportesPensionEmpleador = Math.round(
    contrato.sueldo * (contrato.porcentaje_pension_empleador / 100)
  );

  const valorArl = Math.round(
    contrato.sueldo * (contrato.porcentaje_arl / 100)
  );

  const valorPrimaServicios = Math.round(
    (contrato.sueldo + contrato.auxilio_transporte) * (100 / 12 / 100)
  );

  const valorCesantias = Math.round(
    (contrato.sueldo + contrato.auxilio_transporte) * (100 / 12 / 100)
  );

  const valorInteresesCesantias = Math.round(
    (contrato.sueldo + contrato.auxilio_transporte) * (1 / 100)
  );

  const valorVacaciones = Math.round(contrato.sueldo * (50 / 12 / 100));

  const porcentajeParafiscalSENA = contrato.salario_integral
    ? contrato.porcentaje_parafiscal_sena
    : 0;

  const valorParafiscalSENA = Math.round(
    contrato.sueldo * (porcentajeParafiscalSENA / 100)
  );

  const porcentajeParafiscalICBF = contrato.salario_integral
    ? contrato.porcentaje_parafiscal_icbf
    : 0;

  const valorParafiscalICBF = Math.round(
    contrato.sueldo * (porcentajeParafiscalICBF / 100)
  );

  const valorParafiscalCajaCompesacion = Math.round(
    contrato.sueldo * (contrato.porcentaje_parafiscal_caja_compensacion / 100)
  );

  const totalDeducciones = aportesSaludEmpleado + aportesPensionEmpleado;

  const totalDevengos =
    contrato.sueldo + contrato.auxilio_transporte - totalDeducciones;

  const totalValorEmpleado =
    contrato.sueldo +
    contrato.auxilio_transporte +
    (aportesSaludEmpleador + aportesPensionEmpleador + valorArl) +
    (valorPrimaServicios +
      valorCesantias +
      valorInteresesCesantias +
      valorVacaciones) +
    (valorParafiscalSENA +
      valorParafiscalICBF +
      valorParafiscalCajaCompesacion);

  const valoresContrato = {
    aportesSaludEmpleado,
    porcentajeSaludEmpleador,
    aportesSaludEmpleador,
    aportesPensionEmpleado,
    aportesPensionEmpleador,
    valorArl,
    valorPrimaServicios,
    valorCesantias,
    valorInteresesCesantias,
    valorVacaciones,
    porcentajeParafiscalSENA,
    valorParafiscalSENA,
    porcentajeParafiscalICBF,
    valorParafiscalICBF,
    valorParafiscalCajaCompesacion,
    totalDeducciones,
    totalDevengos,
    totalValorEmpleado,
  };
  return valoresContrato;
};

module.exports = calculosNominaTest;
