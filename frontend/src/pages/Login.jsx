import { makeStyles } from "@material-ui/core";
import { Container, Typography } from "@mui/material";
import { display } from "@mui/system";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Login = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [usuariologin, setusuarioLogin] = useState({
    usuario: "",
    contrasenia: "",
  });

  const [alerta, setAlerta] = useState({});

  const { usuario, contrasenia } = usuariologin;

  const {setToken} = useContext(AuthContext)

  const handleChange = (e) => {
    setusuarioLogin({
      ...usuariologin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([usuario, contrasenia].includes("")) {
      return setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
    }

    setAlerta({});
    try {
      const { data } = await clienteAxios.post(`/api/1.0/auth`, {
        usuario,
        contrasenia,
      });

      setAlerta({
        msg: data.msg,
        error: false,
      });

      localStorage.setItem("token",data.jwt)

      setToken(data)

      setusuarioLogin({
        usuario: "",
        contrasenia: "",
      });

      navigate("/admin");
      
    } catch (err) {
      console.log(err)
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
        Login
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.containerInput}>
          <label className={classes.label}>Usuario</label>
          <input
            type="text"
            placeholder="Ingrese su usuario"
            className={classes.input}
            value={usuario}
            onChange={handleChange}
            name="usuario"
          />
        </div>

        <div className={classes.containerInput}>
          <label className={classes.label}>Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            className={classes.input}
            value={contrasenia}
            onChange={handleChange}
            name="contrasenia"
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
