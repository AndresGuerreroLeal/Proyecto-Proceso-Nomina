import React from "react";
import { Outlet } from "react-router-dom";

//Material ui
import { Container, makeStyles, Paper } from "@material-ui/core";

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
  return (
    <Container className={classes.main}>
      <Paper className={classes.container}>
        <Outlet />
      </Paper>
    </Container>
  );
};

export default FormLayout;
