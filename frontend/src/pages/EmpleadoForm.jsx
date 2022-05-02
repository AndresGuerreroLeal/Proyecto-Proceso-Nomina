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

  const handleSubmit = ()=>{

  }

  return (
    <>
      <Typography variant="h4" component="h2">
        Nuevo empleado
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container className={classes.containerGrid}>
          <Grid
            item
            xs={12}
            lg={5.8}
            justifyContent="flex-start"
            direction="column"
          >
            <Typography variant="p" component="h3">
              Datos Básicos
            </Typography>
            <TextField label="Nombres" variant="outlined" sx={inputStyles} />
            <TextField label="Apellidos" variant="outlined" sx={inputStyles} />
            <TextField
              label="Numero de celular"
              variant="outlined"
              sx={inputStyles}
            />
            <TextField
              label="Correo electrónico"
              variant="outlined"
              sx={inputStyles}
            />
            <TextField select label="Género" sx={inputStyles}>
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="femenino">Femenino</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>
          </Grid>
          <Grid item xs={12} lg={5.8}>
            <Typography variant="p" component="h3">
              Datos Personales
            </Typography>
            <div>
              <TextField select label="Tipo de documento" sx={inputStyles}>
                <MenuItem value="CC">CC</MenuItem>
                <MenuItem value="CE">CE</MenuItem>
                <MenuItem value="TI">TI</MenuItem>
              </TextField>
              <TextField
                label="Numero de documento"
                variant="outlined"
                sx={inputStyles}
              />
            </div>
            <TextField
              type="file"
              label="Documento de identidad"
              InputLabelProps={{
                shrink: true,
              }}
              sx={inputStyles}
            />
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
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p" component="h3">
              Datos de Pago
            </Typography>
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
             <TextField select label="Tipo de cuenta" sx={inputStyles}>
                <MenuItem value="corriente">Corriente</MenuItem>
                <MenuItem value="ahorro">Ahorro</MenuItem>
                <MenuItem value="nomina">Nómina</MenuItem>
                <MenuItem value="chequera">Chequera</MenuItem>
              </TextField>
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
      </form>
    </>
  );
};

export default EmpleadoForm;
