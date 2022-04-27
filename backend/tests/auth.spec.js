/**
 * Archivo de tests para autenticación
 *
 * @author Juan-CamiloF
 */

const mongoose = require("mongoose");
const { app, server } = require("../server/index");
const request = require("supertest");
const Usuario = require("../server/models/usuarios");
const Roles = require("../server/models/roles");

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

const correo = { correo: process.env.CORREO_ADMIN };
const correoInvalido = { correo: "unCorreoInválido@gmail.com" };
let usuario = {};

const nuevaContrasenia = {
  nuevaContrasenia: "otracontrasenia",
};

const actualizarContrasenia = {
  contrasenia: "admin",
  nuevaContrasenia: "otroAdmin",
};

const actualizarContraseniaInvalida = {
  contrasenia: "estaNoEsLaContraseña",
  nuevaContrasenia: "laVerdadNoImporta",
};

const usuarioValido = {
  nombre: "Otro nombre Nuevo",
  correo: "unCorreoVálido@gmail.com",
  usuario: "adminUpdate",
};

const usuarioNuevo = {
  nombre: "Nuevo usuario",
  correo: "usuarioCorreoNuevo@gmail.com",
  usuario: "usuarioNuevo",
};

const usuarioOriginal = {
  correo: process.env.CORREO_ADMIN,
  nombre: process.env.NOMBRE,
  usuario: "admin",
};

const correoEnUso = {
  nombre: usuarioValido.nombre,
  correo: usuarioNuevo.correo,
  usuario: usuarioValido.usuario,
};

const usuarioEnUso = {
  nombre: usuarioValido.nombre,
  correo: usuarioValido.correo,
  usuario: usuarioNuevo.usuario,
};

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

describe("-----Test de endpoint de autentación-----", () => {
  test("[POST code 200] [/api/1.0/auth] Test de autenticación correcta", async () => {
    const response = await request(app).post("/api/1.0/auth").send(admin);
    expect(response.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(response.status).toBe(200);
    expect(response.body.jwt);
  });

  test("[POST code 401] [/api/1.0/auth] Test de autenticación incorrecta", async () => {
    const response = await request(app).post("/api/1.0/auth").send();
    expect(response.status).toBe(400);
  });
});

describe("-----Test de endpoint de validar sesión-----", () => {
  test("[GET code 200] [/api/1.0/auth] Test de validación de sesión válida", async () => {
    const response = await request(app)
      .get("/api/1.0/auth")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.header["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(response.status).toBe(200);
    expect(response.body.acceso).toBe(true);
  });

  test("[GET code 401] [/api/1.0/auth] Test de validación de sesión inválida", async () => {
    const response = await request(app).get("/api/1.0/auth");
    expect(response.status).toBe(200);
    expect(response.body.acceso).toBe(false);
  });
});

describe("-----Test de endpoint para información de la sesión-----", () => {
  test("[GET code 200] [/api/1.0/auth/info] Test de información de la sesión con token válido", async () => {
    const response = await request(app)
      .get("/api/1.0/auth/info")
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.header["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(response.status).toBe(200);
    expect(response.body.usuario).toBe("admin");
    expect(response.body.nombre).toBe(process.env.NOMBRE);
    expect(response.body.correo).toBe(process.env.CORREO_ADMIN);
    expect(response.body.roles[0]).toBe("ADMIN");
    expect(response.body.roles[1]).toBe("REPORTS");
  });

  test("[GET code 200] [/api/1.0/auth/info] Test de información de la sesión con token inválido", async () => {
    const response = await request(app)
      .get("/api/1.0/auth/info")
      .set("Authorization", `Bearer unTokenMuyInvalido`);
    expect(response.status).toBe(403);
  });
});

describe("-----Test de endpoint olvide mi contraseña-----", () => {
  test("[PUT code 200] [/api/1.0/auth/forgot-password] Test de olvide mi contraseña con correo válido", async () => {
    const response = await request(app)
      .put("/api/1.0/auth/forgot-password")
      .send(correo);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Se ha enviado las instrucciones al correo electrónico proporcionado"
    );
    usuario = await mongoose.connection
      .collection("usuarios")
      .findOne({ usuario: "admin" });
  });

  test("[PUT code 400] [/api/1.0/auth/forgot-password] Test de olvide mi contraseña con correo inválido", async () => {
    const response = await request(app)
      .put("/api/1.0/auth/forgot-password")
      .send(correoInvalido);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No se ha enviado las instrucciones al correo electrónico proporcionado"
    );
  });
});

describe("-----Test de endpoint crear una nueva contraseña-----", () => {
  test("[PUT code 201] [/api/1.0/auth/create-new-password/{token}] Test para crear una nueva contraseña de un usuario y token válido", async () => {
    const response = await request(app)
      .put(`/api/1.0/auth/create-new-password/${usuario.tokenCuenta}`)
      .send(nuevaContrasenia);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Se ha cambiado la contraseña éxitosamente"
    );
    //Volver la contraseña al estado original
    await request(app)
      .put(`/api/1.0/auth/create-new-password/${usuario.tokenCuenta}`)
      .send({ nuevaContrasenia: "admin" });
  });

  test("[PUT code 400] [/api/1.0/auth/create-new-password/{token}] Test para crear una nueva contraseña de un usuario y token inválido", async () => {
    const response = await request(app)
      .put(`/api/1.0/auth/create-new-password/${"tokenInvalido"}`)
      .send(nuevaContrasenia);
    expect(response.status).toBe(500);
  });
});

