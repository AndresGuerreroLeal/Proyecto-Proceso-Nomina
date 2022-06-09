import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Context
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import AlertaContext from "../context/alerta/AlertaContext";

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
import { CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import contratoContext from "../context/contrato/ContratoContext";
import ModalContrato from "../components/ModalContrato";
import AuthContext from "../context/auth/AuthContext";

const columns = [
  { id: "numero_contrato", label: "Número de Contrato", minWidth: 130 },
  {
    id: "fecha_inicio",
    label: "Fecha de inicio",
    minWidth: 100,
    align: "center",
  },
  { id: "cargo", label: "Cargo", minWidth: 100 },
  {
    id: "ver_detalle",
    label: "Ver Detalle",
    minWidth: 100,
    align: "center",
  },
  {
    id: "acciones",
    label: "Acciones",
    minWidth: 150,
    align: "center",
  },
];

const Contratos = () => {
  const {
    contratos,
    cargando,
    contrato,
    modalContrato,
    pageContratos,
    rowsPerPageContratos,
    countContratos,
    totalpagesContratos,
    setPageContratos,
    setRowsPerPageContratos,
    obtenerContratos,
    obtenerContrato,
  } = useContext(contratoContext);

  const {perfil} = useContext(AuthContext)

  const {empleadosSinContrato,obtenerEmpleadosSinContrato} = useContext(EmpleadoContext)

  const { alerta } = useContext(AlertaContext);
  
  useEffect(()=>{
    obtenerEmpleadosSinContrato();
  },[])

  useEffect(() => {
    const obtenerContratosState = async () => {
      await obtenerContratos();
    };

    obtenerContratosState();
  }, [rowsPerPageContratos, pageContratos]);

  const handleChangePage = (event, newPage) => {
    setPageContratos(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageContratos(parseInt(event.target.value), 10);
    setPageContratos(0);
  };

  const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
  }));

  const classes = useStyles();

  const handleDownload = (docurl, nombre) => {
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
        link.setAttribute("download", `reportescontrato.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { message } = alerta;

  return (
    <>

      {modalContrato && <ModalContrato />}

      <div className={classes.header}>
        <Typography variant="h4" component="h2">
          Lista Contratos
        </Typography>

        {empleadosSinContrato.length > 0 && perfil?.roles.length >= 2 && (
          <Link to="nuevo-contrato">
            <Button variant="contained" color="primary">
              Nuevo Contrato
            </Button>
          </Link>
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
                {contratos
                  .slice(
                    pageContratos - totalpagesContratos * rowsPerPageContratos,
                    pageContratos * rowsPerPageContratos + rowsPerPageContratos
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
                              {column.id === "ver_detalle" && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => obtenerContrato(row)}
                                >
                                  <LibraryBooksIcon />
                                </Button>
                              )}
                              {column.id === "acciones" &&
                                perfil?.roles.length >= 2 && (
                                  <Button variant="outlined" color="primary">
                                    <EditIcon />
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
            count={countContratos}
            rowsPerPage={rowsPerPageContratos}
            page={pageContratos}
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

export default Contratos;

