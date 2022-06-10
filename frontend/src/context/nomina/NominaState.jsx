import { useContext, useState } from "react";
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";
import AlertaContext from "../alerta/AlertaContext";

//Context
import NominaContext from "./NominaContext";

const NominaState = ({ children }) => {

  let obtenerNovedades = JSON.parse(localStorage.getItem("novedades"));
  if(!obtenerNovedades){
    localStorage.setItem("novedades", JSON.stringify([]));
  }

  const [nominas, setNominas] = useState([]);
  const [reportesNominas,setReportesNominas] = useState([])
  const [cargando,setCargando] = useState(false)
  const [nomina,setNomina] = useState({})

  const [nominasDisabled,setNominasDisabled] = useState([])

  const [nominaNovedad, setNominaNovedad] = useState(obtenerNovedades);

  const [modalNomina,setModalNomina] = useState(false)
  const [modalNuevaNomina,setModalNuevaNomina] = useState(false)
  const [modalNuevaNovedad,setModalNuevaNovedad] = useState(false)

  const [pageNominas, setPageNominas] = useState(0);
  const [rowsPerPageNominas, setRowsPerPageNominas] = useState(5);
  const [totalpagesNominas, setTotalPagesNominas] = useState(0);
  const [countNominas, setCountNominas] = useState(0);

  const [pageReportes, setPageReportes] = useState(0);
  const [rowsPerPageReportes, setRowsPerPageReportes] = useState(5);
  const [totalpagesReportes, setTotalPagesReportes] = useState(0);
  const [countReportes, setCountReportes] = useState(0);

  const { mostrarAlerta } = useContext(AlertaContext);

  const obtenerNominas = async () => {
    setCargando(true);

    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/payroll/list-info?pageNumber=${
          pageNominas + 1
        }&pageSize=${rowsPerPageNominas}`,
        TokenAuth(token)
      );

      setNominas(data.docs);
      setPageNominas(data.page - 1);
      setCountNominas(data.totalDocs);
      setTotalPagesNominas(data.totalPages);
    } catch (err) {
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const obtenerReportes = async () => {
    setCargando(true);

    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/payroll/list?pageNumber=${
          pageReportes + 1
        }&pageSize=${rowsPerPageReportes}`,
        TokenAuth(token)
      );

      setReportesNominas(data.docs);
      setPageReportes(data.page - 1);
      setCountReportes(data.totalDocs);
      setTotalPagesReportes(data.totalPages);
    } catch (err) {
      console.log(err)
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const mostrarModalNomina = ()=>{
    setModalNomina(!modalNomina)
  }

  const mostrarModalNuevaNomina = ()=>{
    setModalNuevaNomina(!modalNuevaNomina)
  }

  const mostrarModalNuevaNovedad = () => {
    setModalNuevaNovedad(!modalNuevaNovedad);
  };

  const obtenerNomina = async (nomina)=>{
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/payroll/get/${nomina._id}`,
        TokenAuth(token)
      );

      setNomina(data);
      
      setModalNomina(true);

    } catch (err) {
      console.log(err);
    }    
  }

  const crearNuevaNovedad = async (novedad, contrato) => {
    setCargando(true);

    let novedades = [...obtenerNovedades, { _id: contrato._id, ...novedad }];
    localStorage.setItem("novedades", JSON.stringify(novedades));

    setNominasDisabled([...nominasDisabled, contrato._id]);

    setNominaNovedad({});

    mostrarAlerta({
      message: "Se creo novedad exitosamente",
      categoria: "success",
    });
          
    setModalNuevaNovedad(false);

    setCargando(false);
  };

  return (
    <NominaContext.Provider
      value={{
        nominas,
        nomina,
        reportesNominas,
        pageReportes,
        rowsPerPageReportes,
        countReportes,
        totalpagesReportes,
        pageNominas,
        rowsPerPageNominas,
        countNominas,
        totalpagesNominas,
        cargando,
        modalNomina,
        modalNuevaNovedad,
        modalNuevaNomina,
        nominaNovedad,
        nominasDisabled,
        setNominasDisabled,
        setPageNominas,
        setRowsPerPageNominas,
        obtenerNominas,
        obtenerReportes,
        obtenerNomina,
        mostrarModalNomina,
        mostrarModalNuevaNomina,
        mostrarModalNuevaNovedad,
        crearNuevaNovedad,
        setRowsPerPageReportes,
        setNominaNovedad,
      }}
    >
      {children}
    </NominaContext.Provider>
  );
};

export default NominaState;
