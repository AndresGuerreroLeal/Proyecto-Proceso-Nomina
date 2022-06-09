/**
 * Archivo de tests para contratos
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
const calculosNominaTest = require("./calculosNominaTest");

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

let jwt;
let _id;
let idEmpleado;

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

let contrato = {
  numero_contrato: empleado.numero_documento,
  tipo_contrato: "Tipo de contrato",
  fecha_inicio: "2022-02-02",
  sueldo: 1000000,
  cargo: "Tester",
  tipo_cotizante: "Dependientte",
  auxilio_transporte: 117172,
  fondo_salud: "Fondo de salud",
  porcentaje_salud_empleado: 4,
  porcentaje_salud_empleador: 8.5,
  fondo_pensiones: "Fondo de pensiones",
  porcentaje_pension_empleado: 4,
  porcentaje_pension_empleador: 12,
  arl: "Arl",
  porcentaje_arl: 0.522,
  fondo_cesantias: "Fondo de cesantias",
  porcentaje_parafiscal_sena: 0,
  porcentaje_parafiscal_icbf: 0,
  porcentaje_parafiscal_caja_compensacion: 4,
  salario_integral: false,
};

let contratoCreado = {
  _id: "",
  ...contrato,
};
let contratoInvalido = {
  _id: "",
  ...contrato,
};

const contrato1 = {
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

const contrato2 = {
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
const contrato3 = {
  numero_contrato: "1234567894",
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

/* Cálculos de valores del contrato para nómina */

const informacionContrato = calculosNominaTest(contrato);

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
    new Contrato(contrato1).save(),
    new Contrato(contrato2).save(),
    new Contrato(contrato3).save(),
  ]);
});

beforeEach(async () => {
  //Inicio de sesión y captura del token
  const response = await request(app).post("/api/1.0/auth").send(admin);
  jwt = await response.body.jwt;
});

