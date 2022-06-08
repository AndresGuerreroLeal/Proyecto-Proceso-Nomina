/**
 * Archivo de tests para empleados
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { app, server } = require("../server/index");
const request = require("supertest");
const Usuario = require("../server/models/usuarios");
const Roles = require("../server/models/roles");
const Empleado = require("../server/models/empleados");
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

let ruta;
let jwt;
let _id;

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

beforeEach(async () => {
  //Inicio de sesión y captura del token
  const response = await request(app).post("/api/1.0/auth").send(admin);
  jwt = await response.body.jwt;
});

describe("-----Test de endpoint de crear empleado-----", () => {
  test("[POST code 201] [/api/1.0/employee/create] Test de crear un empleado válido", async () => {
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
      .set("Authorization", `Bearer ${jwt}`);
    ruta = response.body.documento;
    expect(response.status).toBe(201);
    expect(response.body._id);
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

  test("[POST code 400] [/api/1.0/employee/create] Test de crear un empleado inválido con número documento en uso", async () => {
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

  test("[POST code 400] [/api/1.0/employee/create] Test de crear un empleado inválido con correo en uso", async () => {
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

  test("[POST code 400] [/api/1.0/employee/create] Test de crear un empleado inválido con número celular en uso", async () => {
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

  test("[POST code 400] [/api/1.0/employee/create] Test de crear un empleado inválido con número cuenta en uso", async () => {
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

  test("[POST code 400] [/api/1.0/employee/create] Test de crear un empleado inválido sin documento", async () => {
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
      .field("numero_cuenta", "3232323232")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Documento requerido");
  });
});

describe("-----Test de endpoint de listar empleados activos-----", () => {
  test("[GET code 200] [/api/1.0/employee/list-active] Test de listar empleados activos cantidad[1] ", async () => {
    const response = await request(app)
      .get("/api/1.0/employee/list-active?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.docs[0]._id);
    expect(response.body.docs[0].nombres).toBe(info.nombres);
    expect(response.body.docs[0].apellidos).toBe(info.apellidos);
    expect(response.body.docs[0].tipo_documento).toBe(info.tipo_documento);
    expect(response.body.docs[0].numero_documento).toBe(info.numero_documento);
    expect(response.body.docs[0].documento).toBe(ruta);
    expect(response.body.docs[0].correo).toBe(info.correo);
    expect(response.body.docs[0].numero_celular).toBe(info.numero_celular);
    expect(response.body.docs[0].ciudad_residencia).toBe(
      info.ciudad_residencia
    );
    expect(response.body.docs[0].direccion_residencia).toBe(
      info.direccion_residencia
    );
    expect(response.body.docs[0].metodo_pago).toBe(info.metodo_pago);
    expect(response.body.docs[0].entidad_bancaria).toBe(info.entidad_bancaria);
    expect(response.body.docs[0].tipo_cuenta).toBe(info.tipo_cuenta);
    expect(response.body.docs[0].numero_cuenta).toBe(info.numero_cuenta);
    expect(response.body.docs[0].estado).toBe("ACTIVO");
    expect(response.body.docs[0].concepto).toBe("Empleado creado");
    expect(response.body.totalDocs).toBe(4);
    expect(response.body.limit).toBe(10);
    expect(response.body.page).toBe(1);
    expect(response.body.pagingCounter).toBe(1);
    expect(response.body.hasPrevPage).toBe(false);
    expect(response.body.hasNextPage).toBe(false);
    expect(response.body.prevPage).toBe(null);
    expect(response.body.nextPage).toBe(null);
  });

  test("[GET code 200] [/api/1.0/employee/list-active] Test de listar empleados activos cantidad[3] ", async () => {
    const response = await request(app)
      .get("/api/1.0/employee/list-active?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.docs[1]._id);
    expect(response.body.docs[1].nombres).toBe(empleado1.nombres);
    expect(response.body.docs[1].apellidos).toBe(empleado1.apellidos);
    expect(response.body.docs[1].tipo_documento).toBe(empleado1.tipo_documento);
    expect(response.body.docs[1].numero_documento).toBe(
      empleado1.numero_documento
    );
    expect(response.body.docs[1].documento).toBe(empleado1.documento);
    expect(response.body.docs[1].correo).toBe(empleado1.correo);
    expect(response.body.docs[1].numero_celular).toBe(empleado1.numero_celular);
    expect(response.body.docs[1].ciudad_residencia).toBe(
      empleado1.ciudad_residencia
    );
    expect(response.body.docs[1].direccion_residencia).toBe(
      empleado1.direccion_residencia
    );
    expect(response.body.docs[1].metodo_pago).toBe(empleado1.metodo_pago);
    expect(response.body.docs[1].entidad_bancaria).toBe(
      empleado1.entidad_bancaria
    );
    expect(response.body.docs[1].tipo_cuenta).toBe(empleado1.tipo_cuenta);
    expect(response.body.docs[1].numero_cuenta).toBe(empleado1.numero_cuenta);
    expect(response.body.docs[1].estado).toBe(empleado1.estado);
    expect(response.body.docs[1].concepto).toBe(empleado1.concepto);

    expect(response.body.docs[2]._id);
    expect(response.body.docs[2].nombres).toBe(empleado2.nombres);
    expect(response.body.docs[2].apellidos).toBe(empleado2.apellidos);
    expect(response.body.docs[2].tipo_documento).toBe(empleado2.tipo_documento);
    expect(response.body.docs[2].numero_documento).toBe(
      empleado2.numero_documento
    );
    expect(response.body.docs[2].documento).toBe(empleado2.documento);
    expect(response.body.docs[2].correo).toBe(empleado2.correo);
    expect(response.body.docs[2].numero_celular).toBe(empleado2.numero_celular);
    expect(response.body.docs[2].ciudad_residencia).toBe(
      empleado2.ciudad_residencia
    );
    expect(response.body.docs[2].direccion_residencia).toBe(
      empleado2.direccion_residencia
    );
    expect(response.body.docs[2].metodo_pago).toBe(empleado2.metodo_pago);
    expect(response.body.docs[2].entidad_bancaria).toBe(
      empleado2.entidad_bancaria
    );
    expect(response.body.docs[2].tipo_cuenta).toBe(empleado2.tipo_cuenta);
    expect(response.body.docs[2].numero_cuenta).toBe(empleado2.numero_cuenta);
    expect(response.body.docs[2].estado).toBe(empleado2.estado);
    expect(response.body.docs[2].concepto).toBe(empleado2.concepto);

    expect(response.body.docs[3]._id);
    expect(response.body.docs[3].nombres).toBe(empleado3.nombres);
    expect(response.body.docs[3].apellidos).toBe(empleado3.apellidos);
    expect(response.body.docs[3].tipo_documento).toBe(empleado3.tipo_documento);
    expect(response.body.docs[3].numero_documento).toBe(
      empleado3.numero_documento
    );
    expect(response.body.docs[3].documento).toBe(empleado3.documento);
    expect(response.body.docs[3].correo).toBe(empleado3.correo);
    expect(response.body.docs[3].numero_celular).toBe(empleado3.numero_celular);
    expect(response.body.docs[3].ciudad_residencia).toBe(
      empleado3.ciudad_residencia
    );
    expect(response.body.docs[3].direccion_residencia).toBe(
      empleado3.direccion_residencia
    );
    expect(response.body.docs[3].metodo_pago).toBe(empleado3.metodo_pago);
    expect(response.body.docs[3].entidad_bancaria).toBe(
      empleado3.entidad_bancaria
    );
    expect(response.body.docs[3].tipo_cuenta).toBe(empleado3.tipo_cuenta);
    expect(response.body.docs[3].numero_cuenta).toBe(empleado3.numero_cuenta);
    expect(response.body.docs[3].estado).toBe(empleado3.estado);
    expect(response.body.docs[3].concepto).toBe(empleado3.concepto);
    expect(response.body.totalDocs).toBe(4);
    expect(response.body.limit).toBe(10);
    expect(response.body.page).toBe(1);
    expect(response.body.pagingCounter).toBe(1);
    expect(response.body.hasPrevPage).toBe(false);
    expect(response.body.hasNextPage).toBe(false);
    expect(response.body.prevPage).toBe(null);
    expect(response.body.nextPage).toBe(null);
  });

  test("[GET code 400] [/api/1.0/employee/list-active] Test listar empleados activos sin datos paginación", async () => {
    const response = await request(app)
      .get("/api/1.0/employee/list-active")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No hay parametros de paginación");
  });
});

describe("-----Test de endpoint de cantidad empleados-----", () => {
  test("[GET code 200] [/api/1.0/employee/] Test de cantidad de empleados registrados TODOS ACTIVOS", async () => {
    const response = await request(app)
      .get("/api/1.0/employee")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.cantidadEmpleados).toBe(4);
    expect(response.body.cantidadActivos).toBe(4);
    expect(response.body.cantidadInactivos).toBe(0);
  });
});

describe("-----Test de endpoint de listar empleados inactivos-----", () => {
  test("[GET code 200] [/api/1.0/employee/list-inactive] Test de listar empleados inactivos cantidad[1] ", async () => {
    await Empleado.findOneAndUpdate(
      { correo: info.correo },
      {
        estado: "INACTIVO",
        concepto: "Desactivado",
      },
      { new: true }
    ).exec();
    const response = await request(app)
      .get("/api/1.0/employee/list-inactive?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.docs[0].nombres).toBe(info.nombres);
    expect(response.body.docs[0].apellidos).toBe(info.apellidos);
    expect(response.body.docs[0].tipo_documento).toBe(info.tipo_documento);
    expect(response.body.docs[0].numero_documento).toBe(info.numero_documento);
    expect(response.body.docs[0].documento).toBe(ruta);
    expect(response.body.docs[0].correo).toBe(info.correo);
    expect(response.body.docs[0].numero_celular).toBe(info.numero_celular);
    expect(response.body.docs[0].ciudad_residencia).toBe(
      info.ciudad_residencia
    );
    expect(response.body.docs[0].direccion_residencia).toBe(
      info.direccion_residencia
    );
    expect(response.body.docs[0].metodo_pago).toBe(info.metodo_pago);
    expect(response.body.docs[0].entidad_bancaria).toBe(info.entidad_bancaria);
    expect(response.body.docs[0].tipo_cuenta).toBe(info.tipo_cuenta);
    expect(response.body.docs[0].numero_cuenta).toBe(info.numero_cuenta);
    expect(response.body.docs[0].estado).toBe("INACTIVO");
    expect(response.body.docs[0].concepto).toBe("Desactivado");
    expect(response.body.totalDocs).toBe(1);
    expect(response.body.limit).toBe(10);
    expect(response.body.page).toBe(1);
    expect(response.body.pagingCounter).toBe(1);
    expect(response.body.hasPrevPage).toBe(false);
    expect(response.body.hasNextPage).toBe(false);
    expect(response.body.prevPage).toBe(null);
    expect(response.body.nextPage).toBe(null);
  });

  test("[GET code 200] [/api/1.0/employee/list-inactive] Test de listar empleados inactivos cantidad[3] ", async () => {
    await Promise.all([
      Empleado.findOneAndUpdate(
        { correo: empleado1.correo },
        {
          estado: "INACTIVO",
          concepto: "Desactivado",
        },
        { new: true }
      ),
      Empleado.findOneAndUpdate(
        { correo: empleado2.correo },
        {
          estado: "INACTIVO",
          concepto: "Desactivado",
        },
        { new: true }
      ),
      Empleado.findOneAndUpdate(
        { correo: empleado3.correo },
        {
          estado: "INACTIVO",
          concepto: "Desactivado",
        },
        { new: true }
      ),
    ]);

    const response = await request(app)
      .get("/api/1.0/employee/list-inactive?pageNumber=0&pageSize=10")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.docs[1].nombres).toBe(empleado1.nombres);
    expect(response.body.docs[1].apellidos).toBe(empleado1.apellidos);
    expect(response.body.docs[1].tipo_documento).toBe(empleado1.tipo_documento);
    expect(response.body.docs[1].numero_documento).toBe(
      empleado1.numero_documento
    );
    expect(response.body.docs[1].documento).toBe(empleado1.documento);
    expect(response.body.docs[1].correo).toBe(empleado1.correo);
    expect(response.body.docs[1].numero_celular).toBe(empleado1.numero_celular);
    expect(response.body.docs[1].ciudad_residencia).toBe(
      empleado1.ciudad_residencia
    );
    expect(response.body.docs[1].direccion_residencia).toBe(
      empleado1.direccion_residencia
    );
    expect(response.body.docs[1].metodo_pago).toBe(empleado1.metodo_pago);
    expect(response.body.docs[1].entidad_bancaria).toBe(
      empleado1.entidad_bancaria
    );
    expect(response.body.docs[1].tipo_cuenta).toBe(empleado1.tipo_cuenta);
    expect(response.body.docs[1].numero_cuenta).toBe(empleado1.numero_cuenta);
    expect(response.body.docs[1].estado).toBe("INACTIVO");
    expect(response.body.docs[1].concepto).toBe("Desactivado");

    expect(response.body.docs[2].nombres).toBe(empleado2.nombres);
    expect(response.body.docs[2].apellidos).toBe(empleado2.apellidos);
    expect(response.body.docs[2].tipo_documento).toBe(empleado2.tipo_documento);
    expect(response.body.docs[2].numero_documento).toBe(
      empleado2.numero_documento
    );
    expect(response.body.docs[2].documento).toBe(empleado2.documento);
    expect(response.body.docs[2].correo).toBe(empleado2.correo);
    expect(response.body.docs[2].numero_celular).toBe(empleado2.numero_celular);
    expect(response.body.docs[2].ciudad_residencia).toBe(
      empleado2.ciudad_residencia
    );
    expect(response.body.docs[2].direccion_residencia).toBe(
      empleado2.direccion_residencia
    );
    expect(response.body.docs[2].metodo_pago).toBe(empleado2.metodo_pago);
    expect(response.body.docs[2].entidad_bancaria).toBe(
      empleado2.entidad_bancaria
    );
    expect(response.body.docs[2].tipo_cuenta).toBe(empleado2.tipo_cuenta);
    expect(response.body.docs[2].numero_cuenta).toBe(empleado2.numero_cuenta);
    expect(response.body.docs[2].estado).toBe("INACTIVO");
    expect(response.body.docs[2].concepto).toBe("Desactivado");
    expect(response.body.docs[3].nombres).toBe(empleado3.nombres);

    expect(response.body.docs[3].apellidos).toBe(empleado3.apellidos);
    expect(response.body.docs[3].tipo_documento).toBe(empleado3.tipo_documento);
    expect(response.body.docs[3].numero_documento).toBe(
      empleado3.numero_documento
    );
    expect(response.body.docs[3].documento).toBe(empleado3.documento);
    expect(response.body.docs[3].correo).toBe(empleado3.correo);
    expect(response.body.docs[3].numero_celular).toBe(empleado3.numero_celular);
    expect(response.body.docs[3].ciudad_residencia).toBe(
      empleado3.ciudad_residencia
    );
    expect(response.body.docs[3].direccion_residencia).toBe(
      empleado3.direccion_residencia
    );
    expect(response.body.docs[3].metodo_pago).toBe(empleado3.metodo_pago);
    expect(response.body.docs[3].entidad_bancaria).toBe(
      empleado3.entidad_bancaria
    );
    expect(response.body.docs[3].tipo_cuenta).toBe(empleado3.tipo_cuenta);
    expect(response.body.docs[3].numero_cuenta).toBe(empleado3.numero_cuenta);
    expect(response.body.docs[3].estado).toBe("INACTIVO");
    expect(response.body.docs[3].concepto).toBe("Desactivado");
    expect(response.body.totalDocs).toBe(4);
    expect(response.body.limit).toBe(10);
    expect(response.body.page).toBe(1);
    expect(response.body.pagingCounter).toBe(1);
    expect(response.body.hasPrevPage).toBe(false);
    expect(response.body.hasNextPage).toBe(false);
    expect(response.body.prevPage).toBe(null);
    expect(response.body.nextPage).toBe(null);
  });

  test("[GET code 400] [/api/1.0/employee/list-inactive] Test listar empleados inactivos sin datos paginación", async () => {
    const response = await request(app)
      .get("/api/1.0/employee/list-inactive")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No hay parametros de paginación");
  });
});

describe("-----Test de endpoint de cantidad empleados-----", () => {
  test("[GET code 200] [/api/1.0/employee/] Test de cantidad de empleados registrados TODOS INACTIVOS", async () => {
    const response = await request(app)
      .get("/api/1.0/employee")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.cantidadEmpleados).toBe(4);
    expect(response.body.cantidadActivos).toBe(0);
    expect(response.body.cantidadInactivos).toBe(4);
  });
});

describe("-----Test de endpoint de actualizar información de empleados SIN AFECTAR DOCUMENTO-----", () => {
  let nuevaInfo = {
    nombres: info.nombres,
    apellidos: info.apellidos,
    tipo_documento: "CE",
    numero_documento: info.numero_documento,
    correo: info.correo,
    numero_celular: info.numero_celular,
    ciudad_residencia: "Nueva ciudad",
    direccion_residencia: "Nueva dirección",
    metodo_pago: info.metodo_pago,
    entidad_bancaria: info.entidad_bancaria,
    tipo_cuenta: info.tipo_cuenta,
    numero_cuenta: info.numero_cuenta,
    nuevo_archivo: false,
  };
  test("[PUT code 201] [/api/1.0/employee/update] Test de actualizar empleado válido", async () => {
    /* Obtener Identificador del empleado a actualiza */
    let respuesta = await Empleado.findOne(
      { correo: info.correo },
      { _id: 1 }
    ).exec();
    respuesta = JSON.stringify(respuesta);
    let id = respuesta.split('"')[3];
    nuevaInfo._id = id;
    nuevaInfo.documento = ruta;
    /* Test */
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send(nuevaInfo);
    expect(response.status).toBe(201);
    expect(response.body._id).toBe(nuevaInfo._id);
    expect(response.body.nombres).toBe(nuevaInfo.nombres);
    expect(response.body.apellidos).toBe(nuevaInfo.apellidos);
    expect(response.body.tipo_documento).toBe(nuevaInfo.tipo_documento);
    expect(response.body.numero_documento).toBe(nuevaInfo.numero_documento);
    expect(response.body.correo).toBe(nuevaInfo.correo);
    expect(response.body.numero_celular).toBe(nuevaInfo.numero_celular);
    expect(response.body.ciudad_residencia).toBe(nuevaInfo.ciudad_residencia);
    expect(response.body.direccion_residencia).toBe(
      nuevaInfo.direccion_residencia
    );
    expect(response.body.metodo_pago).toBe(nuevaInfo.metodo_pago);
    expect(response.body.entidad_bancaria).toBe(nuevaInfo.entidad_bancaria);
    expect(response.body.tipo_cuenta).toBe(nuevaInfo.tipo_cuenta);
    expect(response.body.numero_cuenta).toBe(nuevaInfo.numero_cuenta);
  });

  test("[PUT code 400] [/api/1.0/employee/update] Test de actualizar empleado inválido con identificador inexistente", async () => {
    const invalidoId = Object.assign({}, nuevaInfo);
    invalidoId._id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send(invalidoId);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El empleado no existe");
  });

  test("[PUT code 400] [/api/1.0/employee/update] Test de actualizar empleado inválido con número de documento en uso", async () => {
    const invalidoDocumento = Object.assign({}, nuevaInfo);
    invalidoDocumento.numero_documento = empleado1.numero_documento;
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send(invalidoDocumento);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El número de documento ya está registrado"
    );
  });

  test("[PUT code 400] [/api/1.0/employee/update] Test de actualizar empleado inválido con correo en uso", async () => {
    const invalidoCorreo = Object.assign({}, nuevaInfo);
    invalidoCorreo.correo = empleado1.correo;
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send(invalidoCorreo);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El correo ya está registrado");
  });

  test("[PUT code 400] [/api/1.0/employee/update] Test de actualizar empleado inválido con número de celular en uso ", async () => {
    const invalidoCelular = Object.assign({}, nuevaInfo);
    invalidoCelular.numero_celular = empleado1.numero_celular;
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send(invalidoCelular);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El número de celular ya está registrado"
    );
  });

  test("[PUT code 400] [/api/1.0/employee/update] Test de actualizar empleado inválido con número de cuenta en uso", async () => {
    const invalidoCuenta = Object.assign({}, nuevaInfo);
    invalidoCuenta.numero_cuenta = empleado1.numero_cuenta;
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send(invalidoCuenta);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El número de cuenta ya está registrado"
    );
  });
});

