/**
 * Archivo de controlador para las funciones relacionadas con nóminas
 *
 * @author Juan-CamiloF
 */

const log = require("../config/logger");
const httpError = require("../helpers/handleError");
const Empleado = require("../models/empleados");
const Contrato = require("../models/contratos");
const NominaController = {
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
};

module.exports = NominaController;
