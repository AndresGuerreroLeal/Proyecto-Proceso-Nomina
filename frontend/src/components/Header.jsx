import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import logo from "../images/logo.png";
import MailIcon from "@mui/icons-material/Mail";
import AuthContext from "../context/Auth/AuthContext";
import FormatoFecha from "../helpers/FormatoFecha";
import { Button, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  acceso:{
    [theme.breakpoints.down("xs")]: {
      display:"none"
    }
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
    [theme.breakpoints.down("sm")]: {
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
  const [ajustes, setAjustes] = useState(false);
  
  const open = Boolean(ajustes);

  const handleClick = (event) => {
    setAjustes(event.currentTarget);
  };
  const handleClose = () => {
    setAjustes(false);
  };

  const classes = useStyles();

  const { auth } = useContext(AuthContext);

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
          
          <p 
            className={classes.acceso}
          >Ultimo acceso: {FormatoFecha(auth?.ultimoAcceso)}</p>
          <Tooltip title="Ajustes">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>M</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
        anchorEl={ajustes}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Actualizar Datos
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Cambiar contraseña
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