describe("-----Test de endpoint actualizar contraseña-----", () => {
  test("[PUT code 201] [/api/1.0/auth/update-password] Test para actualizar una contraseña de manera válida", async () => {
    const response = await request(app)
      .put("/api/1.0/auth/update-password")
      .set("Authorization", `Bearer ${jwt}`)
      .send(actualizarContrasenia);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Contraseña actualizada con éxito");
    //Volver la contraseña al estado original
    await request(app)
      .put(`/api/1.0/auth/create-new-password/${usuario.tokenCuenta}`)
      .send({ nuevaContrasenia: "admin" });
  });

  test("[PUT code 400] [/api/1.0/auth/update-password] Test para actualizar una contraseña de manera inválida", async () => {
    const response = await request(app)
      .put("/api/1.0/auth/update-password")
      .set("Authorization", `Bearer ${jwt}`)
      .send(actualizarContraseniaInvalida);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Contraseña inválida");
  });
});

describe("-----Test de endpoint actualizar información------", () => {
  test("[PUT code 201] [/api/1.0/auth/update-info] Test para actualizar la información de una manera válida", async () => {
    const response = await request(app)
      .put("/api/1.0/auth/update-info")
      .set("Authorization", `Bearer ${jwt}`)
      .send(usuarioValido);
    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe(usuarioValido.nombre);
    expect(response.body.usuario).toBe(usuarioValido.usuario);
    expect(response.body.correo).toBe(usuarioValido.correo);
    //Volver el usuario al estado original
    await request(app)
      .put("/api/1.0/auth/update-info")
      .set("Authorization", `Bearer ${jwt}`)
      .send(usuarioOriginal);
  });

  test("[PUT code 400] [/api/1.0/auth/update-info] Test para actualizar la información con correo en uso", async () => {
    //Se ingresa un nuevo usuario
    mongoose.connection.collection("usuarios").insertOne({
      nombre: usuarioNuevo.nombre,
      correo: usuarioNuevo.correo,
      usuario: usuarioNuevo.usuario,
      contrasenia:
        "$2a$10$mC77qjUBQz5SiyZ1jtcHa.2GKrJ/PgKFw7Q19ahCeoCHJKqefCCOq",
      ultimoAcceso: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .put("/api/1.0/auth/update-info")
      .set("Authorization", `Bearer ${jwt}`)
      .send(correoEnUso);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El nuevo correo ya está registrado");
  });

  test("[PUT code 400] [/api/1.0/auth/update-info] Test para actualizar la información con usuario en uso", async () => {
    const response = await request(app)
      .put("/api/1.0/auth/update-info")
      .set("Authorization", `Bearer ${jwt}`)
      .send(usuarioEnUso);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El nuevo usuario ya está registrado");
  });
});

afterAll(async () => {
  await Usuario.deleteMany({ usuario: ["admin", "usuarioNuevo"] });
  await Roles.deleteMany({ _id: ["ADMIN", "REPORTS"] });
  mongoose.connection.close();
  server.close();
});
