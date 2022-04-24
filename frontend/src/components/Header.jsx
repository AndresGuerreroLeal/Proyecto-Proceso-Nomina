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
import Avatar from "@mui/material/Avatar";
import { Divider, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";

//Material ui icos
import MenuIcon from "@material-ui/icons/Menu";
import PasswordIcon from '@mui/icons-material/Password';
import LogoutIcon from '@mui/icons-material/Logout';

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
      width: "calc(100% - 333px)",
    },
  },
  logo: {
    width: "33%",
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
            Último Acceso: {perfil.ultimoAcceso.split("T")[0]}
          </Typography>
          <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
          <Avatar alt="Remy Sharp" sx={{ width: 32, height: 32 }}>A</Avatar>
          </IconButton>
        </Tooltip>
        </div>
        <Menu
        anchorEl={anchorEl}
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
          <Avatar /> Mi cuenta
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PasswordIcon fontSize="small"/>
          </ListItemIcon>
          Cambiar contraseña
        </MenuItem>
            
        <MenuItem>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
