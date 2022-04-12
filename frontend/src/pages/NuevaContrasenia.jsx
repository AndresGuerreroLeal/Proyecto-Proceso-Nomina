import { makeStyles } from "@material-ui/core";
import { Container, Typography } from "@mui/material";
import { display } from "@mui/system";
import React, { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const NuevaContrasenia = () => {
  const classes = useStyles();
  
  const { token } = useParams();

    const Navigate = useNavigate()

  const [nuevacontraseniaform, setNuevaContraseniaForm] = useState({
    nuevacontrasenia:"",
    confirmarnuevacontrasenia:""
  });

  const {nuevacontrasenia,confirmarnuevacontrasenia} = nuevacontraseniaform

  const [alerta, setAlerta] = useState({});

  const handleChange = (e)=>{
    setNuevaContraseniaForm({
        ...nuevacontraseniaform,
        [e.target.name]:e.target.value        
    })  
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nuevacontrasenia,confirmarnuevacontrasenia].includes("")) {
      return setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
    }

    if (nuevacontrasenia !== confirmarnuevacontrasenia) {
      return setAlerta({
        msg: "Las contraseñas no coinciden",
        error: true,
      });
    }

    setAlerta({});

    try {
        
      const { data } = await clienteAxios.put(
        `/api/1.0/auth/create-new-password/${token}`,
        { nuevaContrasenia: nuevacontrasenia }
      );
        
        console.log(data)

      setAlerta({
        msg: data + ", pronto sera redirigido al inicio de sesión",
        error: false,
      });   

      setNuevaContraseniaForm({
        nuevacontrasenia: "",
        confirmarnuevacontrasenia: "",
      });

      setTimeout(()=>{
        Navigate("/")
      },3000)

      
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
            Nueva Contraseña
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.containerInput}>
          <label className={classes.label}>Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su nueva contraseña"
            className={classes.input}
            value={nuevacontrasenia}
            onChange={handleChange}
            name="nuevacontrasenia"
          />
        </div>


        <div className={classes.containerInput}>
          <label className={classes.label}>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="Confirme contraseña"
            className={classes.input}
            value={confirmarnuevacontrasenia}
            onChange={handleChange}
            name="confirmarnuevacontrasenia"
          />
        </div>

        <input
          type="submit"
          value="Guardar nueva contraseña"
          className={classes.submit}
        />

      </form>
    </>
  );
};

export default NuevaContrasenia