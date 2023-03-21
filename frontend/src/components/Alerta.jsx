import React, { useContext } from "react";

//Context
import AlertaContext from "../context/alerta/AlertaContext";

//Material ui
import { Alert } from "@mui/material";


const Alerta = () => {
  const { alerta } = useContext(AlertaContext);

  return <Alert severity={alerta.categoria} sx={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>{alerta.message}</Alert>;
};

export default Alerta;
