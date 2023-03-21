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
const Nomina = require("../server/models/nominas");
const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

const empleado1 = {
  nombres: "Empleado1",
  apellidos: "Empleado1",
  tipo_documento: "CC",
  numero_documento: "1234567891",
  genero: "O",
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

const empleado2 = {
  nombres: "Empleado2",
  apellidos: "Empleado2",
  tipo_documento: "CC",
  numero_documento: "1234567892",
  genero: "O",
  documento: "documentoSegundoEmpleado",
  correo: "correoSegundoEmpleado@gmail.com",
  numero_celular: "1234567892",
  ciudad_residencia: "Ciudad",
  direccion_residencia: "Carrera 2 Calle 2",
  metodo_pago: "Efectivo",
  entidad_bancaria: "Entidad Bancaria",
  tipo_cuenta: "Ahorros",
  numero_cuenta: "1234567892",
  estado: "ACTIVO",
  concepto: "Empleados creado",
};
const empleado3 = {
  nombres: "Empleado3",
  apellidos: "Empleado3",
  tipo_documento: "CC",
  numero_documento: "1234567893",
  genero: "O",
  documento: "documentoTercerEmpleado",
  correo: "correoTercerEmpleado@gmail.com",
  numero_celular: "1234567893",
  ciudad_residencia: "Ciudad",
  direccion_residencia: "Carrera 3 Calle 3",
  metodo_pago: "Efectivo",
  entidad_bancaria: "Entidad Bancaria",
  tipo_cuenta: "Ahorros",
  numero_cuenta: "1234567893",
  estado: "ACTIVO",
  concepto: "Empleados creado",
};

const contrato1 = {
  numero_contrato: empleado1.numero_documento,
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
  numero_contrato: empleado3.numero_documento,
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
  numero_contrato: empleado3.numero_documento,
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

const nomina = {
  nombre: "reporte",
  anio: 2022,
  mes: 5,
  enviar_desprendibles: false,
};

let _id;
let idContrato;

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
    new Empleado(empleado1).save(),
    new Empleado(empleado2).save(),
    new Empleado(empleado3).save(),
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

describe("-----Test de listar información para nómina-----", () => {
  test("[GET] code 200 [/api/1.0/payroll/list-info] Test para listar datos de información de nómina", async () => {
    const response = await request(app)
      .get("/api/1.0/payroll/list-info?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    idContrato = response.body.docs[0]._id;
    expect(response.body.docs[0]._id);
    expect(response.body.docs[0].numero_contrato).toBe(
      contrato1.numero_contrato
    );
    expect(response.body.docs[0].tipo_contrato).toBe(contrato1.tipo_contrato);
    expect(response.body.docs[0].fecha_inicio.split("T")[0]).toBe(
      contrato1.fecha_inicio
    );
    expect(response.body.docs[0].sueldo).toBe(contrato1.sueldo);
    expect(response.body.docs[0].cargo).toBe(contrato1.cargo);
    expect(response.body.docs[0].tipo_cotizante).toBe(contrato1.tipo_cotizante);
    expect(response.body.docs[0].auxilio_transporte).toBe(
      contrato1.auxilio_transporte
    );
    expect(response.body.docs[0].fondo_salud).toBe(contrato1.fondo_salud);
    expect(response.body.docs[0].porcentaje_salud_empleado).toBe(
      contrato1.porcentaje_salud_empleado
    );
    expect(response.body.docs[0].porcentaje_salud_empleador).toBe(
      contrato1.porcentaje_salud_empleador
    );
    expect(response.body.docs[0].fondo_pensiones).toBe(
      contrato1.fondo_pensiones
    );
    expect(response.body.docs[0].porcentaje_pension_empleado).toBe(
      contrato1.porcentaje_pension_empleado
    );
    expect(response.body.docs[0].porcentaje_pension_empleador).toBe(
      contrato1.porcentaje_pension_empleador
    );
    expect(response.body.docs[0].arl).toBe(contrato1.arl);
    expect(response.body.docs[0].porcentaje_arl).toBe(contrato1.porcentaje_arl);
    expect(response.body.docs[0].fondo_cesantias).toBe(
      contrato1.fondo_cesantias
    );
    expect(response.body.docs[0].porcentaje_parafiscal_sena).toBe(
      contrato1.porcentaje_parafiscal_sena
    );
    expect(response.body.docs[0].porcentaje_parafiscal_icbf).toBe(
      contrato1.porcentaje_parafiscal_icbf
    );
    expect(response.body.docs[0].porcentaje_parafiscal_caja_compensacion).toBe(
      contrato1.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.docs[0].salario_integral).toBe(
      contrato1.salario_integral
    );
    expect(response.body.docs[0].createdAt);
    expect(response.body.docs[0].updatedAt);
    expect(response.body.totalDocs).toBe(3);
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

describe("-----Test de endpoint de obtener información de nómina-----", () => {
  test("[GET code 200] [/api/1.0/payroll/get/:_id] Test para obtener un contrato para nómina existente", async () => {
    const response = await request(app)
      .get(`/api/1.0/payroll/get/${idContrato}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(idContrato);
    expect(response.body.numero_contrato).toBe(contrato1.numero_contrato);
    expect(response.body.tipo_contrato).toBe(contrato1.tipo_contrato);
    expect(response.body.fecha_inicio.split("T")[0]).toBe(
      contrato1.fecha_inicio
    );
    expect(response.body.sueldo).toBe(contrato1.sueldo);
    expect(response.body.cargo).toBe(contrato1.cargo);
    expect(response.body.tipo_cotizante).toBe(contrato1.tipo_cotizante);
    expect(response.body.auxilio_transporte).toBe(contrato1.auxilio_transporte);
    expect(response.body.fondo_salud).toBe(contrato1.fondo_salud);
    expect(response.body.porcentaje_salud_empleado).toBe(
      contrato1.porcentaje_salud_empleado
    );
    expect(response.body.porcentaje_salud_empleador).toBe(
      contrato1.porcentaje_salud_empleador
    );
    expect(response.body.fondo_pensiones).toBe(contrato1.fondo_pensiones);
    expect(response.body.porcentaje_pension_empleado).toBe(
      contrato1.porcentaje_pension_empleado
    );
    expect(response.body.porcentaje_pension_empleador).toBe(
      contrato1.porcentaje_pension_empleador
    );
    expect(response.body.arl).toBe(contrato1.arl);
    expect(response.body.porcentaje_arl).toBe(contrato1.porcentaje_arl);
    expect(response.body.fondo_cesantias).toBe(contrato1.fondo_cesantias);
    expect(response.body.porcentaje_parafiscal_sena).toBe(
      contrato1.porcentaje_parafiscal_sena
    );
    expect(response.body.porcentaje_parafiscal_icbf).toBe(
      contrato1.porcentaje_parafiscal_icbf
    );
    expect(response.body.porcentaje_parafiscal_caja_compensacion).toBe(
      contrato1.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.salario_integral).toBe(contrato1.salario_integral);
    expect(response.body.nombres).toBe(empleado1.nombres);
    expect(response.body.apellidos).toBe(empleado1.apellidos);
  });

  test("[GET code 400] [/api/1.0/payroll/get/:_id] Test de obtener un contrato para nómina inexistente", async () => {
    const idInvalido = mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/1.0/payroll/get/${idInvalido}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El contrato no existe");
  });
});

describe("-----Test de endpoint de crear nómina-----", () => {
  test("[POST code 201] [/api/1.0/payroll/create] Test para crear una nómina", async () => {
    const response = await request(app)
      .post("/api/1.0/payroll/create")
      .send(nomina)
      .set("Authorization", `Bearer ${jwt}`);
    const dbReportes = await Nomina.find().exec();
    datosReporte = dbReportes[0];
    _id = datosReporte._id;
    expect(response.status).toBe(201);
    expect(dbReportes.length).toBe(1);
    expect(datosReporte._id);
    expect(datosReporte.nombre).toBe(nomina.nombre);
    expect(datosReporte.descripcion).toBe(
      `Nómina generada el día ${fechaActual}`
    );
    expect(datosReporte.anio).toBe(nomina.anio);
    expect(datosReporte.mes).toBe(nomina.mes);
    expect(datosReporte.nomina);
    expect(datosReporte.cantidad_contratos).toBe(3);
    expect(datosReporte.createdAt.toISOString().split("T")[0]).toBe(
      fechaActual
    );
    expect(datosReporte.updatedAt.toISOString().split("T")[0]).toBe(
      fechaActual
    );
  });
});

describe("-----Test de endpoint de listar reportes-----", () => {
  test("[GET code 200] [/api/1.0/payroll/list] Test de listar nóminas", async () => {
    const response = await request(app)
      .get("/api/1.0/payroll/list?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.body.docs[0]._id);
    expect(response.body.docs[0].nombre).toBe(datosReporte.nombre);
    expect(response.body.docs[0].descripcion).toBe(datosReporte.descripcion);
    expect(response.body.docs[0].anio).toBe(nomina.anio);
    expect(response.body.docs[0].mes).toBe(nomina.mes);
    expect(response.body.docs[0].nomina).toBe(datosReporte.nomina);
    expect(response.body.docs[0].cantidad_contratos).toBe(3);
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

describe("-----Test de endpoint de cantidad de nóminas-----", () => {
  test("[GET code 200] [/api/1.0/payroll] Test de obtener la cantidad de nóminas registradas", async () => {
    const response = await request(app)
      .get("/api/1.0/payroll")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.cantidadNominas).toBe(1);
  });
});

describe("-----Test de endpoint de NO crear reporte-----", () => {
  test("[GET code 400] [/api/1.0/payroll/create] Test para no crear un reporte de empleados", async () => {
    await Promise.resolve(
      Contrato.deleteMany({
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

describe("-----Test de endpoint de eliminar nóminas-----", () => {
  test("[DELETE code 200] [/api/1.0/payroll/delete/:_id] Test para eliminar un nóminas existente", async () => {
    const response = await request(app)
      .delete(`/api/1.0/payroll/delete/${_id}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Se eliminó la nómina exitosamente");
  });

  test("[DELETE code 400] [/api/1.0/report-contract/delete/:_id] Test para eliminar un reporte NO existente", async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/1.0/payroll/delete/${idInexistente}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El reporte no existe");
  });
});

afterAll(async () => {
  await Promise.all([
    Usuario.deleteMany({ usuario: ["admin"] }),
    Roles.deleteMany({ _id: ["ADMIN", "REPORTS"] }),
    Empleado.deleteMany({
      correo: [empleado1.correo, empleado2.correo, empleado3.correo],
    }),
  ]);
  mongoose.connection.close();
  server.close();
});
