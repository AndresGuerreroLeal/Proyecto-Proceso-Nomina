import { useState,useContext } from "react";

//Context
import ContratoContext from "./ContratoContext";
import AlertaContext from "../alerta/AlertaContext"
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";

import { useNavigate } from "react-router-dom";

const ContratoState = ({ children }) => {
  const [contratos,setContratos] = useState([])
  const [reportesContratos,setReportesContratos] = useState([])
  const [cargando,setCargando] = useState(false)
  const [contratoEditar, setContratoEditar] = useState(null);
  const [contrato,setContrato] = useState({})
  const [modalContrato,setModalContrato] = useState(false)

  const [pageContratos, setPageContratos] = useState(0);
  const [rowsPerPageContratos, setRowsPerPageContratos] = useState(5);
  const [totalpagesContratos, setTotalPagesContratos] = useState(0);
  const [countContratos, setCountContratos] = useState(0);

  const [pageReportes, setPageReportes] = useState(0);
  const [rowsPerPageReportes, setRowsPerPageReportes] = useState(5);
  const [totalpagesReportes, setTotalPagesReportes] = useState(0);
  const [countReportes, setCountReportes] = useState(0);
  const [reporteEliminar,setReporteEliminar] = useState({})

  const {mostrarAlerta} = useContext(AlertaContext)

  const navigate = useNavigate();

  const crearContrato = async (contrato) => {
    setCargando(true);

    contrato.sueldo = Number(contrato.sueldo.split(",").join(""));
    contrato.porcentaje_arl = Number(contrato.porcentaje_arl);

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
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.post(
        "/api/1.0/contract/create",
        contrato,
        TokenAuth(token)
      );

      setContratos([...contratos, data]);

      mostrarAlerta({
        message: "El contrato se creó correctamente",
        categoria: "success",
      });

      setTimeout(() => {
        navigate("/home/contratos");
      }, 2000);

    } catch (err) {
      console.log(err)
      console.log(err.response);
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const obtenerContratos = async () => {
    setCargando(true);
    
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/contract/list?pageNumber=${
          pageContratos + 1
        }&pageSize=${rowsPerPageContratos}`,
        TokenAuth(token)
      );

      setContratos(data.docs);
      setPageContratos(data.page - 1);
      setCountContratos(data.totalDocs);
      setTotalPagesContratos(data.totalPages);
    } catch (err) {
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const obtenerContratoEditarAPI = async (id) => {
    setCargando(true);

    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/contract/${id}`,
        TokenAuth(token)
      );

      setContratoEditar(data);
    } catch (err) {
      console.log(err);
    } finally {
      setCargando(false);
    }
  };

  const editarContrato = async (contrato) => {
    setCargando(true);
    
    if([contrato.sueldo].includes(",")){
      contrato.sueldo = Number(contrato.sueldo.split(",").join(""));
    }
    contrato.porcentaje_arl = Number(contrato.porcentaje_arl);

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
     
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.put(
        "/api/1.0/contract/update",
        contrato,
        TokenAuth(token)
      );

      setContratos(
        contratos.map((contratoState) =>
          contratoState._id === data._id ? data : contratoState
        )
      );

      setTimeout(() => {
        navigate("/home/contratos");
      }, 2000);

      mostrarAlerta({
        message: "El contrato se actualizó correctamente",
        categoria: "success",
      });

      setContratoEditar(null);
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

  const obtenerReportes = async () => {
    setCargando(true);

    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/report-contract/list?pageNumber=${
          pageReportes + 1
        }&pageSize=${rowsPerPageReportes}`,
        TokenAuth(token)
      );

      setReportesContratos(data.docs);
      setPageReportes(data.page - 1);
      setCountReportes(data.totalDocs);
      setTotalPagesReportes(data.totalPages);
    } catch (err) {
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const eliminarReporte = async (id) => {
    setCargando(true);

    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.delete(
        `api/1.0/report-contract/delete/${id}`,
        TokenAuth(token)
      );

      mostrarAlerta({
        message: data.message,
        categoria: "success",
      });

      setReportesContratos(
        reportesContratos.filter((reporteState) => reporteState._id !== id)
      );

      setCountReportes(countReportes - 1);
    } catch (err) {
      console.log(err);
    } finally {
      setCargando(false);
    }
  };

  const obtenerContrato = async (contrato)=>{

    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/contract/${contrato._id}`,
        TokenAuth(token)
      );

      setContrato(data);
      
      setModalContrato(true);

    } catch (err) {
      console.log(err);
    }
  }

  const mostrarModalContrato = ()=>{
    setModalContrato(!modalContrato);
  }

  const obtenerContratoEditar = (contrato)=>{
    setContratoEditar(contrato);
  }

  return (
    <ContratoContext.Provider
      value={{
        contratos,
        cargando,
        contratoEditar,
        pageContratos,
        rowsPerPageContratos,
        countContratos,
        totalpagesContratos,
        reportesContratos,
        pageReportes,
        rowsPerPageReportes,
        countReportes,
        totalpagesReportes,
        reporteEliminar,
        contrato,
        modalContrato,
        crearContrato,
        obtenerContratoEditarAPI,
        editarContrato,
        setPageContratos,
        setRowsPerPageContratos,
        obtenerContratos,
        obtenerReportes,
        setRowsPerPageReportes,
        setPageReportes,
        eliminarReporte,
        setReporteEliminar,
        obtenerContrato,
        mostrarModalContrato,
        obtenerContratoEditar
      }}
    >
      {children}
    </ContratoContext.Provider>
  );
};

export default ContratoState;
