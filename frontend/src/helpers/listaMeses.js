function listaMeses() {
  const meses = [];

  for (let i = 1; i <= 12; i++) {
    if (i <= 9) {
      meses.push(`0${i}`);
    } else {
      meses.push(i);
    }
  }
  return meses;
}

export default listaMeses;
