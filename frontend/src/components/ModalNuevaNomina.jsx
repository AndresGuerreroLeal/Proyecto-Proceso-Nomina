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
import Alerta from "./Alerta";
import AlertaContext from "../context/alerta/AlertaContext";
import clienteAxios from "../config/axios";

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
    mes: "",
    anio: "",
    nombre: "",
    reset: true,
  };

  const { mostrarModalNuevaNomina, modalNuevaNomina,setNominasDisabled } =
    useContext(NominaContext);

  const { alerta,mostrarAlerta } = useContext(AlertaContext);

  const handleDownload = (docurl,nomina) => {
    const token = sessionStorage.getItem("token");
    const novedades = JSON.parse(localStorage.getItem("novedades"));

    nomina.novedades = novedades && novedades; 
    nomina.enviar_desprendibles = true;

    setNominasDisabled([]);

    localStorage.removeItem("novedades");

    mostrarAlerta({
      message: "Se genero el reporte exitosamente",
      categoria: "success",
    });

    let config = {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    clienteAxios
      .post(docurl,nomina, config)
      .then((res) => res.data)
      .then((file) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${nomina.nombre}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        mostrarModalNuevaNomina(false);
      })
      .catch((err) => {
        console.log(err);
      });


    };
    
    const handleSubmit = (nomina) => {
        handleDownload("/api/1.0/payroll/create", nomina);
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
              onSubmit={formik.handleSubmit}
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

              <TextField
                select
                id="anio"
                name="anio"
                label="Año"
                fullWidth
                value={formik.values.anio}
                onChange={formik.handleChange}
                error={formik.touched.anio && Boolean(formik.errors.anio)}
                helperText={formik.touched.anio && formik.errors.anio}
                onBlur={formik.handleBlur}
              >
                {listaAños()?.map((año) => (
                  <MenuItem value={año} key={año}>
                    {año}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                style={{ width: "50%", margin: "0 auto" }}
                type="submit"
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
