import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Material ui
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
import EmpleadoContext from "../context/empleado/EmpleadoContext";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import ModalEmpleado from "../components/ModalEmpleado";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalDialog from "../components/ModalDialog";
import ModalDeshabilitar from "../components/ModalDeshabilitar";
import DownloadIcon from '@mui/icons-material/Download';

const columns = [
  { id: "nombre", label: "Nombre", minWidth: 130 },
  { id: "cantidad_empleados", label: "Cantidad de Empleados", minWidth: 100,  align: "center" },
  { id: "createdAt", label: "Fecha de Generación", minWidth: 100 },
  {
    id: "acciones",
    label: "Acciones",
    minWidth: 150,
    align: "center",
  },
];

const ReportesEmpleado = () => {

    const {
      reportesEmpleados,
      cargando,
      pageReportes,
      rowsPerPageReportes,
      countReportes,
      totalpagesReportes,
      setPageReportes,
      setRowsPerPageReportes,
      obtenerReportes,
      estado,
      setEstado,
      obtenerEmpleado,
      modalEmpleado,
      empleadoEstado,
      mostrarModalEmpleado,
      obtenerEmpleadoEditar,
      actualizarEstado,
      obtenerEmpleadoEstado
    } = useContext(EmpleadoContext);

    const navigate = useNavigate()

  const [openEliminar,setOpenEliminar] = useState(false);
  const [openDeshabilitar,setOpenDeshabilitar] = useState(false)

  const handleDeshabilitarEmpleado = (concepto)=>{
    actualizarEstado({ ...empleadoEstado, concepto });
    setOpenDeshabilitar(false)
  }
  
  const handleDeshabilitar = ()=>{
    setOpenDeshabilitar(true)
    setOpenEliminar(false)
  }

  useEffect(() => {
    const obtenerReportesState = async () => {
      await obtenerReportes()
    };

    obtenerReportesState();
  }, [rowsPerPageReportes,pageReportes]);
  
  console.log(reportesEmpleados)

  const handleChangePage = (event, newPage) => {
    setPageReportes(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageReportes(parseInt(event.target.value),10);
    setPageReportes(0);
  };

  const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
  
  }));

  const classes = useStyles();

  const handleEmploye = (empleado)=>{
    obtenerEmpleadoEditar(empleado)
    navigate(`editar-empleado/${empleado._id}`);
  }

  const handleDownload =(docurl)=>{
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
        link.setAttribute(
          "download",
          `reportesempleado.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  }  


  return (
    <>
      <div className={classes.header}>
        <Typography variant="h4" component="h2">
          Reportes de Empleados
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
                {reportesEmpleados
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
                              <div onClick={() => obtenerEmpleado(row)}>
                                {column.id === "createdAt"
                                  ? value.split("T")[0]
                                  : value}
                              </div>
                              {column.id === "acciones" && (
                                <div
                                  key={column.id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <Button variant="outlined" color="primary">
                                    <DownloadIcon />
                                  </Button>
                                  <Button variant="outlined" color="secondary">
                                    <DeleteIcon />
                                  </Button>
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

export default ReportesEmpleado;

