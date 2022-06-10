import {
  Box,
  Button,
  MenuItem,
  Modal,
  Paper,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { Grid } from "@mui/material";

import NominaContext from "../context/nomina/NominaContext";
import formikMain from "../helpers/formikMain";
import listaAños from "../helpers/listaAños";
import listaMeses from "../helpers/listaMeses";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const ModalNuevaNomina = () => {
  let values = {
    valor: "",
    concepto: "",
  };

  const { mostrarModalNuevaNomina, modalNuevaNomina, crearNuevaNomina } =
    useContext(NominaContext);

  const handleSubmit = (nomina) => {
    crearNuevaNomina(nomina);
  };

  const formik = formikMain(handleSubmit, values, "NominaSchema");

  return (
    <div>
      <Modal
        open={modalNuevaNomina}
        onClose={mostrarModalNuevaNomina}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: "1rem",
              gap: "2rem",
            }}
          >
            <Typography variant="p" component="h3">
              Crear nueva nómina
            </Typography>
            <form
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <TextField
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
                onBlur={formik.handleBlur}
              />

              <TextField
                select
                id="año"
                name="año"
                label="Año"
                fullWidth
                value={formik.values.año}
                onChange={formik.handleChange}
                error={formik.touched.año && Boolean(formik.errors.año)}
                helperText={formik.touched.año && formik.errors.año}
                onBlur={formik.handleBlur}
              >
                {listaAños()?.map((año) => (
                  <MenuItem value={año} key={año}>
                    {año}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                id="mes"
                name="mes"
                label="Mes"
                fullWidth
                value={formik.values.mes}
                onChange={formik.handleChange}
                error={formik.touched.mes && Boolean(formik.errors.mes)}
                helperText={formik.touched.mes && formik.errors.mes}
                onBlur={formik.handleBlur}
              >
                {listaMeses()?.map((mes) => (
                  <MenuItem value={mes} key={mes}>
                    {mes}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                style={{ width: "50%", margin: "0 auto" }}
              >
                Crear Nómina
              </Button>
            </form>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalNuevaNomina;
