function listaAños() {
  const max = new Date().getFullYear();
  const min = max - 22;
  const años = [];

  for (let i = max; i >= min; i--) {
    años.push(i);
  }
  return años;
}

export default listaAños;
