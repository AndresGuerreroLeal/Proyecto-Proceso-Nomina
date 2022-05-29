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


const columns = [
  { id: "numero_documento", label: "Número de Documento", minWidth: 100 },
  { id: "nombres", label: "Nombres", minWidth: 130 },
  { id: "apellidos", label: "Apellidos", minWidth: 130 },
  {
    id: "correo",
    label: "Correo Electrónico",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "acciones",
    label: "Acciones",
    minWidth: 100,
    align: "center",
  },
];

const Empleados = () => {

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
      mostrarModalEmpleado,
      obtenerEmpleadoEditar
    } = useContext(EmpleadoContext);

    const navigate = useNavigate()


  useEffect(() => {
    const obtenerEmpleadosState = async () => {
      obtenerEmpleados(estado)
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

  return (
    <>
      <div className={classes.header}>
        <Typography variant="h4" component="h2">
          Lista Empleados
        </Typography>

        <TextField
          select
          id="estado_empleado"
          label="Estado de empleado"
          name="estado_empleado"
          sx={{ width: "30%" }}
          onChange={(e) => setEstado(e.target.value)}
          value={estado}
        >
          <MenuItem value="active">Activo</MenuItem>
          <MenuItem value="inactive">Inactivo</MenuItem>
        </TextField>

        <Button variant="contained" color="primary">
          <Link to="nuevo-empleado">Nuevo Empleado</Link>
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
                        key={row.code}
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
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap:"5px"
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={()=>handleEmploye(row)}
                                   
                                  >
                                    <EditIcon />
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                  >
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

            {modalEmpleado && <ModalEmpleado />}

      <Button variant="contained" color="primary">
        <Link to="reportes-empleados">Generar reportes</Link>
      </Button>
    </>
  );
};

export default Empleados;
