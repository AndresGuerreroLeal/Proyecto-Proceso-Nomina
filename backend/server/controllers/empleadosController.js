/**
 * Archivo de controlador para todo lo relacionado con empleados
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError");
const { Empleado } = require("../models/empleados");
const validarDocumento = require("../validators/file");
const subirDocumento = require("../helpers/subirDocumento");
const EmpleadosController = {
  /**
   * @code POST /create : Crear un empleado
   *
   * @param empleado
   *
   * @return empleado @code 201 o mensaje @code 400
   */
  crearEmpleado: async (req, res) => {
    log.info("[POST] Petición de crear un empleado");
    try {
      /* Validar información del empleado */

      //Validar número de documento
      const numeroDocumento = await Empleado.findOne({
        numero_documento: req.body.numero_documento,
      });
      if (numeroDocumento) {
        log.error("Número de documento ya registrado");
        return res
          .status(400)
          .send({ message: "Número de documento ya registrado" });
      }

      //Validar correo
      const correo = await Empleado.findOne({ correo: req.body.correo });
      if (correo) {
        log.error("Correo ya registrado");
        return res.status(400).send({ message: "Correo ya registrado" });
      }

      //Validar número de celular
      const numeroCelular = await Empleado.findOne({
        numero_celular: req.body.numero_celular,
      });
      if (numeroCelular) {
        log.error("Número de celular ya registrado");
        return res
          .status(400)
          .send({ message: "Número de celular ya registrado" });
      }

      //Validar número de cuenta
      const numeroCuenta = await Empleado.findOne({
        numero_cuenta: req.body.numero_cuenta,
      });
      if (numeroCuenta) {
        log.error("Número de cuenta ya registrado");
        return res
          .status(400)
          .send({ message: "Número de cuenta ya registrado" });
      }

      log.info("Información del empleado válida");

      /* Validar documento */
      if (!req.files || !req.files.file) {
        log.error("Se trato de registrar un empleado sin documento");
        return res.status(400).send({ message: "Documento requerido" });
      }

      const documento = req.files.file;
      const archivoValido = validarDocumento(documento);

      if (!archivoValido.booleano) {
        log.error(`${archivoValido.mensaje}`);
        return res.status(400).send({ message: `${archivoValido.mensaje}` });
      }

      /* Subir documento */
      const nombre = req.body.nombres + " " + req.body.apellidos;
      const documentoInformacion = subirDocumento(nombre, documento);

      if (!documentoInformacion.valido) {
        log.info(`Error al guardar el archivo ${documentoInformacion.error}`);
      }

      log.info("Documento subido al servidor con éxito");

      const url = req.protocol + "://" + req.get("host");

      const documentoUrl =
        url + "/api/1.0/employee/download/" + documentoInformacion.nombre;

      const empleado = new Empleado({
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        tipo_documento: req.body.tipo_documento,
        numero_documento: req.body.numero_documento,
        documento: documentoUrl,
        correo: req.body.correo,
        numero_celular: req.body.numero_celular,
        ciudad_residencia: req.body.ciudad_residencia,
        direccion_residencia: req.body.direccion_residencia,
        metodo_pago: req.body.metodo_pago,
        entidad_bancaria: req.body.entidad_bancaria,
        tipo_cuenta: req.body.tipo_cuenta,
        numero_cuenta: req.body.numero_cuenta,
        estado: "ACTIVO",
        concepto: `Empleado creado`,
      });
      await empleado.save();

      log.info(`Empleado creado ${JSON.stringify(empleado)}`);
      return res.status(201).send(empleado);
    } catch (err) {
      httpError(res, err);
    }
  },
  /**
   * @code GET /create : Descargar documento de un empleado
   *
   * @param nombreArchivo
   *
   * @return documento @code 200 o mensaje @code 400
   */
  descargarArchivo: async (req, res) => {
    log.info("[GET] Petición para descargar documento de empleado");
    try {
      const archivo = `${__dirname}/../archivos/documentos/${req.params.file}`;
      res.download(archivo, req.params.file);
    } catch (err) {
      httpError(res, err);
    }
  },
};

module.exports = EmpleadosController;
