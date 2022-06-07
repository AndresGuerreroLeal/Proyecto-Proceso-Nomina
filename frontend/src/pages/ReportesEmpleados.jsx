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
  { id: "nombre", label: "Nombre", minWidth: 100 },
  { id: "cantidad_empleados", label: "Cantidad de Empleados", minWidth: 130 },
  { id: "createdAt", label: "Fecha de Generación", minWidth: 130 },
  {
    id: "acciones",
    label: "Acciones",
    minWidth: 100,
    align: "center",
  },
];

const ReportesEmpleado = () => {

    const {
      empleados,
      cargando,
      page,
      rowsPerPage,
      count,
      totalpages,
      setPage,
      setRowsPerPage,
      obtenerEmpleados,
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
    const obtenerEmpleadosState = async () => {
      await obtenerEmpleados(estado)
    };

    obtenerEmpleadosState();
  }, [rowsPerPage,page,estado]);
      

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value),10);
    setPage(0);
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
                {empleados
                  .slice(
                    page - totalpages * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
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
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </div>
                              {column.id === "acciones" && (
                                <div
                                  key={column.id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width:"90%",
                                    gap:"1"
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
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
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

