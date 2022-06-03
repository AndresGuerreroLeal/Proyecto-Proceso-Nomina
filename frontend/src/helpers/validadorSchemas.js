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

const ActualizarContrasenia = Yup.object().shape({
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
    .matches(/^[0-9]+$/, "Solo se aceptas digitos")
    .min(10, "Numero inválido debe ser de 10 numeros")
    .max(10, "Numero inválido debe ser de 10 numeros")
    .required("Numero de celular requerido"),
  correo: Yup.string().email("Correo inválido").required("Correo requerido"),
  tipo_documento: Yup.string().required("Tipo de documento requerido"),
  numero_documento: Yup.string()
    .matches(/^[0-9]+$/, "Solo se aceptas digitos")
    .min(5, "Debe ser minimo de 5 digitos")
    .max(10, "Debe ser maximo de 10 digitos")
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
    .matches(/^[0-9]+$/, "Solo se aceptas digitos")
    .min(10, "Debe ser minimo de 10 digitos")
    .max(16, "Debe ser maximo de 16 digitos")
    .required("Numero de cuenta requerido"),
});

export default {
  LoginSchema,
  OlvideContraseniaSchema,
  NuevaContraseniaSchema,
  PerfilSchema,
  EmpleadoSchema,
  ActualizarContrasenia,
};
