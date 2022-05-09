import { useContext, useState } from "react";

// Config
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";
import AlertaContext from "../alerta/AlertaContext";

// Context
import EmpleadoContext from "./EmpleadoContext";

const EmpleadoState = ({ children }) => {
  const [alertaempleado, setAlertaEmpleado] = useState({});
  const [cargando, setCargando] = useState(false);

  const { mostrarAlerta } = useContext(AlertaContext);

  const crearEmpleado = async (empleado) => {
    setCargando(true);

    try {
      let formData = new FormData();

      formData.append("file", empleado.file);
      formData.append("nombres", empleado.nombres);
      formData.append("apellidos", empleado.apellidos);
      formData.append("tipo_documento", empleado.tipo_documento);
      formData.append("numero_documento", empleado.numero_documento);
      formData.append("correo", empleado.correo);
      formData.append("numero_celular", empleado.numero_celular);
      formData.append("ciudad_residencia", empleado.ciudad_residencia);
      formData.append("direccion_residencia", empleado.direccion_residencia);
      formData.append("metodo_pago", empleado.metodo_pago);
      formData.append("entidad_bancaria", empleado.entidad_bancaria);
      formData.append("tipo_cuenta", empleado.tipo_cuenta);
      formData.append("numero_cuenta", empleado.numero_cuenta);

      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.post(
        "/api/1.0/employee/create",
        formData,
        TokenAuth(token, true)
      );

      mostrarAlerta({
        message: "El empleado se creo correctamente",
        categoria: "success",
      });
    } catch (err) {
      console.log(err.response);
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <EmpleadoContext.Provider
      value={{
        cargando,
        crearEmpleado,
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
};

export default EmpleadoState;
