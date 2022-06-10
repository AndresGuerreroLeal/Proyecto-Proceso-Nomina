/**
 * Archivo de controlador para las funciones relacionadas con empleados
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError");
const Empleado = require("../models/empleados");
const Contrato = require("../models/contratos");
const validarDocumento = require("../validators/file");
const {
  subirDocumento,
  eliminarDocumento,
  existeDocumento,
} = require("../helpers/funcionesDocumentos");
const { emailRegistroEmpleado } = require("../helpers/enviarCorreos");
const fs = require("fs");
const path = require("path");
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
      }).exec();
      if (numeroDocumento) {
        log.error("Número de documento ya registrado");
        return res
          .status(400)
          .send({ message: "Número de documento ya registrado" });
      }

      //Validar correo
      const correo = await Empleado.findOne({ correo: req.body.correo }).exec();
      if (correo) {
        log.error("Correo ya registrado");
        return res.status(400).send({ message: "Correo ya registrado" });
      }

      //Validar número de celular
      const numeroCelular = await Empleado.findOne({
        numero_celular: req.body.numero_celular,
      }).exec();
      if (numeroCelular) {
        log.error("Número de celular ya registrado");
        return res
          .status(400)
          .send({ message: "Número de celular ya registrado" });
      }

      //Validar número de cuenta
      const numeroCuenta = await Empleado.findOne({
        numero_cuenta: req.body.numero_cuenta,
      }).exec();
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
        return res.status(400).send({
          message: `Error al guardar el archivo ${documentoInformacion.error}`,
        });
      }

      log.info("Documento subido al servidor con éxito");

      const url = req.protocol + "://" + req.get("host");

      const documentoUrl =
        url + "/api/1.0/employee/download/" + documentoInformacion.nombre;

      /* Crear empleado */
      const empleado = new Empleado({
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        tipo_documento: req.body.tipo_documento,
        numero_documento: req.body.numero_documento,
        genero: req.body.genero,
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
        concepto: "Empleado creado",
      });
      await empleado.save();

      //Función para enviar correo
      emailRegistroEmpleado(empleado.correo, empleado.nombres);

      log.info(`Empleado creado ${JSON.stringify(empleado)}`);
      return res.status(201).send(empleado);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /download : Descargar documento de un empleado
   *
   * @param file nombre del documento con el cual se guardo en el servidor
   *
   * @return documento @code 200 o mensaje @code 400
   */
  descargarDocumento: async (req, res) => {
    log.info("[GET] Petición para descargar documento de empleado");

    try {
      const archivo = path.normalize(
        `${process.cwd()}/server/archivos/documentos/${req.params.file}`
      );
      res.download(archivo, req.params.file);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /list-active : Obtener lista de empleados activos
   *
   * @param pageSize y @param pageNumber
   *
   * @return lista de empleados activos @code 200 o mensaje @code 400
   */
  listarActivos: async (req, res) => {
    log.info("[GET] Petición para obtener lista de empleados activos");

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
        sort: {
          numero_documento: 1,
        },
      };
      const empleados = await Empleado.paginate({ estado: "ACTIVO" }, options);
      return res.status(200).send(empleados);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET /list-inactive : Obtener lista de empleados inactivos
   *
   * @param pageSize y @param pageNumber
   *
   * @return lista de empleados inactivos @code 200 o mensaje @code 400
   */
  listarInactivos: async (req, res) => {
    log.info("[GET] Petición para obtener lista de empleados inactivos");

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
        sort: {
          numero_documento: 1,
        },
      };
      const empleados = await Empleado.paginate(
        { estado: "INACTIVO" },
        options
      );
      return res.status(200).send(empleados);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / employee : Obtener cantidad de empleados
   *
   * @returns cantidad empleados @code 200 o mensaje @code 400
   */
  cantidadEmpleados: async (req, res) => {
    log.info("[GET] Petición para obtener cantidad de empleados");

    try {
      const cantidadEmpleados = await Empleado.countDocuments().exec();
      const cantidadActivos = await Empleado.countDocuments({
        estado: "ACTIVO",
      }).exec();
      const cantidadInactivos = await Empleado.countDocuments({
        estado: "INACTIVO",
      }).exec();
      const cantidad = {
        cantidadEmpleados,
        cantidadActivos,
        cantidadInactivos,
      };
      return res.status(200).send(cantidad);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code PUT / update : Actualizar información de empleados
   *
   * @param empleado
   *
   * @return empleado actualizado @code 201 o mensaje @code 400
   */
  actualizarEmpleado: async (req, res) => {
    log.info("[PUT] Petición para actualizar información empleado");

    try {
      /* Validar información empleado */

      //Validar si existe el empleado
      const empleado = await Empleado.findById(req.body._id).exec();
      if (!empleado) {
        log.error("El empleado no existe");
        return res.status(400).send({ message: "El empleado no existe" });
      }

      //Validar si cambio de numero documento y que no exista
      if (empleado.numero_documento !== req.body.numero_documento) {
        const documentoExistente = await Empleado.findOne({
          numero_documento: req.body.numero_documento,
        }).exec();
        if (documentoExistente) {
          log.error("El nuevo número de documento ya está registrado");
          return res
            .status(400)
            .send({ message: "El número de documento ya está registrado" });
        }
      }

      //Validar si cambio el correo y que no exista
      let nuevoCorreo = false;
      if (empleado.correo !== req.body.correo) {
        const correoExistente = await Empleado.findOne({
          correo: req.body.correo,
        }).exec();
        if (correoExistente) {
          log.error("El nuevo correo ya está registrado");
          return res
            .status(400)
            .send({ message: "El correo ya está registrado" });
        } else {
          nuevoCorreo = true;
        }
      }

      //Validar si cambio el número de celular y que no existe
      if (empleado.numero_celular !== req.body.numero_celular) {
        const numeroExistente = await Empleado.findOne({
          numero_celular: req.body.numero_celular,
        }).exec();
        if (numeroExistente) {
          log.error("El nuevo número de celular ya está registrado");
          return res
            .status(400)
            .send({ message: "El número de celular ya está registrado" });
        }
      }

      //Validar si cambio el número de cuenta
      if (empleado.numero_cuenta !== req.body.numero_cuenta) {
        const cuentaExistente = await Empleado.findOne({
          numero_cuenta: req.body.numero_cuenta,
        }).exec();
        if (cuentaExistente) {
          log.error("El nuevo número de cuenta ya está registrado");
          return res
            .status(400)
            .send({ message: "El número de cuenta ya está registrado" });
        }
      }

      log.info("Información del empleado válida");

      /* Validar documento */

      let documentoUrl = "";
      //Validar si cambiaron nombres y apellidos pero no el archivo para cambiar el nombre
      const nuevo_archivo = req.body.nuevo_archivo === "true" ? true : false;
      if (
        (empleado.nombres !== req.body.nombres ||
          empleado.apellidos !== req.body.apellidos) &&
        !nuevo_archivo
      ) {
        //Datos del antiguo archivo
        const ruta = empleado.documento.split("/");
        const archivoViejo = ruta[ruta.length - 1];
        const extencionRuta = archivoViejo.split(".");
        const extencion = extencionRuta[extencionRuta.length - 1];

        //Cambiar nombres archivo
        const nombre = req.body.nombres + " " + req.body.apellidos;
        const archivo =
          nombre.split(" ").join("-") + "-" + Date.now() + "." + extencion;

        //Rutas de los archivos
        const pathViejo = path.normalize(
          `${process.cwd()}/server/archivos/documentos/${archivoViejo}`
        );
        const pathNuevo = path.normalize(
          `${process.cwd()}/server/archivos/documentos/${archivo}`
        );

        //Validar si existe el archivo viejo
        if (!existeDocumento(pathViejo)) {
          log.error("El archivo anterior no existe");
          return res
            .status(400)
            .send({ message: "El archivo anterior no existe" });
        }
        //Renombrar el nombre del archivo
        fs.rename(pathViejo, pathNuevo, (err) => {
          if (err) throw err;
          log.info("Archivo renombrado");
        });
        const url = req.protocol + "://" + req.get("host");
        documentoUrl = url + "/api/1.0/employee/download/" + archivo;
      }

      //Si es un nuevo archivo
      if (nuevo_archivo) {
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

        const rutaDocumento = req.body.documento.split("/");
        const archivoViejo = rutaDocumento[rutaDocumento.length - 1];
        const pathViejo = path.normalize(
          `${process.cwd()}/server/archivos/documentos/${archivoViejo}`
        );
        //Validar si existe el archivo viejo
        if (!existeDocumento(pathViejo)) {
          log.error("El archivo anterior no existe");
          return res
            .status(400)
            .send({ message: "El archivo anterior no existe" });
        }
        const documentoEliminado = eliminarDocumento(archivoViejo);
        if (!documentoEliminado.eliminado) {
          log.error(`Error al eliminar ${documentoEliminado.error}`);
          return res.status(400).send({
            message: `Error al eliminar ${documentoEliminado.error}`,
          });
        }

        log.info("Documento subido al servidor con éxito");

        const url = req.protocol + "://" + req.get("host");

        documentoUrl =
          url + "/api/1.0/employee/download/" + documentoInformacion.nombre;
      }
      //Si no cambian nombres ni documento
      if (
        empleado.nombres === req.body.nombres &&
        empleado.apellidos === req.body.apellidos &&
        !nuevo_archivo
      ) {
        documentoUrl = req.body.documento;
      }

      /* Actualizar empleado */
      const nuevoEmpleado = await Empleado.findByIdAndUpdate(
        req.body._id,
        {
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
        },
        { new: true }
      ).exec();

      log.info(
        `Nueva información del empleado ${JSON.stringify(nuevoEmpleado)}`
      );

      //Función enviar correo
      if (nuevoCorreo)
        emailRegistroEmpleado(nuevoEmpleado.correo, nuevoEmpleado.nombres);

      return res.status(201).send(nuevoEmpleado);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code PUT / update-state/:_id : Actualizar estado de empleados
   *
   * @param idEmpleado
   *
   * @return empleado actualizado @code 201 o mensaje @code 400
   */
  estadoEmpleado: async (req, res) => {
    log.info("[PUT] Petición cambiar estado empleado");

    try {
      let mensaje = {
        empleado: "",
        mensajeEmpleado: "",
        contrato: "",
        mensajeContrato: "",
      };
      const empleado = await Empleado.findById(req.params._id).exec();
      if (!empleado) {
        log.error("El empleado no existe");
        return res.status(400).send({ message: "El empleado no existe" });
      }
      let nuevoEstado = "";
      if (empleado.estado === "ACTIVO") {
        nuevoEstado = "INACTIVO";
      } else if (empleado.estado === "INACTIVO") {
        nuevoEstado = "ACTIVO";
      }

      const empleadoActualizado = await Empleado.findByIdAndUpdate(
        req.params._id,
        {
          estado: nuevoEstado,
          concepto: req.body.concepto,
        },
        { new: true }
      ).exec();
      log.info(
        `Estado del empleado actualizado ${JSON.stringify(empleadoActualizado)}`
      );
      mensaje.mensajeEmpleado = "Estado del empleado actualizado";
      mensaje.empleado = empleadoActualizado;
      const contrato = await Contrato.findOne({
        numero_contrato: empleado.numero_documento,
      }).exec();

      if (!contrato) {
        log.info("El empleado no tiene un contrato definido");
        mensaje.mensajeContrato = "El empleado no tiene un contrato definido";
        mensaje.contrato = null;
      } else {
        const contratoActualizar = await Contrato.findByIdAndUpdate(
          contrato._id,
          {
            estado: nuevoEstado,
          },
          { new: true }
        ).exec();
        mensaje.mensajeContrato = "Estado del contrato actualizado";
        mensaje.contrato = contratoActualizar;
      }

      return res.status(201).send(mensaje);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / :_id : Obtener empleados
   *
   * @param idEmpleado
   *
   * @return empleado @code 200 o mensaje @code 400
   */
  obtenerEmpleado: async (req, res) => {
    log.info("[GET] Petición obtener empleado");
    try {
      const empleado = await Empleado.findById(req.params._id).exec();
      if (!empleado) {
        log.error("El empleado no existe");
        return res.status(400).send({ message: "El empleado no existe" });
      }
      log.info(`Detalles del empleado ${JSON.stringify(empleado)}`);
      return res.status(200).send(empleado);
    } catch (err) {
      httpError(res, err);
    }
  },

  /**
   * @code GET / without-contract : Obtener empleados sin contrato
   *
   * @return empleados @code 200 o mensaje @code 400
   */
  empleadosSinContrato: async (req, res) => {
    log.info("[GET] Petición para obtener empleados sin contrato");

    const empleados = await Empleado.find({});
    const empleadosSinContrato = [];
    for (const empleado of empleados) {
      const contrato = await Contrato.findOne({
        numero_contrato: empleado.numero_documento,
        estado: "ACTIVO",
      });
      if (!contrato) empleadosSinContrato.push(empleado);
    }
    return res.status(200).send(empleadosSinContrato);
  },
};

module.exports = EmpleadosController;
