import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

//Context
import AuthContext from "../context/auth/AuthContext";

//Components
import NavBar from "../components/NavBar";

//Material ui
import { makeStyles, Toolbar } from "@material-ui/core";
import { CircularProgress } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(8),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(7),
    },
    transition: "all .4s ease"
  },
}));

const DashboardLayout = () => {
  const classes = useStyles();

  const { cargando, perfil } = useContext(AuthContext);

  if (cargando)
    return (
      <div className="container">
        <CircularProgress />
      </div>
    );

  return (
    <>
      {perfil?.usuario ? (
        <div className={classes.root}>
          <NavBar />
          <main className={classes.content}>
            <Toolbar />
            <Outlet />
          </main>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default DashboardLayout;
