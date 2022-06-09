/**
 * Archivo de controlador para las funciones relacionadas con contratos
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError");
const calculosNomina = require("../helpers/funcionesNomina");
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

      /* Función para calcular valores de nómina del contrato */
      const informacionContrato = calculosNomina(req.body);

      /* Crear contrato */
      const contrato = new Contrato({
        numero_contrato: req.body.numero_contrato,
        tipo_contrato: req.body.tipo_contrato,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        cargo: req.body.cargo,
        tipo_cotizante: req.body.tipo_cotizante,
        auxilio_transporte: req.body.auxilio_transporte,
        fondo_salud: req.body.fondo_salud,
        fondo_pensiones: req.body.fondo_pensiones,
        arl: req.body.arl,
        fondo_cesantias: req.body.fondo_cesantias,
        salario_integral: req.body.salario_integral,
        estado: "ACTIVO",
        ...informacionContrato,
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
   * @code GET / contract : Obtener cantidad de contratos
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
   * @code PUT / update : Actualizar información de contratos
   *
   * @param contrato
   *
   * @return contrato actualizado @code 201 o mensaje @code 400
   */
  actualizarContrato: async (req, res) => {
    log.info("[PUT] Petición para actualizar información contrato");
    //try{

    const contrato = await Contrato.findById(req.body._id).exec();

    let numero_contrato = contrato.numero_contrato;

    if (contrato.numero_contrato !== req.body.numero_contrato) {
      //Validar existencia del empleado
      numero_contrato = req.body.numero_contrato;
      const empleado = await Empleado.findOne({
        numero_documento: numero_contrato,
      }).exec();

      if (!empleado) {
        log.error("El contrato no tiene un empleado definido");
        return res
          .status(400)
          .send({ message: "El contrato no tiene un empleado definido" });
      }

      //Validar que no exista el contrato
      const existeContrato = await Contrato.findOne({
        numero_contrato: numero_contrato,
      }).exec();

      if (existeContrato) {
        log.error("El número de contrato ya fue registrado");
        return res
          .status(400)
          .send({ message: "El número de contrato ya fue registrado" });
      }
    }

    /* Función para calcular valores de nómina del contrato */
    const informacionContrato = calculosNomina(req.body);
    /* Actualizar contrato */
    const contratoActualizado = await Contrato.findByIdAndUpdate(
      req.body._id,
      {
        numero_contrato: numero_contrato,
        tipo_contrato: req.body.tipo_contrato,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        cargo: req.body.cargo,
        tipo_cotizante: req.body.tipo_cotizante,
        auxilio_transporte: req.body.auxilio_transporte,
        fondo_salud: req.body.fondo_salud,
        fondo_pensiones: req.body.fondo_pensiones,
        arl: req.body.arl,
        fondo_cesantias: req.body.fondo_cesantias,
        salario_integral: req.body.salario_integral,
        estado: "ACTIVO",
        ...informacionContrato,
      },
      { new: true }
    );

    await contratoActualizado.save();

    log.info(`Contrato actualizado ${JSON.stringify(contratoActualizado)}`);
    return res.status(201).send(contratoActualizado);

    //}catch(err){httpError(res,err)}
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
