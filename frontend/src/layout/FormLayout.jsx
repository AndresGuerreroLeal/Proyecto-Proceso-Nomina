import { Container, makeStyles, Paper } from "@material-ui/core";
import { display } from "@mui/system";
import React from "react";
import { Outlet } from "react-router-dom";

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
    width:"320px",
    height:"max-content",
    padding: theme.spacing(3),
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
