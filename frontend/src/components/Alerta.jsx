import React, { useContext } from "react";

//Context
import AlertaContext from "../context/alerta/AlertaContext";

//Material ui
import { Alert } from "@mui/material";


const Alerta = () => {
  const { alerta } = useContext(AlertaContext);

  return <Alert severity={alerta.categoria}>{alerta.message}</Alert>;
};

export default Alerta;
