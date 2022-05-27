import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

const columns = [
  { id: "nombres", label: "Nombres", minWidth: 130 },
  { id: "numero_documento", label: "Número de Documento", minWidth: 100 },
  {
    id: "correo",
    label: "Correo Electrónico",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "numero_celular",
    label: "Número de Celular",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "entidad_bancaria",
    label: "Entidad Bancaria",
    minWidth: 170,
    align: "right",
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
      estado,setEstado
    } = useContext(EmpleadoContext);


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
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
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

      <Button variant="contained" color="primary">
        <Link to="reportes-empleados">Generar reportes</Link>
      </Button>
    </>
  );
};

export default Empleados;
