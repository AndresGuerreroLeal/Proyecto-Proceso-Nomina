/**
 * Archivo con función para generar tokens de cuenta.
 *
 * @author Juan-CamiloF
 */

const generarId = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32);
};

module.exports = generarId;