describe("-----Test de endpoint para actualizar información de empleados AFECTANDO DOCUMENTO-----", () => {
  let nuevaInfo = {
    nombres: "Nuevos nombres",
    apellidos: "Nuevos apellidos",
    tipo_documento: "CE",
    numero_documento: info.numero_documento,
    correo: info.correo,
    numero_celular: info.numero_celular,
    ciudad_residencia: "Nueva ciudad",
    direccion_residencia: "Nueva dirección",
    metodo_pago: info.metodo_pago,
    entidad_bancaria: info.entidad_bancaria,
    tipo_cuenta: info.tipo_cuenta,
    numero_cuenta: info.numero_cuenta,
    nuevo_archivo: true,
  };

  test("[PUT code 201] [/api/1.0/employee/update] Test de actualizar empleado cambiando los nombres", async () => {
    /* Obtener Identificador del empleado a actualiza */
    let respuesta = await Empleado.findOne(
      { correo: info.correo },
      { _id: 1 }
    ).exec();
    respuesta = JSON.stringify(respuesta);
    let id = respuesta.split('"')[3];
    nuevaInfo._id = id;
    nuevaInfo.documento = ruta;
    _id = id;
    /* Test */
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send(nuevaInfo);
    const rutaVieja = ruta;
    ruta = response.body.documento;
    expect(response.status).toBe(201);
    expect(response.body.nombres).toBe(nuevaInfo.nombres);
    expect(response.body.apellidos).toBe(nuevaInfo.apellidos);
    expect(response.body.documento).not.toEqual(rutaVieja);
  });

  test("[PUT code 201] [/api/1.0/employee/update] Test de actualizar empleado cambiando el archivo", async () => {
    nuevaInfo.documento = ruta;
    const file = Buffer.from("Un pdf generado por tests nuevo");
    const response = await request(app)
      .put("/api/1.0/employee/update")
      .set("Authorization", `Bearer ${jwt}`)
      .set("Content-Type", "multipart/form-data")
      .field("_id", nuevaInfo._id)
      .field("nombres", nuevaInfo.nombres)
      .field("apellidos", nuevaInfo.apellidos)
      .field("tipo_documento", nuevaInfo.tipo_documento)
      .field("documento", nuevaInfo.documento)
      .field("numero_documento", nuevaInfo.numero_documento)
      .field("correo", nuevaInfo.correo)
      .field("numero_celular", nuevaInfo.numero_celular)
      .field("ciudad_residencia", nuevaInfo.ciudad_residencia)
      .field("direccion_residencia", nuevaInfo.direccion_residencia)
      .field("metodo_pago", nuevaInfo.metodo_pago)
      .field("entidad_bancaria", nuevaInfo.entidad_bancaria)
      .field("tipo_cuenta", nuevaInfo.tipo_cuenta)
      .field("numero_cuenta", nuevaInfo.numero_cuenta)
      .field("nuevo_archivo", nuevaInfo.nuevo_archivo)
      .attach("file", file, "custom_file.pdf")
      .set("Authorization", `Bearer ${jwt}`);
    const rutaVieja = ruta;
    ruta = response.body.documento;
    expect(response.status).toBe(201);
    expect(response.body.nombres).toBe(nuevaInfo.nombres);
    expect(response.body.apellidos).toBe(nuevaInfo.apellidos);
    expect(response.body.documento).not.toEqual(rutaVieja);
  });
});

