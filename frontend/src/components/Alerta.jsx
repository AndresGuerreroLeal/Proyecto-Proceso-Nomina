import { Alert } from "@mui/material";
import React, { useContext } from "react";
import AlertaContext from "../context/Alerta/AlertaContext";

const Alerta = () => {
  const { alerta } = useContext(AlertaContext);

  return <Alert severity={alerta.categoria} sx={{
      marginBottom:"10px"
  }}>{alerta.message}</Alert>;
};

export default Alerta;
