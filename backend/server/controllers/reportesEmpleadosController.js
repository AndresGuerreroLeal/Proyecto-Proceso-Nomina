/**
 * Archivo de controlador para las funciones relacionadas con los reportes de empleados
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError.js");
const Empleado = require("../models/empleados.js");
const ReporteEmpleado = require("../models/reportesEmpleados.js");
const {
  crearArchivoReporte,
  eliminarArchivoReporte,
} = require("../helpers/funcionesReportes");
const path = require("path");
const ReportesEmpleadosController = {
  /**
   * @code POST / create : Crear un reporte de empleados
   *
   * @return archivo xlsx con los empleados @code 201 o mensaje @code 400
   */
  crearReporte: async (req, res) => {
    log.info("[GET] Petición de crear un reporte de empleados");
    try {
      const cantidadEmpleados = await Empleado.estimatedDocumentCount().exec();
      if (cantidadEmpleados < 1) {
        log.info("No hay empleados registrados para realizar un reporte");
        return res.status(400).send({
          message: "No hay empleados registrados para realizar un reporte",
        });
      }
      const empleados = await Empleado.find({})
        .sort({ estado: 1, createdAt: -1 })
        .exec();

      const columnas = [
        "Nombres",
        "Apellidos",
        "Tipo documento",
        "Numero documento",
        "Correo",
        "Numero celular",
        "Ciudad residencia",
        "Direccion residencia",
        "Metodo pago",
        "Entidad bancaria",
        "Tipo cuenta",
        "Numero cuenta",
        "Estado",
        "Concepto",
        "createdAt",
        "updatedAt",
      ];

      const fecha = Date.now();
      const fechaFormato = new Date(fecha).toISOString().split("T")[0];
      const nombre = "Reporte generado " + fechaFormato;

      const { reporteEstado, wb } = crearArchivoReporte(
        columnas,
        empleados,
        "reportesEmpleados",
        "Empleados",
        nombre
      );

      if (!reporteEstado.creado) {
        log.info(
          `No se pudo generar el reporte de empleados ${reporteEstado.error}`
        );
        return res
          .status(400)
          .send({ message: "No se pudo generar el reporte de empleados" });
      }

      const fechaInicio = empleados[0].createdAt;
      const fechaFinal = empleados[cantidadEmpleados - 1].createdAt;

      const url = req.protocol + "://" + req.get("host");
      const reporteUrl =
        url + "/api/1.0/report-employee/download/" + reporteEstado.nombre;

      const reporteEmpleado = new ReporteEmpleado({
        nombre,
        cantidad_empleados: cantidadEmpleados,
        fecha_inicio: fechaInicio.toISOString().split("T")[0],
        fecha_final: fechaFinal.toISOString().split("T")[0],
        reporte: reporteUrl,
      });

      await reporteEmpleado.save();

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
   * @code GET /download : Descargar archivo de reportes empleados
   *
   * @param file nombre de reporte con el cual se guardo en el servidor
   *
   * @return documento @code 200 o mensaje @code 400
   */
  descargarReporte: async (req, res) => {
    log.info("[GET] Petición para descargar reporte de empleados");

    try {
      const archivo = path.normalize(
        `${process.cwd()}/server/archivos/reportesEmpleados/${req.params.file}`
      );
      res.download(archivo, req.params.file);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /list: Obtener lista de reportes de empleados
   *
   * @param pageSize y @param pageNumber
   *
   * @return lista de reportes de empleados @code 200 o mensaje @code 400
   */
  listarReportes: async (req, res) => {
    log.info("[GET] Petición para obtener lista de reportes de empleados");

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
      const reportesEmpleados = await ReporteEmpleado.paginate({}, options);
      res.status(200).send(reportesEmpleados);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code DELETE /delete: Eliminar un reporte de empleados
   *
   * @param id identificador del reporte
   *
   * @return mensaje de confirmación @code 200 o mensaje @code 400
   */
  eliminarReporte: async (req, res) => {
    log.info("[DELETE] Petición para eliminar reporte de empleados");

    try {
      const reporte = await ReporteEmpleado.findById(req.params._id).exec();
      if (!reporte) {
        log.error("El reporte que se intentó eliminar no existe");
        return res.status(400).send({ message: "El reporte no existe" });
      }

      const ruta = reporte.reporte.split("/");
      const nombreArchivo = ruta[ruta.length - 1];

      const eliminarArchivo = eliminarArchivoReporte(
        "reportesEmpleados",
        nombreArchivo
      );
      if (!eliminarArchivo.eliminado) {
        log.error(`El reporte no se pudo eliminar ${eliminarArchivo.mensaje}`);
        return res
          .status(400)
          .send({ message: `El reporte no se pudo eliminar del servidor` });
      }

      const eliminarReporte = await ReporteEmpleado.findByIdAndDelete(
        req.params._id
      ).exec();
      if (!eliminarReporte) {
        log.error("El reporte no existe");
        return res.status(400).send({ message: "El reporte no existe" });
      }

      log.info("Se eliminó el reporte de empleados exitosamente");
      return res
        .status(200)
        .send({ message: "Se eliminó el reporte de empleados exitosamente" });
    } catch (err) {
      httpError(res, err);
    }
  },
};

module.exports = ReportesEmpleadosController;
