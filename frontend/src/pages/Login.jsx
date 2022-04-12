import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Config
import clienteAxios from "../config/axios";

//Context
import AlertaContext from "../context/alerta/AlertaContext";
import AuthContext from "../context/auth/AuthContext";

//Components
import Alerta from "../components/Alerta";

//Material ui
import { makeStyles } from "@material-ui/core";
import { Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: "uppercase",
    marginButton: "8px",
  },
  form: {
    padding: theme.spacing(3),
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

  const { usuario, contrasenia } = usuariologin;

  const { setToken } = useContext(AuthContext);

  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const handleChange = (e) => {
    setusuarioLogin({
      ...usuariologin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([usuario, contrasenia].includes("")) {
      return mostrarAlerta({
        message: "Todos los campos son obligatorios",
        categoria: "error",
      });
    }

    mostrarAlerta({});

    try {
      const { data } = await clienteAxios.post(`/api/1.0/auth`, {
        usuario,
        contrasenia,
      });

      mostrarAlerta({
        msg: data.msg,
        categoria: false,
      });

      localStorage.setItem("token", data.jwt);

      setToken(data);

      setusuarioLogin({
        usuario: "",
        contrasenia: "",
      });

      navigate("/admin");
    } catch (err) {
      console.log(err);
      mostrarAlerta({
        message: err.response.data,
        categoria: true,
      });
    }
  };

  return (
    <>
      <Typography variant="h4" component="h4" className={classes.title}>
        Login
      </Typography>

      {alerta.message && <Alerta />}

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

        <Link to="/olvide-contrasenia" className={classes.opcion}>
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </>
  );
};

export default Login;