describe("-----Test de endpoint de actualizar estado de empleados-----", () => {
  test("[PUT code 201] [/api/1.0/employee/state/:_id] Test de actualizar estado de un empleado INACTIVO a ACTIVO", async () => {
    const response = await request(app)
      .put(`/api/1.0/employee/state/${_id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ concepto: "Se actualizo estado" });
    expect(response.status).toBe(201);
    expect(response.body.estado).toBe("ACTIVO");
    expect(response.body.concepto).toBe("Se actualizo estado");
  });

  test("[PUT code 201] [/api/1.0/employee/state/:_id] Test de actualizar estado de un empleado ACTIVO A INACTIVO", async () => {
    const response = await request(app)
      .put(`/api/1.0/employee/state/${_id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ concepto: "Se actualizo estado" });
    expect(response.status).toBe(201);
    expect(response.body.estado).toBe("INACTIVO");
    expect(response.body.concepto).toBe("Se actualizo estado");
  });

  test("[PUT code 400] [/api/1.0/employee/state/:_id] Test de actualizar estado de un empleado con identificador sin uso", async () => {
    let idEstado = mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/1.0/employee/state/${idEstado}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ concepto: "Se actualizo estado" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El empleado no existe");
  });

  test("[PUT code 400] [/api/1.0/employee/state/:_id] Test de actualizar estado de un empleado con identificador inválido", async () => {
    const response = await request(app)
      .put(`/api/1.0/employee/state/UnIdentificador`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ concepto: "Se actualizo estado" });
    expect(response.status).toBe(400);
  });

  test("[PUT code 404] [/api/1.0/employee/state/:_id] Test de actualizar estado de un empleado sin parametro de identificador", async () => {
    const response = await request(app)
      .put(`/api/1.0/employee/state/`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ concepto: "Se actualizo estado" });
    expect(response.status).toBe(404);
  });
});

