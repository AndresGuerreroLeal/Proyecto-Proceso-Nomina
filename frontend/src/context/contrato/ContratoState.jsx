import { useState,useContext } from "react";

//Context
import ContratoContext from "./ContratoContext";
import AlertaContext from "../alerta/AlertaContext"
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";

import { useNavigate } from "react-router-dom";

const ContratoState = ({ children }) => {
  const [contratos,setContratos] = useState([])
  const [cargando,setCargando] = useState(false)
  const [contratoEditar, setContratoEditar] = useState(null);

  const {mostrarAlerta} = useContext(AlertaContext)

  const navigate = useNavigate();

  const crearContrato = async (contrato) => {
    setCargando(true);

    const salarioMinimo = 1000000

    if (contrato.sueldo >= salarioMinimo * 2) {
      contrato.auxilio_transporte = 0;
    } else {
      contrato.auxilio_transporte = 117172;
    }

    if (contrato.sueldo >= salarioMinimo * 10) {
      contrato.salario_integral = true;
    } else {
      contrato.salario_integral = false;
    }

    try {
      const token = localStorage.getItem("token");

      console.log(contrato);

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
        navigate("/home/contratos");
      }, 2000);

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

  const obtenerContratoEditarAPI = () => {};

  const editarContrato = () => {};

  return (
    <ContratoContext.Provider
      value={{
        contratos,
        cargando,
        contratoEditar,
        crearContrato,
        obtenerContratoEditarAPI,
        editarContrato,
      }}
    >
      {children}
    </ContratoContext.Provider>
  );
};

export default ContratoState;
