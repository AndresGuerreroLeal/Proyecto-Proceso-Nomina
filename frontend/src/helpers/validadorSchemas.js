import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  usuario: Yup.string().required("Usuario requerido"),
  contrasenia: Yup.string()
    .min(5, "Contraseña inválida")
    .required("Contraseña requerida"),
});

const OlvideContraseniaSchema = Yup.object().shape({
  correo: Yup.string().email("Correo inválido").required("Correo requerido"),
});

const NuevaContraseniaSchema = Yup.object().shape({
  contrasenia: Yup.string()
    .min(5, "Contraseña inválida")
    .required("Contraseña requerida"),
  confirmarContrasenia: Yup.string()
    .min(5, "Contraseña inválida")
    .required("Contraseña requerida")
    .oneOf([Yup.ref("contrasenia"), null], "Contraseña no coincide"),
});

const PerfilSchema = Yup.object().shape({
  usuario: Yup.string().required("Usuario requerido"),
  nombre: Yup.string().required("Nombre requerido"),
  correo: Yup.string().email("Correo inválido").required("Correo requerido"),
});

const ActualizarContraseniaSchema = Yup.object().shape({
  contraseniaActual: Yup.string()
    .min(5, "Contraseña inválida")
    .required("Contraseña requerida"),
  contraseniaNueva: Yup.string()
    .min(5, "Contraseña nueva inválida")
    .required("Contraseña nueva requerida"),
  confirmarContraseniaNueva: Yup.string()
    .min(5, "Contraseña inválida")
    .required("Contraseña requerida")
    .oneOf([Yup.ref("contraseniaNueva"), null], "Contraseña no coincide"),
});

const EmpleadoSchema = Yup.object().shape({
  nombres: Yup.string().required("Nombres requeridos"),
  apellidos: Yup.string().required("Apellidos requeridos"),
  genero: Yup.string().required("Genero requerido"),
  numero_celular: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(10, "Número inválido debe ser mínimo 10 dígitos")
    .max(10, "Número inválido debe ser máximo 10 dígitos")
    .required("Número de celular requerido"),
  correo: Yup.string().email("Correo inválido").required("Correo requerido"),
  tipo_documento: Yup.string().required("Tipo de documento requerido"),
  numero_documento: Yup.string()
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(10, "Debe ser mínimo de 10 dígitos")
    .max(10, "Debe ser máximo de 10 dígitos")
    .required("Número de documento requerido"),
  file: Yup.mixed().required("Archivo requerido"),
  ciudad_residencia: Yup.string().required("Ciudad de residencia requerido"),
  direccion_residencia: Yup.string().required(
    "Dirección de residencia requerido"
  ),
  metodo_pago: Yup.string().required("Metodo de pago requerido"),
  entidad_bancaria: Yup.string().required("Entidad bancaria requerido"),
  tipo_cuenta: Yup.string().required("Tipo de cuenta requerido"),
  numero_cuenta: Yup.string()
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(10, "Debe ser mínimo de 10 dígitos")
    .max(16, "Debe ser máximo de 16 dígitos")
    .required("Número de cuenta requerido"),
});

const ConceptoSchema = Yup.object().shape({
  concepto: Yup.string().required("Concepto requerido"),
});

const ContratoSchema = Yup.object().shape({
  numero_contrato: Yup.number("Caracteres inválidos")
    .min(10, "Número de contrato inválido")
    .required("Número de contrato requerido"),
  tipo_contrato: Yup.string().required("Tipo de contrato requerido"),
  fecha_inicio: Yup.date().required("Fecha de inicio requerida"),
  sueldo: Yup.string()
    .matches(/^[0-9]+(,[0-9]+,[0-9]+)?$/, "Valor inválido")
    .required("Sueldo requerido")
    .min(0, "Sueldo inválido")
    .max(100000000, "Sueldo inválido"),
  cargo: Yup.string().required("Cargo requerido"),
  tipo_cotizante: Yup.string().required("Tipo de cotizante requerido"),
  fondo_salud: Yup.string().required("Fondo de salud requerido"),
  porcentaje_salud_empleado: Yup.number("Caracteres inválidos")
    .max(4, "Porcentaje de salud de empleado inválido")
    .required("Porcentaje de salud de empleado requerido"),
  porcentaje_salud_empleador: Yup.number("Caracteres inválidos")
    .max(8.5, "Porcentaje de salud de empleador inválido")
    .required("Porcentaje de salud de empleador requerido"),
  fondo_pensiones: Yup.string().required("Fondo de pensiones requerido"),
  porcentaje_pension_empleado: Yup.number("Caracteres inválidos")
    .max(4, "Porcentaje de pensión de empleado inválido")
    .required("Porcentaje de pensión de empleado requerido"),
  porcentaje_pension_empleador: Yup.number("Caracteres inválidos")
    .max(12, "Porcentaje de pensión de empleador inválido")
    .required("Porcentaje de pensión de empleador requerido"),
  arl: Yup.string().required("Arl requerido"),
  porcentaje_arl: Yup.number("Caracteres inválidos")
    .min(0.522, "Debe ser mínimo de 0.522")
    .max(6.96, "Debe ser máximo de 6.960")
    .required("Porcentaje de arl requerido"),
  fondo_cesantias: Yup.string().required("Fondo de cesantias requerido"),
  porcentaje_parafiscal_sena: Yup.number("Caracteres inválidos")
    .max(2, "Debe ser máximo del 2%")
    .required("Porcentaje parafiscal sena requerido"),
  porcentaje_parafiscal_icbf: Yup.number("Caracteres inválidos")
    .max(3, "Debe ser máximo del 3%")
    .required("Porcentaje parafiscal ICBF requerido"),
  porcentaje_parafiscal_caja_compensacion: Yup.number("Caracteres inválidos")
    .max(4, "Debe ser máximo del 4%")
    .required("Porcentaje parafiscal caja de compesación requerido"),
});

const NominaSchema = Yup.object().shape({
  nombre: Yup.string().required("Nombre requerido"),
  anio: Yup.string().required("Año requerido"),
  mes: Yup.string().required("Mes requerido"),
});

const NovedadSchema = Yup.object().shape({
  valor: Yup.string()
    .required("Valor requerido")
    .min(0, "Valor inválido")
    .max(100000000, "Sueldo inválido"),
  concepto: Yup.string().required("Concepto requerido"),
});


export default {
  LoginSchema,
  OlvideContraseniaSchema,
  NuevaContraseniaSchema,
  PerfilSchema,
  EmpleadoSchema,
  ActualizarContraseniaSchema,
  ConceptoSchema,
  ContratoSchema,
  NominaSchema,
  NovedadSchema,
};
