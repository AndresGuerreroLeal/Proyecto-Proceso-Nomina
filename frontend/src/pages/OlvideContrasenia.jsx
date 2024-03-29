import React, { useContext } from "react";
import { Link } from "react-router-dom";

//Config
import clienteAxios from "../config/axios";
import formikMain from "../helpers/formikMain";

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
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.up("xs")]: {
      width: "444px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "250px",
    },
  },
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
    color: "lightGray",
  },
}));

const OlvideContrasenia = () => {
  const classes = useStyles();

  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const values = {
    correo: "",
  };

  const handleSubmit = async (valores) => {
    const { correo } = valores;

    try {
      const { data } = await clienteAxios.put(`api/1.0/auth/forgot-password/`, {
        correo,
      });

      mostrarAlerta({
        message: data.message,
        categoria: "info",
      });
    } catch (err) {
      console.log(err.response.data);
      mostrarAlerta({
        message: err.response.data.message
          ? err.response.data.message
          : "Email no válido",
        categoria: "error",
      });
    }
  };

  const { message } = alerta;

  const formik = formikMain(handleSubmit, values, "OlvideContraseniaSchema");

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className={classes.container}
        >
          <Avatar sx={{ m: 1, bgcolor: "#757ce8" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Olvide Contraseña
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            {message && <Alerta />}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo registrado"
              name="correo"
              type="email"
              value={formik.values.correo}
              onChange={formik.handleChange}
              error={formik.touched.correo && Boolean(formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
            />

            <Grid container className={classes.containerGrid}>
              <Grid item xs textAlign={"right"}>
                <Link to="/" variant="body2" className={classes.opcion}>
                  Desea iniciar sesión
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Enviar Instrucciones
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default OlvideContrasenia;
