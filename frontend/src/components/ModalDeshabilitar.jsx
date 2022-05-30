import { TextField } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextareaAutosize,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const ModalDeshabilitar = ({ open, setOpen, eliminar }) => {
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  const [concepto, setConcepto] = useState("");

  const submit = () => {
    if ([concepto].includes("")) {
      return;
    }

    eliminar(concepto);

    setConcepto("");
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Concepto por el cual se deshabilita el empleado
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Escriba concepto"
              style={{ width:"100%",minHeight:40, resize: "none",padding:"1rem" }}
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={submit} autoFocus color="error" variant="contained">
            Deshabilitar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalDeshabilitar;
