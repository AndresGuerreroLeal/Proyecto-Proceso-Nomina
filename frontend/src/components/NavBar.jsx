import React, { useState } from "react";
import { Link } from "react-router-dom";

//Material ui
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Header from "./Header";
import { Collapse, ListSubheader } from "@material-ui/core";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { ListItemButton } from "@mui/material";

//Material ui icons
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ArticleIcon from "@mui/icons-material/Article";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

//Imagenes
import logosm from "../images/logosm.png";

const drawerWidth = 333;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  logonavbar: {
    width: "30%",
    margin: "10px auto",
  },
  drawer: {
    flexShrink: 0,
    width: drawerWidth,
  },
  drawerPaper: {
    padding: "0 20px",
    width: drawerWidth,
  },
  opcion: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "black",
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [open, setOpen] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(!open);
  };

  const [menuempleados, setMenuEmpleados] = useState(false);
  const [menucontratos, setMenuContratos] = useState(false);
  const [menunominas, setMenuNominas] = useState(false);

  return (
    <>
      <CssBaseline />
      <Header toggleDrawer={toggleDrawer} />
      <Drawer
        className={classes.drawer}
        variant={isMdUp ? "permanent" : "temporary"}
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <img src={logosm} className={classes.logonavbar} />
        <Divider />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListSubheader component="div" id="nested-list-subheader">
            Usuarios
          </ListSubheader>
          <ListItemButton
            onClick={() => setMenuEmpleados(!menuempleados)}
            className={classes.listbutton}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Empleados" />
            {menuempleados ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={menuempleados} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <Link to="/home/empleados" className={classes.opcion}>
                  <ListItemIcon>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lista Empleados" />
                </Link>
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }}>
                <Link to="/home/reportes-empleados" className={classes.opcion}>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes Empleados" />
                </Link>
              </ListItemButton>
            </List>
          </Collapse>

          <ListSubheader component="div" id="nested-list-subheader">
            Contratos
          </ListSubheader>
          <ListItemButton onClick={() => setMenuContratos(!menucontratos)}>
            <ListItemIcon>
              <BusinessCenterIcon />
            </ListItemIcon>
            <ListItemText primary="Contratos" />
            {menucontratos ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={menucontratos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <Link to="/contratos" className={classes.opcion}>
                  <ListItemIcon>
                    <WorkHistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Listar Contratos" />
                </Link>
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }}>
                <Link to="admin/reportes-contratos" className={classes.opcion}>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes Contratos" />
                </Link>
              </ListItemButton>
            </List>
          </Collapse>

          <ListSubheader component="div" id="nested-list-subheader">
            Nominas
          </ListSubheader>
          <ListItemButton onClick={() => setMenuNominas(!menunominas)}>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Nominas" />
            {menunominas ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={menunominas} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <Link to="/nominas" className={classes.opcion}>
                  <ListItemIcon>
                    <FindInPageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Listar Nominas" />
                </Link>
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }}>
                <Link to="/reportes-nominas" className={classes.opcion}>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes Nominas" />
                </Link>
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
