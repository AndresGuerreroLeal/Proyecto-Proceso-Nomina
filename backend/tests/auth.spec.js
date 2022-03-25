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

let jwt = "";

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
      .auth(jwt, {type:"bearer"});
    expect(response.header["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(response.status).toBe(200);
    expect(response.body.acceso).toBe(true);
  });

  test("[GET code 401] [/api/1.0/auth] Test de validación de sesión inválida", async () => {
    const response = await request(app)
      .get("/api/1.0/auth")
      .set("Authorization", 'UnTokenMuyInválido');
    expect(response.status).toBe(401);
  });

});

describe("-----Test de endpoint para información de la sesión",()=>{

  test("[GET code 200] [/api/1.0/auth/info] Test de información de la sesión", async () => {
    const response = await request(app)
      .get("/api/1.0/auth/info")
      .auth(jwt, {type:"bearer"});
    expect(response.header["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(response.status).toBe(200);
    expect(response.body.usuario).toBe("admin")
    expect(response.body.nombre).toBe(process.env.NOMBRE);
    expect(response.body.correo).toBe(process.env.CORREO);
  });

test("[GET code 200] [/api/1.0/auth/info] Test de información de la sesión", async () => {
    const response = await request(app)
      .get("/api/1.0/auth/info")
      .auth("UnTokenMuyInvalido", {type:"bearer"});
    expect(response.status).toBe(403);
  });

})

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
