import { useContext, useState } from "react";
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";
import AlertaContext from "../alerta/AlertaContext";

//Context
import NominaContext from "./NominaContext";

const NominaState = ({ children }) => {
  const [nominas, setNominas] = useState([]);
  const [reportesNominas,setReportesNominas] = useState([])
  const [cargando,setCargando] = useState(false)
  const [nomina,setNomina] = useState({})

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
        `/api/1.0/contract/list?pageNumber=${
          pageNominas + 1
        }&pageSize=${rowsPerPageNominas}`,
        TokenAuth(token)
      );

      setNominas(data.docs);
      setPageNominas(data.page - 1);
      setCountNominas(data.totalDocs);
      setTotalPagesNominas(data.totalPages);
    } catch (err) {
      console.log(err.response)
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
        `/api/1.0/report-contract/list?pageNumber=${
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

  const obtenerNomina = ()=>{
  }

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
        setPageNominas,
        setRowsPerPageNominas,
        obtenerNominas,
        obtenerReportes,
        obtenerNomina,
      }}
    >
      {children}
    </NominaContext.Provider>
  );
};

export default NominaState;
