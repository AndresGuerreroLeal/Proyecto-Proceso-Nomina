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

  const navigate = useNavigate();

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
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
    localStorage.removeItem("token");
    setToken({});
    setPerfil({});
  };

  const actualizarPerfil = async (datos) => {
    try {
      const token = localStorage.getItem("token");

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
      console.log(err)
      setAlertaAuth({
        message: err.response.data.message,
        categoria: "error",
      });
    }
  };

  const ActualizarContrasenia = async (datos) => {
    try {
      const token = localStorage.getItem("token");

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
      console.log(err)
      setAlertaAuth({
        message: err.response.data.message,
        categoria: "error",
      });
    }
  };  

  return (
    <AuthContext.Provider
      value={{
        token,
        perfil,
        cargando,
        alertaauth,
        setToken,
        cerrarSesion,
        actualizarPerfil,
        setAlertaAuth,
        ActualizarContrasenia
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
