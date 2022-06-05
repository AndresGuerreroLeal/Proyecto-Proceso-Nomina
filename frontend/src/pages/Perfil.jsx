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
import formikMain from "../helpers/formikMain";

const Perfil = () => {
  const { perfil, actualizarPerfil, alertaauth, setAlertaAuth } =
    useContext(AuthContext);

  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const values = {
    usuario: "",
    nombre: "",
    correo: "",
  };

  useEffect(() => {
    if (perfil) {
      formik.setFieldValue("nombre", perfil.nombre);
      formik.setFieldValue("correo", perfil.correo);
      formik.setFieldValue("usuario", perfil.usuario);
    }

    if (alertaauth) {
      mostrarAlerta(alertaauth);
      return;
    }
  }, [perfil, alertaauth]);

  const handleSubmit = async (valores) => {
    await actualizarPerfil(valores);
  };

  const { message } = alerta;

  const formik = formikMain(handleSubmit, values, "PerfilSchema");

  return (
    <>
      <Typography variant="h4" component="h2">
        Perfil - Datos registrados
      </Typography>

      {message && (
        <Box
          sx={{
            width: "70%",
            margin: " 1rem auto 0 ",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Alerta />
        </Box>
      )}

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
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
          name="usuario"
          value={formik.values.usuario}
          onChange={formik.handleChange}
          error={formik.touched.usuario && Boolean(formik.errors.usuario)}
          helperText={formik.touched.usuario && formik.errors.usuario}
        />
        <TextField
          id="outlined-basic"
          label="Nombre"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
        />
        <TextField
          id="outlined-basic"
          label="Correo"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="correo"
          value={formik.values.correo}
          onChange={formik.handleChange}
          error={formik.touched.correo && Boolean(formik.errors.correo)}
          helperText={formik.touched.correo && formik.errors.correo}
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
