import React, { useContext, useState } from "react";
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
import UiContext from "../context/ui/UiContext";

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
    width: ({ widthMenu }) => widthMenu,
    visibility: ({ visibility }) => visibility,
  },
  drawerPaper: {
    [theme.breakpoints.up("md")]: {
      width: ({ widthMenu }) => widthMenu,
    },
    padding: ({ widthMenu }) => (widthMenu === 333 ? "0 20px" : "0"),
    width: 333,
    visibility: ({ visibility }) => visibility,
    transition: "all .3s ease",
  },
  opcion: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "black",
  },
}));

const NavBar = () => {
  const {menuProperties,changeMenuProperties,open,setOpen} = useContext(UiContext)

  const classes = useStyles(menuProperties);

  const theme = useTheme();

    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(!open);
    changeMenuProperties();
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
        <Link to="" style={{ width: "100%", display: "flex" }}>
          <img src={logosm} className={classes.logonavbar} />
        </Link>
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
              <Link to="/home/empleados" className={classes.opcion}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lista Empleados" />
                </ListItemButton>
              </Link>

              <Link to="/home/reportes-empleados" className={classes.opcion}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes Empleados" />
                </ListItemButton>
              </Link>
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
              <Link to="/home/contratos" className={classes.opcion}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <WorkHistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Listar Contratos" />
                </ListItemButton>
              </Link>

              <Link to="/home/reportes-contratos" className={classes.opcion}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes Contratos" />
                </ListItemButton>
              </Link>
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
              <Link to="/home/nominas" className={classes.opcion}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <FindInPageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Listar Nominas" />
                </ListItemButton>
              </Link>

              <Link to="/home/reportes-nominas" className={classes.opcion}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes Nominas" />
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
