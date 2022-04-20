import React, { useContext, useState } from "react";

//Context
import AuthContext from "../context/auth/AuthContext";

//Material ui
import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";

//Material ui icos
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@mui/material/Avatar";

//Imagenes
import logo from "../images/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    background: "#02524c",
    padding: "15px",
    [theme.breakpoints.up("md")]: {
      width: "calc(100% - 281px)",
    },
  },
  logo: {
    width: "25%",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const Header = ({ toggleDrawer }) => {
  const classes = useStyles();

  const { perfil } = useContext(AuthContext);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.navbar}>
        <img src={logo} className={classes.logo} />
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <div className={classes.icons}>
          <Typography component="p" variant="p">
            Ultimo Acceso: {perfil.ultimoAcceso.split("T")[0]}
          </Typography>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
