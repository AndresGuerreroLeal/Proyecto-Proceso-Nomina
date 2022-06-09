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
    .min(10, "Numero inválido debe ser de 10 numeros")
    .max(10, "Numero inválido debe ser de 10 numeros")
    .required("Numero de celular requerido"),
  correo: Yup.string().email("Correo inválido").required("Correo requerido"),
  tipo_documento: Yup.string().required("Tipo de documento requerido"),
  numero_documento: Yup.string()
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(10, "Debe ser minimo de 10 dígitos")
    .max(10, "Debe ser maximo de 10 dígitos")
    .required("Numero de documento requerido"),
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
    .min(10, "Debe ser minimo de 10 dígitos")
    .max(16, "Debe ser maximo de 16 dígitos")
    .required("Numero de cuenta requerido"),
});

const ConceptoSchema = Yup.object().shape({
  concepto: Yup.string().required("Concepto requerido"),
});

const ContratoSchema = Yup.object().shape({
  numero_contrato: Yup.string()
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .required("Número de contrato requerido"),
  tipo_contrato: Yup.string().required("Tipo de contrato requerido"),
  fecha_inicio: Yup.date().min(new Date(), "Fecha de inicio requerido"),
  sueldo: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .max(9, "Sueldo inválido")
    .required("Sueldo requerido"),
  cargo: Yup.string().required("Cargo requerido"),
  tipo_cotizante: Yup.string().required("Tipo de cotizante requerido"),
  auxilio_transporte: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .max(6, "Auxilio de transporte inválido")
    .required("Auxilio de transporte requerido"),
  fondo_salud: Yup.string().required("Fondo de salud requerido"),
  porcentaje_salud_empleado: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(4, "Porcentaje de salud de empleado inválido")
    .max(4, "Porcentaje de salud de empleado inválido")
    .required("Porcentaje de salud de empleado requerido"),
  porcentaje_salud_empleador: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(4, "Porcentaje de salud de empleador inválido")
    .max(4, "porcentaje de salud de empleador inválido")
    .required("Porcentaje de salud de empleador requerido"),
  fondo_pensiones: Yup.string().required("Fondo de pensiones requerido"),
  porcentaje_pension_empleado: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(4, "Porcentaje de pensión de empleado inválido")
    .max(4, "Porcentaje de pensión de empleado inválido")
    .required("Porcentaje de pensión de empleado requerido"),
  porcentaje_pension_empleador: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(4, "Porcentaje de pensión de empleador inválido")
    .max(4, "Porcentaje de pensión de empleador inválido")
    .required("Porcentaje de pensión de empleador requerido"),
  arl: Yup.string().required("Arl requerido"),
  porcentaje_arl: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(0.522, "Debe ser minimo de 0.522")
    .max(6.96, "Debe ser maximo de 6.960")
    .required("Porcentaje de arl requerido"),
  fondo_cesantias: Yup.string().required("Fondo de cesantias requerido"),
  porcentaje_parafiscal_sena: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(2, "Debe ser minimo del 2%")
    .required("Porcentaje parafiscal sena requerido"),
  porcentaje_parafiscal_icbf: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(3, "Debe ser minimo del 3%")
    .required("Porcentaje parafiscal ICBF requerido"),
  porcentaje_parafiscal_caja_compensacion: Yup.string("Caracteres inválidos")
    .matches(/^[0-9]+$/, "Solo se aceptan dígitos")
    .min(4, "Debe ser minimo del 4%")
    .required("Porcentaje parafiscal caja de compesación requerido"),
  salario_integral: Yup.bool().oneOf([true], "Salario integral inválido "),
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
};
