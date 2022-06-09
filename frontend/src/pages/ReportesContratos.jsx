import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Context
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import AlertaContext from "../context/alerta/AlertaContext";

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
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import contratoContext from "../context/contrato/ContratoContext";
import AuthContext from "../context/auth/AuthContext";

const columns = [
  { id: "nombre", label: "Nombre", minWidth: 150 },
  {
    id: "cantidad_contratos",
    label: "Cantidad de Contratos",
    minWidth: 80,
    align: "center",
  },
  { id: "createdAt", label: "Fecha de Generación", minWidth: 100 },
  {
    id: "acciones",
    label: "Acciones",
    minWidth: 150,
    align: "center",
  },
];

const ReportesContratos = () => {
  const {
    reportesContratos,
    cargando,
    pageReportes,
    rowsPerPageReportes,
    countReportes,
    totalpagesReportes,
    setPageReportes,
    setRowsPerPageReportes,
    obtenerReportes,
    eliminarReporte,
    reporteEliminar,
    setReporteEliminar,
  } = useContext(contratoContext);

  const { perfil } = useContext(AuthContext);

  const { alerta } = useContext(AlertaContext);

  const navigate = useNavigate();

  const [openEliminar, setOpenEliminar] = useState(false);

  const obtenerReporte = (reporte) => {
    setOpenEliminar(true);
    setReporteEliminar(reporte);
  };

  const handleEliminarReporte = () => {
    eliminarReporte(reporteEliminar);
    setOpenEliminar(false);
  };

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

  const handleDownload = (docurl, nombre) => {
    const token = localStorage.getItem("token");

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
      {openEliminar && (
        <ModalDialog
          open={openEliminar}
          setOpen={setOpenEliminar}
          titulo={`¿Está seguro de eliminar el reporte?`}
          contenido={"Se eliminará permanentemente y no podrá ser recuperado."}
          eliminar={handleEliminarReporte}
        />
      )}

      <div className={classes.header}>
        <Typography variant="h4" component="h2">
          Reportes de Contratos
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
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportesContratos
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
                              {column.id === "createdAt"
                                ? value.split("T")[0]
                                : value}

                              {column.id === "acciones" && (
                                <div
                                  key={column.id}
                                  style={{
                                    display:
                                      perfil?.roles.length >= 2 ? "flex" : "",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() =>
                                      handleDownload(row.reporte, row.nombre)
                                    }
                                  >
                                    <DownloadIcon />
                                  </Button>

                                  {perfil?.roles.length >= 2 && (
                                    <Button
                                      variant="outlined"
                                      color="secondary"
                                      onClick={() => obtenerReporte(row._id)}
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  )}
                                </div>
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

export default ReportesContratos;
