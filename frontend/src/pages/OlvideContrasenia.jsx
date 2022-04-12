import { makeStyles } from "@material-ui/core";
import { Container, Typography } from "@mui/material";
import { display } from "@mui/system";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import AuthContext from "../context/auth/AuthContext";

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

  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([correo].includes("")) {
      return setAlerta({
        msg: "Se requiere obligatoriamente el correo registrado",
        error: true,
      });
    }

    setAlerta({});

    try {
        console.log(correo)
      const { data } = await clienteAxios.put(`api/1.0/auth/forgot-password/`,{correo});
        
        console.log(data)

      setAlerta({
        msg: data.msg,
        error: false,
      });

      setCorreo("");
      
    } catch (err) {
      console.log(err.response.data)
      setAlerta({
        msg: err.response.data,
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <>
      <Typography variant="h4" component="h4" className={classes.title}>
        Olvide Contraseña
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.containerInput}>
          <label className={classes.label}>Correo</label>
          <input
            type="text"
            placeholder="Ingrese su correo"
            className={classes.input}
            value={correo}
            onChange={(e)=>setCorreo(e.target.value)}
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

export default OlvideContrasenia