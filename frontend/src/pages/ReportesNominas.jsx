import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Context
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import AlertaContext from "../context/alerta/AlertaContext";
import AuthContext from "../context/auth/AuthContext";
import NominaContext from "../context/nomina/NominaContext";

// Components
import ModalDialog from "../components/ModalDialog";
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
import DownloadIcon from '@mui/icons-material/Download';

const columns = [
  { id: "nombre", label: "Nombre", minWidth: 100 },
  { id: "createdAt", label: "Fecha de Generación", minWidth: 100 },
  {
    id: "acciones",
    label: "Acciones",
    minWidth: 100,
    align: "center",
  },
];

const ReportesNominas = () => {

  const {
    reportesNominas,
    cargando,
    pageReportes,
    rowsPerPageReportes,
    countReportes,
    totalpagesReportes,
    setPageReportes,
    setRowsPerPageReportes,
    obtenerReportes,
  } = useContext(NominaContext);

  const { alerta } = useContext(AlertaContext);

  useEffect(() => {
    const obtenerReportesState = async () => {
      await obtenerReportes();
    };

    obtenerReportesState();
  }, [rowsPerPageReportes, pageReportes]);

  const handleChangePage = (event, newPage) => {
    setPageReportes(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageReportes(parseInt(event.target.value), 10);
    setPageReportes(0);
  };

  const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
  }));

  const classes = useStyles();

  const handleDownload = (docurl,nombre) => {
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
        link.setAttribute("download", `${nombre}.xlsx`);
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

      <div className={classes.header}>
        <Typography variant="h4" component="h2">
          Reportes de Nóminas
        </Typography>
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
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportesNominas
                  .slice(
                    pageReportes - totalpagesReportes * rowsPerPageReportes,
                    pageReportes * rowsPerPageReportes + rowsPerPageReportes
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
                                {column.id === "createdAt"
                                  ? value?.split("T")[0]
                                  : value}
                              </div>

                              {column.id === "acciones" && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() =>
                                    handleDownload(row.nomina, row.nombre)
                                  }
                                >
                                  <DownloadIcon />
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
            count={countReportes}
            rowsPerPage={rowsPerPageReportes}
            page={pageReportes}
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

export default ReportesNominas;

