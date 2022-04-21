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
              flexDirection: "column",
            }}
          >
            <Typography component="h3" variant="h5">
              Ver empleado
            </Typography>
            <Typography component="p" variant="body5">
              Total empleados: 30
            </Typography>
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
            <Typography component="p" variant="body1">
              Total contratos: 30
            </Typography>
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
            <Typography component="p" variant="body1">
              Total nóminas: 30
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
