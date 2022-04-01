import { makeStyles } from "@material-ui/core";
import { Container, Typography } from "@mui/material";
import { display } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";

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

  return (
    <>
      <Typography variant="h4" component="h4" className={classes.title}>
        Login
      </Typography>
      <form className={classes.form}>
        <div className={classes.containerInput}>
          <label className={classes.label}>Email</label>
          <input
            type="text"
            placeholder="Ingresa tu email"
            className={classes.input}
          />
        </div>

        <div className={classes.containerInput}>
          <label className={classes.label}>Password</label>
          <input
            type="password"
            placeholder="Ingresa tu password"
            className={classes.input}
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
