import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  usuario: Yup.string().required("Usuario requerido"),
  contrasenia: Yup.string()
    .min(5, "Contraseña inválida")
    .required("Contraseña requerida"),
});
