/**
 * Archivo de test para reportes contratos
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { app, server } = require("../server/index");
const request = require("supertest");
const Usuario = require("../server/models/usuarios");
const Roles = require("../server/models/roles");
const Contratos = require("../server/models/contratos");
const ReportesContratos = require("../server/models/reportesContratos");

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

const contrato1 = {
  numero_contrato: "1234567891",
  tipo_contrato: "Tipo de contrato",
  fecha_inicio: "2022-02-02",
  sueldo: 1000000,
  cargo: "Tester",
  tipo_cotizante: "Dependientte",
  auxilio_transporte: 117172,
  fondo_salud: "Fondo de salud",
  porcentaje_salud_empleado: 4,
  porcentaje_salud_empleador: 0,
  aportes_salud_empleado: 40000,
  aportes_salud_empleador: 0,
  fondo_pensiones: "Fondo de pensiones",
  porcentaje_pension_empleado: 4,
  porcentaje_pension_empleador: 12,
  aportes_pension_empleado: 40000,
  aportes_pension_empleador: 120000,
  arl: "Arl",
  porcentaje_arl: 0.522,
  valor_arl: 5220,
  valor_prima_servicios: 93098,
  fondo_cesantias: "Fondo de cesantias",
  valor_cesantias: 93098,
  valor_intereses_cesantias: 11172,
  valor_vacaciones: 41667,
  porcentaje_parafiscal_sena: 0,
  valor_parafiscal_sena: 0,
  porcentaje_parafiscal_icbf: 0,
  valor_parafiscal_icbf: 0,
  porcentaje_parafiscal_caja_compensacion: 4,
  valor_parafiscal_caja_compensacion: 40000,
  total_devengos: 1037172,
  total_deducciones: 80000,
  total_valor_empleado: 1521427,
  salario_integral: false,
  estado: "ACTIVO",
};

const contrato2 = {
  numero_contrato: "1234567892",
  tipo_contrato: "Tipo de contrato",
  fecha_inicio: "2022-02-02",
  sueldo: 1000000,
  cargo: "Tester",
  tipo_cotizante: "Dependientte",
  auxilio_transporte: 117172,
  fondo_salud: "Fondo de salud",
  porcentaje_salud_empleado: 4,
  porcentaje_salud_empleador: 0,
  aportes_salud_empleado: 40000,
  aportes_salud_empleador: 0,
  fondo_pensiones: "Fondo de pensiones",
  porcentaje_pension_empleado: 4,
  porcentaje_pension_empleador: 12,
  aportes_pension_empleado: 40000,
  aportes_pension_empleador: 120000,
  arl: "Arl",
  porcentaje_arl: 0.522,
  valor_arl: 5220,
  valor_prima_servicios: 93098,
  fondo_cesantias: "Fondo de cesantias",
  valor_cesantias: 93098,
  valor_intereses_cesantias: 11172,
  valor_vacaciones: 41667,
  porcentaje_parafiscal_sena: 0,
  valor_parafiscal_sena: 0,
  porcentaje_parafiscal_icbf: 0,
  valor_parafiscal_icbf: 0,
  porcentaje_parafiscal_caja_compensacion: 4,
  valor_parafiscal_caja_compensacion: 40000,
  total_devengos: 1037172,
  total_deducciones: 80000,
  total_valor_empleado: 1521427,
  salario_integral: false,
  estado: "ACTIVO",
};

const contrato3 = {
  numero_contrato: "1234567893",
  tipo_contrato: "Tipo de contrato",
  fecha_inicio: "2022-02-02",
  sueldo: 1000000,
  cargo: "Tester",
  tipo_cotizante: "Dependientte",
  auxilio_transporte: 117172,
  fondo_salud: "Fondo de salud",
  porcentaje_salud_empleado: 4,
  porcentaje_salud_empleador: 0,
  aportes_salud_empleado: 40000,
  aportes_salud_empleador: 0,
  fondo_pensiones: "Fondo de pensiones",
  porcentaje_pension_empleado: 4,
  porcentaje_pension_empleador: 12,
  aportes_pension_empleado: 40000,
  aportes_pension_empleador: 120000,
  arl: "Arl",
  porcentaje_arl: 0.522,
  valor_arl: 5220,
  valor_prima_servicios: 93098,
  fondo_cesantias: "Fondo de cesantias",
  valor_cesantias: 93098,
  valor_intereses_cesantias: 11172,
  valor_vacaciones: 41667,
  porcentaje_parafiscal_sena: 0,
  valor_parafiscal_sena: 0,
  porcentaje_parafiscal_icbf: 0,
  valor_parafiscal_icbf: 0,
  porcentaje_parafiscal_caja_compensacion: 4,
  valor_parafiscal_caja_compensacion: 40000,
  total_devengos: 1037172,
  total_deducciones: 80000,
  total_valor_empleado: 1521427,
  salario_integral: false,
  estado: "ACTIVO",
};

let jwt;
let datosReporte;
let _id;

const fecha = Date.now();
const fechaActual = new Date(fecha).toISOString().split("T")[0];
beforeAll(async () => {
  await Promise.all([
    new Roles({ _id: "ADMIN" }).save(),
    new Roles({ _id: "REPORTS" }).save(),
    new Usuario({
      nombre: process.env.NOMBRE,
      correo: process.env.CORREO_ADMIN,
      usuario: "admin",
      roles: ["ADMIN", "REPORTS"],
      contrasenia:
        "$2a$10$mC77qjUBQz5SiyZ1jtcHa.2GKrJ/PgKFw7Q19ahCeoCHJKqefCCOq",
      ultimoAcceso: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save(),
    new Contratos(contrato1).save(),
    new Contratos(contrato2).save(),
    new Contratos(contrato3).save(),
  ]);
});

describe("-----Test de endpoint de crear reporte-----", () => {
  test("[GET code 201] [/api/1.0/report-contract/create] Test para crear un reporte de contratos", async () => {
    const response = await request(app)
      .get("/api/1.0/report-contract/create")
      .set("Authorization", `Bearer ${jwt}`);
    const dbReportes = await ReportesContratos.find().exec();
    datosReporte = dbReportes[0];
    _id = datosReporte._id;
    expect(response.status).toBe(201);
    expect(dbReportes.length).toBe(1);
    expect(datosReporte._id);
    expect(datosReporte.nombre).toBe(`Reporte generado ${fechaActual}`);
    expect(datosReporte.cantidad_contratos).toBe(3);
    expect(datosReporte.fecha_inicio.toISOString().split("T")[0]).toBe(
      fechaActual
    );
    expect(datosReporte.fecha_final.toISOString().split("T")[0]).toBe(
      fechaActual
    );
    expect(datosReporte.reporte);
  });
});

describe("-----Test de endpoint de listar reportes-----", () => {
  test("[GET code 200] [/api/1.0/report-contract/list] Test de listar reportes de empleados", async () => {
    const response = await request(app)
      .get("/api/1.0/report-contract/list?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.body.docs[0]._id);
    expect(response.body.docs[0].nombre).toBe(datosReporte.nombre);
    expect(response.body.docs[0].cantidad_empleados).toBe(
      datosReporte.cantidad_empleados
    );
    expect(response.body.docs[0].fecha_inicio).toBe(
      datosReporte.fecha_inicio.toISOString()
    );
    expect(response.body.docs[0].fecha_final).toBe(
      datosReporte.fecha_final.toISOString()
    );
    expect(response.body.docs[0].reporte).toBe(datosReporte.reporte);
    expect(response.body.totalDocs).toBe(1);
    expect(response.body.limit).toBe(10);
    expect(response.body.page).toBe(1);
    expect(response.body.pagingCounter).toBe(1);
    expect(response.body.hasPrevPage).toBe(false);
    expect(response.body.hasNextPage).toBe(false);
    expect(response.body.prevPage).toBe(null);
    expect(response.body.nextPage).toBe(null);
  });
});

describe("-----Test de endpoint de NO crear reporte-----", () => {
  test("[GET code 400] [/api/1.0/report-contract/create] Test para no crear un reporte de empleados", async () => {
    await Promise.resolve(
      Contratos.deleteMany({
        numero_contrato: [
          contrato1.numero_contrato,
          contrato2.numero_contrato,
          contrato3.numero_contrato,
        ],
      })
    );
    const response = await request(app)
      .get("/api/1.0/report-contract/create")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No hay contratos registrados para realizar un reporte"
    );
  });
});

describe("-----Test de endpoint de eliminar reportes-----", () => {
  test("[DELETE code 200] [/api/1.0/report-contract/delete/:_id] Test para eliminar un reporte existente", async () => {
    const response = await request(app)
      .delete(`/api/1.0/report-contract/delete/${_id}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Se eliminó el reporte de contratos exitosamente"
    );
  });
  
  test("[DELETE code 400] [/api/1.0/report-contract/delete/:_id] Test para eliminar un reporte NO existente", async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/1.0/report-contract/delete/${idInexistente}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El reporte no existe");
  });
});

beforeEach(async () => {
  //Inicio de sesión y captura del token
  const response = await request(app).post("/api/1.0/auth").send(admin);
  jwt = await response.body.jwt;
});

afterAll(async () => {
  await Promise.all([
    Usuario.deleteMany({ usuario: ["admin"] }),
    Roles.deleteMany({ _id: ["ADMIN", "REPORTS"] }),
  ]);
  mongoose.connection.close();
  server.close();
});
