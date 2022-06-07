/**
 * Archivo de controlador para las funciones relacionadas con contratos
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError");
const Empleado = require("../models/empleados");
const Contrato = require("../models/contratos");
const ContratoController = {
  /**
   * @code POST / create : Crear un contrato
   *
   * @param contrato
   *
   * @return contrato @code 201 o mensaje @code 400
   */
  crearContrato: async (req, res) => {
    log.info("[POST] Petición de crear un contrato");
    try {
      //Validar existencia del empleado
      const empleado = await Empleado.findOne({
        numero_documento: req.body.numero_contrato,
      }).exec();

      if (!empleado) {
        log.error("El contrato no tiene un empleado definido");
        return res
          .status(400)
          .send({ message: "El contrato no tiene un empleado definido" });
      }

      //Validar que no exista el contrato
      const existeContrato = await Contrato.findOne({
        numero_contrato: req.body.numero_contrato,
      }).exec();

      if (existeContrato) {
        log.error("El número de contrato ya fue registrado");
        return res
          .status(400)
          .send({ message: "El número de contrato ya fue registrado" });
      }

      const sueldo = req.body.sueldo;

      /* Cálculo de aportes para salud */
      const porcentajeSaludEmpleado = req.body.porcentaje_salud_empleado;
      const porcentajeSaludEmpleador = req.body.salario_integral
        ? req.body.porcentaje_salud_empleador
        : 0;
      const valorSaludEmpleado = Math.round(
        sueldo * (porcentajeSaludEmpleado / 100)
      );
      const valorSaludEmpleador = req.body.salario_integral
        ? Math.round(sueldo * (porcentajeSaludEmpleador / 100))
        : 0;

      /* Cálculo de aportes para pensión */
      const porcentajePensionEmpleado = req.body.porcentaje_pension_empleado;
      const porcentajePensionEmpleador = req.body.porcentaje_pension_empleador;
      const valorPensionEmpleado = Math.round(
        sueldo * (porcentajePensionEmpleado / 100)
      );
      const valorPensionEmpleador = Math.round(
        sueldo * (porcentajePensionEmpleador / 100)
      );

      /* Cálculo de aportes para ARL */
      const porcentajeArl = req.body.porcentaje_arl;
      const valorArl = Math.round(sueldo * (porcentajeArl / 100));

      /* Total devengos y descuentos */
      const totalDeducciones = valorSaludEmpleado + valorPensionEmpleado;
      const totalDevengos =
        sueldo + req.body.auxilio_transporte - totalDeducciones;

      /* Cálculo prestaciones sociales */
      const porcentajePrimaServicios = 100 / 12;
      const valorPrimaServicios = Math.round(
        (sueldo + req.body.auxilio_transporte) *
          (porcentajePrimaServicios / 100)
      );

      const porcentajeCesantias = 100 / 12;
      const valorCesantias = Math.round(
        (sueldo + req.body.auxilio_transporte) * (porcentajeCesantias / 100)
      );

      const porcentajeInteresesCesantias = 1;
      const valorInteresesCesantias = Math.round(
        (sueldo + req.body.auxilio_transporte) *
          (porcentajeInteresesCesantias / 100)
      );

      const porcentajeVacaciones = 50 / 12;
      const valorVacaciones = Math.round(sueldo * (porcentajeVacaciones / 100));

      /* Cálculo parafiscales */
      const porcentajeParafiscalSENA = req.body.salario_integral
        ? req.body.porcentaje_parafiscal_sena
        : 0;
      const valorParafiscalSENA = Math.round(
        sueldo * (porcentajeParafiscalSENA / 100)
      );

      const porcentajeParafiscalICBF = req.body.salario_integral
        ? req.body.valor_parafiscal_icbf
        : 0;
      const valorParafiscalICBF = Math.round(
        sueldo * (porcentajeParafiscalICBF / 100)
      );

      const porcentajeParafiscalCajaCompensacion =
        req.body.porcentaje_parafiscal_caja_compensacion;
      const valorParafiscalCajaCompesacion = Math.round(
        sueldo * (porcentajeParafiscalCajaCompensacion / 100)
      );

      /* Costo empleador por empleado */
      const totalValorEmpleado =
        sueldo +
        req.body.auxilio_transporte +
        (valorSaludEmpleador + valorPensionEmpleador + valorArl) +
        (valorPrimaServicios +
          valorCesantias +
          valorInteresesCesantias +
          valorVacaciones) +
        (valorParafiscalSENA +
          valorParafiscalICBF +
          valorParafiscalCajaCompesacion);

      /* Crear contrato */
      const contrato = new Contrato({
        numero_contrato: req.body.numero_contrato,
        tipo_contrato: req.body.tipo_contrato,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        sueldo: sueldo,
        cargo: req.body.cargo,
        tipo_cotizante: req.body.tipo_cotizante,
        auxilio_transporte: req.body.auxilio_transporte,
        fondo_salud: req.body.fondo_salud,
        porcentaje_salud_empleado: porcentajeSaludEmpleado,
        porcentaje_salud_empleador: porcentajeSaludEmpleador,
        aportes_salud_empleado: valorSaludEmpleado,
        aportes_salud_empleador: valorSaludEmpleador,
        fondo_pensiones: req.body.fondo_pensiones,
        porcentaje_pension_empleado: porcentajePensionEmpleado,
        porcentaje_pension_empleador: porcentajePensionEmpleador,
        aportes_pension_empleado: valorPensionEmpleado,
        aportes_pension_empleador: valorPensionEmpleador,
        arl: req.body.arl,
        porcentaje_arl: porcentajeArl,
        valor_arl: valorArl,
        valor_prima_servicios: valorPrimaServicios,
        fondo_cesantias: req.body.fondo_cesantias,
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
        salario_integral: req.body.salario_integral,
        estado: "ACTIVO",
      });

      await contrato.save();

      log.info(`Contrato creado ${JSON.stringify(contrato)}`);
      return res.status(201).send(contrato);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / list : Listar contratos
   *
   * @param pageSize y @param pageNumber
   *
   * @return lista de contratos @code 200 o mensaje @code 400
   */
  listarContratos: async (req, res) => {
    log.info("[GET] Petición listar contratos");
    try {
      const { pageSize, pageNumber } = req.query;
      if (!pageSize || !pageNumber) {
        log.error("Sin datos de paginación");
        return res
          .status(400)
          .send({ message: "No hay parametros de paginación" });
      }
      const campos = {
        _id: 1,
        numero_contrato: 1,
        tipo_contrato: 1,
        fecha_inicio: 1,
        sueldo: 1,
        cargo: 1,
        tipo_cotizante: 1,
        auxilio_transporte: 1,
        fondo_salud: 1,
        porcentaje_salud_empleado: 1,
        porcentaje_salud_empleador: 1,
        fondo_pensiones: 1,
        porcentaje_pension_empleado: 1,
        porcentaje_pension_empleador: 1,
        arl: 1,
        porcentaje_arl: 1,
        fondo_cesantias: 1,
        porcentaje_parafiscal_sena: 1,
        porcentaje_parafiscal_icbf: 1,
        porcentaje_parafiscal_caja_compensacion: 1,
        salario_integral: 1,
        createdAt: 1,
        updatedAt: 1,
      };

      let options = {
        page: parseInt(pageNumber, 10) < 0 ? 0 : parseInt(pageNumber, 10),
        limit: parseInt(pageSize, 10) < 0 ? 10 : parseInt(pageSize, 10),
        sort: {
          numero_contrato: 1,
        },
        select: campos,
      };

      const contratos = await Contrato.paginate({ estado: "ACTIVO" }, options);
      return res.status(200).send(contratos);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / contract : Obtener cantidad de empleados
   *
   * @return cantidad de contratos @code 200 o mensaje @code 400
   */
  cantidadContratos: async (req, res) => {
    log.info("[GET] Petición para obtener la cantidad de contratos");
    try {
      const cantidadContratos = await Contrato.countDocuments().exec();
      const contratosActivos = await Contrato.countDocuments({
        estado: "ACTIVO",
      }).exec();
      const contratosInactivos = await Contrato.countDocuments({
        estado: "INACTIVO",
      }).exec();

      const cantidad = {
        cantidadContratos,
        contratosActivos,
        contratosInactivos,
      };
      return res.status(200).send(cantidad);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / :_id : Obtener contratos
   *
   * @param idContrato
   *
   * @return contrato @code 200 o mensaje @code 400
   */
  obtenerContrato: async (req, res) => {
    log.info("[GET] Petición obtener contrato");
    try {
      const campos = {
        _id: 1,
        numero_contrato: 1,
        tipo_contrato: 1,
        fecha_inicio: 1,
        sueldo: 1,
        cargo: 1,
        tipo_cotizante: 1,
        auxilio_transporte: 1,
        fondo_salud: 1,
        porcentaje_salud_empleado: 1,
        porcentaje_salud_empleador: 1,
        fondo_pensiones: 1,
        porcentaje_pension_empleado: 1,
        porcentaje_pension_empleador: 1,
        arl: 1,
        porcentaje_arl: 1,
        fondo_cesantias: 1,
        porcentaje_parafiscal_sena: 1,
        porcentaje_parafiscal_icbf: 1,
        porcentaje_parafiscal_caja_compensacion: 1,
        salario_integral: 1,
        createdAt: 1,
        updatedAt: 1,
      };
      const contrato = await Contrato.findById(req.params._id)
        .select(campos)
        .exec();
      if (!contrato) {
        log.error("El contrato no existe");
        return res.status(400).send({ message: "El contrato no existe" });
      }
      log.info(`Detalles del contrato ${JSON.stringify(contrato)}`);
      return res.status(200).send(contrato);
    } catch (err) {
      httpError(res, err);
    }
  },
};

module.exports = ContratoController;
