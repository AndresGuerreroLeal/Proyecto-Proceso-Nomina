import React, { useContext, useEffect, useState } from "react";

// Config 
import formikMain from "../helpers/formikMain";
import NumberFormat from "react-number-format";

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

const withValueLimit = ({ floatValue }) => floatValue <= 100000000;

const ContratoForm = () => {
  const classes = useStyles();

  const {
    crearContrato,
    cargando,
    contratoEditar,
    obtenerContratoEditarAPI,
    editarContrato,
  } = useContext(contratoContext);

  const {empleadosSinContrato,obtenerEmpleadosSinContrato} = useContext(EmpleadoContext)

  const {mostrarAlerta,alerta} = useContext(AlertaContext)

  const {id} = useParams()

  let values = {
    numero_contrato: "",
    cargo: "",
    fecha_inicio: new Date().toISOString().split("T")[0],
    sueldo: "",
    tipo_cotizante: "",
    tipo_contrato: "",
    fondo_salud: "",
    porcentaje_salud_empleado: 4,
    porcentaje_salud_empleador: 8.5,
    fondo_pensiones: "",
    porcentaje_pension_empleado: 4,
    porcentaje_pension_empleador: 12,
    arl: "",
    porcentaje_arl: "",
    fondo_cesantias: "",
    porcentaje_parafiscal_sena: 2,
    porcentaje_parafiscal_icbf: 3,
    porcentaje_parafiscal_caja_compensacion: 4,
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

  useEffect(() => {
    if (contratoEditar && id) {
      formik.setFieldValue("numero_contrato", contratoEditar.numero_contrato);
      formik.setFieldValue("tipo_contrato", contratoEditar.tipo_contrato);
      formik.setFieldValue(
        "fecha_inicio",
        contratoEditar.fecha_inicio.split("T")[0]
      );
      formik.setFieldValue("sueldo", contratoEditar.sueldo);
      formik.setFieldValue("cargo", contratoEditar.cargo);
      formik.setFieldValue("tipo_cotizante", contratoEditar.tipo_cotizante);
      formik.setFieldValue("fondo_pensiones", contratoEditar.fondo_pensiones);
      formik.setFieldValue("fondo_cesantias", contratoEditar.fondo_cesantias);
      formik.setFieldValue("fondo_salud", contratoEditar.fondo_salud);
      formik.setFieldValue(
        "porcentaje_salud_empleado",
        contratoEditar.porcentaje_salud_empleado
      );
      formik.setFieldValue(
        "porcentaje_salud_empleador",
        contratoEditar.porcentaje_salud_empleador
      );
      formik.setFieldValue(
        "porcentaje_pension_empleado",
        contratoEditar.porcentaje_pension_empleado
      );
      formik.setFieldValue(
        "porcentaje_pension_empleador",
        contratoEditar.porcentaje_pension_empleador
      );
      formik.setFieldValue("arl", contratoEditar.arl);
      formik.setFieldValue("porcentaje_arl", contratoEditar.porcentaje_arl);
      formik.setFieldValue(
        "porcentaje_parafiscal_sena",
        contratoEditar.porcentaje_parafiscal_sena
      );
      formik.setFieldValue(
        "porcentaje_parafiscal_icbf",
        contratoEditar.porcentaje_parafiscal_icbf
      );
      formik.setFieldValue(
        "porcentaje_parafiscal_caja_compensacion",
        contratoEditar.porcentaje_parafiscal_caja_compensacion
      );
      formik.setFieldValue("_id", id);
    }
  }, [contratoEditar]);

  useEffect(()=>{
    obtenerEmpleadosSinContrato()
  },[])

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
            {contratoEditar?._id ? "Editar Contrato" : "Nuevo Contrato"}
          </Typography>

          {message && <Alerta />}

          <form onSubmit={formik.handleSubmit}>
            <Grid container className={classes.containerGrid}>
              <Grid item xs={12} lg={5.8} justifyContent="flex-start">
                <Typography variant="p" component="h3">
                  Información Laboral
                </Typography>
                {contratoEditar?._id && id ? (
                  <TextField
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
                    disabled
                  />
                ) : (
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
                    {empleadosSinContrato.length > 0 ? (
                      empleadosSinContrato.map((empleado) => (
                        <MenuItem
                          value={empleado.numero_documento}
                          key={empleado.numero_documento}
                        >
                          {empleado.numero_documento}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>No hay ningun empleado sin contrato</MenuItem>
                    )}
                  </TextField>
                )}
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
                  type="date"
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
                    <MenuItem value="A término fijo">A término fijo</MenuItem>
                    <MenuItem value="A término indefinido">
                      A término indefinido
                    </MenuItem>
                    <MenuItem value="Por obra o labor">
                      Por obra o labor
                    </MenuItem>
                    <MenuItem value="Temporal">Temporal</MenuItem>
                    <MenuItem value="Ocasional">Ocasional</MenuItem>
                    <MenuItem value="Accidental">Accidental</MenuItem>
                    <MenuItem value="Aprendizaje">Aprendizaje</MenuItem>
                  </TextField>
                  <NumberFormat
                    label="Sueldo"
                    variant="outlined"
                    name="sueldo"
                    sx={inputStyles}
                    value={formik.values.sueldo}
                    onChange={formik.handleChange}
                    customInput={TextField}
                    thousandSeparator={true}
                    isAllowed={withValueLimit}
                    error={
                      formik.touched.sueldo && Boolean(formik.errors.sueldo)
                    }
                    helperText={formik.touched.sueldo && formik.errors.sueldo}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <TextField
                  select
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
                >
                  <MenuItem value="Beneficiario">Beneficiario</MenuItem>
                  <MenuItem value="Cotizante">Cotizante</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="p" component="h3">
                  Datos para aportes de seguridad social y parafiscales
                </Typography>

                <TextField
                  select
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
                >
                  <MenuItem value="Aliansalud">Aliansalud</MenuItem>
                  <MenuItem value="Cafam">Cafam</MenuItem>
                  <MenuItem value="Capital Salud">Capital Salud</MenuItem>
                  <MenuItem value="Capresoca">Capresoca</MenuItem>
                  <MenuItem value="Colsubsidio">Colsubsidio</MenuItem>
                  <MenuItem value="COMFANDI">COMFANDI</MenuItem>
                  <MenuItem value="Compensar">Compensar</MenuItem>
                  <MenuItem value="Coomeva">Coomeva</MenuItem>
                  <MenuItem value="Coosalud">Coosalud</MenuItem>
                  <MenuItem value="Sanitas">Sanitas</MenuItem>
                  <MenuItem value="Sura">Sura</MenuItem>
                  <MenuItem value="Famisanar">Famisanar</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </TextField>

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
                  disabled
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
                  disabled
                />

                <TextField
                  select
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
                >
                  <MenuItem value="Protección S.A">Protección S.A</MenuItem>
                  <MenuItem value="Porvenir S.A">Porvenir S.A</MenuItem>
                  <MenuItem value="Colfondos Pensiones y Cesantías S.A">
                    Colfondos Pensiones y Cesantías S.A
                  </MenuItem>
                  <MenuItem value="Old Mutual Pensiones y Cesantías S.A">
                    Old Mutual Pensiones y Cesantías S.A
                  </MenuItem>
                  <MenuItem value="Colpensiones">Colpensiones</MenuItem>
                </TextField>

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
                  disabled
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
                  disabled
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
                  <MenuItem value="Sura">Sura</MenuItem>
                  <MenuItem value="Positiva">Positiva</MenuItem>
                  <MenuItem value="Axa Colpatria">Axa Colpatria</MenuItem>
                  <MenuItem value="Colmena">Colmena</MenuItem>
                  <MenuItem value="Bolívar">Bolívar</MenuItem>
                  <MenuItem value="La Equidad">La Equidad</MenuItem>
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
                  <MenuItem value="0.522">0.522%</MenuItem>
                  <MenuItem value="1.044">1.044%</MenuItem>
                  <MenuItem value="2.436">2.436%</MenuItem>
                  <MenuItem value="4.350">4.350%</MenuItem>
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
                  <MenuItem value="Colfondos">Colfondos</MenuItem>
                  <MenuItem value="Porvenir">Porvenir</MenuItem>
                  <MenuItem value="Protección">Protección</MenuItem>
                  <MenuItem value="Skandia">Skandia</MenuItem>
                  <MenuItem value="Fondo Nacional del Ahorro">
                    Fondo Nacional del Ahorro
                  </MenuItem>
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
                  disabled
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
                  disabled
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
                  disabled
                />

                {cargando ? (
                  <div className="container2">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="container2">
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      {contratoEditar ? "Guardar Cambios" : "Crear Contrato"}
                    </Button>
                  </div>
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
