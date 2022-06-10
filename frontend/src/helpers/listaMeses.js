const Meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function listaMeses() {
  const meses = [];

  for (let i = 1; i <= 12; i++) {
    meses.push(`${Meses[i - 1]}`);
  }
  return meses;
}

export default listaMeses;
