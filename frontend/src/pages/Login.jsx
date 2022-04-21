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
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";

const useStyles = makeStyles((theme) => ({
  containerGrid: {
    alignItems: "center",
    justifyContent: "center",
  },
  opcion: {
    color: "gray",
    textDecoration: "none",
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

  const [errorusario, setErrorUsuario] = useState({
    message: "",
    error: false,
  });

  const [errorcontrasenia, setErrorContrasenia] = useState({
    message: "",
    error: false,
  });

  const handleChange = (e) => {
    setusuarioLogin({
      ...usuariologin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([usuario, contrasenia].includes("")) {
      setErrorUsuario({
        message: "Campo de usuario requerido",
        error: true,
      });
      setErrorContrasenia({
        message: "Campo de contraseña requerido",
        error: true,
      });
      return;
    } else if (usuario === "") {
      setErrorUsuario({
        message: "Campo de usuario requerido",
        error: true,
      });
      return;
    } else if (contrasenia === "") {
      setErrorContrasenia({
        message: "Campo de contraseña requerido",
        error: true,
      });
      return;
    }

    setErrorUsuario({
      message: "",
      error: false,
    });

    setErrorContrasenia({
      message: "",
      error: false,
    });

    try {
      const { data } = await clienteAxios.post(`/api/1.0/auth`, {
        usuario,
        contrasenia,
      });

      localStorage.setItem("token", data.jwt);

      setToken(data);

      setusuarioLogin({
        usuario: "",
        contrasenia: "",
      });

      navigate("/admin");
    } catch (err) {
      mostrarAlerta({
        message: err.response.data,
        categoria: true,
      });
    }
  };

  const { message } = alerta;

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
            Iniciar Sesión
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
              label="Usuario registrado"
              error={errorusario.error}
              helperText={errorusario?.message}
              name="usuario"
              onChange={handleChange}
              value={usuario}
              type="text"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contrasenia"
              label="Contraseña"
              error={errorcontrasenia.error}
              helperText={errorcontrasenia?.message}
              type="password"
              onChange={handleChange}
              value={contrasenia}
              id="password"
            />
            <Grid container className={classes.containerGrid}>
              <Grid item xs>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Recordarme"
                />
              </Grid>
              <Grid item xs textAlign={"right"}>
                <Link
                  to="/olvide-contrasenia"
                  variant="body2"
                  className={classes.opcion}
                >
                  ¿Olvide contraseña?
                </Link>
              </Grid>
            </Grid>
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

export default Login;
