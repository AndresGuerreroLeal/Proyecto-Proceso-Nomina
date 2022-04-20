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
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";

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

  const [errornuevacontrasenia, setErrorNuevaContrasenia] = useState({
    message: "",
    error: false,
  });

  const [errorconfirmarnuevacontrasenia, setConfirmarErrorNuevaContrasenia] =
    useState({
      message: "",
      error: false,
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
      setErrorNuevaContrasenia({
        message: "Campo de nueva contraseña requerido",
        error: true,
      });
      setConfirmarErrorNuevaContrasenia({
        message: "Campo de confirmar nueva contraseña requerido",
        error: true,
      });
      return;
    } else if (nuevacontrasenia !== confirmarnuevacontrasenia) {
      setErrorNuevaContrasenia({
        message: "",
        error: false,
      });
      setConfirmarErrorNuevaContrasenia({
        message: "Las contraseña no coincide",
        error: true,
      });
      return;
    }

    setErrorNuevaContrasenia({
      message: "",
      error: false,
    });
    setConfirmarErrorNuevaContrasenia({
      message: "Campo de confirmar nueva contraseña requerido",
      error: false,
    });

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

  const {message} = alerta

  return (
    <>
      <CssBaseline />

      {message && <Alerta />} 

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#757ce8" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Nueva Contraseña
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña Nueva"
              name="nuevacontrasenia"
              onChange={handleChange}
              value={nuevacontrasenia}
              error={errornuevacontrasenia?.error}
              helperText={errornuevacontrasenia.message}
              type="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmarnuevacontrasenia"
              label="Confirmar nueva contraseña"
              type="password"
              onChange={handleChange}
              value={confirmarnuevacontrasenia}
              error={errorconfirmarnuevacontrasenia?.error}
              helperText={errorconfirmarnuevacontrasenia.message}
              id="password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default NuevaContrasenia;
