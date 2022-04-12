import { Alert } from "@mui/material";
import React, { useContext } from "react";
import AlertaContext from "../context/alerta/AlertaContext";

const Alerta = () => {
  const { alerta } = useContext(AlertaContext);

  return <Alert severity={alerta.categoria}>{alerta.message}</Alert>;
};

export default Alerta;
