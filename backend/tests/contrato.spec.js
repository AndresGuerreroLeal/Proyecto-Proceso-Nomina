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

const admin = {
  usuario: "admin",
  contrasenia: "admin",
};

let jwt;

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
  porcentaje_pensiones_empleado: 4,
  porcentaje_pensiones_empleador: 12,
  arl: "Arl",
  porcentaje_arl: 0.522,
  fondo_cesantias: "Fondo de cesantias",
  porcentaje_parafiscal_sena: 0,
  porcentaje_parafiscal_ICBF: 0,
  porcentaje_parafiscal_caja_compensacion: 4,
  salario_integral: false,
};

/* Cálculos de valores del contrato para nomina */

const aportesSaludEmpleado = Math.round(
  contrato.sueldo * (contrato.porcentaje_salud_empleado / 100)
);

const aportesSaludEmpleador = contrato.salario_integral
  ? Math.round(contrato.sueldo * (contrato.porcentaje_salud_empleador / 100))
  : 0;

const aportesPensionEmpleado = Math.round(
  contrato.sueldo * (contrato.porcentaje_pensiones_empleado / 100)
);
const aportesPensionEmpleador = Math.round(
  contrato.sueldo * (contrato.porcentaje_pensiones_empleador / 100)
);

const valorArl = Math.round(contrato.sueldo * (contrato.porcentaje_arl / 100));

const valorPrimaServicios = Math.round(
  (contrato.sueldo + contrato.auxilio_transporte) * (100 / 12 / 100)
);

const valorCesantias = Math.round(
  (contrato.sueldo + contrato.auxilio_transporte) * (100 / 12 / 100)
);

const valorInteresesCesantias = Math.round(
  (contrato.sueldo + contrato.auxilio_transporte) * (1 / 100)
);

const valorVacaciones = Math.round(contrato.sueldo * (50 / 12 / 100));

const porcentajeParafiscalSena = contrato.salario_integral
  ? contrato.porcentaje_parafiscal_sena
  : 0;

const valorParafiscalSena = Math.round(
  contrato.sueldo * (porcentajeParafiscalSena / 100)
);

const porcentajeParafiscalICBF = contrato.salario_integral
  ? contrato.porcentaje_parafiscal_ICBF
  : 0;

const valorParafiscalICBF = Math.round(
  contrato.sueldo * (porcentajeParafiscalICBF / 100)
);

const valorParafiscalCajaCompesacion = Math.round(
  contrato.sueldo * (contrato.porcentaje_parafiscal_caja_compensacion / 100)
);

const totalDeducciones = aportesSaludEmpleado + aportesPensionEmpleado;

const totalDevengos =
  contrato.sueldo + contrato.auxilio_transporte - totalDeducciones;

const totalValorEmpleado =
  contrato.sueldo +
  contrato.auxilio_transporte +
  (aportesSaludEmpleador + aportesPensionEmpleador + valorArl) +
  (valorPrimaServicios +
    valorCesantias +
    valorInteresesCesantias +
    valorVacaciones) +
  (valorParafiscalSena + valorParafiscalICBF + valorParafiscalCajaCompesacion);

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
  ]);
});

beforeEach(async () => {
  //Inicio de sesión y captura del token
  const response = await request(app).post("/api/1.0/auth").send(admin);
  jwt = await response.body.jwt;
});

describe("-----Test de endpoint crear un contrato-----", () => {
  test("[POST code 201]  [/api/1.0/contract/create] Test de crear un contrato válido", async () => {
    const response = await request(app)
      .post("/api/1.0/contract/create")
      .send(contrato)
      .set("Authorization", `Bearer ${jwt}`);
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
      contrato.porcentaje_salud_empleador
    );
    expect(response.body.aportes_salud_empleado).toBe(aportesSaludEmpleado);
    expect(response.body.aportes_salud_empleador).toBe(aportesSaludEmpleador);
    expect(response.body.fondo_pensiones).toBe(contrato.fondo_pensiones);
    expect(response.body.porcentaje_pensiones_empleado).toBe(
      contrato.porcentaje_pensiones_empleado
    );
    expect(response.body.porcentaje_pensiones_empleador).toBe(
      contrato.porcentaje_pensiones_empleador
    );
    expect(response.body.aportes_pension_empleado).toBe(aportesPensionEmpleado);
    expect(response.body.aportes_pension_empleador).toBe(
      aportesPensionEmpleador
    );
    expect(response.body.arl).toBe(contrato.arl);
    expect(response.body.porcentaje_arl).toBe(contrato.porcentaje_arl);
    expect(response.body.valor_arl).toBe(valorArl);
    expect(response.body.valor_prima_servicios).toBe(valorPrimaServicios);
    expect(response.body.fondo_cesantias).toBe(contrato.fondo_cesantias);
    expect(response.body.valor_cesantias).toBe(valorCesantias);
    expect(response.body.valor_intereses_cesantias).toBe(
      valorInteresesCesantias
    );
    expect(response.body.valor_vacaciones).toBe(valorVacaciones);
    expect(response.body.porcentaje_parafiscal_sena).toBe(
      porcentajeParafiscalSena
    );
    expect(response.body.valor_parafiscal_sena).toBe(valorParafiscalSena);
    expect(response.body.porcentaje_parafiscal_ICBF).toBe(
      porcentajeParafiscalICBF
    );
    expect(response.body.valor_parafiscal_ICBF).toBe(valorParafiscalICBF);
    expect(response.body.porcentaje_parafiscal_caja_compensacion).toBe(
      contrato.porcentaje_parafiscal_caja_compensacion
    );
    expect(response.body.valor_parafiscal_caja_compensacion).toBe(
      valorParafiscalCajaCompesacion
    );
    expect(response.body.total_devengos).toBe(totalDevengos);
    expect(response.body.total_deducciones).toBe(totalDeducciones);
    expect(response.body.total_valor_empleado).toBe(totalValorEmpleado);
    expect(response.body.salario_integral).toBe(contrato.salario_integral);
  });

  test("[POST code 400] [api/1.0/contract/create] Test para crear un contrato con un número de contrato registrado", async () => {
    const response = await request(app)
      .post("/api/1.0/contract/create")
      .send(contrato)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El número de contrato ya fue registrado"
    );
  });

  test("[POST code 400] [api/1.0/contract/create] Test para crear un contrato sin un empleado relacionado", async () => {
    contrato.numero_contrato = "1111111111";
    const response = await request(app)
      .post("/api/1.0/contract/create")
      .send(contrato)
      .set("Authorization", `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El contrato no tiene un empleado definido"
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
    Contrato.deleteOne({ numero_contrato: empleado.numero_documento }),
  ]);
  mongoose.connection.close();
  server.close();
});
