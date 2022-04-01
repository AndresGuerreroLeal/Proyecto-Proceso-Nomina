const FormatoFecha = (fecha) => {
  const nuevaFecha = new Date(fecha);
  return `${
    nuevaFecha.getDate() + 1
  }-${nuevaFecha.getMonth()}-${nuevaFecha.getFullYear()}`;
};

export default FormatoFecha;
