import React, { useContext } from "react";

// Config 
import formikMain from "../helpers/formikMain";

//Material ui
import { Alert, Button, CircularProgress, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import Alerta from "../components/Alerta";
import AlertaContext from "../context/alerta/AlertaContext";

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

const EmpleadoForm = () => {
  const classes = useStyles();

  const {crearEmpleado,cargando} = useContext(EmpleadoContext)
  const {mostrarAlerta,alerta} = useContext(AlertaContext)


  const values = {
    nombres:"",
    apellidos:"",
    genero:"",
    tipo_documento:"",
    numero_documento:"",
    correo:"",
    numero_celular:"",
    ciudad_residencia:"",
    direccion_residencia:"",
    metodo_pago:"",
    entidad_bancaria:"",
    tipo_cuenta:"",
    numero_cuenta:"",
    file:""
  }

  const handleSubmit =  (empleado)=>{

    try {
      
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      
      crearEmpleado(empleado);
      
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

  const formik = formikMain(handleSubmit,values,"EmpleadoSchema")

  const {message} = alerta 

  return (
    <>
      <Typography variant="h4" component="h2">
        Nuevo empleado
      </Typography>

      {message && <Alerta />}

      <form onSubmit={formik.handleSubmit}>
        <Grid container className={classes.containerGrid}>
          <Grid item xs={12} lg={5.8} justifyContent="flex-start">
            <Typography variant="p" component="h3">
              Datos Básicos
            </Typography>
            <TextField
              label="Nombres"
              variant="outlined"
              sx={inputStyles}
              value={formik.values.nombres}
              onChange={formik.handleChange}
              error={formik.touched.nombres && Boolean(formik.errors.nombres)}
              helperText={formik.touched.nombres && formik.errors.nombres}
              name="nombres"
            />
            <TextField
              label="Apellidos"
              variant="outlined"
              name="apellidos"
              sx={inputStyles}
              value={formik.values.apellidos}
              onChange={formik.handleChange}
              error={
                formik.touched.apellidos && Boolean(formik.errors.apellidos)
              }
              helperText={formik.touched.apellidos && formik.errors.apellidos}
            />
            <TextField
              select
              id="genero"
              name="genero"
              label="Género"
              sx={inputStyles}
              value={formik.values.genero}
              onChange={formik.handleChange}
              error={formik.touched.genero && Boolean(formik.errors.genero)}
              helperText={formik.touched.genero && formik.errors.genero}
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </TextField>
            <TextField
              label="Numero de celular"
              variant="outlined"
              sx={inputStyles}
              name="numero_celular"
              value={formik.values.numero_celular}
              onChange={formik.handleChange}
              error={
                formik.touched.numero_celular &&
                Boolean(formik.errors.numero_celular)
              }
              helperText={
                formik.touched.numero_celular && formik.errors.numero_celular
              }
            />
            <TextField
              label="Correo electrónico"
              variant="outlined"
              name="correo"
              sx={inputStyles}
              value={formik.values.correo}
              onChange={formik.handleChange}
              error={formik.touched.correo && Boolean(formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
            />
          </Grid>
          <Grid item xs={12} lg={5.8}>
            <Typography variant="p" component="h3">
              Datos Personales
            </Typography>
            <div>
              <TextField
                select
                id="tipo_documento"
                label="Tipo de documento"
                name="tipo_documento"
                sx={inputStyles}
                value={formik.values.tipo_documento}
                onChange={formik.handleChange}
                error={
                  formik.touched.tipo_documento &&
                  Boolean(formik.errors.tipo_documento)
                }
                helperText={
                  formik.touched.tipo_documento && formik.errors.tipo_documento
                }
              >
                <MenuItem value="CC">CC</MenuItem>
                <MenuItem value="CE">CE</MenuItem>
                <MenuItem value="TI">TI</MenuItem>
              </TextField>
              <TextField
                label="Numero de documento"
                variant="outlined"
                name="numero_documento"
                sx={inputStyles}
                value={formik.values.numero_documento}
                onChange={formik.handleChange}
                error={
                  formik.touched.numero_documento &&
                  Boolean(formik.errors.numero_documento)
                }
                helperText={
                  formik.touched.numero_documento &&
                  formik.errors.numero_documento
                }
              />
            </div>
            <TextField
              type="file"
              label="Documento de identidad"
              multiple={false}
              name="file"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => formik.setFieldValue("file", e.target.files[0])}
              error={formik.touched.file && Boolean(formik.errors.file)}
              helperText={formik.touched.file && formik.errors.file}
              sx={inputStyles}
            />
            <TextField
              label="Ciudad de residencia"
              variant="outlined"
              sx={inputStyles}
              name="ciudad_residencia"
              value={formik.values.ciudad_residencia}
              onChange={formik.handleChange}
              error={
                formik.touched.ciudad_residencia &&
                Boolean(formik.errors.ciudad_residencia)
              }
              helperText={
                formik.touched.ciudad_residencia &&
                formik.errors.ciudad_residencia
              }
            />
            <TextField
              label="Dirección de residencia"
              variant="outlined"
              name="direccion_residencia"
              sx={inputStyles}
              value={formik.values.direccion_residencia}
              onChange={formik.handleChange}
              error={
                formik.touched.direccion_residencia &&
                Boolean(formik.errors.direccion_residencia)
              }
              helperText={
                formik.touched.direccion_residencia &&
                formik.errors.direccion_residencia
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p" component="h3">
              Datos de Pago
            </Typography>
            <TextField
              label="Metodo de pago"
              variant="outlined"
              name="metodo_pago"
              sx={inputStyles}
              value={formik.values.metodo_pago}
              onChange={formik.handleChange}
              error={
                formik.touched.metodo_pago && Boolean(formik.errors.metodo_pago)
              }
              helperText={
                formik.touched.metodo_pago && formik.errors.metodo_pago
              }
            />

            <TextField
              label="Entidad bancaria"
              variant="outlined"
              name="entidad_bancaria"
              sx={inputStyles}
              value={formik.values.entidad_bancaria}
              onChange={formik.handleChange}
              error={
                formik.touched.entidad_bancaria &&
                Boolean(formik.errors.entidad_bancaria)
              }
              helperText={
                formik.touched.entidad_bancaria &&
                formik.errors.entidad_bancaria
              }
            />
            <TextField
              select
              label="Tipo de cuenta"
              name="tipo_cuenta"
              sx={inputStyles}
              value={formik.values.tipo_cuenta}
              onChange={formik.handleChange}
              error={
                formik.touched.tipo_cuenta && Boolean(formik.errors.tipo_cuenta)
              }
              helperText={
                formik.touched.tipo_cuenta && formik.errors.tipo_cuenta
              }
            >
              <MenuItem value="corriente">Corriente</MenuItem>
              <MenuItem value="ahorro">Ahorro</MenuItem>
              <MenuItem value="nomina">Nómina</MenuItem>
              <MenuItem value="chequera">Chequera</MenuItem>
            </TextField>
            <TextField
              label="Numero de cuenta"
              name="numero_cuenta"
              variant="outlined"
              sx={inputStyles}
              value={formik.values.numero_cuenta}
              onChange={formik.handleChange}
              error={
                formik.touched.numero_cuenta &&
                Boolean(formik.errors.numero_cuenta)
              }
              helperText={
                formik.touched.numero_cuenta && formik.errors.numero_cuenta
              }
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
                Crear usuario
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EmpleadoForm;
