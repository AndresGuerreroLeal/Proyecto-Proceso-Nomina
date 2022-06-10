import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Context
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import AlertaContext from "../context/alerta/AlertaContext";
import NominaContext from "../context/nomina/NominaContext";

// Components
import Alerta from "../components/Alerta";

// Material ui
import { Button, makeStyles, Typography } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import DeleteIcon from "@mui/icons-material/Delete";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import clienteAxios from "../config/axios";
import { CircularProgress, MenuItem, TextField } from "@mui/material";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AuthContext from "../context/auth/AuthContext";
import formikMain from "../helpers/formikMain";
import ModalNomina from "../components/ModalNomina";
import ModalNuevaNovedad from "../components/ModalNuevaNovedad";
import ModalNuevaNomina from "../components/ModalNuevaNomina";
import ModalDialog from "../components/ModalDialog";

let NuevasNovedades = JSON.parse(localStorage.getItem("novedades"))
  ? JSON.parse(localStorage.getItem("novedades")).map(
      (novedad) => novedad._id
    )
  : [];

const columns = [
  { id: "numero_contrato", label: "Cédula", minWidth: 100 },
  {
    id: "nombres",
    label: "Nombres",
    minWidth: 100,
  },
  { id: "apellidos", label: "Apellidos", minWidth: 100 },
  { id: "sueldo", label: "Valor de Contrato", minWidth: 100 },
  {
    id: "fecha_inicio",
    label: "Fecha de Inicio",
    minWidth: 100,
  },
  {
    id: "novedad",
    label: "Novedad",
    minWidth: 80,
  },
  {
    id: "ver_detalle",
    label: "Ver Detalle",
    minWidth: 80,
    align: "center",
  },
];

const Nominas = () => {
  const {
    nominas,
    cargando,
    modalNomina,
    setNominasDisabled,
    nomina,
    eliminarNomina,
    setNominaNovedad,
    modalNuevaNovedad,
    modalNuevaNomina,
    pageNominas,
    rowsPerPageNominas,
    countNominas,
    totalpagesNominas,
    setPageNominas,
    setRowsPerPageNominas,
    obtenerNominas,
    obtenerNomina,
    mostrarModalNuevaNomina,
    mostrarModalNuevaNovedad,
    nominasDisabled,
    obtenerNominaEliminar,
    eliminarReporteNomina
  } = useContext(NominaContext);

  const { perfil } = useContext(AuthContext);

  const { alerta } = useContext(AlertaContext);

  const [openEliminar,setOpenEliminar] = useState(false);
  
  const handleEliminar = ()=>{
      eliminarReporteNomina(eliminarNomina)
      setOpenEliminar(!openEliminar);
  }

  useEffect(() => {
    setNominasDisabled(
      JSON.parse(localStorage.getItem("novedades")).map((nomina) => nomina._id)
    );
  }, []);

  useEffect(() => {
    const obtenerNominasState = async () => {
      await obtenerNominas();
    };

    obtenerNominasState();
  }, [rowsPerPageNominas, pageNominas]);

  const handleNovedad = (novedad) => {
    setNominaNovedad(novedad);
    mostrarModalNuevaNovedad();
  };


  const handleChangePage = (event, newPage) => {
    setPageNominas(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageNominas(parseInt(event.target.value), 10);
    setPageNominas(0);
  };

  const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
  }));

  const classes = useStyles();

  const { message } = alerta;

  return (
    <>
      {modalNomina && <ModalNomina />}
      {modalNuevaNovedad && <ModalNuevaNovedad />}
      {modalNuevaNomina && <ModalNuevaNomina />}

      {openEliminar && (
        <ModalDialog
          open={openEliminar}
          setOpen={setOpenEliminar}
          titulo={`¿Está seguro de eliminar la nómina?`}
          contenido={"Se eliminará permanentemente sin medio de recuperación."}
          eliminar={handleEliminar}
        />
      )}

      <div className={classes.header}>
        <Typography variant="h4" component="h2">
          Lista Nóminas
        </Typography>
        {nominas?.length >= 1 && (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ height: "max-content" }}
            onClick={mostrarModalNuevaNomina}
          >
            Crear Nómina
          </Button>
        )}
      </div>

      {cargando ? (
        <div className="container3">
          <CircularProgress />
        </div>
      ) : (
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          {message && <Alerta />}

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        display:
                          perfil?.roles.length <= 1 &&
                          column.id === "acciones" &&
                          "none",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {nominas
                  .slice(
                    pageNominas - totalpagesNominas * rowsPerPageNominas,
                    pageNominas * rowsPerPageNominas + rowsPerPageNominas
                  )
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];

                          return (
                            <TableCell key={column.id} align={column.align}>
                              <div>
                                {column.id === "fecha_inicio"
                                  ? value.split("T")[0]
                                  : value}
                              </div>

                              {column.id === "novedad" &&
                              nominasDisabled.includes(row._id) ? (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleNovedad(row)}
                                  disabled
                                >
                                  <NewReleasesIcon />
                                </Button>
                              ) : (
                                column.id === "novedad" &&
                                !nominasDisabled.includes(row._id) && (
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleNovedad(row)}
                                  >
                                    <NewReleasesIcon />
                                  </Button>
                                )
                              )}

                              {column.id === "ver_detalle" && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => obtenerNomina(row)}
                                >
                                  <LibraryBooksIcon />
                                </Button>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={countNominas}
            rowsPerPage={rowsPerPageNominas}
            page={pageNominas}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"Número de filas"}
            labelDisplayedRows={({ from, to, count }) =>
              `Registros del ${from} al ${to} de ${count}`
            }
          />
        </Paper>
      )}
    </>
  );
};

export default Nominas;

