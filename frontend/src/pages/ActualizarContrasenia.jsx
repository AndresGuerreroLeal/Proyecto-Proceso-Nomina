import React, { useContext, useEffect, useState } from "react";

//Config
import formikMain from "../helpers/formikMain";

//Context
import AuthContext from "../context/auth/AuthContext";
import AlertaContext from "../context/alerta/AlertaContext";

//Components
import Alerta from "../components/Alerta";

//Material ui
import { Typography } from "@material-ui/core";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const ActualizarContrasenia = () => {
  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const { alertaauth, actualizarContrasenia } = useContext(AuthContext);

  let values = {
    contraseniaActual: "",
    contraseniaNueva: "",
    confirmarContraseniaNueva: "",
    reset: true,
  };

  useEffect(() => {
    if (alertaauth) {
      mostrarAlerta(alertaauth);
      return;
    }
  }, [alertaauth]);

  const handleSubmit = async (valores) => {
    await actualizarContrasenia({
      contrasenia: valores.contraseniaActual,
      nuevaContrasenia: valores.contraseniaNueva,
      reset: valores.reset,
    });
  };

  const { message } = alerta;

  const formik = formikMain(handleSubmit, values, "ActualizarContraseniaSchema");

  return (
    <>
      <Typography variant="h4" component="h2">
        Actualizar Contraseña
      </Typography>

      {message && (
        <Box sx={{ width: "70%", margin: " 1rem auto 0 ", display:"flex",
        justifyContent:"center" }}>
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
          label="Contraseña Actual"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="contraseniaActual"
          type="password"
          value={formik.values.contraseniaActual}
          onChange={formik.handleChange}
          error={formik.touched.contraseniaActual && Boolean(formik.errors.contraseniaActual)}
          helperText={formik.touched.contraseniaActual && formik.errors.contraseniaActual}
        />

        <TextField
          label="Contraseña Nueva"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="contraseniaNueva"
          type="password"
          value={formik.values.contraseniaNueva}
          onChange={formik.handleChange}
          error={formik.touched.contraseniaNueva && Boolean(formik.errors.contraseniaNueva)}
          helperText={formik.touched.contraseniaNueva && formik.errors.contraseniaNueva}
        />

        <TextField
          label="Confirmar Contraseña Nueva"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="confirmarContraseniaNueva"
          type="password"
          value={formik.values.confirmarContraseniaNueva}
          onChange={formik.handleChange}
          error={formik.touched.confirmarContraseniaNueva && Boolean(formik.errors.confirmarContraseniaNueva)}
          helperText={formik.touched.confirmarContraseniaNueva && formik.errors.confirmarContraseniaNueva}
        />

        <Button
          type="submit"
          
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Actualizar Contraseña
        </Button>
      </Box>
    </>
  );
};

export default ActualizarContrasenia;
