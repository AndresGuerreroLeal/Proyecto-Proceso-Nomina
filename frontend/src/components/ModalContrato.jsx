import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Grid } from "@mui/material";
import contratoContext from "../context/contrato/ContratoContext";

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

const ModalContrato = () => {
  const { contrato, modalContrato, mostrarModalContrato } =
    useContext(contratoContext);

  return (
    <div>
      <Modal
        open={modalContrato}
        onClose={mostrarModalContrato}
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
              Número de contrato: {contrato.numero_contrato}
            </Typography>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Información Laboral
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Número de contrato:{" "}
                  <span className="texto"> {contrato.numero_contrato}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Fecha de inicio:{" "}
                  <span className="texto">{contrato.fecha_inicio}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Cargo: <span className="texto">{contrato.cargo}</span>
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Datos de Contrato
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Tipo de contrato:{" "}
                  <span className="texto">{contrato.tipo_contrato}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Sueldo: <span className="texto">{contrato.sueldo}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Tipo de cotizante:{" "}
                  <span className="texto">{contrato.tipo_cotizante}</span>
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
                  <span className="texto">{contrato.fondo_salud}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de salud del empleado:{" "}
                  <span className="texto">
                    {contrato.porcentaje_salud_empleado}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de salud del empleador:{" "}
                  <span className="texto">
                    {contrato.porcentaje_salud_empleador}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Fondo de pensiones:{" "}
                  <span className="texto">{contrato.fondo_pensiones}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de pensión del empleado:{" "}
                  <span className="texto">
                    {contrato.porcentaje_pension_empleado}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje de pensión del empleador:{" "}
                  <span className="texto">
                    {contrato.porcentaje_pension_empleador}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Arl: <span className="texto">{contrato.arl}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Fondo de cesantias:{" "}
                  <span className="texto">{contrato.fondo_cesantias}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje parafiscal sena:{" "}
                  <span className="texto">
                    {contrato.porcentaje_parafiscal_sena}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje parafiscal ICBF:{" "}
                  <span className="texto">
                    {contrato.porcentaje_parafiscal_icbf}
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Porcentaje parafiscal compensación:{" "}
                  <span className="texto">
                    {contrato.porcentaje_parafiscal_caja_compensacion}
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

export default ModalContrato;
