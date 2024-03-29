import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Context
import AuthContext from "./AuthContext";

//Config
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";

const AuthState = ({ children }) => {
  const [token, setToken] = useState({});
  const [perfil, setPerfil] = useState({});
  const [cargando, setCargando] = useState(true);
  const [alertaauth, setAlertaAuth] = useState();
  const [cantidadEmpleados, setCantidadEmpleados] = useState({});
  const [cantidadContratos, setCantidadContratos] = useState({});
  const [cantidadNominas, setCantidadNominas] = useState({});
  const [cargandoAPI, setCargandoAPI] = useState(false);

  const navigate = useNavigate({});

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const { data } = await clienteAxios.get(
          "/api/1.0/auth/info",
          TokenAuth(token)
        );

        setPerfil(data);
      } catch (err) {
        setToken({});
        setPerfil({});
        console.log(err);
      } finally {
        setCargando(false);
      }
    };
    autenticarUsuario();
  }, [token]);

  const cerrarSesion = () => {
    sessionStorage.removeItem("token");
    setToken({});
    setPerfil({});
  };

  const actualizarPerfil = async (datos) => {
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.put(
        "/api/1.0/auth/update-info/",
        datos,
        TokenAuth(token)
      );

      setPerfil(data);

      setAlertaAuth({
        message: "Datos actualizados correctamente",
        categoria: "success",
      });

      setTimeout(() => {
        setAlertaAuth({});
      }, 3000);
    } catch (err) {
      console.log(err);
      setAlertaAuth({
        message: err.response.data.message,
        categoria: "error",
      });
    }
  };

  const actualizarContrasenia = async (datos) => {
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.put(
        "/api/1.0/auth/update-password/",
        datos,
        TokenAuth(token)
      );

      setAlertaAuth({
        message: data.message,
        categoria: "success",
      });

      setTimeout(() => {
        setAlertaAuth({});
      }, 3000);
    } catch (err) {
      console.log(err);
      setAlertaAuth({
        message: err.response.data.message,
        categoria: "error",
      });
    }
  };

  const obtenerCantidadEmpleados = async () => {
    setCargandoAPI(true);
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        "/api/1.0/employee/",
        TokenAuth(token)
      );

      setCantidadEmpleados(data);
    } catch (err) {
      setAlertaAuth({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargandoAPI(false);
    }
  };

  const obtenerCantidadContratos = async () => {
    setCargandoAPI(true);
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        "/api/1.0/contract/",
        TokenAuth(token)
      );

      setCantidadContratos(data);
    } catch (err) {
      setAlertaAuth({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargandoAPI(false);
    }
  };

  const obtenerCantidadNominas = async () => {
    setCargandoAPI(true);
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await clienteAxios.get(
        "/api/1.0/payroll/",
        TokenAuth(token)
      );

      setCantidadNominas(data);
    } catch (err) {
      setAlertaAuth({
        message: err.response.data.message,
        categoria: "error",
      });
    } finally {
      setCargandoAPI(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        token,
        perfil,
        cargando,
        alertaauth,
        cantidadEmpleados,
        cantidadContratos,
        cargandoAPI,
        cantidadNominas,
        setToken,
        cerrarSesion,
        actualizarPerfil,
        setAlertaAuth,
        actualizarContrasenia,
        obtenerCantidadEmpleados,
        obtenerCantidadContratos,
        obtenerCantidadNominas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
