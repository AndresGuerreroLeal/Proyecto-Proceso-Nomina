import {
  Box,
  Button,
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
import NumberFormat from "react-number-format";

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

const withValueLimit = ({ floatValue }) => floatValue <= 1000000;

const ModalNuevaNovedad = () => {
  let values = {
    valor: "",
    concepto: "",
    reset: true,
  };

  const { mostrarModalNuevaNovedad, modalNuevaNovedad, crearNuevaNovedad,nominaNovedad } =
    useContext(NominaContext);

  const handleSubmit = (novedad) => {
    crearNuevaNovedad(novedad,nominaNovedad);
  };

  const formik = formikMain(handleSubmit, values, "NovedadSchema");

  return (
    <div>
      <Modal
        open={modalNuevaNovedad}
        onClose={mostrarModalNuevaNovedad}
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
              Crear nueva novedad
            </Typography>
            <form
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
              }}
              onSubmit={formik.handleSubmit}
            >
              <NumberFormat
                id="valor"
                fullWidth
                name="valor"
                label="Valor"
                value={formik.values.valor}
                onChange={formik.handleChange}
                error={formik.touched.valor && Boolean(formik.errors.valor)}
                helperText={formik.touched.valor && formik.errors.valor}
                onBlur={formik.handleBlur}
                customInput={TextField}
                thousandSeparator={true}
                isAllowed={withValueLimit}
              />
              <TextField
                id="concepto"
                fullWidth
                name="concepto"
                label="Concepto"
                value={formik.values.concepto}
                onChange={formik.handleChange}
                error={
                  formik.touched.concepto && Boolean(formik.errors.concepto)
                }
                helperText={formik.touched.concepto && formik.errors.concepto}
                onBlur={formik.handleBlur}
              />

              <Button
                variant="contained"
                style={{ width: "50%", margin: "0 auto" }}
                type="submit"
              >
                Guardar novedad
              </Button>
            </form>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalNuevaNovedad;
