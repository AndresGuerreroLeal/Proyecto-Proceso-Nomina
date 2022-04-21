/**
 * Archivo de tests para empleados
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { app, server } = require("../server/index");
const request = require("supertest");
const { Usuario } = require("../server/models/usuarios");
const { Roles } = require("../server/models/roles");
const { Empleado } = require("../server/models/empleados");
const fs = require("fs");
const path = require("path");

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

const info = {
  nombres: "Nombre empleado",
  apellidos: "Apellidos empleados",
  tipo_documento: "CC",
  numero_documento: "1234567890",
  correo: "empleadovalido@gmail.com",
  numero_celular: "1234567890",
  ciudad_residencia: "ciudad",
  direccion_residencia: "direccion",
  metodo_pago: "metodo pago",
  entidad_bancaria: "entidad bancaria",
  tipo_cuenta: "tipo cuenta",
  numero_cuenta: "1234567890",
};

let ruta = "";

let jwt;

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
  ]);
});

beforeEach(async () => {
  //Inicio de sesión y captura del token
  const response = await request(app).post("/api/1.0/auth").send(admin);
  jwt = await response.body.jwt;
});

describe("-----Test de endpoint de crear empleado------", () => {
  test("[POST code 201] [/api/1.0/empleado/create] Test de crear un empleado válido", async () => {
    const file = Buffer.from("Un pdf generado por tests");
    const response = await request(app)
      .post("/api/1.0/employee/create")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("nombres", info.nombres)
      .field("apellidos", info.apellidos)
      .field("tipo_documento", info.tipo_documento)
      .field("numero_documento", info.numero_documento)
      .field("correo", info.correo)
      .field("numero_celular", info.numero_celular)
      .field("ciudad_residencia", info.ciudad_residencia)
      .field("direccion_residencia", info.direccion_residencia)
      .field("metodo_pago", info.metodo_pago)
      .field("entidad_bancaria", info.entidad_bancaria)
      .field("tipo_cuenta", info.tipo_cuenta)
      .field("numero_cuenta", info.numero_cuenta)
      .attach("file", file, "custom_file.pdf")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    ruta = response.body.documento;
    expect(response.status).toBe(201);
    expect(response.body.nombres).toBe(info.nombres);
    expect(response.body.apellidos).toBe(info.apellidos);
    expect(response.body.tipo_documento).toBe(info.tipo_documento);
    expect(response.body.numero_documento).toBe(info.numero_documento);
    expect(response.body.correo).toBe(info.correo);
    expect(response.body.numero_celular).toBe(info.numero_celular);
    expect(response.body.ciudad_residencia).toBe(info.ciudad_residencia);
    expect(response.body.direccion_residencia).toBe(info.direccion_residencia);
    expect(response.body.metodo_pago).toBe(info.metodo_pago);
    expect(response.body.entidad_bancaria).toBe(info.entidad_bancaria);
    expect(response.body.tipo_cuenta).toBe(info.tipo_cuenta);
    expect(response.body.numero_cuenta).toBe(info.numero_cuenta);
  });

  test("[POST code 400] [/api/1.0/empleado/create] Test de crear un empleado inválido con número documento en uso", async () => {
    const file = Buffer.from("Un pdf generado por tests");
    const response = await request(app)
      .post("/api/1.0/employee/create")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("nombres", info.nombres)
      .field("apellidos", info.apellidos)
      .field("tipo_documento", info.tipo_documento)
      .field("numero_documento", info.numero_documento)
      .field("correo", info.correo)
      .field("numero_celular", info.numero_celular)
      .field("ciudad_residencia", info.ciudad_residencia)
      .field("direccion_residencia", info.direccion_residencia)
      .field("metodo_pago", info.metodo_pago)
      .field("entidad_bancaria", info.entidad_bancaria)
      .field("tipo_cuenta", info.tipo_cuenta)
      .field("numero_cuenta", info.numero_cuenta)
      .attach("file", file, "custom_file.pdf")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Número de documento ya registrado");
  });

  test("[POST code 400] [/api/1.0/empleado/create] Test de crear un empleado inválido con correo en uso", async () => {
    const file = Buffer.from("Un pdf generado por tests");
    const response = await request(app)
      .post("/api/1.0/employee/create")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("nombres", info.nombres)
      .field("apellidos", info.apellidos)
      .field("tipo_documento", info.tipo_documento)
      .field("numero_documento", "0987654321")
      .field("correo", info.correo)
      .field("numero_celular", info.numero_celular)
      .field("ciudad_residencia", info.ciudad_residencia)
      .field("direccion_residencia", info.direccion_residencia)
      .field("metodo_pago", info.metodo_pago)
      .field("entidad_bancaria", info.entidad_bancaria)
      .field("tipo_cuenta", info.tipo_cuenta)
      .field("numero_cuenta", info.numero_cuenta)
      .attach("file", file, "custom_file.pdf")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Correo ya registrado");
  });

  test("[POST code 400] [/api/1.0/empleado/create] Test de crear un empleado inválido con número celular en uso", async () => {
    const file = Buffer.from("Un pdf generado por tests");
    const response = await request(app)
      .post("/api/1.0/employee/create")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("nombres", info.nombres)
      .field("apellidos", info.apellidos)
      .field("tipo_documento", info.tipo_documento)
      .field("numero_documento", "0987654321")
      .field("correo", "correovalido@gmail.com")
      .field("numero_celular", info.numero_celular)
      .field("ciudad_residencia", info.ciudad_residencia)
      .field("direccion_residencia", info.direccion_residencia)
      .field("metodo_pago", info.metodo_pago)
      .field("entidad_bancaria", info.entidad_bancaria)
      .field("tipo_cuenta", info.tipo_cuenta)
      .field("numero_cuenta", info.numero_cuenta)
      .attach("file", file, "custom_file.pdf")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Número de celular ya registrado");
  });

  test("[POST code 400] [/api/1.0/empleado/create] Test de crear un empleado inválido con número cuenta en uso", async () => {
    const file = Buffer.from("Un pdf generado por tests");
    const response = await request(app)
      .post("/api/1.0/employee/create")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("nombres", info.nombres)
      .field("apellidos", info.apellidos)
      .field("tipo_documento", info.tipo_documento)
      .field("numero_documento", "0987654321")
      .field("correo", "correovalido@gmail.com")
      .field("numero_celular", "0987654321")
      .field("ciudad_residencia", info.ciudad_residencia)
      .field("direccion_residencia", info.direccion_residencia)
      .field("metodo_pago", info.metodo_pago)
      .field("entidad_bancaria", info.entidad_bancaria)
      .field("tipo_cuenta", info.tipo_cuenta)
      .field("numero_cuenta", info.numero_cuenta)
      .attach("file", file, "custom_file.pdf")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Número de cuenta ya registrado");
  });

  test("[POST code 400] [/api/1.0/empleado/create] Test de crear un empleado inválido sin documento", async () => {
    const response = await request(app)
      .post("/api/1.0/employee/create")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("nombres", info.nombres)
      .field("apellidos", info.apellidos)
      .field("tipo_documento", info.tipo_documento)
      .field("numero_documento", "0987654321")
      .field("correo", "correovalido@gmail.com")
      .field("numero_celular", "0987654321")
      .field("ciudad_residencia", info.ciudad_residencia)
      .field("direccion_residencia", info.direccion_residencia)
      .field("metodo_pago", info.metodo_pago)
      .field("entidad_bancaria", info.entidad_bancaria)
      .field("tipo_cuenta", info.tipo_cuenta)
      .field("numero_cuenta", info.numero_cuenta)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Número de cuenta ya registrado");
  });

  test("[POST code 400] [/api/1.0/empleado/create] Test de crear un empleado inválido con nombre de documento incorrecto", async () => {
    const file = Buffer.from("Un pdf generado por tests");
    const response = await request(app)
      .post("/api/1.0/employee/create")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("nombres", info.nombres)
      .field("apellidos", info.apellidos)
      .field("tipo_documento", info.tipo_documento)
      .field("numero_documento", "0987654321")
      .field("correo", "correovalido@gmail.com")
      .field("numero_celular", "0987654321")
      .field("ciudad_residencia", info.ciudad_residencia)
      .field("direccion_residencia", info.direccion_residencia)
      .field("metodo_pago", info.metodo_pago)
      .field("entidad_bancaria", info.entidad_bancaria)
      .field("tipo_cuenta", info.tipo_cuenta)
      .field("numero_cuenta", info.numero_cuenta)
      .attach("documento", file, "custom_file.pdf")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Número de cuenta ya registrado");
  });
});

afterAll(async () => {
  ruta = ruta.split("/");
  const nombreArchivo = ruta[ruta.length - 1];
  await Usuario.deleteMany({ usuario: ["admin"] });
  await Roles.deleteMany({ _id: ["ADMIN", "REPORTS"] });
  await Empleado.deleteOne({ correo: info.correo });
  mongoose.connection.close();
  server.close();
  ruta = path.normalize(
    `${__dirname}/../server/archivos/documentos/${nombreArchivo}`
  );
  fs.unlinkSync(ruta);
});
