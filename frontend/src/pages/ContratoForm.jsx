import React, { useContext, useEffect, useState } from "react";

// Config 
import formikMain from "../helpers/formikMain";

//Material ui
import { Alert, Button, CircularProgress, Container, Grid, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import Alerta from "../components/Alerta";
import AlertaContext from "../context/alerta/AlertaContext";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../config/axios";
import ModalDialog from "../components/ModalDialog";
import AuthContext from "../context/auth/AuthContext";
import contratoContext from "../context/contrato/ContratoContext";

const useStyles = makeStyles((theme) => ({
  containerGrid: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    gap: theme.spacing(3),
  },
  containerItem: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const inputStyles = {
  width: "100%",
  marginTop: "1rem",
};

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

const ContratoForm = () => {
  const classes = useStyles();

  const {
    crearContrato,
    cargando,
    contratoEditar,
    obtenerContratoEditarAPI,
    editarContrato,
  } = useContext(contratoContext);

  const {mostrarAlerta,alerta} = useContext(AlertaContext)

  const {id} = useParams()

  let values = {
    numero_contrato: "",
    cargo: "",
    fecha_inicio: "",
    sueldo: "",
    tipo_cotizante: "",
    tipo_contrato: "",
    auxilio_transporte: "",
    fondo_salud: "",
    porcentaje_salud_empleado: "",
    porcentaje_salud_empleador: "",
    fondo_pensiones: "",
    porcentaje_pension_empleado: "",
    porcentaje_pension_empleador: "",
    arl: "",
    porcentaje_arl: "",
    fondo_cesantias: "",
    porcentaje_parafiscal_sena: "",
    porcentaje_parafiscal_icbf: "",
    porcentaje_parafiscal_caja_compesacion: "",
    salario_integral: "",
    reset: true,
  };

  const handleSubmit =  (contrato)=>{
    
    try {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });

      if (id && contratoEditar) {
        editarContrato(contrato);
      } else {
        crearContrato(contrato);
      }

    } catch (err) {
      if (!err.response) {
        mostrarAlerta({
          message: "Fallas internas, por favor inténtelo más tarde.",
          categoria: "error",
        });
      } else {
        mostrarAlerta({
          message: err.response.data.message,
          categoria: "error",
        });
      } 
    }    
  }

  const formik = formikMain(handleSubmit, values, "ContratoSchema");

  useEffect(() => {
    if (id) {
      obtenerContratoEditarAPI(id);
    }
  }, [id]);

  useEffect(()=>{
    if(contratoEditar && id){
    }
  },[contratoEditar])

  const {message} = alerta 

  return (
    <>
      {cargando ? (
        <div className="container3">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Typography variant="h4" component="h2">
            {contratoEditar._id ? "Editar Contrato" : "Nuevo Contrato"}
          </Typography>

          {message && <Alerta />}

          <form onSubmit={formik.handleSubmit}>
            <Grid container className={classes.containerGrid}>
              <Grid item xs={12} lg={5.8} justifyContent="flex-start">
                <Typography variant="p" component="h3">
                  Información laboral
                </Typography>
                <TextField
                  select
                  id="numero_contrato"
                  name="numero_contrato"
                  label="Número de contrato"
                  sx={inputStyles}
                  value={formik.values.numero_contrato}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.numero_contrato &&
                    Boolean(formik.errors.numero_contrato)
                  }
                  helperText={
                    formik.touched.numero_contrato &&
                    formik.errors.numero_contrato
                  }
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </TextField>
                <TextField
                  label="Fecha de inicio"
                  variant="outlined"
                  name="fecha_inicio"
                  sx={inputStyles}
                  value={formik.values.fecha_inicio}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fecha_inicio &&
                    Boolean(formik.errors.fecha_inicio)
                  }
                  helperText={
                    formik.touched.fecha_inicio && formik.errors.fecha_inicio
                  }
                  onBlur={formik.handleBlur}
                />
                <TextField
                  id="cargo"
                  name="cargo"
                  label="Cargo"
                  sx={inputStyles}
                  value={formik.values.cargo}
                  onChange={formik.handleChange}
                  error={formik.touched.cargo && Boolean(formik.errors.cargo)}
                  helperText={formik.touched.cargo && formik.errors.cargo}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} lg={5.8}>
                <Typography variant="p" component="h3">
                  Datos de Contrato
                </Typography>
                <div>
                  <TextField
                    select
                    id="tipo_contrato"
                    label="Tipo de contrato"
                    name="tipo_contrato"
                    sx={inputStyles}
                    value={formik.values.tipo_contrato}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.tipo_contrato &&
                      Boolean(formik.errors.tipo_contrato)
                    }
                    helperText={
                      formik.touched.tipo_contrato &&
                      formik.errors.tipo_contrato
                    }
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="CC">CC</MenuItem>
                    <MenuItem value="CE">CE</MenuItem>
                    <MenuItem value="TI">TI</MenuItem>
                  </TextField>
                  <TextField
                    label="Sueldo"
                    variant="outlined"
                    name="sueldo"
                    sx={inputStyles}
                    value={formik.values.sueldo}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.sueldo && Boolean(formik.errors.sueldo)
                    }
                    helperText={formik.touched.sueldo && formik.errors.sueldo}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <TextField
                  select
                  id="salario_integral"
                  label="Salario integral"
                  name="salario_integral"
                  sx={inputStyles}
                  value={formik.values.salario_integral}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.salario_integral &&
                    Boolean(formik.errors.salario_integral)
                  }
                  helperText={
                    formik.touched.salario_integral &&
                    formik.errors.salario_integral
                  }
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="true">Si</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="p" component="h3">
                  Datos para aportes de seguridad social y parafiscales
                </Typography>
                <TextField
                  label="Tipo de cotizante"
                  variant="outlined"
                  name="tipo_cotizante"
                  sx={inputStyles}
                  value={formik.values.tipo_cotizante}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.tipo_cotizante &&
                    Boolean(formik.errors.tipo_cotizante)
                  }
                  helperText={
                    formik.touched.tipo_cotizante &&
                    formik.errors.tipo_cotizante
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  label="Auxilio de transporte"
                  variant="outlined"
                  name="auxilio_transporte"
                  sx={inputStyles}
                  value={formik.values.auxilio_transporte}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.auxilio_transporte &&
                    Boolean(formik.errors.auxilio_transporte)
                  }
                  helperText={
                    formik.touched.auxilio_transporte &&
                    formik.errors.auxilio_transporte
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  label="Fondo de salud"
                  name="fondo_salud"
                  variant="outlined"
                  sx={inputStyles}
                  value={formik.values.fondo_salud}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fondo_salud &&
                    Boolean(formik.errors.fondo_salud)
                  }
                  helperText={
                    formik.touched.fondo_salud && formik.errors.fondo_salud
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  label="Porcentaje de salud del empleado"
                  name="porcentaje_salud_empleado"
                  variant="outlined"
                  sx={inputStyles}
                  value={formik.values.porcentaje_salud_empleado}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_salud_empleado &&
                    Boolean(formik.errors.porcentaje_salud_empleado)
                  }
                  helperText={
                    formik.touched.porcentaje_salud_empleado &&
                    formik.errors.porcentaje_salud_empleado
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  label="Porcentaje de salud del empleador"
                  name="porcentaje_salud_empleador"
                  variant="outlined"
                  sx={inputStyles}
                  value={formik.values.porcentaje_salud_empleador}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_salud_empleador &&
                    Boolean(formik.errors.porcentaje_salud_empleador)
                  }
                  helperText={
                    formik.touched.porcentaje_salud_empleador &&
                    formik.errors.porcentaje_salud_empleador
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  label="Fondo de pensiones"
                  name="fondo_pensiones"
                  variant="outlined"
                  sx={inputStyles}
                  value={formik.values.fondo_pensiones}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fondo_pensiones &&
                    Boolean(formik.errors.fondo_pensiones)
                  }
                  helperText={
                    formik.touched.fondo_pensiones &&
                    formik.errors.fondo_pensiones
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  label="Porcentaje de pensión del empleado"
                  name="porcentaje_pension_empleado"
                  variant="outlined"
                  sx={inputStyles}
                  value={formik.values.porcentaje_pension_empleado}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_pension_empleado &&
                    Boolean(formik.errors.porcentaje_pension_empleado)
                  }
                  helperText={
                    formik.touched.porcentaje_pension_empleado &&
                    formik.errors.porcentaje_pension_empleado
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  label="Porcentaje de pensión del empleador"
                  name="porcentaje_pension_empleador"
                  variant="outlined"
                  sx={inputStyles}
                  value={formik.values.porcentaje_pension_empleador}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_pension_empleador &&
                    Boolean(formik.errors.porcentaje_pension_empleador)
                  }
                  helperText={
                    formik.touched.porcentaje_pension_empleador &&
                    formik.errors.porcentaje_pension_empleador
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  select
                  id="arl"
                  label="Arl"
                  name="arl"
                  sx={inputStyles}
                  value={formik.values.arl}
                  onChange={formik.handleChange}
                  error={formik.touched.arl && Boolean(formik.errors.arl)}
                  helperText={formik.touched.arl && formik.errors.arl}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="true">Si</MenuItem>
                  <MenuItem value="false">N</MenuItem>
                </TextField>

                <TextField
                  select
                  id="porcentaje_arl"
                  label="Porcentaje de arl"
                  name="porcentaje_arl"
                  sx={inputStyles}
                  value={formik.values.porcentaje_arl}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_arl &&
                    Boolean(formik.errors.porcentaje_arl)
                  }
                  helperText={
                    formik.touched.porcentaje_arl &&
                    formik.errors.porcentaje_arl
                  }
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="true">Si</MenuItem>
                  <MenuItem value="false">N</MenuItem>
                </TextField>

                <TextField
                  select
                  id="fondo_cesantias"
                  label="Fondo de cesantias"
                  name="fondo_cesantias"
                  sx={inputStyles}
                  value={formik.values.fondo_cesantias}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fondo_cesantias &&
                    Boolean(formik.errors.fondo_cesantias)
                  }
                  helperText={
                    formik.touched.fondo_cesantias &&
                    formik.errors.fondo_cesantias
                  }
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="true">Si</MenuItem>
                  <MenuItem value="false">N</MenuItem>
                </TextField>

                <TextField
                  id="porcentaje_parafiscal_sena"
                  label="Porcentaje parafiscal sena"
                  name="porcentaje_parafiscal_sena"
                  sx={inputStyles}
                  value={formik.values.porcentaje_parafiscal_sena}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_parafiscal_sena &&
                    Boolean(formik.errors.porcentaje_parafiscal_sena)
                  }
                  helperText={
                    formik.touched.porcentaje_parafiscal_sena &&
                    formik.errors.porcentaje_parafiscal_sena
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  id="porcentaje_parafiscal_icbf"
                  label="Porcentaje parafiscal ICBF"
                  name="porcentaje_parafiscal_icbf"
                  sx={inputStyles}
                  value={formik.values.porcentaje_parafiscal_icbf}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_parafiscal_icbf &&
                    Boolean(formik.errors.porcentaje_parafiscal_icbf)
                  }
                  helperText={
                    formik.touched.porcentaje_parafiscal_icbf &&
                    formik.errors.porcentaje_parafiscal_icbf
                  }
                  onBlur={formik.handleBlur}
                />

                <TextField
                  id="porcentaje_parafiscal_caja_compensacion"
                  label="Porcentaje parafiscal de caja de compensación"
                  name="porcentaje_parafiscal_caja_compensacion"
                  sx={inputStyles}
                  value={formik.values.porcentaje_parafiscal_caja_compensacion}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.porcentaje_parafiscal_caja_compensacion &&
                    Boolean(
                      formik.errors.porcentaje_parafiscal_caja_compensacion
                    )
                  }
                  helperText={
                    formik.touched.porcentaje_parafiscal_caja_compensacion &&
                    formik.errors.porcentaje_parafiscal_caja_compensacion
                  }
                  onBlur={formik.handleBlur}
                />

                {cargando ? (
                  <div className="container2">
                    <CircularProgress />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {contratoEditar ? "Guardar Cambios" : "Crear Contrato"}
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </>
      )}
    </>
  );
};

export default ContratoForm;
