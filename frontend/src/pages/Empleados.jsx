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

const columns = [
  { id: "nombres", label: "Nombres", minWidth: 130 },
  { id: "numero_documento", label: "Numero de Documento", minWidth: 100 },
  {
    id: "correo",
    label: "Correo Electrónico",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "numero_celular",
    label: "Numero de Celular",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "entidad_bancaria",
    label: "Entidad Bancaria",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

const Empleados = () => {


  const [cargando,setCargando] = useState(false)

    const {
      empleados,
      page,
      rowsPerPage,
      count,
      totalpages,
      setPage,
      setRowsPerPage,
      obtenerEmpleados,
    } = useContext(EmpleadoContext);


  useEffect(() => {
    const obtenerEmpleadosState = async () => {
      obtenerEmpleados()
    };

    obtenerEmpleadosState();
  }, [rowsPerPage,page]);
      

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

        <Button variant="contained" color="primary">
          <Link to="nuevo-empleado">Nuevo Empleado</Link>
        </Button>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "30px" }}>
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
                      {cargando ? (
                        <p>cargando</p>
                      ) : (
                        columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })
                      )}
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
    </>
  );
};

export default Empleados;
