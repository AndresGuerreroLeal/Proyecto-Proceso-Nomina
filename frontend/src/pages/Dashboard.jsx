import React, { useContext, useEffect } from "react";

//Context
import AuthContext from "../context/auth/AuthContext";

//Material ui
import { makeStyles, Typography } from "@material-ui/core";
import { CircularProgress, Grid, Paper } from "@mui/material";

const useStyles = makeStyles((theme) => ({}));

const Dashboard = () => {

  const {cantidadEmpleados,cantidadContratos,cargandoAPI,obtenerCantidadEmpleados,obtenerCantidadContratos} = useContext(AuthContext)

  useEffect(()=>{
    obtenerCantidadEmpleados();
    obtenerCantidadContratos();
  },[])

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
            {cargandoAPI ? (
              <CircularProgress />
            ) : (
              <>
                <Typography component="h3" variant="h5">
                  Ver Empleados
                </Typography>
                <div style={{ textAlign: "center" }}>
                  <p>Total empleados: {cantidadEmpleados?.cantidadEmpleados}</p>
                  <p>Total Activos: {cantidadEmpleados?.cantidadActivos}</p>
                  <p>Total Inactivos: {cantidadEmpleados?.cantidadInactivos}</p>
                </div>
              </>
            )}
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
            {cargandoAPI ? (
              <CircularProgress />
            ) : (
              <>
                <Typography component="h3" variant="h5">
                  Ver contactos
                </Typography>
                <div style={{ textAlign: "center" }}>
                  <p>Total contratos: {cantidadContratos?.cantidadContratos}</p>
                  <p>Total Activos: {cantidadContratos?.contratosActivos}</p>
                  <p>
                    Total Inactivos: {cantidadContratos?.contratosInactivos}
                  </p>
                </div>
              </>
            )}
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
