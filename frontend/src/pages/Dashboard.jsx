import React from "react";

//Material ui
import { makeStyles, Typography } from "@material-ui/core";
import { Grid, Paper } from "@mui/material";

const useStyles = makeStyles((theme) => ({}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <>
      <Typography component="h2" variant="h4" gutterBottom>
        Hola, bienvenido de nuevo
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{
          marginTop: 2,
        }}
      >
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              height: 300,
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              flexDirection: "column",
            }}
          >
            <Typography component="h3" variant="h5">
              Ver Empleados
            </Typography>
            <p>Total empleados: 30</p>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              height: 300,
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              flexDirection: "column",
            }}
          >
            <Typography component="h3" variant="h5">
              Ver contactos
            </Typography>

            <p>Total contratos: 30</p>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              height: 300,
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              flexDirection: "column",
            }}
          >
            <Typography component="h3" variant="h5">
              Ver nóminas
            </Typography>
            <p>Total nóminas: 30</p>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
