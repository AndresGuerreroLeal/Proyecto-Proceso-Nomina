import { makeStyles, Toolbar } from "@material-ui/core";
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

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
  },
}));

const DashboardLayout = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar />
      <main className={classes.content}>
        <Toolbar />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
