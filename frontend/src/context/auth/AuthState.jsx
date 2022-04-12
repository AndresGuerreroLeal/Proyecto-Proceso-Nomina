import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";
import AuthContext from "./AuthContext";

const AuthState = ({ children }) => {
  const [token, setToken] = useState({});
  const [perfil, setPerfil] = useState({});
  const [cargando, setCargando] = useState(true);

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

        navigate("/admin");
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

  


  return (
    <AuthContext.Provider
      value={{
        token,
        perfil,
        cargando,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
