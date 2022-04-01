import { makeStyles } from "@material-ui/core";
import { Container, Typography } from "@mui/material";
import { display } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: "uppercase",
  },
  form: {
    marginTop: theme.spacing(2),
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

const Login = () => {
  const classes = useStyles();

  const [usuariologin,setUsuarioLogin] = useState({
    usuario:"",
    contrasenia:""
  })

  const {usuario,contrasenia} = usuariologin

  const handleChange = (e)=>{
    setUsuarioLogin({
      ...usuariologin,
      [e.target.name]:e.target.value
    })
  }


  return (
    <>
      <Typography variant="h4" component="h4" className={classes.title}>
        Iniciar Sesión
      </Typography>
      <form className={classes.form}>
        <div className={classes.containerInput}>
          <label className={classes.label} htmlFor="usuario">Usuario</label>
          <input
            type="text"
            placeholder="Ingrese su usuario"
            className={classes.input}
            value={usuario}
            name="usuario"
            id="usuario"
            onChange={handleChange}
          />
          
        </div>

        <div className={classes.containerInput}>
          <label className={classes.label} htmlFor="contrasenia">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            className={classes.input}
            value={contrasenia}
            name="contrasenia"
            id="contrasenia"
            onChange={handleChange}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className={classes.submit}
        />

        <Link to="" className={classes.opcion}>
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </>
  );
};

export default Login;
