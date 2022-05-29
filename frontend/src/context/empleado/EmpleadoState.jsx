import { useContext, useState } from "react";

// Context
import EmpleadoContext from "./EmpleadoContext";

// Config
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";
import AlertaContext from "../alerta/AlertaContext";

const EmpleadoState = ({ children }) => {
  const [cargando, setCargando] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count,setCount] = useState(0)
  const [totalpages,setTotalPages] = useState(0)
  const [estado,setEstado] = useState("active")
  const [empleado,setEmpleado] = useState({})
  const [modalEmpleado,setModalEmpleado] = useState(false)
  const [empleadoEditar,setEmpledadoEditar] = useState({})

  const { mostrarAlerta } = useContext(AlertaContext);

  const obtenerEmpleados = async (estado) => {
    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/employee/list-${estado}?pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}`,
        TokenAuth(token)
      );

      setEmpleados(data.docs);
      setPage(data.page - 1)  
      setCount(data.totalDocs)      
      setTotalPages(data.totalPages)
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

      mostrarAlerta({
        message: "El empleado se creo correctamente",
        categoria: "success",
      });
    } catch (err) {
      mostrarAlerta({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const obtenerEmpleado = (empleado)=>{
    setEmpleado(empleado)
    mostrarModalEmpleado()
  }

  const mostrarModalEmpleado = ()=>{
    setModalEmpleado(!modalEmpleado);
  }

  const obtenerEmpleadoEditar = async (empleado) => {
    setEmpledadoEditar(empleado);
  };

  const obtenerEmpleadoEditarAPI = async (id) => {
    setCargando(true)
    try {
      const token = localStorage.getItem("token");

      const { data } = await clienteAxios.get(
        `/api/1.0/employee/${id}`,
        TokenAuth(token, true)
      );

      console.log(data);

      setEmpledadoEditar(data);
    } catch (err) {
      console.log(err);
    } finally{
      setCargando(false)
    }
  };

  return (
    <EmpleadoContext.Provider
      value={{
        cargando,
        empleados,
        page,
        rowsPerPage,
        count,
        totalpages,
        estado,
        empleado,
        modalEmpleado,
        empleadoEditar,
        setRowsPerPage,
        setPage,
        crearEmpleado,
        obtenerEmpleados,
        setEstado,
        obtenerEmpleado,
        mostrarModalEmpleado,
        obtenerEmpleadoEditar,
        obtenerEmpleadoEditarAPI
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
};

export default EmpleadoState;
