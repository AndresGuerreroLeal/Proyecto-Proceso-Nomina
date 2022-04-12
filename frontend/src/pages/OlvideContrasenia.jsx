import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

//Config
import clienteAxios from "../config/axios";

//Context
import AlertaContext from "../context/alerta/AlertaContext";

//Components
import Alerta from "../components/Alerta";

//Material ui
import { makeStyles } from "@material-ui/core";
import { Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: "uppercase",
    marginTop: theme.spacing(1),
  },
  form: {
    padding: theme.spacing(4),
  },
  containerInput: {
    marginBottom: theme.spacing(3),
  },
  label: {
    display: "block",
    marginBottom: theme.spacing(1),
    fontSize: "18px",
  },
  input: {
    width: "100%",
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    border: "1px solid gray",
  },
  submit: {
    width: "105%",
    margin: "0 auto",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    cursor: "pointer",
  },
  opcion: {
    fontSize: "12px",
    color: "lightGray",
  },
}));

const OlvideContrasenia = () => {
  const classes = useStyles();

  const [correo, setCorreo] = useState("");

  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([correo].includes("")) {
      return mostrarAlerta({
        message: "Se requiere obligatoriamente el correo registrado",
        categoria: "error",
      });
    }

    mostrarAlerta({
      message: "",
      categoria: "",
    });

    try {
      const { data } = await clienteAxios.put(`api/1.0/auth/forgot-password/`, {
        correo,
      });

      mostrarAlerta({
        message: data.message,
        categoria: "info",
      });

      setCorreo("");
    } catch (err) {
      console.log(err.response.data);
      mostrarAlerta({
        message: err.response.data.message
          ? err.response.data.message
          : "Email no válido",
        categoria: "error",
      });
    }
  };

  return (
    <>
      <Typography variant="h4" component="h4" className={classes.title}>
        Olvide Contraseña
      </Typography>

      {alerta.message && <Alerta />}

      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.containerInput}>
          <label className={classes.label}>Correo</label>
          <input
            type="text"
            placeholder="Ingrese su correo"
            className={classes.input}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Enviar instrucciones"
          className={classes.submit}
        />

        <Link to="/" className={classes.opcion}>
          Iniciar Sesión
        </Link>
      </form>
    </>
  );
};

export default OlvideContrasenia;