describe("-----Test de endpoint de crear un contrato-----", () => {
  test("[POST code 201] [/api/1.0/contract/create] Test de crear un contrato válido", async () => {
    const response = await request(app)
      .post("/api/1.0/contract/create")
      .send(contrato)
      .set("Authorization", `Bearer ${jwt}`);
    _id = response.body._id;
    contratoCreado._id = _id;
    contratoInvalido._id = _id;
    expect(response.status).toBe(201);
    expect(response.body._id);
    expect(response.body.numero_contrato).toBe(empleado.numero_documento);
    expect(response.body.tipo_contrato).toBe(contrato.tipo_contrato);
    expect(response.body.fecha_inicio).toBe(
      contrato.fecha_inicio + "T00:00:00.000Z"
    );
    expect(response.body.sueldo).toBe(contrato.sueldo);
    expect(response.body.cargo).toBe(contrato.cargo);
    expect(response.body.tipo_cotizante).toBe(contrato.tipo_cotizante);
    expect(response.body.auxilio_transporte).toBe(contrato.auxilio_transporte);
    expect(response.body.fondo_salud).toBe(contrato.fondo_salud);
    expect(response.body.porcentaje_salud_empleado).toBe(
      contrato.porcentaje_salud_empleado
    );
    expect(response.body.porcentaje_salud_empleador).toBe(
      informacionContrato.porcentajeSaludEmpleador
    );
    expect(response.body.aportes_salud_empleado).toBe(
      informacionContrato.aportesSaludEmpleado
    );
    expect(response.body.aportes_salud_empleador).toBe(
      informacionContrato.aportesSaludEmpleador
    );
    expect(response.body.fondo_pensiones).toBe(contrato.fondo_pensiones);
    expect(response.body.porcentaje_pension_empleado).toBe(
      contrato.porcentaje_pension_empleado
    );
    expect(response.body.porcentaje_pension_empleador).toBe(
      contrato.porcentaje_pension_empleador
    );
    expect(response.body.aportes_pension_empleado).toBe(
      informacionContrato.aportesPensionEmpleado
    );
    expect(response.body.aportes_pension_empleador).toBe(
      informacionContrato.aportesPensionEmpleador
    );
    expect(response.body.arl).toBe(contrato.arl);
    expect(response.body.porcentaje_arl).toBe(contrato.porcentaje_arl);
    expect(response.body.valor_arl).toBe(informacionContrato.valorArl);
    expect(response.body.valor_prima_servicios).toBe(
      informacionContrato.valorPrimaServicios
    );
    expect(response.body.fondo_cesantias).toBe(contrato.fondo_cesantias);
    expect(response.body.valor_cesantias).toBe(
      informacionContrato.valorCesantias
    );
    expect(response.body.valor_intereses_cesantias).toBe(
      informacionContrato.valorInteresesCesantias
    );
    expect(response.body.valor_vacaciones).toBe(
      informacionContrato.valorVacaciones
    );
    expect(response.body.porcentaje_parafiscal_sena).toBe(
      informacionContrato.porcentajeParafiscalSENA
    );
    expect(response.body.valor_parafiscal_sena).toBe(
      informacionContrato.valorParafiscalSENA
    );
    expect(response.body.porcentaje_parafiscal_icbf).toBe(
      informacionContrato.porcentajeParafiscalICBF
    );
    expect(response.body.valor_parafiscal_icbf).toBe(
      informacionContrato.valorParafiscalICBF
    );
    expect(response.body.porcentaje_parafiscal_caja_compensacion).toBe(
      contrato.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.valor_parafiscal_caja_compensacion).toBe(
      informacionContrato.valorParafiscalCajaCompesacion
    );
    expect(response.body.total_devengos).toBe(
      informacionContrato.totalDevengos
    );
    expect(response.body.total_deducciones).toBe(
      informacionContrato.totalDeducciones
    );
    expect(response.body.total_valor_empleado).toBe(
      informacionContrato.totalValorEmpleado
    );
    expect(response.body.salario_integral).toBe(contrato.salario_integral);
    expect(response.body.estado).toBe("ACTIVO");
  });

  test("[POST code 400] [/api/1.0/contract/create] Test para crear un contrato con un número de contrato registrado", async () => {
    const response = await request(app)
      .post("/api/1.0/contract/create")
      .send(contrato)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El número de contrato ya fue registrado"
    );
  });

  test("[POST code 400] [/api/1.0/contract/create] Test para crear un contrato sin un empleado relacionado", async () => {
    let contratoIdInvalido = Object.assign({}, contrato);
    contratoIdInvalido.numero_contrato = "1111111111";
    const response = await request(app)
      .post("/api/1.0/contract/create")
      .send(contratoIdInvalido)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El contrato no tiene un empleado definido"
    );
  });
});

