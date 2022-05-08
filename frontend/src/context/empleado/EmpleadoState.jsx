import { useState } from "react";

// Config
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";

// Context
import EmpleadoContext from "./EmpleadoContext";

const EmpleadoState = ({ children }) => {
  const [alertaemplado, setAlertaEmplado] = useState({});

  const crearEmpleado = async (empleado) => {
    try {
      let formData = new FormData();

      const pdf = empleado.file.files[0]

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

      console.log(data);
    } catch (err) {
      console.log(err);
      setAlertaEmplado({
        message: err.response.data.message,
      });
    }
  };

  return (
    <EmpleadoContext.Provider
      value={{
        alertaemplado,
        crearEmpleado,
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
};

export default EmpleadoState;
