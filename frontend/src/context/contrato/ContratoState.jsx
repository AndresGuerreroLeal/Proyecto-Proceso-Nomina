import { useState } from "react";

//Context
import ContratoContext from "./ContratoContext";

const ContratoState = ({ children }) => {
  const [contratos,setContratos] = useState([])

  const crearContrato = async (contrato) => {
    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.post(
        "/api/1.0/contract/create",
        contrato,
        TokenAuth(token)
      );

      setContratos([...contratos, data]);

      mostrarAlerta({
        message: "El contrato se creo correctamente",
        categoria: "success",
      });

      setTimeout(() => {
        navigate("/home/empleados");
      }, 2000);
    } catch (err) {
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
      console.log(err.response);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ContratoContext.Provider
      value={{
        contratos,
        crearContrato
      }}
    >
      {children}
    </ContratoContext.Provider>
  );
};

export default ContratoState;
