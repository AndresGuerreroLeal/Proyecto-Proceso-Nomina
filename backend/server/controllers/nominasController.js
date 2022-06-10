/**
 * Archivo de controlador para las funciones relacionadas con nóminas
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError");
const Empleado = require("../models/empleados");
const Contrato = require("../models/contratos");
const Nomina = require("../models/nominas");
const calculosNomina = require("../helpers/funcionesNomina");
const {
  crearArchivoReporte,
  eliminarArchivoReporte,
} = require("../helpers/funcionesReportes");
const { emailDesprendibleNomina } = require("../helpers/enviarCorreos");
const path = require("path");
const NominaController = {
  /**
   * @code POST / create : Crear reporte de nómina
   *
   * @param nombre, @param anio, @param mes, @param novedades[] y @param enviar_desprendibles
   *
   * @return archivo xlsx con la nómina @code 201 o mensaje @code 400
   */
  crearNomina: async (req, res) => {
    log.info("[POST] Petición para crear nóminas");

    const ultimoDiaMes = new Date(req.body.anio, req.body.mes - 1, 30);

    const primerDiaMes = new Date(req.body.anio, req.body.mes - 1, 1);

    const cantidadContratos = await Contrato.estimatedDocumentCount({
      fecha_inicio: { $lte: ultimoDiaMes },
      estado: "ACTIVO",
    }).exec();

    if (cantidadContratos < 1) {
      log.info("No hay contratos registrados para realizar una nómina");
      return res.status(400).send({
        message: "No hay contratos registrados para realizar una nómina",
      });
    }

    const contratos = await Contrato.find({
      fecha_inicio: { $lte: ultimoDiaMes },
      estado: "ACTIVO",
    })
      .lean()
      .exec();

    contratos.map((contrato) => {
      if (req.body.novedades && req.body.novedades.length > 0) {
        //Novedades
        for (const novedad of req.body.novedades) {
          if (contrato._id == novedad._id) {
            contrato.valor_novedad = novedad.valor;
            contrato.concepto_novedad = novedad.concepto;
          }
        }
      } else {
        contrato.valor_novedad = 0;
        contrato.concepto_novedad = "No se realizo ninguna novedad";
      }
      //Si no se trabajaron los 30 días del mes
      if (contrato.fecha_inicio > primerDiaMes) {
        const diferenciaTiempo = Math.abs(ultimoDiaMes - contrato.fecha_inicio);
        const dias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
        const sueldoDia = parseInt(contrato.sueldo / 30);
        contrato.sueldo = sueldoDia * dias;
        const auxilioTransporteDia = parseInt(contrato.auxilio_transporte / 30);
        contrato.auxilio_transporte = auxilioTransporteDia * dias;
        const valoresNomina = calculosNomina(contrato);
        contrato.porcentaje_salud_empleado =
          valoresNomina.porcentaje_salud_empleado;
        contrato.porcentaje_salud_empleador =
          valoresNomina.porcentaje_salud_empleador;
        contrato.aportes_salud_empleado = valoresNomina.aportes_salud_empleado;
        contrato.aportes_salud_empleador =
          valoresNomina.aportes_salud_empleador;
        contrato.porcentaje_pension_empleado =
          valoresNomina.porcentaje_pension_empleado;
        contrato.porcentaje_pension_empleador =
          valoresNomina.porcentaje_pension_empleador;
        contrato.aportes_pension_empleado =
          valoresNomina.aportes_pension_empleado;
        contrato.aportes_pension_empleador =
          valoresNomina.aportes_pension_empleador;
        contrato.porcentaje_arl = valoresNomina.porcentaje_arl;
        contrato.valor_arl = valoresNomina.valor_arl;
        contrato.valor_prima_servicios = valoresNomina.valor_prima_servicios;
        contrato.valor_cesantias = valoresNomina.valor_cesantias;
        contrato.porcentaje_intereses_cesantias =
          valoresNomina.porcentaje_intereses_cesantias;
        contrato.valor_intereses_cesantias =
          valoresNomina.valor_intereses_cesantias;
        contrato.valor_vacaciones = valoresNomina.valor_vacaciones;
        contrato.porcentaje_parafiscal_sena =
          valoresNomina.porcentaje_parafiscal_sena;
        contrato.valor_parafiscal_sena = valoresNomina.valor_parafiscal_sena;
        contrato.porcentaje_parafiscal_icbf =
          valoresNomina.porcentaje_parafiscal_icbf;
        contrato.valor_parafiscal_icbf = valoresNomina.valor_parafiscal_icbf;
        contrato.porcentaje_parafiscal_caja_compensacion =
          valoresNomina.porcentaje_parafiscal_caja_compensacion;
        contrato.valor_parafiscal_caja_compensacion =
          valoresNomina.valor_parafiscal_caja_compensacion;
        contrato.total_devengos = valoresNomina.total_devengos;
        contrato.total_deducciones = valoresNomina.total_deducciones;
        contrato.total_valor_empleado = valoresNomina.total_valor_empleado;
        return contrato;
      }
      contrato.total_devengos =
        contrato.total_devengos + contrato.valor_novedad;
      contrato.total_valor_empleado =
        contrato.total_valor_empleado + contrato.valor_novedad;
      return contrato;
    });

    const empleados = [];

    await Promise.all(
      contratos.map(async (contrato) => {
        const empleado = await Empleado.findOne({
          numero_documento: contrato.numero_contrato,
        })
          .lean()
          .exec();
        empleado.sueldo = contrato.sueldo;
        empleado.auxilio_transporte = contrato.auxilio_transporte;
        empleado.aportes_salud_empleado = contrato.aportes_salud_empleado;
        empleado.aportes_pension_empleado = contrato.aportes_pension_empleado;
        empleado.total_devengos = contrato.total_devengos;
        empleado.total_deducciones = contrato.total_deducciones;
        empleado.valor_novedad = contrato.valor_novedad;
        empleados.push(empleado);
        contrato.nombres = empleado.nombres;
        contrato.apellidos = empleado.apellidos;
        return contrato;
      })
    );

    const columnas = [
      "Numero contrato",
      "Nombres",
      "Apellidos",
      "Sueldo",
      "Salario integral",
      "Cargo",
      "fecha_inicio",
      "Tipo contrato",
      "Tipo cotizante",
      "Auxilio transporte",
      "Fondo salud",
      "Porcentaje salud empleado",
      "Porcentaje salud empleador",
      "Aportes salud empleado",
      "Aportes salud empleador",
      "Fondo pensiones",
      "Porcentaje pension empleado",
      "Porcentaje pension empleador",
      "Aportes pension empleado",
      "Aportes pension empleador",
      "Arl",
      "Porcentaje arl",
      "Valor arl",
      "Valor prima servicios",
      "Fondo cesantias",
      "Valor cesantias",
      "Valor intereses cesantias",
      "Valor vacaciones",
      "Porcentaje parafiscal sena",
      "Valor parafiscal sena",
      "Porcentaje parafiscal icbf",
      "Valor parafiscal icbf",
      "Porcentaje parafiscal caja compensacion",
      "Valor parafiscal caja compensacion",
      "Total devengos",
      "Total deducciones",
      "Total valor empleado",
      "Valor novedad",
      "Concepto novedad",
      "Estado",
      "createdAt",
      "updatedAt",
    ];

    const { reporteEstado, wb } = crearArchivoReporte(
      columnas,
      contratos,
      "nominas",
      "Contratos",
      req.body.nombre
    );

    if (!reporteEstado.creado) {
      log.info(`No se pudo generar la nómina ${reporteEstado.error}`);
      return res.status(400).send({ message: "No se pudo generar la nómina" });
    }

    const url = req.protocol + "://" + req.get("host");
    const reporteUrl =
      url + "/api/1.0/payroll/download/" + reporteEstado.nombre;

    const fecha = Date.now();
    const fechaFormato = new Date(fecha).toISOString().split("T")[0];

    const nomina = new Nomina({
      nombre: req.body.nombre,
      descripcion: "Nómina generada el día " + fechaFormato,
      anio: req.body.anio,
      mes: req.body.mes,
      nomina: reporteUrl,
      cantidad_contratos: cantidadContratos,
    });

    await nomina.save();

    if (req.body.enviar_desprendibles) {
      empleados.forEach((empleado) => {
        emailDesprendibleNomina(empleado);
      });
    }

    wb.writeToBuffer().then((buffer) => {
      const bufferBinario = Buffer.from(buffer);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + reporteEstado.nombre
      );
      return res.status(201).send(bufferBinario);
    });
  },

  /**
   * @code GET /download : Descargar archivo de nómina
   *
   * @param file nombre de reporte con el cual se guardo en el servidor
   *
   * @return documento @code 200 o mensaje @code 400
   */
  descargarNomina: async (req, res) => {
    log.info("[GET] Petición para descargar nómina");

    try {
      const archivo = path.normalize(
        `${process.cwd()}/server/archivos/nominas/${req.params.file}`
      );
      res.download(archivo, req.params.file);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / list-info : Listar información para nóminas
   *
   * @param pageSize y @param pageNumber
   *
   * @return lista de contratos con nombres de empleados @code 200 o mensaje @code 400
   */
  listarInformacion: async (req, res) => {
    log.info("[GET] Petición para listar información para nóminas");

    try {
      const { pageSize, pageNumber } = req.query;
      if (!pageSize || !pageNumber) {
        log.error("Sin datos de paginación");
        return res
          .status(400)
          .send({ message: "No hay parametros de paginación" });
      }
      let options = {
        page: parseInt(pageNumber, 10) < 0 ? 0 : parseInt(pageNumber, 10),
        limit: parseInt(pageSize, 10) < 0 ? 10 : parseInt(pageSize, 10),
        sort: {
          numero_contrato: 1,
        },
        lean: true,
        leanWithId: false,
      };

      const contratos = await Contrato.paginate({ estado: "ACTIVO" }, options);

      //Agregar nombres y apellidos del empleado del contrato
      await Promise.all(
        contratos.docs.map(async (contrato) => {
          const empleado = await Empleado.findOne({
            numero_documento: contrato.numero_contrato,
          });
          contrato.nombres = empleado.nombres;
          contrato.apellidos = empleado.apellidos;
          return contrato;
        })
      );

      return res.status(200).send(contratos);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /list: Obtener lista de nóminas
   *
   * @param pageSize y @param pageNumber
   *
   * @return lista de nóminas @code 200 o mensaje @code 400
   */
  listarNominas: async (req, res) => {
    log.info("[GET] Petición para obtener lista de nóminas");

    try {
      const { pageNumber, pageSize } = req.query;
      if (!pageNumber || !pageSize) {
        log.error("Sin datos de paginación");
        return res
          .status(400)
          .send({ message: "No hay parametros de paginación" });
      }
      let options = {
        page: parseInt(pageNumber, 10) < 0 ? 0 : parseInt(pageNumber, 10),
        limit: parseInt(pageSize, 10) < 0 ? 10 : parseInt(pageSize, 10),
        createdAt: -1,
      };
      const nominas = await Nomina.paginate({}, options);
      res.status(200).send(nominas);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / payroll : Obtener cantidad de nóminas
   *
   * @returns cantidad nóminas @code 200 o mensaje @code 400
   */
  cantidadNominas: async (req, res) => {
    log.info("[GET] Petición para obtener cantidad de nóminas");

    try {
      const cantidadNominas = await Nomina.countDocuments().exec();
      return res.status(200).send({ cantidadNominas });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code DELETE /delete: Eliminar un reporte de nóminas
   *
   * @param id identificador del reporte
   *
   * @return mensaje de confirmación @code 200 o mensaje @code 400
   */
  eliminarNomina: async (req, res) => {
    log.info("[DELETE] Petición para eliminar una nómina");

    try {
      const reporte = await Nomina.findById(req.params._id).exec();
      if (!reporte) {
        log.error("El reporte que se intentó eliminar no existe");
        return res.status(400).send({ message: "El reporte no existe" });
      }

      const ruta = reporte.nomina.split("/");
      const nombreArchivo = ruta[ruta.length - 1];
      const eliminarArchivo = eliminarArchivoReporte("nominas", nombreArchivo);
      if (!eliminarArchivo.eliminado) {
        log.error(`El reporte no se pudo eliminar ${eliminarArchivo.mensaje}`);
        return res
          .status(400)
          .send({ message: `El reporte no se pudo eliminar del servidor` });
      }

      const eliminarReporte = await Nomina.findByIdAndDelete(
        req.params._id
      ).exec();
      if (!eliminarReporte) {
        log.error("El reporte no existe");
        return res.status(400).send({ message: "El reporte no existe" });
      }

      log.info("Se eliminó la nómina exitosamente");
      return res
        .status(200)
        .send({ message: "Se eliminó la nómina exitosamente" });
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET : /get/:_id : Obtener información de una nómina
   *
   * @param id identificador del contrato
   *
   * @return contrato @code 200 o mensaje @code 400
   */
  obtenerInformacion: async (req, res) => {
    log.info("[GET] Petición de obtener información de nómina");
    try {
      const contrato = await Contrato.findById(req.params._id).lean().exec();
      if (!contrato) {
        log.error("El contrato no existe");
        return res.status(400).send({ message: "El contrato no existe" });
      }
      const empleado = await Empleado.findOne({
        numero_documento: contrato.numero_contrato,
      });

      contrato.nombres = empleado.nombres;
      contrato.apellidos = empleado.apellidos;
      return res.status(200).send(contrato);
    } catch (err) {
      httpError(res, err);
    }
  },
};

module.exports = NominaController;
