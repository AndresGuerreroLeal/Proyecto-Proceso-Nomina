import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

//Material ui
import { CircularProgress, Container, makeStyles, Paper } from "@material-ui/core";
import AuthContext from "../context/auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  main: {
    height: "100vh",
    width: "100vw",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
}));

const FormLayout = () => {
  const classes = useStyles();

  const {cargando,perfil } = useContext(AuthContext);

  if(cargando) return (

    <div className="container">
    <CircularProgress />
  </div>
    )

  return (
    <>
      {!perfil?.usuario ? (
        <Container className={classes.main}>
          <Paper className={classes.container}>
            <Outlet />
          </Paper>
        </Container>
      ) : (
        <Navigate to="/home" />
      )}
    </>
  );
};

export default FormLayout;
