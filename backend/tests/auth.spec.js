/**
 * Archivo de tests para autenticación
 *
 * @author Juan-CamiloF
 */
const mongoose = require("mongoose");
const { app, server } = require("../server/index");
const request = require("supertest");

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

const correo = { correo: process.env.CORREO };

let usuario = {};

const nuevaContrasenia = {
  nuevaContrasenia: "otracontrasenia",
};
let jwt;

beforeEach(async () => {
  const response = await request(app).post("/api/1.0/auth").send(admin);
  jwt = response.body.jwt;
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
    expect(response.status).toBe(401);
  });
});

describe("-----Test de endpoint de validar sesión-----", () => {
  test("[GET code 200] [/api/1.0/auth] Test de validación de sesión válida", async () => {
    const response = await request(app)
      .get("/api/1.0/auth")
      .auth(jwt, { type: "bearer" });
    expect(response.header["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(response.status).toBe(200);
    expect(response.body.acceso).toBe(true);
  });

  test("[GET code 401] [/api/1.0/auth] Test de validación de sesión inválida", async () => {
    const response = await request(app)
      .get("/api/1.0/auth")
      .set("Authorization", "UnTokenMuyInválido");
    expect(response.status).toBe(401);
  });
});

describe("-----Test de endpoint para información de la sesión", () => {
  test("[GET code 200] [/api/1.0/auth/info] Test de información de la sesión con token válido", async () => {
    const response = await request(app)
      .get("/api/1.0/auth/info")
      .auth(jwt, { type: "bearer" });
    expect(response.header["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(response.status).toBe(200);
    expect(response.body.usuario).toBe("admin");
    expect(response.body.nombre).toBe(process.env.NOMBRE);
    expect(response.body.correo).toBe(process.env.CORREO);
  });

  test("[GET code 200] [/api/1.0/auth/info] Test de información de la sesión con token inválido", async () => {
    const response = await request(app)
      .get("/api/1.0/auth/info")
      .auth("UnTokenMuyInvalido", { type: "bearer" });
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
      .send({ correo: "unCorreoMuyInválido" });
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
      .send({nuevaContrasenia:"admin"});
  });
  test("[PUT code 400] [/api/1.0/auth/create-new-password/{token}] Test para crear una nueva contraseña de un usuario y token inválido", async () => {
    const response = await request(app)
      .put(`/api/1.0/auth/create-new-password/${"tokenInvalido"}`)
      .send(nuevaContrasenia);
    expect(response.status).toBe(500);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
