import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'

const ModalDialog = ({ open, setOpen, titulo, contenido,eliminar }) => {
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{titulo}.</DialogTitle>
        <DialogContent>
          <DialogContentText>{contenido}.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={eliminar}
            autoFocus
            color="error"
            variant="contained"
          >
            Acepto
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalDialog