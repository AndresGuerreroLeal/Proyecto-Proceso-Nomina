import React from "react";

//Material ui
import { Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  containerGrid: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    gap: theme.spacing(3),
  },
  containerItem: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const inputStyles = {
  width: "100%",
  marginTop: "1rem",
};

const EmpleadoForm = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" component="h2">
        Nuevo empleado
      </Typography>
      <Grid container className={classes.containerGrid}>
        <Grid item xs={11} lg={5.8}>
          <TextField
            type="file"
            label="Documento de identidad"
            InputLabelProps={{
              shrink: true,
            }}
            sx={inputStyles}
          />
          <TextField label="Nombres" variant="outlined" sx={inputStyles} />
          <TextField label="Apellidos" variant="outlined" sx={inputStyles} />
          <TextField select label="Tipo de documento" sx={inputStyles}>
            <MenuItem>CC</MenuItem>
          </TextField>
          <TextField
            label="Numero de documento"
            variant="outlined"
            sx={inputStyles}
          />
          <TextField label="Correo" variant="outlined" sx={inputStyles} />
          <TextField
            label="Numero de celular"
            variant="outlined"
            sx={inputStyles}
          />
        </Grid>
        <Grid item xs={11} lg={5.8}>
          <TextField
            label="Ciudad de residencia"
            variant="outlined"
            sx={inputStyles}
          />
          <TextField
            label="Dirección de residencia"
            variant="outlined"
            sx={inputStyles}
          />
          <TextField
            label="Metodo de pago"
            variant="outlined"
            sx={inputStyles}
          />
          <TextField
            label="Entidad bancaria"
            variant="outlined"
            sx={inputStyles}
          />
          <TextField
            label="Tipo de cuenta"
            variant="outlined"
            sx={inputStyles}
          />
          <TextField
            label="Numero de cuenta"
            variant="outlined"
            sx={inputStyles}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Crear usuario
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EmpleadoForm;