describe("-----Test de endpoint de listar contratos-----", () => {
  test("[GET code 200] [/api/1.0/contract/list] Test de listar contratos cantidad[1] ", async () => {
    const response = await request(app)
      .get("/api/1.0/contract/list?pageSize=10&pageNumber=1")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.docs[0]._id).toBe(_id);
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
      informacionContrato.porcentajeSaludEmpleador
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

  test("[GET code 200] [/api/1.0/contract/list] Test de listar contratos cantidad[3] ", async () => {
    const response = await request(app)
      .get("/api/1.0/contract/list?pageSize=10&pageNumber=1")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    //Contrato posición 1
    expect(response.body.docs[1]._id);
    expect(response.body.docs[1].numero_contrato).toBe(
      contrato1.numero_contrato
    );
    expect(response.body.docs[1].tipo_contrato).toBe(contrato1.tipo_contrato);
    expect(response.body.docs[1].fecha_inicio.split("T")[0]).toBe(
      contrato1.fecha_inicio
    );
    expect(response.body.docs[1].sueldo).toBe(contrato1.sueldo);
    expect(response.body.docs[1].cargo).toBe(contrato1.cargo);
    expect(response.body.docs[1].tipo_cotizante).toBe(contrato1.tipo_cotizante);
    expect(response.body.docs[1].auxilio_transporte).toBe(
      contrato1.auxilio_transporte
    );
    expect(response.body.docs[1].fondo_salud).toBe(contrato1.fondo_salud);
    expect(response.body.docs[1].porcentaje_salud_empleado).toBe(
      contrato1.porcentaje_salud_empleado
    );
    expect(response.body.docs[1].porcentaje_salud_empleador).toBe(
      informacionContrato.porcentajeSaludEmpleador
    );
    expect(response.body.docs[1].fondo_pensiones).toBe(
      contrato1.fondo_pensiones
    );
    expect(response.body.docs[1].porcentaje_pension_empleado).toBe(
      contrato1.porcentaje_pension_empleado
    );
    expect(response.body.docs[1].porcentaje_pension_empleador).toBe(
      contrato1.porcentaje_pension_empleador
    );
    expect(response.body.docs[1].arl).toBe(contrato1.arl);
    expect(response.body.docs[1].porcentaje_arl).toBe(contrato1.porcentaje_arl);
    expect(response.body.docs[1].fondo_cesantias).toBe(
      contrato1.fondo_cesantias
    );
    expect(response.body.docs[1].porcentaje_parafiscal_sena).toBe(
      contrato1.porcentaje_parafiscal_sena
    );
    expect(response.body.docs[1].porcentaje_parafiscal_icbf).toBe(
      contrato1.porcentaje_parafiscal_icbf
    );
    expect(response.body.docs[1].porcentaje_parafiscal_caja_compensacion).toBe(
      contrato1.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.docs[1].salario_integral).toBe(
      contrato1.salario_integral
    );
    expect(response.body.docs[1].createdAt);
    expect(response.body.docs[1].updatedAt);
    //Contrato posición 2
    expect(response.body.docs[2]._id);
    expect(response.body.docs[2].numero_contrato).toBe(
      contrato2.numero_contrato
    );
    expect(response.body.docs[2].tipo_contrato).toBe(contrato2.tipo_contrato);
    expect(response.body.docs[2].fecha_inicio.split("T")[0]).toBe(
      contrato2.fecha_inicio
    );
    expect(response.body.docs[2].sueldo).toBe(contrato2.sueldo);
    expect(response.body.docs[2].cargo).toBe(contrato2.cargo);
    expect(response.body.docs[2].tipo_cotizante).toBe(contrato2.tipo_cotizante);
    expect(response.body.docs[2].auxilio_transporte).toBe(
      contrato2.auxilio_transporte
    );
    expect(response.body.docs[2].fondo_salud).toBe(contrato2.fondo_salud);
    expect(response.body.docs[2].porcentaje_salud_empleado).toBe(
      contrato2.porcentaje_salud_empleado
    );
    expect(response.body.docs[2].porcentaje_salud_empleador).toBe(
      informacionContrato.porcentajeSaludEmpleador
    );
    expect(response.body.docs[2].fondo_pensiones).toBe(
      contrato2.fondo_pensiones
    );
    expect(response.body.docs[2].porcentaje_pension_empleado).toBe(
      contrato2.porcentaje_pension_empleado
    );
    expect(response.body.docs[2].porcentaje_pension_empleador).toBe(
      contrato1.porcentaje_pension_empleador
    );
    expect(response.body.docs[2].arl).toBe(contrato2.arl);
    expect(response.body.docs[2].porcentaje_arl).toBe(contrato2.porcentaje_arl);
    expect(response.body.docs[2].fondo_cesantias).toBe(
      contrato2.fondo_cesantias
    );
    expect(response.body.docs[2].porcentaje_parafiscal_sena).toBe(
      contrato2.porcentaje_parafiscal_sena
    );
    expect(response.body.docs[2].porcentaje_parafiscal_icbf).toBe(
      contrato2.porcentaje_parafiscal_icbf
    );
    expect(response.body.docs[2].porcentaje_parafiscal_caja_compensacion).toBe(
      contrato2.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.docs[2].salario_integral).toBe(
      contrato2.salario_integral
    );
    expect(response.body.docs[2].createdAt);
    expect(response.body.docs[2].updatedAt);
    //Contrato posición 3
    expect(response.body.docs[3]._id);
    expect(response.body.docs[3].numero_contrato).toBe(
      contrato3.numero_contrato
    );
    expect(response.body.docs[3].tipo_contrato).toBe(contrato3.tipo_contrato);
    expect(response.body.docs[3].fecha_inicio.split("T")[0]).toBe(
      contrato3.fecha_inicio
    );
    expect(response.body.docs[3].sueldo).toBe(contrato3.sueldo);
    expect(response.body.docs[3].cargo).toBe(contrato3.cargo);
    expect(response.body.docs[3].tipo_cotizante).toBe(contrato3.tipo_cotizante);
    expect(response.body.docs[3].auxilio_transporte).toBe(
      contrato3.auxilio_transporte
    );
    expect(response.body.docs[3].fondo_salud).toBe(contrato3.fondo_salud);
    expect(response.body.docs[3].porcentaje_salud_empleado).toBe(
      contrato3.porcentaje_salud_empleado
    );
    expect(response.body.docs[3].porcentaje_salud_empleador).toBe(
      informacionContrato.porcentajeSaludEmpleador
    );
    expect(response.body.docs[3].fondo_pensiones).toBe(
      contrato3.fondo_pensiones
    );
    expect(response.body.docs[3].porcentaje_pension_empleado).toBe(
      contrato3.porcentaje_pension_empleado
    );
    expect(response.body.docs[3].porcentaje_pension_empleador).toBe(
      contrato3.porcentaje_pension_empleador
    );
    expect(response.body.docs[3].arl).toBe(contrato3.arl);
    expect(response.body.docs[3].porcentaje_arl).toBe(contrato3.porcentaje_arl);
    expect(response.body.docs[3].fondo_cesantias).toBe(
      contrato3.fondo_cesantias
    );
    expect(response.body.docs[3].porcentaje_parafiscal_sena).toBe(
      contrato3.porcentaje_parafiscal_sena
    );
    expect(response.body.docs[3].porcentaje_parafiscal_icbf).toBe(
      contrato3.porcentaje_parafiscal_icbf
    );
    expect(response.body.docs[3].porcentaje_parafiscal_caja_compensacion).toBe(
      contrato3.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.docs[3].salario_integral).toBe(
      contrato3.salario_integral
    );
    expect(response.body.docs[3].createdAt);
    expect(response.body.docs[3].updatedAt);

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

  test("[GET code 400] [/api/1.0/contract/list] Test de listar contratos sin datos de paginación", async () => {
    const response = await request(app)
      .get("/api/1.0/contract/list")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No hay parametros de paginación");
  });
});

describe("-----Test de endpoint de cantidad contratos-----", () => {
  test("[GET code 200] [/api/1.0/contract/] Test de obtener cantidad de contratos", async () => {
    const response = await request(app)
      .get("/api/1.0/contract/")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.cantidadContratos).toBe(4);
    expect(response.body.contratosActivos).toBe(4);
    expect(response.body.contratosInactivos).toBe(0);
  });
});

describe("-----Test de endpoint para actualizar información de un contrato-----", () => {
  contratoCreado.salario = 1500000;
  contratoCreado.tipo_contrato = "Nuevo tipo contrato";

  const informacionContratoActualizado = calculosNominaTest(contratoCreado);

  test("[PUT code 201] [/api/1.0/contract/update] Test de actualizar la información de un contrato de manera válida", async () => {
    const response = await request(app)
      .put("/api/1.0/contract/update")
      .send(contratoCreado)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(201);
    expect(response.body._id);
    expect(response.body.numero_contrato).toBe(empleado.numero_documento);
    expect(response.body.tipo_contrato).toBe(contratoCreado.tipo_contrato);
    expect(response.body.fecha_inicio).toBe(
      contrato.fecha_inicio + "T00:00:00.000Z"
    );
    expect(response.body.sueldo).toBe(contratoCreado.sueldo);
    expect(response.body.cargo).toBe(contrato.cargo);
    expect(response.body.tipo_cotizante).toBe(contrato.tipo_cotizante);
    expect(response.body.auxilio_transporte).toBe(contrato.auxilio_transporte);
    expect(response.body.fondo_salud).toBe(contrato.fondo_salud);
    expect(response.body.porcentaje_salud_empleado).toBe(
      contrato.porcentaje_salud_empleado
    );
    expect(response.body.porcentaje_salud_empleador).toBe(
      informacionContratoActualizado.porcentajeSaludEmpleador
    );
    expect(response.body.aportes_salud_empleado).toBe(
      informacionContratoActualizado.aportesSaludEmpleado
    );
    expect(response.body.aportes_salud_empleador).toBe(
      informacionContratoActualizado.aportesSaludEmpleador
    );
    expect(response.body.fondo_pensiones).toBe(contrato.fondo_pensiones);
    expect(response.body.porcentaje_pension_empleado).toBe(
      contrato.porcentaje_pension_empleado
    );
    expect(response.body.porcentaje_pension_empleador).toBe(
      contrato.porcentaje_pension_empleador
    );
    expect(response.body.aportes_pension_empleado).toBe(
      informacionContratoActualizado.aportesPensionEmpleado
    );
    expect(response.body.aportes_pension_empleador).toBe(
      informacionContratoActualizado.aportesPensionEmpleador
    );
    expect(response.body.arl).toBe(contrato.arl);
    expect(response.body.porcentaje_arl).toBe(contrato.porcentaje_arl);
    expect(response.body.valor_arl).toBe(
      informacionContratoActualizado.valorArl
    );
    expect(response.body.valor_prima_servicios).toBe(
      informacionContratoActualizado.valorPrimaServicios
    );
    expect(response.body.fondo_cesantias).toBe(contrato.fondo_cesantias);
    expect(response.body.valor_cesantias).toBe(
      informacionContratoActualizado.valorCesantias
    );
    expect(response.body.valor_intereses_cesantias).toBe(
      informacionContratoActualizado.valorInteresesCesantias
    );
    expect(response.body.valor_vacaciones).toBe(
      informacionContratoActualizado.valorVacaciones
    );
    expect(response.body.porcentaje_parafiscal_sena).toBe(
      informacionContratoActualizado.porcentajeParafiscalSENA
    );
    expect(response.body.valor_parafiscal_sena).toBe(
      informacionContratoActualizado.valorParafiscalSENA
    );
    expect(response.body.porcentaje_parafiscal_icbf).toBe(
      informacionContratoActualizado.porcentajeParafiscalICBF
    );
    expect(response.body.valor_parafiscal_icbf).toBe(
      informacionContratoActualizado.valorParafiscalICBF
    );
    expect(response.body.porcentaje_parafiscal_caja_compensacion).toBe(
      contrato.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.valor_parafiscal_caja_compensacion).toBe(
      informacionContratoActualizado.valorParafiscalCajaCompesacion
    );
    expect(response.body.total_devengos).toBe(
      informacionContratoActualizado.totalDevengos
    );
    expect(response.body.total_deducciones).toBe(
      informacionContratoActualizado.totalDeducciones
    );
    expect(response.body.total_valor_empleado).toBe(
      informacionContratoActualizado.totalValorEmpleado
    );
    expect(response.body.salario_integral).toBe(contrato.salario_integral);
    expect(response.body.estado).toBe("ACTIVO");
  });
  contratoInvalido.numero_contrato = "1111111111";
  test("[PUT code 400] [/api/1.0/contract/update] Test de actualizar la información de un contrato de manera inválida número de contrato cambio", async () => {
    const response = await request(app)
      .put("/api/1.0/contract/update")
      .send(contratoInvalido)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El contrato no tiene un empleado definido"
    );
  });
});

describe("-----Test de endpoint de obtener información de un contrato-----", () => {
  test("[GET code 200] [/api/1.0/contract/:_id] Test de obtener información de un contrato existente", async () => {
    const response = await request(app)
      .get(`/api/1.0/contract/${_id}`)
      .set("Authorization", `Bearer ${jwt}`);
    const fecha = Date.now();
    const fechaFormato = new Date(fecha).toISOString().split("T")[0];
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(_id);
    expect(response.body.numero_contrato).toBe(contrato.numero_contrato);
    expect(response.body.fecha_inicio.split("T")[0]).toBe(
      contrato.fecha_inicio
    );
    expect(response.body.sueldo).toBe(contrato.sueldo);
    expect(response.body.cargo).toBe(contrato.cargo);
    expect(response.body.tipo_cotizante).toBe(contrato.tipo_cotizante);
    expect(response.body.auxilio_transporte).toBe(contrato.auxilio_transporte);
    expect(response.body.fondo_salud).toBe(contrato.fondo_salud);
    expect(response.body.porcentaje_salud_empleado).toBe(
      contrato.porcentaje_salud_empleado
    );
    expect(response.body.porcentaje_salud_empleador).toBe(
      informacionContrato.porcentajeSaludEmpleador
    );
    expect(response.body.fondo_pensiones).toBe(contrato.fondo_pensiones);
    expect(response.body.porcentaje_pension_empleado).toBe(
      contrato.porcentaje_pension_empleado
    );
    expect(response.body.porcentaje_pension_empleador).toBe(
      contrato.porcentaje_pension_empleador
    );
    expect(response.body.arl).toBe(contrato.arl);
    expect(response.body.porcentaje_arl).toBe(contrato.porcentaje_arl);
    expect(response.body.fondo_cesantias).toBe(contrato.fondo_cesantias);
    expect(response.body.porcentaje_parafiscal_sena).toBe(
      contrato.porcentaje_parafiscal_sena
    );
    expect(response.body.porcentaje_parafiscal_icbf).toBe(
      contrato.porcentaje_parafiscal_icbf
    );
    expect(response.body.porcentaje_parafiscal_caja_compensacion).toBe(
      contrato.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.salario_integral).toBe(false);
    expect(response.body.createdAt.split("T")[0]).toBe(fechaFormato);
    expect(response.body.updatedAt.split("T")[0]).toBe(fechaFormato);
  });

  test("[GET code 400] [/api/1.0/contract/:_id] Test de obtener información de un contrato inexistente", async () => {
    const idInvalido = mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/1.0/contract/${idInvalido}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El contrato no existe");
  });
});

describe("-----Test de actualizar estado de un contrato-----", () => {
  test("[PUT code 200] [/api/1.0/employee/state/:_id] Test de actualizar estado de un contrato ACTIVO a INACTIVO", async () => {
    let respuesta = await Empleado.findOne({
      numero_documento: empleado.numero_documento,
    });
    respuesta = JSON.stringify(respuesta);
    idEmpleado = respuesta.split('"')[3];
    const response = await request(app)
      .put(`/api/1.0/employee/state/${idEmpleado}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ concepto: "Se actualizo estado" });
    expect(response.status).toBe(201);
    expect(response.body.contrato.estado).toBe("INACTIVO");
    expect(response.body.mensajeContrato).toBe(
      "Estado del contrato actualizado"
    );
  });
  test("[PUT code 200] [/api/1.0/employee/state/:_id] Test de actualizar estado de un contrato INACTIVO a ACTIVO", async () => {
    const response = await request(app)
      .put(`/api/1.0/employee/state/${idEmpleado}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ concepto: "Se actualizo estado" });
    expect(response.status).toBe(201);
    expect(response.body.contrato.estado).toBe("ACTIVO");
    expect(response.body.mensajeContrato).toBe(
      "Estado del contrato actualizado"
    );
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
      numero_contrato: [
        contrato.numero_contrato,
        contrato1.numero_contrato,
        contrato2.numero_contrato,
        contrato3.numero_contrato,
      ],
    }),
  ]);
  mongoose.connection.close();
  server.close();
});
