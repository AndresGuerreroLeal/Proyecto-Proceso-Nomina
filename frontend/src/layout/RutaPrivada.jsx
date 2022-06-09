import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

//Context
import AuthContext from "../context/auth/AuthContext";

//Material ui
import { CircularProgress } from "@mui/material";

const RutaPrivada = () => {
  const { cargando, perfil } = useContext(AuthContext);

  if (cargando)
    return (
      <div className="container">
        <CircularProgress />
      </div>
    );

  return <>{perfil?.roles.length > 1 ? <Outlet /> : <Navigate to="/home" />}</>;
};

export default RutaPrivada;