describe("-----Test de endpoint de obtener información de un empleado-----", () => {
  test("[GET code 200] [/api/1.0/employee/get/:_id] Test de obtener información de un empleado existente", async () => {
    const response = await request(app)
      .get(`/api/1.0/employee/get/${_id}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.body._id);
    expect(response.body.nombres).toBe("Nuevos nombres");
    expect(response.body.apellidos).toBe("Nuevos apellidos");
    expect(response.body.tipo_documento).toBe("CE");
    expect(response.body.numero_documento).toBe("1234567890");
    expect(response.body.documento).toBe(ruta);
    expect(response.body.correo).toBe(info.correo);
    expect(response.body.numero_celular).toBe(info.numero_celular);
    expect(response.body.ciudad_residencia).toBe("Nueva ciudad");
    expect(response.body.direccion_residencia).toBe("Nueva dirección");
    expect(response.body.metodo_pago).toBe(info.metodo_pago);
    expect(response.body.entidad_bancaria).toBe(info.entidad_bancaria);
    expect(response.body.tipo_cuenta).toBe(info.tipo_cuenta);
    expect(response.body.numero_cuenta).toBe(info.numero_cuenta);
  });

  test("[GET code 400] [/api/1.0/employee/get/:_id] Test de obtener información de un empleado inexistente", async () => {
    const idInvalido = mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/1.0/employee/get/${idInvalido}`)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El empleado no existe");
  });
});

describe("-----Test de endpoint de obtener empleados sin contrato-----", () => {
  test("[GET code 200] [/api/1.0/employee/without-contract] Test de obtener empleados sin un contrato vinculado", async () => {
    const response = await request(app)
      .get("/api/1.0/employee/without-contract")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
  });
});

afterAll(async () => {
  ruta = ruta.split("/");
  const nombreArchivo = ruta[ruta.length - 1];
  await Promise.all([
    Usuario.deleteMany({ usuario: ["admin"] }),
    Roles.deleteMany({ _id: ["ADMIN", "REPORTS"] }),
    Empleado.deleteMany({
      correo: [
        info.correo,
        empleado1.correo,
        empleado2.correo,
        empleado3.correo,
      ],
    }),
  ]);
  mongoose.connection.close();
  server.close();
  ruta = path.normalize(
    `${process.cwd()}/server/archivos/documentos/${nombreArchivo}`
  );
  fs.unlinkSync(ruta);
});
