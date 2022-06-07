import { useContext, useState } from "react";

// Context
import EmpleadoContext from "./EmpleadoContext";

// Config
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";
import AlertaContext from "../alerta/AlertaContext";
import { useNavigate } from "react-router-dom";

const EmpleadoState = ({ children }) => {
  const [cargando, setCargando] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [reportesEmpleados,setReportesEmpleados] = useState([])

  const [pageEmpleados, setPageEmpleados] = useState(0);
  const [rowsPerPageEmpleados, setRowsPerPageEmpleados] = useState(5);
  const [totalpagesEmpleados, setTotalPagesEmpleados] = useState(0);
  const [countEmpleados, setCountEmpleados] = useState(0);
  
  const [estado, setEstado] = useState("active");
  const [empleado, setEmpleado] = useState({});
  const [modalEmpleado, setModalEmpleado] = useState(false);
  const [empleadoEditar, setEmpledadoEditar] = useState({});
  const [empleadoEstado, setEmpleadoEstado] = useState({});
  const [reporteEliminar,setReporteEliminar] = useState({})

  const [pageReportes, setPageReportes] = useState(0);
  const [rowsPerPageReportes, setRowsPerPageReportes] = useState(5);
  const [totalpagesReportes, setTotalPagesReportes] = useState(0);
  const [countReportes, setCountReportes] = useState(0);

  const navigate = useNavigate();

  const { mostrarAlerta } = useContext(AlertaContext);

  const obtenerEmpleados = async (estado) => {
    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/employee/list-${estado}?pageNumber=${
          pageEmpleados + 1
        }&pageSize=${rowsPerPageEmpleados}`,
        TokenAuth(token)
      );

      setEmpleados(data.docs);
      setPageEmpleados(data.page - 1);
      setCountEmpleados(data.totalDocs);
      setTotalPagesEmpleados(data.totalPages);
    } catch (err) {
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

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
        "api/1.0/employee/create",
        formData,
        TokenAuth(token, true)
      );

      setEmpleados([...empleados, data]);

      mostrarAlerta({
        message: "El empleado se creo correctamente",
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

  const obtenerEmpleado = (empleado) => {
    setEmpleado(empleado);
    mostrarModalEmpleado();
  };

  const mostrarModalEmpleado = () => {
    setModalEmpleado(!modalEmpleado);
  };

  const obtenerEmpleadoEditar = async (empleado) => {
    setEmpledadoEditar({ ...empleado, eliminar: false });
  };

  const obtenerEmpleadoEditarAPI = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/employee/${id}`,
        TokenAuth(token)
      );

      setEmpledadoEditar({ ...data, eliminar: false });
    } catch (err) {
      console.log(err);
    } finally {
      setCargando(false);
    }
  };

  const editarEmpleado = async (empleado) => {
    setCargando(true);

    try {
      let formData = new FormData();

      if (empleado.nuevo_archivo) {
        formData.append("file", empleado.file);
      }

      formData.append("nuevo_archivo", empleado.nuevo_archivo ? true : false);
      formData.append("documento", empleado.documento);
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
      formData.append("_id", empleado._id);

      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.put(
        "/api/1.0/employee/update",
        formData,
        TokenAuth(token, true)
      );

      setEmpleados(
        empleados.map((empleadoState) =>
          empleadoState._id === data._id ? data : empleadoState
        )
      );

      setTimeout(() => {
        navigate("/home/empleados");
      }, 2000);

      mostrarAlerta({
        message: "El empleado se actualizó correctamente",
        categoria: "success",
      });

      setEmpledadoEditar({});
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

  const obtenerEmpleadoEstado = (empleado) => {
    setEmpleadoEstado(empleado);
  };

  const actualizarEstado = async (empleado) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.put(
        `/api/1.0/employee/state/${empleado._id}`,
        {
          concepto: empleado.concepto,
        },
        TokenAuth(token)
      );

      setEmpleados(
        empleados.filter((empleadoState) => empleadoState._id !== data._id)
      );

      setEmpleadoEstado({});

      setCountEmpleados(countEmpleados - 1);  

    } catch (err) {
      console.log(err);
    } finally {
      setCargando(false);
    }
  };

  const obtenerReportes = async () => {
    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/report-employee/list/?pageNumber=${
          pageReportes + 1
        }&pageSize=${rowsPerPageReportes}`,
        TokenAuth(token)
      );

      setReportesEmpleados(data.docs);
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
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.delete(
        `/api/1.0/report-employee/delete/${id}`,
        TokenAuth(token)
      );
      

      mostrarAlerta({
        message: data.message,
        categoria: "info",
      });

      setReportesEmpleados(
        reportesEmpleados.filter((reporteState) => reporteState._id !== id)
      );
      
      setCountReportes(countReportes - 1)

    } catch (err) {
      console.log(err);
    } finally {
      setCargando(false);
    }
  };


  return (
    <EmpleadoContext.Provider
      value={{
        cargando,
        empleados,
        pageEmpleados,
        rowsPerPageEmpleados,
        countEmpleados,
        totalpagesEmpleados,
        estado,
        empleado,
        modalEmpleado,
        empleadoEditar,
        empleadoEstado,
        reportesEmpleados,
        pageReportes,
        rowsPerPageReportes,
        countReportes,
        totalpagesReportes,
        reporteEliminar,
        setRowsPerPageEmpleados,
        setPageEmpleados,
        crearEmpleado,
        obtenerEmpleados,
        setEstado,
        obtenerEmpleado,
        mostrarModalEmpleado,
        obtenerEmpleadoEditar,
        obtenerEmpleadoEditarAPI,
        editarEmpleado,
        obtenerEmpleadoEstado,
        actualizarEstado,
        obtenerReportes,
        setRowsPerPageReportes,
        setPageReportes,
        eliminarReporte,
        setReporteEliminar,
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
};

export default EmpleadoState;
