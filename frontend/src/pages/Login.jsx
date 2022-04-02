import { makeStyles } from "@material-ui/core";
import { Container, Typography } from "@mui/material";
import { display } from "@mui/system";
import React, { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";
import AlertaContext from "../context/Alerta/AlertaContext";
import AuthContext from "../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: "uppercase",
    textAlign:"center"
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

  const {setAuth} = useContext(AuthContext)
  const {alerta,mostrarAlerta} = useContext(AlertaContext)

  const navigate = useNavigate()

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


  const handleSubmit = async (e)=>{
    e.preventDefault()

    if([usuario,contrasenia].includes("")){
      mostrarAlerta({
          message:"Todos los campos son obligatorios",
          categoria:"error"        
      })
      return
    }

    try{
     const {data} = await clienteAxios.post("/api/1.0/auth",{
       usuario,contrasenia
     })

    localStorage.setItem("token",data.jwt)

    setAuth(data)

    navigate("/admin");

    setUsuario({
       email: "",
       password: "",
     });

    }catch(err){
   
    }
  }

  const {message} = alerta

  return (
    <>
      {message && <Alerta />}
      <Typography variant="h4" component="h4" className={classes.title}>
        Iniciar Sesión
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.containerInput}>
          <label className={classes.label} htmlFor="usuario">
            Usuario
          </label>
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
          <label className={classes.label} htmlFor="contrasenia">
            Contraseña
          </label>
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
