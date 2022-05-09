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

const ActualizarContrasenia = () => {
  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const { alertaauth, ActualizarContrasenia } = useContext(AuthContext);

  useEffect(() => {
    if (alertaauth) {
      mostrarAlerta(alertaauth);
      return;
    }
  }, [alertaauth]);

  const [actualizarcontrasenia, setActualizarContrasenia] = useState({
    contrasenia: "",
    contraseniaNueva: "",
    confirmarContraseniaNueva: "",
  });

  const [contraseniaerror, setContraseniaError] = useState({
    message: "",
    error: false,
  });

  const [contrasenianuevaerror, setContraseniaNuevaError] = useState({
    message: "",
    error: false,
  });

  const [confcontrasenianuevaerror, setConfContraseniaError] = useState({
    message: "",
    error: false,
  });

  const { contrasenia, contraseniaNueva, confirmarContraseniaNueva } =
    actualizarcontrasenia;

  const handleChange = (e) => {
    setActualizarContrasenia({
      ...actualizarcontrasenia,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      [contrasenia, contraseniaNueva, confirmarContraseniaNueva].includes("")
    ) {
      setContraseniaError({
        message: "Campo de contraseña requerido",
        error: true,
      });
      setContraseniaNuevaError({
        message: "Campo de nueva contraseña requerido",
        error: true,
      });
      setConfContraseniaError({
        message: "Campo de confirmar contrase requerido",
        error: true,
      });
      return;
    }
    else if (contrasenia === "") {
      setContraseniaError({
        message: "Campo de contraseña requerido",
        error: true,
      });
      return;
    } else if (contraseniaNueva === "") {
      setContraseniaNuevaError({
        message: "Campo de nueva contraseña requerido",
        error: true,
      });
      return;
    } else if (confirmarContraseniaNueva === "") {
      setConfContraseniaError({
        message: "Campo de confirmar contrase requerido",
        error: true,
      });
      return;
    } else if (contraseniaNueva <= 4) {
      setContraseniaNuevaError({
        message: "Contraseña nueva no válida",
        error: true,
      });
      return;
    } else if (contraseniaNueva !== confirmarContraseniaNueva) {
      setConfContraseniaError({
        message: "La contraseña no coincide",
        error: true,
      });
      return;
    }

    setContraseniaError();
    setContraseniaNuevaError();
    setConfContraseniaError();

    ActualizarContrasenia({
      contrasenia,
      nuevaContrasenia: contraseniaNueva,
    });

    setActualizarContrasenia({
      contrasenia: "",
      contraseniaNueva: "",
      confirmarContraseniaNueva: "",
    });
  };

  const { message } = alerta;

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
          label="Contraseña Actual"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="contrasenia"
          type="password"
          onChange={handleChange}
          value={contrasenia}
          error={contraseniaerror?.error}
          helperText={contraseniaerror?.message}
        />

        <TextField
          label="Contraseña Nueva"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="contraseniaNueva"
          type="password"
          onChange={handleChange}
          value={contraseniaNueva}
          error={contrasenianuevaerror?.error}
          helperText={contrasenianuevaerror?.message}
        />

        <TextField
          label="Confirmar Contraseña Nueva"
          variant="outlined"
          sx={{ width: "70%", mt: 3 }}
          name="confirmarContraseniaNueva"
          type="password"
          onChange={handleChange}
          value={confirmarContraseniaNueva}
          error={confcontrasenianuevaerror?.error}
          helperText={confcontrasenianuevaerror?.message}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, width: "70%" }}
        >
          Actualizar Contraseña
        </Button>
      </Box>
    </>
  );
};

export default ActualizarContrasenia;
