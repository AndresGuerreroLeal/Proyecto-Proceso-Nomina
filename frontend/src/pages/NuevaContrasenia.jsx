import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const NuevaContrasenia = () => {
  const classes = useStyles();

  const { token } = useParams();

  const Navigate = useNavigate();

  const [nuevacontraseniaform, setNuevaContraseniaForm] = useState({
    nuevacontrasenia: "",
    confirmarnuevacontrasenia: "",
  });

  const { nuevacontrasenia, confirmarnuevacontrasenia } = nuevacontraseniaform;

  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const handleChange = (e) => {
    setNuevaContraseniaForm({
      ...nuevacontraseniaform,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nuevacontrasenia, confirmarnuevacontrasenia].includes("")) {
      return mostrarAlerta({
        message: "Todos los campos son obligatorios",
        categoria: "error",
      });
    }

    if (nuevacontrasenia !== confirmarnuevacontrasenia) {
      return mostrarAlerta({
        message: "Las contraseñas no coinciden",
        categoria: "error",
      });
    }

    mostrarAlerta({
      message: "",
      categoria: "",
    });

    try {
      const { data } = await clienteAxios.put(
        `/api/1.0/auth/create-new-password/${token}`,
        { nuevaContrasenia: nuevacontrasenia }
      );

      mostrarAlerta({
        message: data.message + ", pronto sera redirigido al inicio de sesión",
        categoria: "success",
      });

      setNuevaContraseniaForm({
        nuevacontrasenia: "",
        confirmarnuevacontrasenia: "",
      });

      setTimeout(() => {
        Navigate("/");
      }, 3000);
    } catch (err) {
      mostrarAlerta({
        message: "Error interno, intentelo mas tarde",
        categoria: "error",
      });
    }
  };

  return (
    <>
      <Typography variant="h4" component="h4" className={classes.title}>
        Nueva Contraseña
      </Typography>

      {alerta.message && <Alerta />}

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

export default NuevaContrasenia;
