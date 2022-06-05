import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import Avatar from "@mui/material/Avatar";
import { Divider, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";

//Material ui icons
import MenuIcon from "@material-ui/icons/Menu";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";

//Imagenes
import logo from "../images/logo.png";
import UiContext from "../context/ui/UiContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    background: "#02524c",
    padding: "15px",
    [theme.breakpoints.up("md")]: {
      width: ({ widthMenu }) => `calc(100% - ${widthMenu}px)`,
    },
  },
  logo: {
    width: "33%",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    cursor: "pointer",
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
  },
}));

const Header = ({ toggleDrawer }) => {
  
    const {menuProperties} = useContext(UiContext)

  const classes = useStyles(menuProperties);

  const { perfil, cerrarSesion } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleRute = (ruta) => {
    navigate(`${ruta}`);
    setAnchorEl(null)
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.navbar}>
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
          <p>Último Acceso: {perfil.ultimoAcceso.split("T")[0]}</p>

          <Tooltip title="Ajustes de usuario">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar alt="Remy Sharp" sx={{ width: 32, height: 32 }}>
                A
              </Avatar>
            </IconButton>
          </Tooltip>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => handleRute("perfil")}>
            <Avatar /> Mi cuenta
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleRute("actualizar-contrasenia")}>
            <ListItemIcon>
              <PasswordIcon fontSize="small" />
            </ListItemIcon>
            Cambiar contraseña
          </MenuItem>

          <MenuItem onClick={cerrarSesion}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
