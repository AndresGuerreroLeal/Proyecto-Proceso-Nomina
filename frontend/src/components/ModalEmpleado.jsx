import { Box, Modal, Typography } from '@mui/material';
import React, { useContext } from 'react'
import EmpleadoContext from '../context/empleado/EmpleadoContext';
import { Grid } from "@mui/material";
import clienteAxios from '../config/axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:350,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };

const ModalEmpleado = () => {

    const {empleado,mostrarModalEmpleado,modalEmpleado} = useContext(EmpleadoContext)

  const handleDownload =(docurl)=>{


      const token = localStorage.getItem("token")

      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      clienteAxios
        .get(docurl, config)
        .then((res) => res.data)
        .then((file) => {
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.setAttribute("type", "hidden");
          link.href = file;
          console.log(link.href)
          link.download = docurl;
          link.click();
          document.body.removeChild(link);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.message);
        });



  }

  return (
    <div>
      <Modal
        open={modalEmpleado}
        onClose={mostrarModalEmpleado}
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
              Empleado: {empleado.nombres}
            </Typography>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Datos Básicos
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Nombre: <span className="texto">{empleado.nombres}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Apellidos: <span className="texto">{empleado.apellidos}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Número de celular:{" "}
                  <span className="texto">{empleado.numero_celular}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Correo: <span className="texto">{empleado.correo}</span>
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Datos Personales
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Tipo de documento:{" "}
                  <span className="texto">{empleado.tipo_documento}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Número de documento:{" "}
                  <span className="texto">{empleado.numero_documento}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Documento:{" "}
                  <span className="texto">
                    <button onClick={() => handleDownload(empleado.documento)}>
                      Ver documento
                    </button>
                  </span>
                </Typography>

                <Typography variant="p" component="h4">
                  Ciudad de residencia:{" "}
                  <span className="texto">{empleado.ciudad_residencia}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Dirección de residencia:{" "}
                  <span className="texto">{empleado.direccion_residencia}</span>
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} justifyContent="flex-start">
              <Typography variant="p" component="h3">
                Datos de pago
              </Typography>

              <div style={{ padding: "0.5rem" }}>
                <Typography variant="p" component="h4">
                  Método de pago:{" "}
                  <span className="texto">{empleado.metodo_pago}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Entidad bancaria:{" "}
                  <span className="texto">{empleado.entidad_bancaria}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Tipo de cuenta:{" "}
                  <span className="texto">{empleado.tipo_cuenta}</span>
                </Typography>

                <Typography variant="p" component="h4">
                  Número de cuenta:{" "}
                  <span className="texto">{empleado.numero_cuenta}</span>
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalEmpleado