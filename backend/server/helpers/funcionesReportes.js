/**
 * Archivo encargado de las funciones de los reportes
 *
 * @author Juan-CamiloF
 */

const path = require("path");
const xl = require("excel4node");
const fs = require("fs");
const crearArchivoReporte = (columnas, datos, nombreHoja, nombre) => {
  let reporteEstado = {
    nombre: "",
    creado: false,
    error: "",
    reporte: new xl.Workbook(),
  };
  //Crear archivo excel, hoja y estilos
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(nombreHoja);
  const estilos = wb.createStyle({
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#B6EBF3",
      fgColor: "#B6EBF3",
    },
    alignment: {
      wrapText: true,
      vertical: "center",
      horizontal: "center",
    },
  });

  //Genereación de columnas
  for (let columna = 0; columna < columnas.length; columna++) {
    if (columnas[columna] == "createdAt") {
      ws.cell(1, columna + 1)
        .string("Fecha de creacion")
        .style(estilos);
    } else if (columnas[columna] == "updatedAt") {
      ws.cell(1, columna + 1)
        .string("Fecha de actualizacion")
        .style(estilos);
    } else {
      ws.cell(1, columna + 1)
        .string(columnas[columna])
        .style(estilos);
    }
  }

  //Generación de datos
  for (let i = 0; i < datos.length; i++) {
    for (let j = 0; j < columnas.length; j++) {
      if (columnas[j] !== "createdAt" && columnas[j] !== "updatedAt") {
        ws.cell(i + 2, j + 1).string(
          datos[i][columnas[j].toLowerCase().split(" ").join("_")]
        );
      } else {
        let fecha = new Date(datos[i][columnas[j]]);
        ws.cell(i + 2, j + 1).string(fecha.toISOString().split("T")[0]);
      }
    }
  }

  //Obtener nombre, la ruta y guardar el reporte
  const nombreFinal = nombre.split(" ").join("-") + "-" + Date.now() + ".xlsx";
  const ruta = path.normalize(
    `${process.cwd()}/server/archivos/reportesEmpleados/${nombreFinal}`
  );
  wb.write(ruta, (err) => {
    if (err) {
      reporteEstado.error = err;
      return reporteEstado;
    }
  });
  reporteEstado.nombre = nombreFinal;
  reporteEstado.creado = true;
  reporteEstado.reporte = wb;

  return { reporteEstado, wb };
};

const eliminarArchivoReporte = (directorio, nombre) => {
  let archivoEliminado = {
    eliminado: false,
    mensaje: "",
  };
  const ruta = `${process.cwd()}/server/archivos/${directorio}/${nombre}`;
  fs.unlink(ruta, (err) => {
    if (err) {
      archivoEliminado.mensaje = err;
      return archivoEliminado;
    }
  });
  archivoEliminado.eliminado = true;
  return archivoEliminado;
};

module.exports = { crearArchivoReporte, eliminarArchivoReporte };
