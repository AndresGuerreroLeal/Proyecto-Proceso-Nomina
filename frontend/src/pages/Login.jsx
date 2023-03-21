import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Config
import clienteAxios from "../config/axios";
import formikMain from "../helpers/formikMain";

//Context
import AlertaContext from "../context/alerta/AlertaContext";
import AuthContext from "../context/auth/AuthContext";

//Components
import Alerta from "../components/Alerta";

//Material ui
import { makeStyles } from "@material-ui/core";
import { CircularProgress, Typography } from "@mui/material";
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
  containerGridOption: {
    textAlign: "right",
    [theme.breakpoints.down("xs")]: {
      textAlign:"left"
    },
  },
}));

const Login = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [cargando, setCargando] = useState(false);

  const values = {
    usuario: "",
    contrasenia: "",
  };

  const { setToken } = useContext(AuthContext);
  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const handleSubmit = async (valores) => {
    try {
      setCargando(true);

      const { data } = await clienteAxios.post(`/api/1.0/auth`, valores);

      sessionStorage.setItem("token", data.jwt);

      setToken(data);

      navigate("/home");
    } catch (err) {
      if (!err.response) {
        mostrarAlerta({
          message: "Fallas internas, por favor inténtelo más tarde.",
          categoria: "error",
        });
      } else {
        mostrarAlerta({
          message: err.response.data.message,
          categoria: "error",
        });
      }
    }
    setCargando(false);
  };

  const { message } = alerta;

  const formik = formikMain(handleSubmit, values, "LoginSchema");

  return (
    <>
      <CssBaseline />

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
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            autoComplete="false"
          >
            {message && <Alerta />}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Usuario registrado"
              value={formik.values.usuario}
              onChange={formik.handleChange}
              error={formik.touched.usuario && Boolean(formik.errors.usuario)}
              helperText={formik.touched.usuario && formik.errors.usuario}
              name="usuario"
              type="text"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contrasenia"
              label="Contraseña"
              value={formik.values.contrasenia}
              onChange={formik.handleChange}
              error={
                formik.touched.contrasenia && Boolean(formik.errors.contrasenia)
              }
              helperText={
                formik.touched.contrasenia && formik.errors.contrasenia
              }
              type="password"
              id="contrasenia"
            />
            <Grid container className={classes.containerGrid}>
              <Grid item xs className={classes.containerGridOption}>
                <Link
                  to="/olvide-contrasenia"
                  variant="body2"
                  className={classes.opcion}
                >
                  ¿Olvide contraseña?
                </Link>
              </Grid>
            </Grid>
            {cargando ? (
              <div className="container2">
                <CircularProgress />
              </div>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
