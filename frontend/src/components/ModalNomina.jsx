import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import { Grid } from "@mui/material";
import clienteAxios from "../config/axios";
import AuthContext from "../context/auth/AuthContext";
import NominaContext from "../context/nomina/NominaContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const ModalNomina = () => {
  const { empleado } = useContext(EmpleadoContext);

  const { nomina, mostrarModalNomina, modalNomina } = useContext(NominaContext);

  const handleDownload = (docurl) => {
    const token = sessionStorage.getItem("token");

    let config = {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    clienteAxios
      .get(docurl, config)
      .then((res) => res.data)
      .then((file) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
          "download",
          `${empleado.nombres}-${empleado.apellidos}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Modal
        open={modalNomina}
        onClose={mostrarModalNomina}
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
              marginTop: "1rem",
              gap: "0.5rem",
            }}
          >
            <Typography variant="p" component="h3">
              Nómina: {nomina.numero_contrato}
            </Typography>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Datos Básicos
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Nombres: <span className="texto">{nomina.nombres}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Apellidos: <span className="texto">{nomina.apellidos}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Estado: <span className="texto">{nomina.estado}</span>
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Información Laboral
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Número de contrato:{" "}
                  <span className="texto">{nomina.numero_contrato}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Fecha de inicio:{" "}
                  <span className="texto">{nomina.fecha_inicio}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Cargo: <span className="texto">{nomina.cargo}</span>
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Datos de Contrato
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Tipo de contato:{" "}
                  <span className="texto">{nomina.tipo_contrato}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Sueldo: <span className="texto">{nomina.sueldo}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Tipo de cotizante:{" "}
                  <span className="texto">{empleado.tipo_cotizante}</span>
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Datos para aportes de seguridad social y parafiscales
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Fondo de salud:{" "}
                  <span className="texto">{nomina.fondo_salud}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de salud del empleado:{" "}
                  <span className="texto">
                    {nomina.porcentaje_salud_empleado}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de salud del empleador:{" "}
                  <span className="texto">
                    {nomina.porcentaje_salud_empleador}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Fondo de pensiones:{" "}
                  <span className="texto">{nomina.fondo_pensiones}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de pensión del empleado:{" "}
                  <span className="texto">
                    {nomina.porcentaje_pension_empleado}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de pensión del empleador:{" "}
                  <span className="texto">
                    {nomina.porcentaje_pension_empleador}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Arl: <span className="texto">{nomina.arl}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Fondo de cesantias:{" "}
                  <span className="texto">{nomina.fondo_cesantias}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje parafiscal SENA:{" "}
                  <span className="texto">
                    {nomina.porcentaje_parafiscal_sena}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje parafiscal ICBF:{" "}
                  <span className="texto">
                    {nomina.porcentaje_parafiscal_icbf}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje parafiscal compensación:{" "}
                  <span className="texto">
                    {nomina.porcentaje_parafiscal_caja_compensacion}
                  </span>
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalNomina;
