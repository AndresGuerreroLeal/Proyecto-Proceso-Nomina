import React, { useContext, useEffect, useState } from "react";

//Context
import AuthContext from "../context/auth/AuthContext";
import AlertaContext from "../context/alerta/AlertaContext";

//Components
import Alerta from "../components/Alerta";

//Material ui
import { Typography } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";

const Perfil = () => {
  const { perfil, actualizarPerfil, alertaauth, setAlertaAuth } =
    useContext(AuthContext);
  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    usuario: "",
  });

  const [usuarioerror, setErrorUsuario] = useState({
    message: "",
    error: false,
  });
  const [correoerror, setErrorCorreo] = useState({
    message: "",
    error: false,
  });
  const [nombreerror, setErrorNombre] = useState({
    message: "",
    error: false,
  });

  useEffect(() => {
    setDatos({
      nombre: perfil?.nombre,
      correo: perfil?.correo,
      usuario: perfil?.usuario,
    });

    if (alertaauth) {
      mostrarAlerta(alertaauth);
      return;
    }
  }, [perfil, alertaauth]);

  const { nombre, correo, usuario } = datos;

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usuario === "") {
      setErrorUsuario({
        message: "Campo de usuario requerido",
        error: true,
      });
      return;
    } else if (correo === "") {
      setErrorCorreo({
        message: "Campo de contraseña requerido",
        error: true,
      });
      return;
    } else if (nombre === "") {
      setErrorNombre({
        message: "Campo de contraseña requerido",
        error: true,
      });
      return;
    } else if ([usuario, nombre, correo].includes("")) {
      setErrorUsuario({
        message: "Campo de usuario requerido",
        error: true,
      });
      setErrorCorreo({
        message: "Campo de correo requerido",
        error: true,
      });
      setErrorNombre({
        message: "Campo de nombre requerido",
        error: true,
      });
      return;
    }

    setErrorUsuario({
      message: "",
      error: false,
    });

    setErrorNombre({
      message: "",
      error: false,
    });

    setErrorCorreo({
      message: "",
      error: false,
    });

    await actualizarPerfil(datos);
  };

  const { message } = alerta;

  return (
    <>
      <Typography variant="h4" component="h2">
        Perfil - Datos registrados
      </Typography>

      {message && (
        <Box sx={{ width: "70%", margin: " 1rem auto 0 ", display:"flex",
        justifyContent:"center" }}>
          <Alerta />
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Usuario"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          value={usuario}
          name="usuario"
          onChange={handleChange}
          error={usuarioerror.error}
          helperText={usuarioerror?.message}
        />
        <TextField
          id="outlined-basic"
          label="Nombre"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          value={nombre}
          name="nombre"
          onChange={handleChange}
          error={nombreerror.error}
          helperText={nombreerror?.message}
        />
        <TextField
          id="outlined-basic"
          label="Correo"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          value={correo}
          name="correo"
          onChange={handleChange}
          error={correoerror.error}
          helperText={correoerror?.message}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, width: "70%" }}
        >
          Guardar Cambios
        </Button>
      </Box>
    </>
  );
};

export default Perfil;
