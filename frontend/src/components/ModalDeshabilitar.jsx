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
import React, { useContext, useEffect, useState } from "react";
import AlertaContext from "../context/alerta/AlertaContext";
import Alerta from "./Alerta";

const ModalDeshabilitar = ({ open, setOpen, titulo, eliminar, boton }) => {
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  const [concepto, setConcepto] = useState("");

  const { alerta, mostrarAlerta } = useContext(AlertaContext);

  const submit = () => {
    if ([concepto].includes("")) {
      return mostrarAlerta({
        message: "Se requiere concepto",
        categoria: "error",
      });
    }

    eliminar(concepto);

    setConcepto("");
  };

  const {message} = alerta

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        {message && <Alerta />}
        <DialogTitle>{titulo}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Escriba concepto"
              style={{
                width: "100%",
                minHeight: 40,
                resize: "none",
                padding: "1rem",
              }}
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
            {boton}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalDeshabilitar;
