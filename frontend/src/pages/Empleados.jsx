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
import Alerta from "../components/Alerta";
import AlertaContext from "../context/alerta/AlertaContext";

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
      pageEmpleados,
      rowsPerPageEmpleados,
      countEmpleados,
      totalpagesEmpleados,
      setPageEmpleados,
      setRowsPerPageEmpleados,
      obtenerEmpleados,
      estado,
      setEstado,
      obtenerEmpleado,
      modalEmpleado,
      empleadoEstado,
      mostrarModalEmpleado,
      obtenerEmpleadoEditar,
      actualizarEstado,
      obtenerEmpleadoEstado,
    } = useContext(EmpleadoContext);

    const {alerta} = useContext(AlertaContext)

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
  }, [rowsPerPageEmpleados,pageEmpleados,estado]);
      

  const handleChangePage = (event, newPage) => {
    setPageEmpleados(newPage)
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageEmpleados(parseInt(event.target.value),10);
    setPageEmpleados(0);
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

  const { message } = alerta;

  return (
    <>
      {openEliminar && (
        <ModalDialog
          open={openEliminar}
          setOpen={setOpenEliminar}
          titulo={
            estado === "active"
              ? `¿Está seguro de deshabilitar el empleado?`
              : `¿Está seguro de habilitar el empleado?`
          }
          contenido={
            estado === "active"
              ? "Tambien se deshabilitará el contrato."
              : "Tambien se habilitará el contrato."
          }
          eliminar={handleDeshabilitar}
        />
      )}

      {openDeshabilitar && (
        <ModalDeshabilitar
          open={openDeshabilitar}
          setOpen={setOpenDeshabilitar}
          eliminar={handleDeshabilitarEmpleado}
          titulo={
            estado === "active"
              ? `Concepto por el cual se deshabilita el empleado`
              : `Concepto por el cual se habilita el empleado`
          }
          boton={estado === "active" ? "Deshabilitar" : "Habilitar"}
        />
      )}

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

        <Link to="nuevo-empleado">
          <Button variant="contained" color="primary">
            Nuevo Empleado
          </Button>
        </Link>
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
                {empleados
                  .slice(
                    pageEmpleados - totalpagesEmpleados * rowsPerPageEmpleados,
                    pageEmpleados * rowsPerPageEmpleados + rowsPerPageEmpleados
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
                                    gap: "5px",
                                  }}
                                >
                                  {estado === "active" ? (
                                    <>
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEmploye(row)}
                                      >
                                        <EditIcon />
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                          obtenerEmpleadoEstado(row);
                                          setOpenEliminar(!openEliminar);
                                        }}
                                      >
                                        <DeleteIcon />
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => {
                                        obtenerEmpleadoEstado(row);
                                        setOpenEliminar(!openEliminar);
                                      }}
                                    >
                                      ACTIVAR
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
            count={countEmpleados}
            rowsPerPage={rowsPerPageEmpleados}
            page={pageEmpleados}
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

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDownload("/api/1.0/report-employee/create")}
      >
        Generar reportes
      </Button>
    </>
  );
};

export default Empleados;
