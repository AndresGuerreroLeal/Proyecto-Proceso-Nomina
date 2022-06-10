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
    minWidth: 100,
  },
  {
    id: "ver_detalle",
    label: "Ver Detalle",
    minWidth: 150,
    align: "center",
  },
];

const Nominas = () => {
  
  const {
    nominas,
    cargando,
    modalNomina,
    nomina,
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
  } = useContext(NominaContext);
  
    let values = {
      nombre: "",
      año: "",
      mes: "",
      reset: true,
    };
  
  const {perfil} = useContext(AuthContext)
  
  const { alerta } = useContext(AlertaContext);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerNominasState = async () => {
      await obtenerNominas();
    };

    obtenerNominasState();
  }, [rowsPerPageNominas, pageNominas]);



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
        link.setAttribute("download", `reportesnominas.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = ()=>{
  }

  const { message } = alerta;

  return (
    <>
      {modalNomina && <ModalNomina />}
      {modalNuevaNovedad && <ModalNuevaNovedad />}
      {modalNuevaNomina && <ModalNuevaNomina />}

      <div className={classes.header}>
        <Typography variant="h4" component="h2">
          Lista Nóminas
        </Typography>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ height: "max-content" }}
          onClick={mostrarModalNuevaNomina}
        >
          Crear Nómina
        </Button>
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

                              {column.id === "novedad" && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={mostrarModalNuevaNovedad}
                                >
                                  <NewReleasesIcon />
                                </Button>
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

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDownload("/api/1.0/report-contract/create")}
      >
        Generar reportes
      </Button>
    </>
  );
};

export default Nominas;

