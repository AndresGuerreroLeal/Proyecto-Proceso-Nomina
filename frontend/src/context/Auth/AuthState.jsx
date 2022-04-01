import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import TokenAuth from "../../config/tokenAuth";
import AuthContext from "./AuthContext";

const AuthState = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    autenticarUsuario();
  }, []);
  
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
      
      setAuth(data);
    } catch (err) {
      console.log(err);
    }

    setCargando(false);
  };
  
  

  const cerrarSesion = ()=>{
    localStorage.removeItem("token")
    setAuth({})
  }


  return (
    <AuthContext.Provider
      value={{
        auth,
        cargando,
        setAuth,
        cerrarSesion,
        autenticarUsuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
