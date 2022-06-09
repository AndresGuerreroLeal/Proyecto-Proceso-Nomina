/**
 * Archivo de tests para nóminas
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { app, server } = require("../server/index");
const request = require("supertest");
const Usuario = require("../server/models/usuarios");
const Roles = require("../server/models/roles");
const Empleado = require("../server/models/empleados");
const Contrato = require("../server/models/contratos");

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

const empleado = {
  nombres: "Empleado1",
  apellidos: "Empleado1",
  tipo_documento: "CC",
  numero_documento: "1234567891",
  documento: "documentoPrimerEmpleado",
  correo: "correoPrimerEmpleado@gmail.com",
  numero_celular: "1234567891",
  ciudad_residencia: "Ciudad",
  direccion_residencia: "Carrera 1 Calle 1",
  metodo_pago: "Efectivo",
  entidad_bancaria: "Entidad Bancaria",
  tipo_cuenta: "Ahorros",
  numero_cuenta: "1234567891",
  estado: "ACTIVO",
  concepto: "Empleados creado",
};

const contrato = {
  numero_contrato: empleado.numero_documento,
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
    new Empleado(empleado).save(),
    new Contrato(contrato).save(),
  ]);
});

beforeEach(async () => {
  //Inicio de sesión y captura del token
  const response = await request(app).post("/api/1.0/auth").send(admin);
  jwt = await response.body.jwt;
});

describe("-----Test de listar información para nómina-----", () => {
  test("[GET] code 200 [/api/1.0/payroll/list-info] Test para listar datos de información de nómina", async () => {
    const response = await request(app)
      .get("/api/1.0/payroll/list-info?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.docs[0]._id);
    expect(response.body.docs[0].nombres).toBe(empleado.nombres);
    expect(response.body.docs[0].apellidos).toBe(empleado.apellidos);
    expect(response.body.docs[0].numero_contrato).toBe(
      contrato.numero_contrato
    );
    expect(response.body.docs[0].tipo_contrato).toBe(contrato.tipo_contrato);
    expect(response.body.docs[0].fecha_inicio.split("T")[0]).toBe(
      contrato.fecha_inicio
    );
    expect(response.body.docs[0].sueldo).toBe(contrato.sueldo);
    expect(response.body.docs[0].cargo).toBe(contrato.cargo);
    expect(response.body.docs[0].tipo_cotizante).toBe(contrato.tipo_cotizante);
    expect(response.body.docs[0].auxilio_transporte).toBe(
      contrato.auxilio_transporte
    );
    expect(response.body.docs[0].fondo_salud).toBe(contrato.fondo_salud);
    expect(response.body.docs[0].porcentaje_salud_empleado).toBe(
      contrato.porcentaje_salud_empleado
    );
    expect(response.body.docs[0].porcentaje_salud_empleador).toBe(
      porcentajeSaludEmpleador
    );
    expect(response.body.docs[0].fondo_pensiones).toBe(
      contrato.fondo_pensiones
    );
    expect(response.body.docs[0].porcentaje_pension_empleado).toBe(
      contrato.porcentaje_pension_empleado
    );
    expect(response.body.docs[0].porcentaje_pension_empleador).toBe(
      contrato.porcentaje_pension_empleador
    );
    expect(response.body.docs[0].arl).toBe(contrato.arl);
    expect(response.body.docs[0].porcentaje_arl).toBe(contrato.porcentaje_arl);
    expect(response.body.docs[0].fondo_cesantias).toBe(
      contrato.fondo_cesantias
    );
    expect(response.body.docs[0].porcentaje_parafiscal_sena).toBe(
      contrato.porcentaje_parafiscal_sena
    );
    expect(response.body.docs[0].porcentaje_parafiscal_icbf).toBe(
      contrato.porcentaje_parafiscal_icbf
    );
    expect(response.body.docs[0].porcentaje_parafiscal_caja_compensacion).toBe(
      contrato.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.docs[0].salario_integral).toBe(
      contrato.salario_integral
    );
    expect(response.body.docs[0].createdAt);
    expect(response.body.docs[0].updatedAt);
    expect(response.body.totalDocs).toBe(4);
    expect(response.body.limit).toBe(10);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.page).toBe(1);
    expect(response.body.pagingCounter).toBe(1);
    expect(response.body.hasPrevPage).toBe(false);
    expect(response.body.hasNextPage).toBe(false);
    expect(response.body.prevPage).toBe(null);
    expect(response.body.nextPage).toBe(null);
  });

  test("[GET code 400] [/api/1.0/payroll/list-info] Test para listar datos de información para nómina sin paginación", async () => {
    const response = await request(app)
      .get("/api/1.0/payroll/list-info")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No hay parametros de paginación");
  });
});

afterAll(async () => {
  await Promise.all([
    Usuario.deleteMany({ usuario: ["admin"] }),
    Roles.deleteMany({ _id: ["ADMIN", "REPORTS"] }),
    Empleado.deleteOne({
      correo: empleado.correo,
    }),
    Contrato.deleteMany({
      numero_contrato: [contrato.numero_contrato],
    }),
  ]);
  mongoose.connection.close();
  server.close();
});
