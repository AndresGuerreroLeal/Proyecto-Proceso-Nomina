/**
 * Archivo de test para reportes empleados
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { app, server } = require("../server/index");
const request = require("supertest");
const Usuario = require("../server/models/usuarios");
const Roles = require("../server/models/roles");
const Empleado = require("../server/models/empleados");
const ReportesEmpleados = require("../server/models/reportesEmpleados");

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

const empleado1 = {
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
const empleado2 = {
  nombres: "Empleado2",
  apellidos: "Empleado2",
  tipo_documento: "CC",
  numero_documento: "1234567892",
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
    new Empleado(empleado1).save(),
    new Empleado(empleado2).save(),
    new Empleado(empleado3).save(),
  ]);
});

describe("-----Test de endpoint de crear reporte-----", () => {
  test("[GET code 201] [/api/1.0/report-employee/create] Test para crear un reporte de empleados", async () => {
    const response = await request(app)
      .get("/api/1.0/report-employee/create")
      .set("Authorization", `Bearer ${jwt}`);
    const dbReportes = await ReportesEmpleados.find().exec();
    datosReporte = dbReportes[0];
    _id = datosReporte._id;
    expect(response.status).toBe(201);
    expect(dbReportes.length).toBe(1);
    expect(datosReporte._id);
    expect(datosReporte.nombre).toBe(`Reporte generado ${fechaActual}`);
    expect(datosReporte.cantidad_empleados).toBe(3);
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
  test("[GET code 200] [/api/1.0/report-employee/list] Test de listar reportes de empleados", async () => {
    const response = await request(app)
      .get("/api/1.0/report-employee/list?pageNumber=0&pageSize=10")
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
  test("[GET code 400] [/api/1.0/report-employee/create] Test para no crear un reporte de empleados", async () => {
    await Promise.resolve(
      Empleado.deleteMany({
        correo: [empleado1.correo, empleado2.correo, empleado3.correo],
      })
    );
    const response = await request(app)
      .get("/api/1.0/report-employee/create")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No hay empleados registrados para realizar un reporte"
    );
  });
});

describe("-----Test de endpoint de eliminar reportes-----", () => {
  test("[DELETE code 200] [/api/1.0/report-employe/delete/:_id] Test para eliminar un reporte existente", async () => {
    const response = await request(app)
      .delete(`/api/1.0/report-employee/delete/${_id}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Se eliminó el reporte de empleados exitosamente"
    );
  });
  
  test("[DELETE code 400] [/api/1.0/report-employee/delete/:_id] Test para eliminar un reporte NO existente", async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/1.0/report-employee/delete/${idInexistente}`)
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
