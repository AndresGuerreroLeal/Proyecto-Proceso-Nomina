/**
 * Archivo de controlador para las funciones relacionadas con los reportes de empleados
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError");
const Contratos = require("../models/contratos");
const ReporteContratos = require("../models/reportesContratos");
const {
  crearArchivoReporte,
  eliminarArchivoReporte,
} = require("../helpers/funcionesReportes");
const path = require("path");
const ReportesContratosController = {
  /**
   * @code POST / create : Crear un reporte de contratos
   *
   * @return archivo xlsx con los contratos @code 201 o mensaje @code 400
   */
  crearReporte: async (req, res) => {
    log.info("[GET] Petición de crear un reporte de contratos");
    try {
      const cantidadContratos = await Contratos.estimatedDocumentCount().exec();
      if (cantidadContratos < 1) {
        log.info("No hay contratos registrados para realizar un reporte");
        return res.status(400).send({
          message: "No hay contratos registrados para realizar un reporte",
        });
      }

      const contratos = await Contratos.find({})
        .sort({
          estado: 1,
          createdAt: -1,
        })
        .exec();

      const columnas = [
        "Numero contrato",
        "Tipo contrato",
        "fecha_inicio",
        "Sueldo",
        "Cargo",
        "Tipo cotizante",
        "Auxilio transporte",
        "Fondo salud",
        "Porcentaje salud empleado",
        "Porcentaje salud empleador",
        "Fondo pensiones",
        "Porcentaje pension empleado",
        "Porcentaje pension empleador",
        "Arl",
        "Porcentaje arl",
        "Fondo cesantias",
        "porcentaje parafiscal SENA",
        "porcentaje parafiscal ICBF",
        "porcentaje parafiscal caja compensacion",
        "Salario integral",
        "createdAt",
        "updatedAt",
      ];

      const fecha = Date.now();
      const fechaFormato = new Date(fecha).toISOString().split("T")[0];
      const nombre = "Reporte generado " + fechaFormato;

      const { reporteEstado, wb } = crearArchivoReporte(
        columnas,
        contratos,
        "reportesContratos",
        "Contratos",
        nombre
      );

      if (!reporteEstado.creado) {
        log.info(
          `No se pudo generar el reporte de contratos ${reporteEstado.error}`
        );
        return res
          .status(400)
          .send({ message: "No se pudo generar el reporte de contratos" });
      }

      const fechaInicio = contratos[0].createdAt;
      const fechaFinal = contratos[contratos.length - 1].createdAt;

      const url = req.protocol + "://" + req.get("host");
      const reporteUrl =
        url + "/api/1.0/report-contract/download/" + reporteEstado.nombre;

      const reporteContrato = new ReporteContratos({
        nombre,
        cantidad_contratos: cantidadContratos,
        fecha_inicio: fechaInicio.toISOString().split("T")[0],
        fecha_final: fechaFinal.toISOString().split("T")[0],
        reporte: reporteUrl,
      });

      await reporteContrato.save();

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
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /download : Descargar archivo de reportes contratos
   *
   * @param file nombre de reporte con el cual se guardo en el servidor
   *
   * @return documento @code 200 o mensaje @code 400
   */
  descargarReporte: async (req, res) => {
    log.info("[GET] Petición para descargar reporte de contratos");

    try {
      const archivo = path.normalize(
        `${process.cwd()}/server/archivos/reportesContratos/${req.params.file}`
      );
      res.download(archivo, req.params.file);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /list: Obtener lista de reportes de contratos
   *
   * @param pageSize y @param pageNumber
   *
   * @return lista de reportes de contratos @code 200 o mensaje @code 400
   */
  listarReportes: async (req, res) => {
    log.info("[GET] Petición para obtener lista de reportes de contratos");

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
      const reportesContratos = await ReporteContratos.paginate({}, options);
      res.status(200).send(reportesContratos);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code DELETE /delete: Eliminar un reporte de contratos
   *
   * @param id identificador del reporte
   *
   * @return mensaje de confirmación @code 200 o mensaje @code 400
   */
  eliminarReporte: async (req, res) => {
    log.info("[DELETE] Petición para eliminar reporte de contratos");

    //try {
    const reporte = await ReporteContratos.findById(req.params._id).exec();
    if (!reporte) {
      log.error("El reporte que se intentó eliminar no existe");
      return res.status(400).send({ message: "El reporte no existe" });
    }

    const ruta = reporte.reporte.split("/");
    const nombreArchivo = ruta[ruta.length - 1];

    const eliminarArchivo = eliminarArchivoReporte(
      "reportesContratos",
      nombreArchivo
    );
    if (!eliminarArchivo.eliminado) {
      log.error(`El reporte no se pudo eliminar ${eliminarArchivo.mensaje}`);
      return res
        .status(400)
        .send({ message: `El reporte no se pudo eliminar del servidor` });
    }

    const eliminarReporte = await ReporteContratos.findByIdAndDelete(
      req.params._id
    );
    if (!eliminarReporte) {
      log.error("El reporte no existe");
      return res.status(400).send({ message: "El reporte no existe" });
    }

    log.info("Se eliminó el reporte de contratos exitosamente");
    return res
      .status(200)
      .send({ message: "Se eliminó el reporte de contratos exitosamente" });
    // } catch (err) {
    //   httpError(res, err);
    // }
  },
};

module.exports = ReportesContratosController;
